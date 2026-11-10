import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const exec = promisify(execFile);
const ffmpeg = resolve('.cache/ms-playwright/ffmpeg-1013/ffmpeg-win64.exe');
const output = resolve('docs/evidencias/movimento');
await mkdir(output, { recursive: true });
for (const name of ['percurso-desktop', 'percurso-mobile', 'calibracao-discreta', 'calibracao-moderada', 'calibracao-expressiva']) {
  const directory = `${output}/${name}`;
  await mkdir(directory, { recursive: true });
  await exec(ffmpeg, ['-y','-i',resolve(`docs/evidencias/videos/${name}.webm`),'-vf','scale=480:-1','-r','2','-frames:v','24',`${directory}/quadro-%02d.png`]);
  const frames = (await readdir(directory)).filter(file => file.endsWith('.png')).sort();
  const width = name.includes('mobile') ? 195 : 360;
  const height = name.includes('mobile') ? 422 : 225;
  const selected = frames.filter((_, index) => index % (name.includes('calibracao') ? 1 : 2) === 0).slice(0, 12);
  const composites = [];
  for (let i = 0; i < selected.length; i++) {
    composites.push({ input: await sharp(`${directory}/${selected[i]}`).resize(width, height, { fit: 'cover' }).png().toBuffer(), left: (i % 4) * width, top: Math.floor(i / 4) * (height + 26) });
    const label = `<svg width="${width}" height="26"><rect width="100%" height="100%" fill="#f2f5ef"/><text x="10" y="18" font-family="Arial" font-size="12" fill="#123c3d">Quadro ${selected[i].match(/\d+/)[0]}</text></svg>`;
    composites.push({ input: Buffer.from(label), left: (i % 4) * width, top: Math.floor(i / 4) * (height + 26) + height });
  }
  await sharp({ create: { width: width * 4, height: (height + 26) * Math.ceil(selected.length / 4), channels: 3, background: '#f2f5ef' } }).composite(composites).png().toFile(`${output}/${name}-sequencia.png`);
  console.log(`Sequência de revisão: ${name}.`);
}
