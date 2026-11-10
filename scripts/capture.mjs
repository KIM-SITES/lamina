import { mkdir, writeFile, rename, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { launch, baseURL } from "./browser.mjs";

const output = resolve("docs/evidencias");
const videosOnly = process.argv.includes('--videos-only');
for (const directory of [
  "responsividade",
  "transicoes",
  "calibracoes",
  "videos",
  "estados",
])
  await mkdir(`${output}/${directory}`, { recursive: true });
const browser = await launch();
const manifest = {
  browser: browser.version(),
  baseURL,
  screenshots: [],
  videos: [],
  calibrations: [],
};
if (videosOnly) Object.assign(manifest, JSON.parse(await readFile(`${output}/manifesto.json`, 'utf8')));
async function shot(page, path, options = {}) {
  await page.screenshot({ path: `${output}/${path}`, ...options });
  manifest.screenshots.push(path);
}
const sizes = [
  [320, 740],
  [375, 812],
  [390, 844],
  [430, 932],
  [768, 1024],
  [820, 1180],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
];
for (const [width, height] of (videosOnly ? [] : sizes)) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    hasTouch: width < 1100,
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.waitForFunction(
    () => window.__lamina && window.__lamina.surface.mode !== "loading",
  );
  await page.waitForTimeout(1400);
  await shot(page, `responsividade/hero-${width}.png`);
  if ([390, 820, 1440].includes(width)) {
    await shot(page, `responsividade/pagina-${width}.png`, { fullPage: true });
    const distance = await page
      .locator("[data-surface]")
      .evaluate(
        (element) => element.getBoundingClientRect().height - innerHeight,
      );
    for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
      await page.evaluate(
        (top) => scrollTo({ top, behavior: "instant" }),
        distance * fraction,
      );
      await page.waitForTimeout(220);
      await shot(page, `transicoes/${width}-${Math.round(fraction * 100)}.png`);
    }
    await page.locator("#servicos").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await shot(page, `estados/servicos-${width}.png`);
    await page.getByRole("button", { name: "Um respiro no pátio" }).click();
    await page.waitForTimeout(900);
    await page.locator(".environment-images").scrollIntoViewIfNeeded();
    await shot(page, `estados/patio-${width}.png`);
    await page.getByLabel("Revitalização e reforma", { exact: true }).check();
    await page.getByLabel("Residência", { exact: true }).check();
    await page.getByRole("button", { name: "Ver resumo" }).click();
    await page.locator("#orcamento").scrollIntoViewIfNeeded();
    await shot(page, `estados/resumo-${width}.png`);
  }
  await context.close();
  console.log(`Capturas ${width}px prontas.`);
}

for (const calibration of (videosOnly ? [] : ["discreta", "moderada", "expressiva"])) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: `${output}/videos`, size: { width: 960, height: 600 } },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/?calibracao=${calibration}`);
  await page.waitForFunction(() => window.__lamina?.surface.mode === "webgl");
  await page.waitForTimeout(1300);
  const slider = page.locator("#surface-position");
  for (const value of [20, 80, 50]) {
    await slider.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
    await page.waitForTimeout(170);
    await shot(page, `calibracoes/${calibration}-${value}.png`);
  }
  await shot(page, `calibracoes/${calibration}-detalhe.png`, {
    clip: { x: 780, y: 460, width: 620, height: 330 },
  });
  manifest.calibrations.push(
    await page.evaluate(() => window.__lamina.surface),
  );
  const video = page.video();
  await context.close();
  const target = `${output}/videos/calibracao-${calibration}.webm`;
  await rename(await video.path(), target);
  manifest.videos.push(`videos/calibracao-${calibration}.webm`);
}

for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["tablet", 820, 1180],
  ["mobile", 390, 844],
]) {
  const scale = Math.min(1, 960 / width, 900 / height);
  const context = await browser.newContext({
    viewport: { width, height },
    hasTouch: name !== "desktop",
    recordVideo: {
      dir: `${output}/videos`,
      size: { width: Math.round(width * scale), height: Math.round(height * scale) },
    },
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await page.waitForTimeout(1300);
  const range = page.locator("#surface-position");
  const bounds = await range.boundingBox();
  await page.mouse.move(
    bounds.x + bounds.width * 0.5,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width * 0.9,
    bounds.y + bounds.height / 2,
    { steps: 24 },
  );
  await page.mouse.move(
    bounds.x + bounds.width * 0.1,
    bounds.y + bounds.height / 2,
    { steps: 36 },
  );
  await page.mouse.move(
    bounds.x + bounds.width * 0.5,
    bounds.y + bounds.height / 2,
    { steps: 20 },
  );
  await page.mouse.up();
  await page.waitForTimeout(400);
  const distance = await page
    .locator("[data-surface]")
    .evaluate(
      (element) => element.getBoundingClientRect().height - innerHeight,
    );
  for (let step = 0; step <= 55; step++) {
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      ((distance + 300) * step) / 55,
    );
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(450);
  for (let step = 55; step >= 0; step--) {
    await page.evaluate(
      (top) => scrollTo({ top, behavior: "instant" }),
      ((distance + 300) * step) / 55,
    );
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(450);
  await page.locator("#ambientes").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Um respiro no pátio" }).click();
  await page.waitForTimeout(1000);
  const video = page.video();
  await context.close();
  await rename(await video.path(), `${output}/videos/percurso-${name}.webm`);
  manifest.videos.push(`videos/percurso-${name}.webm`);
  console.log(`Gravação ${name} pronta.`);
}

for (const [name, options, suffix] of (videosOnly ? [] : [
  ["fallback", {}, "?grafico=fallback"],
  ["movimento-reduzido", { reducedMotion: "reduce" }, ""],
  ["sem-javascript", { javaScriptEnabled: false }, ""],
])) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    ...options,
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/${suffix}`);
  await page.waitForTimeout(500);
  await shot(page, `estados/${name}.png`);
  await context.close();
}
manifest.videos = [...new Set(manifest.videos)];
await writeFile(`${output}/manifesto.json`, JSON.stringify(manifest, null, 2));
await browser.close();
