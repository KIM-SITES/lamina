import { readdir, stat, writeFile } from 'node:fs/promises';
const excluded = new Set(['node_modules','.cache','.astro','dist','test-results','playwright-report','.agents','.git','AGENTS.md','skills-lock.json']);
const lines = [];
async function walk(directory = '.') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await walk(path);
    else if (path !== './docs/inventario-arquivos.txt') lines.push(`${path.slice(2)}\t${(await stat(path)).size} bytes`);
  }
}
await walk();
await writeFile('docs/inventario-arquivos.txt', `Arquivos de entrega da Fase 1 (fontes e evidências; exclui dependências, build e caches).\nAGENTS.md, .agents e skills-lock.json são anteriores e foram preservados.\n\n${lines.sort().join('\n')}\n`);
console.log(`${lines.length} arquivos de entrega inventariados.`);
