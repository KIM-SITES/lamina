import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = 'docs/redirecao/etapa-3/fontes';
const output = 'public/studies/etapa-3/images';
await mkdir(output, { recursive: true });
const sources = [
  ['luz-aberta', `${root}/luz-aberta.png`, .56],
  ['jardim-adentro', `${root}/jardim-adentro.png`, .55],
  ['depois-do-sol', `${root}/depois-do-sol.png`, .57],
  ['materia-e-agua', `${root}/materia-e-agua.png`, .48],
  ['patio-final', 'docs/fontes/originais/patio.png', .56],
];
const manifest = [];
for (const [id, source, center] of sources) {
  const meta = await sharp(source).metadata();
  for (const width of [720, 1080, 1440]) {
    const path = `${output}/${id}-${width}.webp`;
    const info = await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 83 }).toFile(path);
    manifest.push({ id, source, path, ...info });
  }
  const cropWidth = Math.floor(meta.height * .75);
  const left = Math.max(0, Math.min(meta.width - cropWidth, Math.round(meta.width * center - cropWidth / 2)));
  const path = `${output}/${id}-vertical.webp`;
  const info = await sharp(source).extract({ left, top: 0, width: cropWidth, height: meta.height }).resize(720, 960).webp({ quality: 84 }).toFile(path);
  manifest.push({ id, source, path, crop: { left, top: 0, width: cropWidth, height: meta.height }, ...info });
}
await writeFile(`${root}/derivados.json`, JSON.stringify(manifest, null, 2));
console.log(`${manifest.length} derivados responsivos, sem alterações pictóricas por código.`);
