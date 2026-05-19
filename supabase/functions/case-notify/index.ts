// case-notify — Web Push for case assignments and follow-up reminders.
// Records every send in public.push_log (one row per recipient,
// status sent|failed; opened_at stamped later by push-ack).
//
//   mode 'assignment' : { record: <customer_feedback row> }  (DB trigger
//                        cw_cf_assignment_push)
//   mode 'reminder'   : {}  (pg_cron 'case-reminders-15min') — the
//                        function finds due / overdue follow-ups itself
//
// Requires project secrets (shared with chat-push):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, CHAT_PUSH_SECRET
// Deploy: supabase functions deploy case-notify --no-verify-jwt
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY') ?? ''
const VAPID_PRIVATE= Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
const VAPID_SUBJECT= Deno.env.get('VAPID_SUBJECT') ?? 'mailto:ops@cedarwings.local'
const SECRET       = Deno.env.get('CASE_NOTIFY_SECRET') || Deno.env.get('CHAT_PUSH_SECRET') || ''
if (VAPID_PUBLIC && VAPID_PRIVATE) webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)

const H = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' }
const getJSON = (p: string) => fetch(`${SUPABASE_URL}/rest/v1/${p}`, { headers: H }).then(r => r.ok ? r.json() : [])
const roleKey = (v: string|null) => v && v.startsWith('role:') ? v.slice(5).toLowerCase() : null
const today   = () => new Date().toISOString().slice(0, 10)

function targetsFor(assigned: string|null, emps: any[]): any[] {
  if (!assigned) return []
  const rk = roleKey(assigned)
  if (!rk) return emps.filter(e => e.name === assigned)
  return emps.filter(e => {
    const mine = [String(e.custom_role || e.role || '').toLowerCase(), String(e.role || '').toLowerCase()]
    try {
      const raw = e.extra_roles
      const ex = typeof raw === 'string' ? JSON.parse(raw || '[]') : (Array.isArray(raw) ? raw : [])
      for (const x of ex) mine.push(String(x).toLowerCase())
    } catch { /* ignore */ }
    return mine.includes(rk)
  })
}

async function notify(emp: any, kind: string, caseId: string|null, title: string, body: string, url: string) {
  const ins = await fetch(`${SUPABASE_URL}/rest/v1/push_log`, {
    method: 'POST', headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify({ kind, case_id: caseId, employee_id: emp.id,
      recipient_name: emp.name, title, body, url, status: 'sent' }),
  }).then(r => r.ok ? r.json() : [])
  const logId = ins?.[0]?.id
  const subs = await getJSON(`push_subscriptions?employee_id=eq.${emp.id}&select=id,endpoint,p256dh,auth`)
  if (!subs.length) {
    if (logId) await fetch(`${SUPABASE_URL}/rest/v1/push_log?id=eq.${logId}`, {
      method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'failed', error: 'no subscription' }) })
    return
  }
  const payload = JSON.stringify({ title, body: body.slice(0, 160), tag: `cw-${kind}-${caseId || ''}`, url, logId })
  let ok = 0; const dead: string[] = []; let lastErr = ''
  await Promise.all(subs.map(async (s: any) => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)
      ok++
    } catch (err: any) {
      lastErr = String(err?.body || err?.message || err)
      if (err?.statusCode === 404 || err?.statusCode === 410) dead.push(s.id)
    }
  }))
  if (dead.length) await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?id=in.(${dead.map(d => `"${d}"`).join(',')})`,
    { method: 'DELETE', headers: H }).catch(() => {})
  if (logId) await fetch(`${SUPABASE_URL}/rest/v1/push_log?id=eq.${logId}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify(ok ? { status: 'sent' } : { status: 'failed', error: lastErr.slice(0, 300) || 'send failed' }) })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 })
  try {
    if (SECRET && req.headers.get('x-webhook-secret') !== SECRET) return new Response('forbidden', { status: 403 })
    if (!SUPABASE_URL || !SERVICE_KEY || !VAPID_PUBLIC || !VAPID_PRIVATE)
      return new Response('push not configured', { status: 200 })
    const bodyJson = await req.json().catch(() => ({} as any))
    const u = new URL(req.url)
    const mode = u.searchParams.get('mode') || bodyJson.mode || (bodyJson.record ? 'assignment' : 'reminder')
    const emps = await getJSON('employees?select=id,name,role,custom_role,extra_roles&is_active=eq.true')

    if (mode === 'assignment') {
      const rec = bodyJson.record
      if (!rec || !rec.id || !rec.assigned_to) return new Response('no assignee', { status: 200 })
      const tgts = targetsFor(rec.assigned_to, emps)
      const fb = rec.feedback_no || 'Feedback'
      const title = `📋 New case assigned — ${fb}`
      const body  = `${String(rec.type || 'complaint').replace(/_/g, ' ')}${rec.customer_name ? ' · ' + rec.customer_name : ''}. Tap to open and respond.`
      const link  = `./customer_feedback.html?open=${rec.id}`
      for (const e of tgts) await notify(e, 'assignment', rec.id, title, body, link)
      return new Response(JSON.stringify({ mode, recipients: tgts.length }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    const t = today()
    const due = await getJSON(`customer_feedback?select=id,feedback_no,customer_name,follow_up_date,follow_up_note,follow_up_assignee,follow_up_done_at,follow_up_reminded_at&follow_up_date=not.is.null&follow_up_done_at=is.null&follow_up_date=lte.${t}&or=(follow_up_reminded_at.is.null,follow_up_reminded_at.lt.${t})&limit=500`)
    let n = 0
    for (const c of due) {
      const tgts = targetsFor(c.follow_up_assignee, emps)
      const overdue = c.follow_up_date < t
      const title = `${overdue ? '⚠️ Overdue follow-up' : '⏰ Follow-up due today'} — ${c.feedback_no || 'Feedback'}`
      const note  = c.follow_up_note ? `“${c.follow_up_note}”` : 'Follow-up is due.'
      const body  = `${note}${c.customer_name ? ' · ' + c.customer_name : ''}. Tap to open the case.`
      const link  = `./customer_feedback.html?open=${c.id}`
      for (const e of tgts) { await notify(e, 'reminder', c.id, title, body, link); n++ }
      await fetch(`${SUPABASE_URL}/rest/v1/customer_feedback?id=eq.${c.id}`, {
        method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
        body: JSON.stringify({ follow_up_reminded_at: new Date().toISOString() }) }).catch(() => {})
    }
    return new Response(JSON.stringify({ mode: 'reminder', cases: due.length, sent: n }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response('error: ' + (e as Error).message, { status: 200 })
  }
})
