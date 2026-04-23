#!/usr/bin/env node
// Cross-file DOM-ID sanity check.
//
// Collects every `id="…"` in every .html file, then every
// `getElementById("…")` / `querySelector("#…")` reference in every
// .html inline script and .js file, and flags any reference to an
// ID that doesn't exist anywhere in the repo.
//
// Would have caught:
//   index.html: togglePw() called getElementById("pwEye") but no
//   element had id="pwEye" → icon never flipped. Browser silently
//   threw inside the handler.
//
// Limitation: does not verify the ID lives on the *same page* the
// JS runs on. It only catches the "referenced nowhere" class,
// which is where the historical bug lived.

import { readdir, readFile } from "node:fs/promises"

const ROOT = new URL("..", import.meta.url).pathname

async function files(ext) {
  return (await readdir(ROOT)).filter(f => f.endsWith(ext))
}

// 1. Harvest every id="…" in every .html AND .js file.
//    Catches IDs that live in a template literal or setAttribute
//    call — i.e. elements injected at runtime. We deliberately
//    don't try to understand scope; any id="X" string anywhere in
//    the repo counts as a declaration of X.
const known = new Set()
// Matches:
//   id="foo"           (HTML attribute, or attribute inside a JS string)
//   elem.id = "foo"    (JS property assignment)
//   setAttribute("id", "foo")
const harvesters = [
  /\bid\s*=\s*["']([A-Za-z_][\w-]*)["']/g,
  /\.id\s*=\s*["']([A-Za-z_][\w-]*)["']/g,
  /setAttribute\s*\(\s*["']id["']\s*,\s*["']([A-Za-z_][\w-]*)["']/g,
]
for (const ext of [".html", ".js"]) {
  for (const f of await files(ext)) {
    const src = await readFile(`${ROOT}/${f}`, "utf8")
    for (const re of harvesters) {
      for (const m of src.matchAll(re)) known.add(m[1])
    }
  }
}

// 2. Harvest references. Check .js files and inline <script> bodies.
const refs = []
const refRe = /(?:getElementById\s*\(\s*["']([A-Za-z_][\w-]*)["']\s*\))|(?:querySelector(?:All)?\s*\(\s*["']#([A-Za-z_][\w-]*)\b)/g

async function scan(src, label) {
  for (const m of src.matchAll(refRe)) {
    const id = m[1] || m[2]
    if (id) refs.push({ id, label })
  }
}

for (const f of await files(".js")) {
  await scan(await readFile(`${ROOT}/${f}`, "utf8"), f)
}

for (const f of await files(".html")) {
  const src = await readFile(`${ROOT}/${f}`, "utf8")
  for (const m of src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    await scan(m[1], f)
  }
  // Also scan inline handlers like onclick="…getElementById(…)…"
  for (const m of src.matchAll(/\bon[a-z]+\s*=\s*(["'])([\s\S]*?)\1/gi)) {
    await scan(m[2], f)
  }
}

// 3. Report. Warning-only: the codebase has a handful of
//    intentional references to IDs that don't exist (defensive
//    cleanup of stale cached DOM in bloom_import.html /
//    clocking.html per commit 2ff8cbd, CSS :not(#…) selectors in
//    access.js). Exit 0 unless forced strict.
const bad = refs.filter(r => !known.has(r.id))
if (bad.length) {
  console.log(`DOM ID references with no known declaration (${bad.length}):`)
  const by = new Map()
  for (const r of bad) {
    if (!by.has(r.id)) by.set(r.id, new Set())
    by.get(r.id).add(r.label)
  }
  for (const [id, labels] of by) {
    console.log(`  #${id}  ← ${[...labels].join(", ")}`)
  }
  if (process.env.STRICT_DOM_IDS === "1") process.exit(1)
} else {
  console.log(`DOM IDs OK (${known.size} declared, ${refs.length} referenced)`)
}
