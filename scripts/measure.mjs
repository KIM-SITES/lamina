import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { launch, baseURL } from "./browser.mjs";

async function files(directory, extension = "") {
  const result = [];
  for (const name of await readdir(directory)) {
    const path = `${directory}/${name}`;
    const info = await stat(path);
    if (info.isDirectory()) result.push(...(await files(path, extension)));
    else if (name.endsWith(extension)) {
      const content = await readFile(path);
      result.push({
        path,
        bytes: content.length,
        gzip: gzipSync(content).length,
      });
    }
  }
  return result;
}
const scripts = await files("dist", ".js");
const css = await files("dist", ".css");
const images = await files("public/images");
const fonts = await files("public/fonts");
const report = {
  environment: { os: process.platform, node: process.version, baseURL },
  assets: {
    scripts,
    javascriptGzip: scripts.reduce((sum, file) => sum + file.gzip, 0),
    css,
    images,
    fonts,
    fontsBytes: fonts.reduce((sum, file) => sum + file.bytes, 0),
  },
  runs: [],
  graphics: null,
  limitations: [
    "Laboratório local em Windows, não mede experiência de visitantes.",
    "Viewport móvel e CPU/rede emulados não substituem aparelho físico.",
    "Custo de renderer é CPU JavaScript, não tempo efetivo da GPU.",
    "Amostra de rAF mede agendamento, não garante quadros apresentados na tela.",
    "Gravação e screenshots introduzem custo extra e avisos ReadPixels.",
  ],
};
const browser = await launch();
report.environment.browser = browser.version();
for (let run = 0; run < 3; run++) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 200 * 1024,
    uploadThroughput: 90 * 1024,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0, longTasks: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.__metrics.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      window.__metrics.longTasks += list.getEntries().length;
    }).observe({ type: "longtask", buffered: true });
  });
  await page.goto(baseURL);
  await page.waitForTimeout(5500);
  const metrics = await page.evaluate(() => ({
    ...window.__metrics,
    fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
    navigation: performance.getEntriesByType("navigation").map((item) => ({
      domContentLoaded: item.domContentLoadedEventEnd,
      load: item.loadEventEnd,
      bytes: item.transferSize,
    })),
    resources: performance.getEntriesByType("resource").map((item) => ({
      name: item.name.split("/").pop(),
      bytes: item.transferSize,
      duration: item.duration,
    })),
    diagnostics: window.__lamina?.surface,
  }));
  report.runs.push(metrics);
  await context.close();
  console.log(
    `Medição móvel ${run + 1}: LCP ${Math.round(metrics.lcp)} ms, CLS ${metrics.cls}`,
  );
}
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();
await page.goto(baseURL);
await page.waitForTimeout(1500);
report.graphics = await page.evaluate(async () => {
  const gl = document.querySelector("canvas")?.getContext("webgl2");
  const debug = gl?.getExtension("WEBGL_debug_renderer_info");
  const adapter = debug
    ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)
    : "indisponível";
  const samples = [];
  let previous = 0;
  const start = performance.now();
  await new Promise((resolve) => {
    function step(now) {
      if (previous) samples.push(now - previous);
      previous = now;
      const progress = Math.min(1, (now - start) / 2000);
      scrollTo({
        top: Math.sin(progress * Math.PI) * 500,
        behavior: "instant",
      });
      if (progress < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
  samples.sort((a, b) => a - b);
  const at = (quantile) =>
    samples[
      Math.min(samples.length - 1, Math.floor(samples.length * quantile))
    ];
  return {
    adapter,
    samples: samples.length,
    rafIntervalMedian: at(0.5),
    rafIntervalP95: at(0.95),
    diagnostics: window.__lamina?.surface,
  };
});
await context.close();
await browser.close();
await writeFile(
  "docs/evidencias/performance.json",
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    {
      javascriptGzip: report.assets.javascriptGzip,
      fontsBytes: report.assets.fontsBytes,
      graphics: report.graphics,
    },
    null,
    2,
  ),
);
