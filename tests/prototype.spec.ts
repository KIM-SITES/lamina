import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("navegação, serviços e orçamento permanecem locais", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") writes.push(request.url());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A água transforma o espaço.",
  );
  await expect(
    page.getByText("Projeto demonstrativo", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Conhecer os serviços" }).click();
  await expect(page).toHaveURL(/#servicos$/);
  await page
    .getByRole("link", {
      name: "Explorar possibilidades de revitalização e reforma",
    })
    .click();
  await expect(page.locator('input[value="revitalizacao"]')).toBeChecked();
  await page.getByLabel("Condomínio", { exact: true }).check();
  await page.getByRole("button", { name: "Ver resumo" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Revitalização e reforma para condomínio.",
  );
  await expect(page.getByRole("status")).toContainText(
    "Nenhuma solicitação foi enviada",
  );
  await page.getByLabel("Residência", { exact: true }).check();
  await expect(page.getByRole("status")).toBeEmpty();
  expect(writes).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
});

test("todos os destinos de âncora existem", async ({ page }) => {
  await page.goto("/?grafico=fallback");
  const invalid = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href")!)
        .filter((href) => !document.getElementById(href.slice(1))),
    );
  expect(invalid).toEqual([]);
});

test("dez larguras, orientação e zoom sem transbordamento", async ({
  page,
}) => {
  await page.goto("/?grafico=fallback");
  for (const width of [320, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        { message: `overflow em ${width}px` },
      )
      .toBe(true);
    const title = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(title!.x).toBeGreaterThanOrEqual(0);
    expect(title!.x + title!.width).toBeLessThanOrEqual(width + 1);
  }
  await page.setViewportSize({ width: 1180, height: 820 });
  await expect(
    page.getByRole("link", { name: "Conhecer os serviços" }),
  ).toBeVisible();
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});

test("teclado, foco e controle nativo da superfície", async ({ page }) => {
  await page.goto("/?grafico=fallback");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("link", { name: "Lâmina — Piscinas & Paisagens, início" })
      .first(),
  ).toBeFocused();
  const slider = page.getByRole("slider", { name: "Explorar a superfície" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("100");
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("0");
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("1");
  expect(
    await slider.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).not.toBe("none");
});

test("alternância rápida dos ambientes mantém estado e legenda", async ({
  page,
}) => {
  await page.goto("/?grafico=fallback");
  const patio = page.getByRole("button", { name: "Um respiro no pátio" });
  const garden = page.getByRole("button", { name: "Entre água e jardim" });
  await patio.click();
  await garden.click();
  await patio.click();
  await expect(patio).toHaveAttribute("aria-pressed", "true");
  await expect(garden).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator('[data-environment="patio"]')).toHaveClass(
    /is-active/,
  );
  await expect(page.locator("[data-gallery-description]")).toContainText(
    "escala mais íntima",
  );
});

test("movimento reduzido evita canvas e respeita mudança em tempo real", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.surface.mode))
    .toBe("reduced-motion");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("button", { name: "Um respiro no pátio" }).click();
  await expect(page.locator('[data-environment="patio"]')).toHaveClass(
    /is-active/,
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(1000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("sem JavaScript, conteúdo e duas imagens disponíveis", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4322/");
  await expect(
    page.getByRole("heading", { name: "A água transforma o espaço." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Projeto e construção", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".environment-frame")).toHaveCount(2);
  await expect(page.locator(".environment-frame").nth(1)).toBeVisible();
  await expect(
    page.getByText("A simulação exige JavaScript.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Ver resumo" })).toHaveCount(0);
  await context.close();
});

test("WebGL indisponível mantém fotografia, controle e orçamento", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return original.apply(this, [type, ...args] as never);
    } as typeof original;
  });
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.surface.mode))
    .toBe("fallback");
  await expect(
    page.getByRole("slider", { name: "Explorar a superfície" }),
  ).toBeVisible();
  await expect(page.locator("[data-surface-image]")).toBeVisible();
  await page.getByLabel("Manutenção e tratamento", { exact: true }).check();
  await page.getByLabel("Residência", { exact: true }).check();
  await page.getByRole("button", { name: "Ver resumo" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Manutenção e tratamento para residência",
  );
});

test("falha da textura preserva fallback", async ({ page }) => {
  await page.route("**/images/agua-detalhe.webp", (route) => route.abort());
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.surface.mode))
    .toBe("fallback");
  await expect(page.locator("[data-surface-image]")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Conhecer os serviços" }),
  ).toBeVisible();
});

test("sem erros de execução e auditoria sem violações automáticas", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.waitForTimeout(1800);
  expect(errors).toEqual([]);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});

test("refração, rolagem reversível, repouso e descarte", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.surface.mode))
    .toBe("webgl");
  const slider = page.getByRole("slider", { name: "Explorar a superfície" });
  for (const value of [0, 100, 15, 85, 50])
    await slider.evaluate((element, value) => {
      (element as HTMLInputElement).value = String(value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
  await page.evaluate(() => scrollTo({ top: 350, behavior: "instant" }));
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.progress || 0))
    .toBeGreaterThan(0.1);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.progress))
    .toBe(0);
  await page.waitForTimeout(1500);
  const before = await page.evaluate(() =>
    "frames" in window.__lamina!.surface ? window.__lamina!.surface.frames : -1,
  );
  await page.waitForTimeout(350);
  const after = await page.evaluate(() =>
    "frames" in window.__lamina!.surface ? window.__lamina!.surface.frames : -2,
  );
  expect(after).toBe(before);
  await page.locator("#orcamento").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  expect(
    await page.evaluate(() =>
      "active" in window.__lamina!.surface
        ? window.__lamina!.surface.active
        : true,
    ),
  ).toBe(false);
  await page.evaluate(() => window.__lamina?.dispose());
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("contexto gráfico perdido e restaurado", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.surface.mode))
    .toBe("webgl");
  const supported = await page.evaluate(() => {
    const canvas = document.querySelector("canvas")!;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const extension = gl?.getExtension("WEBGL_lose_context");
    if (!extension) return false;
    (window as unknown as { restoreContext: () => void }).restoreContext = () =>
      extension.restoreContext();
    extension.loseContext();
    return true;
  });
  test.skip(
    !supported,
    "Extensão de perda de contexto indisponível neste navegador.",
  );
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.surface.mode))
    .toBe("context-lost");
  await expect(page.locator("[data-surface-canvas]")).not.toHaveClass(
    /is-ready/,
  );
  await page.waitForTimeout(200);
  await page.evaluate(() =>
    (window as unknown as { restoreContext: () => void }).restoreContext(),
  );
  await expect
    .poll(() => page.evaluate(() => window.__lamina?.surface.mode))
    .toBe("webgl");
  await expect(page.locator("[data-surface-canvas]")).toHaveClass(/is-ready/);
});

test("toque no controle e navegação vertical coexistem", async ({
  browser,
  browserName,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    ...(browserName === "firefox" ? {} : { isMobile: true }),
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4322/?grafico=fallback");
  const slider = page.getByRole("slider", { name: "Explorar a superfície" });
  const bounds = (await slider.boundingBox())!;
  await page.touchscreen.tap(
    bounds.x + bounds.width * 0.8,
    bounds.y + bounds.height / 2,
  );
  expect(Number(await slider.inputValue())).toBeGreaterThan(50);
  await page.getByRole("link", { name: "Conhecer os serviços" }).tap();
  await expect(page).toHaveURL(/#servicos/);
  await context.close();
});
