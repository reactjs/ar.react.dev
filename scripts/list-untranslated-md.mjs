#!/usr/bin/env node
/**
 * Lists Markdown files under src/content with few Arabic letters (likely English).
 * Threshold is heuristic; raise ARABIC_MIN after more pages are translated.
 *
 * Usage: node scripts/list-untranslated-md.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'src/content');
const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const ARABIC_MIN = 80;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const low = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const n = (text.match(ARABIC) || []).length;
  if (n < ARABIC_MIN) low.push({f: path.relative(process.cwd(), f), n});
}
low.sort((a, b) => a.n - b.n || a.f.localeCompare(b.f));
console.log(
  `Files with <${ARABIC_MIN} Arabic chars: ${low.length} / ${files.length}\n`
);
for (const {f, n} of low) console.log(`${String(n).padStart(5)}  ${f}`);
