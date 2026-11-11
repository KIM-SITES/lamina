import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import sharp from 'sharp';
const exec=promisify(execFile),root='docs/redirecao/etapa-3',publicRoot='public/studies/etapa-3';
const manifest=await readFile(`${root}/evidencias.json`,'utf8').then(JSON.parse).catch(()=>({date:'2026-11-11',route:'http://127.0.0.1:4322/estudos/etapa-3/',screenshots:[],videos:[],reviewImages:{}}));
// The manifest can be recovered after an interrupted packaging step without recapturing a video.
if(!manifest.screenshots.length)for(const file of await readdir(`${root}/evidencias`)){
  if(!file.endsWith('.png')||file.startsWith('video-'))continue;
  const name=file.slice(0,-4),path=`${root}/evidencias/${file}`,buffer=await readFile(path),meta=await sharp(buffer).metadata();
  const preview=`${publicRoot}/evidencias/${name}.webp`,p=await sharp(preview).metadata();
  const format=name.split('-')[0],viewport=format==='desktop'?{width:1440,height:900}:format==='tablet'?{width:820,height:1180}:format==='mobile'?{width:390,height:844}:format==='small'?{width:320,height:700}:{width:1920,height:1080};
  manifest.screenshots.push({name,path,preview,width:meta.width,height:meta.height,viewport,fullPage:name.endsWith('-completa'),reducedMotion:name.endsWith('-completa'),sha256:createHash('sha256').update(buffer).digest('hex')});
  manifest.reviewImages[name]={width:p.width,height:p.height};
}
const ffmpeg=resolve('.cache/ms-playwright/ffmpeg-1013/ffmpeg-win64.exe');
for(const name of ['desktop','mobile']){
  const path=`${root}/videos/percurso-${name}.webm`,buffer=await readFile(path);
  let video=manifest.videos.find(v=>v.name===name);
  if(!video){video={name,path,bytes:buffer.length,width:name==='desktop'?1440:390,height:name==='desktop'?900:844,edited:false,sha256:createHash('sha256').update(buffer).digest('hex'),interaction:name==='desktop'?'Wheel nativo e cliques reais automatizados no Chromium.':'Gestos de toque CDP e taps reais automatizados no Chromium.'};manifest.videos.push(video);}
  const directory=`${root}/quadros-${name}`;await mkdir(directory,{recursive:true});const prefix=`final-${Date.now()}`;
  const result=await exec(ffmpeg,['-y','-i',resolve(path),'-vf',name==='mobile'?'scale=195:-1':'scale=480:-1','-r','0.5','-frames:v','30',resolve(`${directory}/${prefix}-%02d.png`)]);
  const duration=result.stderr.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);if(duration)video.durationSeconds=Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3]);
  const files=(await readdir(directory)).filter(f=>f.startsWith(prefix)&&f.endsWith('.png')).sort();
  const width=name==='mobile'?195:480,height=name==='mobile'?422:300,columns=name==='mobile'?5:3;
  const layers=await Promise.all(files.map(async(file,i)=>({input:await readFile(`${directory}/${file}`),left:i%columns*width,top:Math.floor(i/columns)*height})));
  const sequence=`${root}/evidencias/video-${name}-sequencia.png`;
  const image=await sharp({create:{width:width*columns,height:height*Math.ceil(files.length/columns),channels:3,background:'#083c63'}}).composite(layers).png().toBuffer();await writeFile(sequence,image);
  const info=await sharp(image).resize({width:1200,withoutEnlargement:true}).webp({quality:86}).toFile(`${publicRoot}/evidencias/video-${name}-sequencia.webp`);
  manifest.reviewImages[`video-${name}-sequencia`]={width:info.width,height:info.height};video.sampledFrames={count:files.length,intervalSeconds:2,path:sequence,interpolated:false,files:files.map(f=>`${directory}/${f}`)};
}
await writeFile(`${root}/evidencias.json`,JSON.stringify(manifest,null,2));await writeFile(`${publicRoot}/evidencias/dimensoes.json`,JSON.stringify(manifest.reviewImages,null,2));
console.log(JSON.stringify({screenshots:manifest.screenshots.length,videos:manifest.videos.map(v=>({name:v.name,durationSeconds:v.durationSeconds,frames:v.sampledFrames.count}))}));
