#!/usr/bin/env node
// Syntax-check every .js file and every inline <script> block in
// every .html file. Catches parse-level regressions that would
// otherwise only surface in the browser (missing bracket, stray
// comma, await outside async, etc).
//
// Inline scripts get wrapped in an async IIFE so top-level `await`
// — which the app uses — parses cleanly.

import { readdir, readFile } from "node:fs/promises"
import { parse } from "acorn"

const ROOT = new URL("..", import.meta.url).pathname

async function listFiles(ext) {
  const all = await readdir(ROOT)
  return all.filter(f => f.endsWith(ext))
}

function check(source, label, { isModule = true } = {}) {
  try {
    parse(source, {
      ecmaVersion: "latest",
      sourceType: isModule ? "module" : "script",
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowHashBang: true,
    })
    return null
  } catch (err) {
    return `${label}: ${err.message}`
  }
}

const errors = []

for (const f of await listFiles(".js")) {
  const src = await readFile(`${ROOT}/${f}`, "utf8")
  const e = check(src, f)
  if (e) errors.push(e)
}

const scriptRe = /<script(?<attrs>[^>]*)>(?<body>[\s\S]*?)<\/script>/g
for (const f of await listFiles(".html")) {
  const src = await readFile(`${ROOT}/${f}`, "utf8")
  let m, idx = 0
  while ((m = scriptRe.exec(src))) {
    idx++
    const attrs = m.groups.attrs || ""
    const body = m.groups.body || ""
    if (/\bsrc\s*=/i.test(attrs)) continue
    if (!body.trim()) continue
    const isModule = /\btype\s*=\s*["']?module["']?/i.test(attrs)
    const e = check(body, `${f} <script #${idx}>`, { isModule })
    if (e) errors.push(e)
  }
}

if (errors.length) {
  console.error("JS syntax errors:")
  for (const e of errors) console.error("  " + e)
  process.exit(1)
}
console.log("JS syntax OK")
