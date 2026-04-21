// admin-user — manager-only Supabase Auth admin bridge.
// Deployment:  supabase functions deploy admin-user --project-ref cvrmadmzzualqukxxlro
// Requires:    project already has the employees table with auth_user_id column
//              and at least one employee row with role='manager' linked to a session.
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SB_SERVICE_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const AUTH_BASE = `${SUPABASE_URL}/auth/v1/admin/users`
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  const trace: Record<string, unknown> = {}
  try {
    if (!SERVICE_KEY) return json({ error: 'Server misconfig: SUPABASE_SERVICE_ROLE_KEY not set', trace }, 500)

    const authHeader = req.headers.get('Authorization') || ''
    const jwt = authHeader.replace(/^Bearer\s+/i, '').trim()
    if (!jwt) return json({ error: 'Missing Authorization header', trace }, 401)

    const meRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${jwt}` }
    })
    trace.me_status = meRes.status
    if (!meRes.ok) return json({ error: 'Invalid or expired session', trace }, 401)
    const me = await meRes.json()
    const callerId = me?.id
    if (!callerId) return json({ error: 'Session has no user id', trace }, 401)

    const empRes = await fetch(
      `${SUPABASE_URL}/rest/v1/employees?auth_user_id=eq.${callerId}&select=role,is_active`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
    )
    trace.emp_status = empRes.status
    if (!empRes.ok) return json({ error: 'Profile lookup failed', trace }, 500)
    const emps = await empRes.json()
    const caller = Array.isArray(emps) ? emps[0] : null
    if (!caller) return json({ error: 'No employee profile linked to this account', trace }, 403)
    if (!caller.is_active) return json({ error: 'Your account is blocked', trace }, 403)
    if (caller.role !== 'manager') return json({ error: 'Managers only', trace }, 403)

    const body = await req.json().catch(() => ({}))
    const { action, uid, email, password, name, role, updates } = body
    const H = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' }
    let r: Response
    if (action === 'list') {
      r = await fetch(AUTH_BASE + '?per_page=200', { headers: H })
    } else if (action === 'create') {
      if (!email || !password) return json({ error: 'email and password required', trace }, 400)
      r = await fetch(AUTH_BASE, {
        method: 'POST', headers: H,
        body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { name, role } })
      })
    } else if (action === 'update') {
      if (!uid) return json({ error: 'uid required', trace }, 400)
      r = await fetch(`${AUTH_BASE}/${uid}`, { method: 'PUT', headers: H, body: JSON.stringify(updates || {}) })
    } else if (action === 'delete') {
      if (!uid) return json({ error: 'uid required', trace }, 400)
      r = await fetch(`${AUTH_BASE}/${uid}`, { method: 'DELETE', headers: H })
    } else {
      return json({ error: 'invalid action', trace }, 400)
    }
    const d = r.status === 204 ? { success: true } : await r.json().catch(() => ({}))
    if (r.status >= 400) {
      return json({ error: (d as { msg?: string; message?: string }).msg || (d as { message?: string }).message || 'Admin call failed', admin: d, trace }, r.status)
    }
    return json(d, r.status)
  } catch (e) {
    return json({ error: (e as Error).message || 'Internal error', trace }, 500)
  }
})
