// chat_media.js — shared chat attachment support (photo / video /
// voice / camera) for the Team Chat page and the per-case discussion
// embedded in Customer Feedback.
//
// Files go to the private `chat-media` Storage bucket; messages carry
// an `attachments` jsonb array of { path, kind, mime, name, size }.
// The browser reads files back through short-lived signed URLs.
//
//   import { createChatAttachments, attachmentsHtml, hydrateAttachments }
//     from './chat_media.js'
//
//   const att = createChatAttachments({ sb, composerEl, insertBeforeEl, notify })
//   ... on send:  const files = att.hasPending() ? await att.upload() : []
//   ... on render: el.innerHTML = ... attachmentsHtml(msg.attachments) ...
//                  hydrateAttachments(sb, el)

export const CHAT_BUCKET = 'chat-media'
const MAX_BYTES = 25 * 1024 * 1024   // 25 MB / file
const MAX_FILES = 6                   // per message

const _esc = s => String(s == null ? '' : s)
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function kindFromMime(m = '') {
  if (m.startsWith('image/')) return 'image'
  if (m.startsWith('video/')) return 'video'
  if (m.startsWith('audio/')) return 'audio'
  return 'file'
}
function extFor(file) {
  const fromName = (file.name || '').split('.').pop()
  if (fromName && fromName.length <= 5 && fromName !== file.name) return fromName.toLowerCase()
  const m = (file.type || '').split('/')[1] || 'bin'
  return m.split(';')[0].toLowerCase()
}
function humanSize(n) {
  if (!n) return ''
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB'
  return (n / 1024 / 1024).toFixed(1) + ' MB'
}

// ── one-time CSS ──────────────────────────────────────────────────────
let _cssDone = false
function injectCss() {
  if (_cssDone) return
  _cssDone = true
  const css = `
  @keyframes cwAttPulse{0%,100%{opacity:1}50%{opacity:.55}}
  /* Scoped to beat the composers' generic button styling. */
  .composer .cw-att-btn,.cc-composer .cw-att-btn{
    width:34px;height:34px;flex-shrink:0;border:1px solid var(--bdr);border-radius:50%;
    background:var(--bg);color:var(--mu);font-size:15px;cursor:pointer;display:flex;align-items:center;
    justify-content:center;transition:background .12s,color .12s,transform .08s;padding:0;line-height:1;
    font-family:inherit;box-shadow:none}
  .composer .cw-att-btn:hover,.cc-composer .cw-att-btn:hover{background:var(--b50,#eef2ff);color:var(--blue,#3b5fe2)}
  .composer .cw-att-btn:active,.cc-composer .cw-att-btn:active{transform:scale(.92)}
  .composer .cw-att-btn.rec,.cc-composer .cw-att-btn.rec{background:var(--red,#dc2626);color:#fff;
    border-color:var(--red,#dc2626);animation:cwAttPulse 1.1s infinite}
  .cw-att-tray{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px 0}
  .cw-att-chip{position:relative;display:flex;align-items:center;gap:7px;max-width:200px;
    border:1px solid var(--bdr);border-radius:10px;padding:6px 8px;background:var(--card);font-size:11px;color:var(--mu)}
  .cw-att-chip img,.cw-att-chip video{width:38px;height:38px;object-fit:cover;border-radius:6px;flex-shrink:0;background:#000}
  .cw-att-chip .cw-att-nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;color:var(--txt)}
  .cw-att-x{border:none;background:var(--bg);color:var(--mu);border-radius:50%;width:18px;height:18px;
    font-size:12px;line-height:1;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .cw-att-x:hover{background:var(--r50,#fef2f2);color:var(--red,#dc2626)}
  .cw-att{display:block;margin-top:6px;border-radius:12px;max-width:240px;max-height:240px;cursor:pointer}
  .cw-att-v{display:block;margin-top:6px;border-radius:12px;max-width:260px;max-height:260px;background:#000}
  .cw-att-a{display:block;margin-top:6px;width:240px;max-width:100%}
  .cw-att-f{display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:7px 11px;border:1px solid var(--bdr);
    border-radius:10px;background:var(--card);font-size:12px;font-weight:600;color:var(--blue,#3b5fe2)}
  .cw-att-loading{opacity:.45}
  `
  const tag = document.createElement('style')
  tag.textContent = css
  document.head.appendChild(tag)
}

// ── signed-URL cache (path → { url, until }) ──────────────────────────
const _signed = new Map()
async function signPaths(sb, paths) {
  const out = new Map()
  const now = Date.now()
  const need = []
  for (const p of paths) {
    const c = _signed.get(p)
    if (c && c.until > now + 60_000) out.set(p, c.url)
    else if (!need.includes(p)) need.push(p)
  }
  if (need.length) {
    try {
      const { data, error } = await sb.storage.from(CHAT_BUCKET).createSignedUrls(need, 3600)
      if (!error && Array.isArray(data)) {
        for (const row of data) {
          if (row && row.signedUrl && row.path) {
            _signed.set(row.path, { url: row.signedUrl, until: now + 3600_000 })
            out.set(row.path, row.signedUrl)
          }
        }
      }
    } catch { /* leave unsigned; nodes stay in loading state */ }
  }
  return out
}

// ── render: attachments → HTML (un-hydrated) ──────────────────────────
export function attachmentsHtml(list) {
  if (!Array.isArray(list) || !list.length) return ''
  injectCss()
  let h = '<div class="cw-att-wrap">'
  for (const a of list) {
    if (!a || !a.path) continue
    const p = _esc(a.path), nm = _esc(a.name || 'file')
    if (a.kind === 'image')
      h += `<a class="cw-att-link" data-att-path="${p}" data-att-kind="image" target="_blank" rel="noopener">`
         + `<img class="cw-att cw-att-loading" alt="${nm}"></a>`
    else if (a.kind === 'video')
      h += `<video class="cw-att-v cw-att-loading" data-att-path="${p}" data-att-kind="video" controls playsinline preload="metadata"></video>`
    else if (a.kind === 'audio')
      h += `<audio class="cw-att-a cw-att-loading" data-att-path="${p}" data-att-kind="audio" controls preload="metadata"></audio>`
    else
      h += `<a class="cw-att-f cw-att-loading" data-att-path="${p}" data-att-kind="file" target="_blank" rel="noopener">📎 ${nm}</a>`
  }
  return h + '</div>'
}

// Fill in signed URLs for any attachment nodes not yet hydrated.
export async function hydrateAttachments(sb, root) {
  if (!root) return
  const nodes = root.querySelectorAll('[data-att-path]:not([data-att-done])')
  if (!nodes.length) return
  const paths = [...new Set([...nodes].map(n => n.getAttribute('data-att-path')))]
  const urls = await signPaths(sb, paths)
  nodes.forEach(n => {
    const url = urls.get(n.getAttribute('data-att-path'))
    if (!url) return
    const kind = n.getAttribute('data-att-kind')
    if (kind === 'image') { n.href = url; const img = n.querySelector('img'); if (img) img.src = url }
    else if (kind === 'video' || kind === 'audio') { n.src = url }
    else { n.href = url }
    n.classList.remove('cw-att-loading')
    n.setAttribute('data-att-done', '1')
  })
}

// ── composer attachment controls ──────────────────────────────────────
export function createChatAttachments({ sb, composerEl, insertBeforeEl, notify }) {
  injectCss()
  const note = typeof notify === 'function' ? notify : () => {}
  const pending = []   // { id, file, kind }
  let tray = null
  let recorder = null, recChunks = [], recStream = null

  // hidden file inputs
  const mkInput = (accept, capture, multiple) => {
    const i = document.createElement('input')
    i.type = 'file'; i.accept = accept; i.style.display = 'none'
    if (capture) i.capture = capture
    if (multiple) i.multiple = true
    i.addEventListener('change', () => { addFiles(i.files); i.value = '' })
    composerEl.appendChild(i)
    return i
  }
  const galleryInput = mkInput('image/*,video/*', null, true)
  const cameraInput  = mkInput('image/*', 'environment', false)

  const mkBtn = (txt, title, on) => {
    const b = document.createElement('button')
    b.type = 'button'; b.className = 'cw-att-btn'; b.textContent = txt; b.title = title
    b.addEventListener('click', on)
    composerEl.insertBefore(b, insertBeforeEl)
    return b
  }
  mkBtn('🖼️', 'Attach photo or video', () => galleryInput.click())
  mkBtn('📷', 'Take a photo',           () => cameraInput.click())
  const voiceBtn = mkBtn('🎤', 'Record a voice message', toggleVoice)

  function ensureTray() {
    if (tray) return tray
    tray = document.createElement('div')
    tray.className = 'cw-att-tray'
    composerEl.parentElement.insertBefore(tray, composerEl)
    return tray
  }
  function renderTray() {
    if (!pending.length) { if (tray) { tray.remove(); tray = null } return }
    const t = ensureTray()
    t.innerHTML = ''
    for (const it of pending) {
      const chip = document.createElement('div')
      chip.className = 'cw-att-chip'
      let thumb = ''
      if (it.kind === 'image') thumb = `<img src="${URL.createObjectURL(it.file)}">`
      else if (it.kind === 'video') thumb = `<video src="${URL.createObjectURL(it.file)}" muted></video>`
      else thumb = `<span style="font-size:18px">${it.kind === 'audio' ? '🎤' : '📎'}</span>`
      chip.innerHTML = `${thumb}<span class="cw-att-nm">${_esc(it.file.name)}</span>`
        + `<span style="white-space:nowrap">${humanSize(it.file.size)}</span>`
      const x = document.createElement('button')
      x.type = 'button'; x.className = 'cw-att-x'; x.textContent = '×'; x.title = 'Remove'
      x.addEventListener('click', () => {
        const idx = pending.findIndex(p => p.id === it.id)
        if (idx >= 0) pending.splice(idx, 1)
        renderTray()
      })
      chip.appendChild(x)
      t.appendChild(chip)
    }
  }

  function addFiles(fileList) {
    for (const f of fileList || []) {
      if (pending.length >= MAX_FILES) { note(`Up to ${MAX_FILES} files per message`, 'err'); break }
      if (f.size > MAX_BYTES) { note(`"${f.name}" is too large (max 25 MB)`, 'err'); continue }
      pending.push({ id: (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()), file: f, kind: kindFromMime(f.type) })
    }
    renderTray()
  }

  async function toggleVoice() {
    if (recorder && recorder.state === 'recording') { recorder.stop(); return }
    if (pending.length >= MAX_FILES) { note(`Up to ${MAX_FILES} files per message`, 'err'); return }
    if (!navigator.mediaDevices || !window.MediaRecorder) { note('Voice recording not supported on this device', 'err'); return }
    try {
      recStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch { note('Microphone access denied', 'err'); return }
    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || ''
    recChunks = []
    recorder = mime ? new MediaRecorder(recStream, { mimeType: mime }) : new MediaRecorder(recStream)
    recorder.addEventListener('dataavailable', e => { if (e.data && e.data.size) recChunks.push(e.data) })
    recorder.addEventListener('stop', () => {
      voiceBtn.classList.remove('rec'); voiceBtn.textContent = '🎤'
      if (recStream) { recStream.getTracks().forEach(t => t.stop()); recStream = null }
      const type = (recorder && recorder.mimeType) || 'audio/webm'
      const blob = new Blob(recChunks, { type })
      recorder = null
      if (!blob.size) return
      const ext = type.includes('mp4') ? 'm4a' : 'webm'
      const file = new File([blob], `voice-${Date.now()}.${ext}`, { type })
      if (file.size > MAX_BYTES) { note('Recording too large (max 25 MB)', 'err'); return }
      pending.push({ id: (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()), file, kind: 'audio' })
      renderTray()
    })
    recorder.start()
    voiceBtn.classList.add('rec'); voiceBtn.textContent = '⏹'
  }

  async function upload() {
    const out = []
    for (const it of pending) {
      const path = `${(crypto.randomUUID && crypto.randomUUID()) || Date.now() + '-' + Math.random().toString(16).slice(2)}.${extFor(it.file)}`
      const { error } = await sb.storage.from(CHAT_BUCKET)
        .upload(path, it.file, { contentType: it.file.type || 'application/octet-stream', upsert: false })
      if (error) { note('Upload failed: ' + error.message, 'err'); throw error }
      out.push({ path, kind: it.kind, mime: it.file.type || '', name: it.file.name || 'file', size: it.file.size || 0 })
    }
    pending.length = 0
    renderTray()
    return out
  }

  return {
    hasPending: () => pending.length > 0,
    count: () => pending.length,
    upload,
    clear() { pending.length = 0; renderTray() },
  }
}
