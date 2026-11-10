import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = 'docs/redirecao/etapa-1';
const output = 'public/studies/etapa-1';
await mkdir(output, { recursive: true });
const landscape = `${root}/originais/superficie-horizontal.png`;
const portrait = `${root}/originais/superficie-vertical.png`;
const patio = `${root}/originais/patio.png`;
const garden = `${root}/originais/jardim.png`;
const recipes = [
  { name: 'superficie-desktop', source: landscape, width: 1586, height: 992, position: 'centre', role: 'Hero desktop; matriz de enquadramento desktop.' },
  { name: 'superficie-tablet-horizontal', source: landscape, width: 1280, height: 960, position: 'centre', role: 'Recorte 4:3 do mestre horizontal; preserva canto da piscina, pavilhão e borda.' },
  { name: 'superficie-tablet-vertical', source: portrait, width: 1024, height: 1365, position: 'centre', role: 'Recorte 3:4 da tomada vertical; retém pavilhão, diagonal da borda e degraus.' },
  { name: 'superficie-mobile', source: portrait, width: 792, height: 1188, position: 'centre', role: 'Tomada vertical completa em 2:3, sem recorte panorâmico ampliado.' },
  { name: 'enquadramento', source: landscape, width: 790, height: 992, extract: { left: 440, top: 0, width: 790, height: 992 }, role: 'Destino editorial da cena desktop; mesma fotografia, não uma nova perspectiva.' },
  { name: 'enquadramento-vertical', source: portrait, width: 820, height: 1100, extract: { left: 102, top: 160, width: 820, height: 1100 }, role: 'Destino editorial de mobile e tablet vertical; mesma matriz vertical do hero.' },
  { name: 'patio', source: patio, width: 1440, height: 960, position: 'centre', role: 'Segundo ambiente demonstrativo, distinto do hero.' },
  { name: 'jardim', source: garden, width: 1440, height: 960, position: 'centre', role: 'Vista elevada do ambiente de jardim, não utilizada na passagem óptica por ser outra câmera.' },
  { name: 'material', source: landscape, width: 952, height: 600, extract: { left: 634, top: 392, width: 952, height: 600 }, role: 'Detalhe de água, borda e degraus para concluir a narrativa; mesma matriz horizontal.' },
];
const assets = [];
for (const recipe of recipes) {
  let image = sharp(recipe.source);
  if (recipe.extract) image = image.extract(recipe.extract);
  const path = `${output}/${recipe.name}.webp`;
  await image.resize(recipe.width, recipe.height, { fit: 'cover', position: recipe.position, withoutEnlargement: true }).webp({ quality: 87 }).toFile(path);
  const { width, height } = await sharp(path).metadata();
  assets.push({ ...recipe, path, width, height, bytes: (await stat(path)).size, sha256: createHash('sha256').update(await readFile(path)).digest('hex') });
}
const originals = [];
for (const path of [landscape, portrait, patio, garden]) {
  const { width, height } = await sharp(path).metadata();
  originals.push({ path, width, height, bytes: (await stat(path)).size, sha256: createHash('sha256').update(await readFile(path)).digest('hex') });
}
await writeFile(`${root}/inventario-recursos.json`, JSON.stringify({ generatedWith: 'image_gen integrado', transformations: 'Somente recorte, redimensionamento sem ampliação e codificação WebP com sharp. Sem retoque pictórico por código.', originals, assets }, null, 2));
console.log(JSON.stringify(assets.map(({ name, width, height, bytes }) => ({ name, width, height, bytes })), null, 2));
