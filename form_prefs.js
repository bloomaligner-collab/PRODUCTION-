// form_prefs.js — per-user, cross-device form customisation.
//
// Backed by public.user_form_prefs (RLS: owner-only), one row per
// (user, form). Used by the Customer Feedback "Log Feedback" modal to
// remember which optional fields a user shows/hides, their order, and
// whether modal icons are shown.
//
//   import { loadFormPrefs, saveFormPrefs } from './form_prefs.js'
//   const prefs = await loadFormPrefs(sb, 'customer_feedback_log')
//   await saveFormPrefs(sb, 'customer_feedback_log', prefs)
//
// prefs shape (free-form per form): { order:[], hidden:[], icons:bool }

export async function loadFormPrefs(sb, form) {
  try {
    const { data, error } = await sb.from('user_form_prefs')
      .select('prefs').eq('form', form).maybeSingle()
    if (error || !data) return {}
    return data.prefs || {}
  } catch {
    return {}
  }
}

export async function saveFormPrefs(sb, form, prefs) {
  // user_id defaults to auth.uid(); UNIQUE(user_id, form) lets us upsert.
  const { error } = await sb.from('user_form_prefs')
    .upsert({ form, prefs: prefs || {} }, { onConflict: 'user_id,form' })
  return error ? error.message : null
}
