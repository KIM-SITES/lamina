import sharp from "sharp";
import { mkdir, copyFile, writeFile } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
await mkdir("public/fonts", { recursive: true });
await mkdir("docs/fontes", { recursive: true });
const scenes = [
  ["superficie", "docs/fontes/originais/superficie.png"],
  ["patio", "docs/fontes/originais/patio.png"],
];
for (const [name, input] of scenes) {
  for (const width of [640, 960, 1440, 1920]) {
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 83 })
      .toFile(`public/images/${name}-${width}.webp`);
  }
}
// Recorte vertical próprio: preserva borda, degraus, água e árvore.
await sharp(scenes[0][1])
  .resize(900, 1200, { fit: "cover", position: "right" })
  .webp({ quality: 84 })
  .toFile("public/images/superficie-vertical.webp");
// Detalhe da mesma cena para continuidade óptica entre os dois quadros.
const metadata = await sharp(scenes[0][1]).metadata();
await sharp(scenes[0][1])
  .extract({
    left: Math.round(metadata.width * 0.35),
    top: Math.round(metadata.height * 0.5),
    width: Math.round(metadata.width * 0.64),
    height: Math.round(metadata.height * 0.49),
  })
  .resize(1440, 900, { fit: "cover" })
  .webp({ quality: 82 })
  .toFile("public/images/agua-detalhe.webp");
for (const [font, filename] of [
  ["syne", "syne-latin-wght-normal.woff2"],
  ["instrument-sans", "instrument-sans-latin-wght-normal.woff2"],
]) {
  await copyFile(
    `node_modules/@fontsource-variable/${font}/files/${filename}`,
    `public/fonts/${font}.woff2`,
  );
  await copyFile(
    `node_modules/@fontsource-variable/${font}/LICENSE`,
    `docs/fontes/${font}-OFL.txt`,
  );
}
await writeFile(
  "docs/fontes/geracao.json",
  JSON.stringify(
    {
      generatedWith: "image_gen integrado, sem CLI ou API key",
      sources: scenes.map(([name]) => ({
        name,
        original: `docs/fontes/originais/${name}.png`,
      })),
      transformations:
        "Somente conversão WebP, redimensionamento e recortes responsivos por sharp.",
    },
    null,
    2,
  ),
);
console.log("Imagens e fontes locais preparadas.");
