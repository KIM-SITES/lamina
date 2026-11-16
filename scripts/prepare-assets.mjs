import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
const sources = 'src/assets/images';
const output = 'public/images';
await mkdir(output, { recursive: true });
await mkdir('public/fonts', { recursive: true });
// The hero matrices also supply the measured destination of the optical transition.
await sharp(`${sources}/superficie-horizontal.png`)
    .resize(1586, 992, { fit: 'cover', position: 'centre', withoutEnlargement: true })
    .webp({ quality: 87 }).toFile(`${output}/superficie-desktop.webp`);
await sharp(`${sources}/superficie-vertical.png`)
    .webp({ quality: 82 }).toFile(`${output}/superficie-vertical.webp`);
const scenes = [
    ['luz-aberta', .56], ['jardim-adentro', .55], ['depois-do-sol', .57],
    ['materia-e-agua', .48], ['patio-final', .56],
];
for (const [id, center] of scenes) {
    const source = `${sources}/${id}.png`;
    const metadata = await sharp(source).metadata();
    // Materials uses the portrait detail at every size.
    if (id !== 'materia-e-agua') {
        for (const width of [720, 1080, 1440]) {
            await sharp(source).resize({ width, withoutEnlargement: true })
                .webp({ quality: 83 }).toFile(`${output}/${id}-${width}.webp`);
        }
    }
    const cropWidth = Math.floor(metadata.height * .75);
    const left = Math.max(0, Math.min(metadata.width - cropWidth, Math.round(metadata.width * center - cropWidth / 2)));
    await sharp(source).extract({ left, top: 0, width: cropWidth, height: metadata.height })
        .resize(720, 960).webp({ quality: 84 }).toFile(`${output}/${id}-vertical.webp`);
}
for (const font of ['syne', 'instrument-sans']) {
    await copyFile(`node_modules/@fontsource-variable/${font}/files/${font}-latin-wght-normal.woff2`, `public/fonts/${font}.woff2`);
}
console.log('19 imagens responsivas e duas fontes locais preparadas.');
