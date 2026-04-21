// Cedarwings SAS — page auth guard
// Include on every authenticated page via:
//   <script type="module" src="auth_guard.js"></script>
// If there's no Supabase session, wipes stale sessionStorage and redirects to login.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { SUPABASE_CONFIG } from "./config.js"

const _guardSb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)

const SESSION_KEYS = ["cw_current_emp", "cw_role", "cw_pages", "cw_name", "cw_custom_role"]

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

// Check on load
const { data } = await _guardSb.auth.getSession()
if (!data.session) redirectToLogin()

// Also react to sign-out in another tab
_guardSb.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") redirectToLogin()
})

// Expose a global sign-out helper for pages to use
window.cwSignOut = async () => {
  await _guardSb.auth.signOut()
  redirectToLogin()
}
