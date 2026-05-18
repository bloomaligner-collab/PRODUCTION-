// chat-push — sends a Web Push notification when a chat message is
// inserted. Wire it as a Supabase Database Webhook:
//
//   Database → Webhooks → Create
//     Table:  public.chat_messages      Events: INSERT
//     Type:   Supabase Edge Functions   →  chat-push
//     HTTP header (optional but recommended):
//       x-webhook-secret: <same value as CHAT_PUSH_SECRET below>
//
// Deploy:
//   supabase functions deploy chat-push --project-ref cvrmadmzzualqukxxlro --no-verify-jwt
//
// Secrets (supabase secrets set ...):
//   VAPID_PUBLIC_KEY   — same value put in config.js → SUPABASE_CONFIG/VAPID
//   VAPID_PRIVATE_KEY  — generated with: npx web-push generate-vapid-keys
//   VAPID_SUBJECT      — e.g. mailto:ops@cedarwings.example
//   CHAT_PUSH_SECRET   — optional shared secret matching the webhook header
//   (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically)

import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY') ?? ''
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:ops@cedarwings.local'
const PUSH_SECRET = Deno.env.get('CHAT_PUSH_SECRET') ?? ''

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
}

const rest = (path: string) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  }).then((r) => (r.ok ? r.json() : []))

function roleKey(v: string) { return v.startsWith('role:') ? v.slice(5).toLowerCase() : null }

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204 })
  try {
    if (PUSH_SECRET && req.headers.get('x-webhook-secret') !== PUSH_SECRET) {
      return new Response('forbidden', { status: 403 })
    }
    if (!SUPABASE_URL || !SERVICE_KEY || !VAPID_PUBLIC || !VAPID_PRIVATE) {
      return new Response('push not configured', { status: 200 })
    }
    const body = await req.json().catch(() => ({}))
    const m = body.record || body.message || body
    if (!m || !m.id || !m.sender_id) return new Response('ignored', { status: 200 })

    const emps = await rest('employees?select=id,name,role,custom_role,extra_roles')
    const byId = new Map<string, any>(emps.map((e: any) => [e.id, e]))
    const sender = byId.get(m.sender_id)
    const fromName = sender?.name || 'Teammate'

    // Which employee ids should be notified?
    let targetIds: string[]
    let url = './chat.html'
    if (m.case_id) {
      const cases = await rest(`customer_feedback?id=eq.${m.case_id}&select=assigned_to`)
      const assigned: string | null = cases?.[0]?.assigned_to ?? null
      const rk = assigned ? roleKey(assigned) : null
      targetIds = emps.filter((e: any) => {
        if (e.id === m.sender_id) return false
        if (e.role === 'manager') return true
        if (!assigned) return false
        if (!rk) return assigned === e.name
        const mine = [String(e.custom_role || e.role || '').toLowerCase()]
        try {
          const ex = typeof e.extra_roles === 'string' ? JSON.parse(e.extra_roles || '[]') : (e.extra_roles || [])
          for (const x of ex) mine.push(String(x).toLowerCase())
        } catch { /* ignore */ }
        return mine.includes(rk)
      }).map((e: any) => e.id)
      url = `./customer_feedback.html?open=${m.case_id}`
    } else if (m.recipient_id) {
      targetIds = [m.recipient_id]
      url = `./chat.html?convo=dm&partner=${m.sender_id}`
    } else {
      targetIds = emps.filter((e: any) => e.id !== m.sender_id).map((e: any) => e.id)
      url = './chat.html'
    }
    if (!targetIds.length) return new Response('no targets', { status: 200 })

    const inList = targetIds.map((x) => `"${x}"`).join(',')
    const subs = await rest(
      `push_subscriptions?employee_id=in.(${inList})&select=id,endpoint,p256dh,auth`,
    )
    if (!subs.length) return new Response('no subscriptions', { status: 200 })

    const payload = JSON.stringify({
      title: `💬 ${fromName}`,
      body: String(m.body || '').slice(0, 140),
      tag: 'cw-chat-' + (m.case_id || m.recipient_id || 'group'),
      url,
    })

    const dead: string[] = []
    await Promise.all(subs.map(async (s: any) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        )
      } catch (err: any) {
        const code = err?.statusCode
        if (code === 404 || code === 410) dead.push(s.id)
      }
    }))

    if (dead.length) {
      await fetch(
        `${SUPABASE_URL}/rest/v1/push_subscriptions?id=in.(${dead.map((d) => `"${d}"`).join(',')})`,
        { method: 'DELETE', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
      ).catch(() => {})
    }
    return new Response(JSON.stringify({ sent: subs.length - dead.length, pruned: dead.length }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response('error: ' + (e as Error).message, { status: 200 })
  }
})
