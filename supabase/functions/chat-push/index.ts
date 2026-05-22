// chat-push — Web Push when a chat message is inserted (DB trigger
// chat_messages_push / cw_chat_push_notify). One push_log row per
// recipient (status sent|failed, opened_at stamped by push-ack), so
// chat shows in the notifications dashboard alongside assignment /
// reminder. Deploy: supabase functions deploy chat-push --no-verify-jwt
// Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT,
//          CHAT_PUSH_SECRET (matches the trigger's x-webhook-secret).
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY') ?? ''
const VAPID_PRIVATE= Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
const VAPID_SUBJECT= Deno.env.get('VAPID_SUBJECT') ?? 'mailto:ops@cedarwings.local'
const PUSH_SECRET  = Deno.env.get('CHAT_PUSH_SECRET') ?? ''
if (VAPID_PUBLIC && VAPID_PRIVATE) webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)

const H = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' }
const getJSON = (p: string) => fetch(`${SUPABASE_URL}/rest/v1/${p}`, { headers: H }).then(r => r.ok ? r.json() : [])
function roleKey(v: string) { return v && v.startsWith('role:') ? v.slice(5).toLowerCase() : null }

async function notify(emp: any, caseId: string|null, title: string, body: string, url: string) {
  const ins = await fetch(`${SUPABASE_URL}/rest/v1/push_log`, {
    method: 'POST', headers: { ...H, Prefer: 'return=representation' },
    body: JSON.stringify({ kind: 'chat', case_id: caseId, employee_id: emp.id,
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
  const payload = JSON.stringify({ title, body: body.slice(0, 160), tag: `cw-chat-${caseId || emp.id}`, url, logId })
  let ok = 0; const dead: string[] = []; let lastErr = ''
  await Promise.all(subs.map(async (s: any) => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload); ok++ }
    catch (err: any) { lastErr = String(err?.body || err?.message || err); if (err?.statusCode === 404 || err?.statusCode === 410) dead.push(s.id) }
  }))
  if (dead.length) await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?id=in.(${dead.map(d=>`"${d}"`).join(',')})`, { method: 'DELETE', headers: H }).catch(()=>{})
  if (logId) await fetch(`${SUPABASE_URL}/rest/v1/push_log?id=eq.${logId}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify(ok ? { status: 'sent' } : { status: 'failed', error: lastErr.slice(0, 300) || 'send failed' }) })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 })
  try {
    if (PUSH_SECRET && req.headers.get('x-webhook-secret') !== PUSH_SECRET) return new Response('forbidden', { status: 403 })
    if (!SUPABASE_URL || !SERVICE_KEY || !VAPID_PUBLIC || !VAPID_PRIVATE) return new Response('push not configured', { status: 200 })
    const body = await req.json().catch(() => ({}))
    const m = body.record || body.message || body
    if (!m || !m.id || !m.sender_id) return new Response('ignored', { status: 200 })
    const emps = await getJSON('employees?select=id,name,role,custom_role,extra_roles')
    const byId = new Map<string, any>(emps.map((e: any) => [e.id, e]))
    const sender = byId.get(m.sender_id)
    const fromName = sender?.name || 'Teammate'

    let targets: any[]
    let url = './chat.html'
    if (m.case_id) {
      const cases = await getJSON(`customer_feedback?id=eq.${m.case_id}&select=assigned_to`)
      const assigned: string | null = cases?.[0]?.assigned_to ?? null
      const rk = assigned ? roleKey(assigned) : null
      targets = emps.filter((e: any) => {
        if (e.id === m.sender_id) return false
        if (['manager', 'admin', 'super_admin'].includes(e.role)) return true
        if (!assigned) return false
        if (!rk) return assigned === e.name
        const mine = [String(e.custom_role || e.role || '').toLowerCase()]
        try { const ex = typeof e.extra_roles === 'string' ? JSON.parse(e.extra_roles || '[]') : (e.extra_roles || []); for (const x of ex) mine.push(String(x).toLowerCase()) } catch {}
        return mine.includes(rk)
      })
      url = `./customer_feedback.html?open=${m.case_id}`
    } else if (m.recipient_id) {
      const r = byId.get(m.recipient_id); targets = r ? [r] : []
      url = `./chat.html?convo=dm&partner=${m.sender_id}`
    } else {
      targets = emps.filter((e: any) => e.id !== m.sender_id)
      url = './chat.html'
    }
    if (!targets.length) return new Response('no targets', { status: 200 })
    const title = `💬 ${fromName}`
    const text  = String(m.body || '').slice(0, 140) || '📎 attachment'
    for (const e of targets) await notify(e, m.case_id || null, title, text, url)
    return new Response(JSON.stringify({ recipients: targets.length }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response('error: ' + (e as Error).message, { status: 200 })
  }
})
