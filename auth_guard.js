// Cedarwings SAS — page auth guard
// Include on every authenticated page via:
//   <script type="module" src="auth_guard.js"></script>
// 1. Wipes any stored auth tokens from other Supabase projects (migration
//    leftovers that would otherwise keep sending a stale JWT).
// 2. Calls sb.auth.getUser() — validates the JWT with the server. If
//    invalid / expired, signs out, clears session storage, redirects to
//    login.
// 3. Exposes window.cwSignOut() for logout links.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { SUPABASE_CONFIG } from "./config.js"

const _guardSb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)

const SESSION_KEYS = ["cw_current_emp", "cw_role", "cw_pages", "cw_name", "cw_custom_role"]

// Derive the current project's auth-token key so we can tell it apart
// from any leftovers (e.g. sb-<oldref>-auth-token).
const CURRENT_AUTH_KEY = (() => {
  try {
    const ref = new URL(SUPABASE_CONFIG.url).hostname.split('.')[0]
    return `sb-${ref}-auth-token`
  } catch { return null }
})()

function wipeStaleAuthTokens() {
  // Any localStorage key that looks like a Supabase auth token but
  // belongs to a different project ref is dead weight — remove it.
  const rm = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && /^sb-[a-z0-9]+-auth-token/.test(k) && k !== CURRENT_AUTH_KEY) rm.push(k)
  }
  rm.forEach(k => localStorage.removeItem(k))
}

// iOS PWAs (and some browsers) wipe sessionStorage when the app is
// closed/reopened. The Supabase auth token survives in localStorage,
// but CW_ACCESS.guard() reads `cw_name` from sessionStorage and would
// bounce the still-authenticated user back to the login screen. Mirror
// the session keys back from localStorage so the user stays in.
function restoreSessionFromLocal() {
  for (const k of SESSION_KEYS) {
    if (!sessionStorage.getItem(k)) {
      const v = localStorage.getItem(k)
      if (v != null) sessionStorage.setItem(k, v)
    }
  }
}

function clearSession() {
  SESSION_KEYS.forEach(k => {
    sessionStorage.removeItem(k)
    localStorage.removeItem(k)
  })
}

function redirectToLogin() {
  clearSession()
  if (!/index\.html?$|\/$/.test(location.pathname)) {
    location.replace("index.html")
  }
}

// 1. Clean any cross-project leftover tokens BEFORE touching the client.
wipeStaleAuthTokens()
// 1b. Re-hydrate sessionStorage from localStorage when iOS has wiped it.
restoreSessionFromLocal()

// 2. Validate the current session against the server. getUser() actually
//    hits /auth/v1/user, so a JWT signed by a different project is
//    rejected here (not just stale-looking). getSession() would lie.
const { data: userData, error: userErr } = await _guardSb.auth.getUser()
if (userErr || !userData?.user) {
  // Distinguish a genuinely invalid/expired token from a transient
  // network failure. On flaky mobile connections getUser() (which hits
  // the network) can fail to reach the server; signing the user out in
  // that case forces a needless re-login and a redirect flicker. Only
  // bounce to login when the token is actually rejected (HTTP 401/403)
  // or there is no stored session at all. Otherwise keep the user in
  // and let autoRefreshToken recover in the background.
  const status = userErr?.status
  const { data: sessionData } = await _guardSb.auth.getSession()
  const hasLocalSession = !!sessionData?.session
  if (status === 401 || status === 403 || !hasLocalSession) {
    try { await _guardSb.auth.signOut() } catch { /* best effort */ }
    redirectToLogin()
  }
}

// 3. React to sign-out in another tab too.
_guardSb.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") redirectToLogin()
})

// 4. Global sign-out helper.
window.cwSignOut = async () => {
  try { await _guardSb.auth.signOut() } catch { /* best effort */ }
  redirectToLogin()
}
