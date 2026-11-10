import { environments } from "../data/content";

export function initGallery() {
  const gallery = document.querySelector<HTMLElement>("[data-gallery]");
  if (!gallery) return;
  const frames = [
    ...gallery.querySelectorAll<HTMLElement>("[data-environment]"),
  ];
  const buttons = [
    ...gallery.querySelectorAll<HTMLButtonElement>("[data-scene]"),
  ];
  const description = gallery.querySelector<HTMLElement>(
    "[data-gallery-description]",
  );
  let timeout: ReturnType<typeof setTimeout>;
  gallery.classList.add("js-gallery");
  gallery.querySelector<HTMLElement>("[data-gallery-controls]")!.hidden = false;
  function select(id: string) {
    const scene = environments.find((item) => item.id === id);
    if (!scene) return;
    clearTimeout(timeout);
    frames.forEach((frame) => {
      const selected = frame.dataset.environment === id;
      frame.classList.toggle(
        "is-leaving",
        frame.classList.contains("is-active") && !selected,
      );
      frame.classList.toggle("is-active", selected);
      frame.setAttribute("aria-hidden", String(!selected));
    });
    buttons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.scene === id)),
    );
    if (description) description.textContent = scene.description;
    timeout = setTimeout(
      () => frames.forEach((frame) => frame.classList.remove("is-leaving")),
      850,
    );
  }
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      const id = button.dataset.scene!;
      select(id);
      const url = new URL(location.href);
      url.searchParams.set('ambiente', id);
      history.replaceState(null, '', url);
    }),
  );
  const hashScene = new URL(location.href).searchParams.get("ambiente");
  select(hashScene || "jardim");
}
