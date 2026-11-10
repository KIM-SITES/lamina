import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const html = await readFile('docs/evidencias/index.html', 'utf8');
const references = [...html.matchAll(/(?:src|href|poster)="([^"]+)"/g)].map(match => match[1]).filter(value => !value.startsWith('http'));
const missing = [];
for (const reference of new Set(references)) {
  try { await access(resolve('docs/evidencias', reference)); }
  catch { missing.push(reference); }
}
console.log(JSON.stringify({ references: references.length, missing }));
if (missing.length) process.exitCode = 1;
