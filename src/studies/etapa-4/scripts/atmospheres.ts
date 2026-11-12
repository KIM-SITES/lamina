/** Photographic crossfade, progressive HTML, and a visible response to slow or failed images. */
export function initAtmospheres() {
  const root = document.querySelector<HTMLElement>('[data-atmospheres]');
  if (!root) return;
  const panels = [...root.querySelectorAll<HTMLElement>('[data-atmosphere]')];
  const selectors = [...root.querySelectorAll<HTMLButtonElement>('[data-atmosphere-select]')];
  const stage = root.querySelector<HTMLElement>('.atmosphere-stage')!;
  const status = root.querySelector<HTMLElement>('[data-gallery-status]')!;
  const feedback = root.querySelector<HTMLElement>('[data-gallery-feedback]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let requested = 0;
  let generation = 0;
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  let animations: Animation[] = [];

  function settle() {
    animations.forEach(animation => animation.cancel());
    animations = [];
    panels.forEach((panel, index) => {
      panel.hidden = index !== active;
      panel.inert = index !== active;
      panel.style.removeProperty('z-index');
    });
  }
  function clearFeedback() {
    clearTimeout(feedbackTimer);
    feedback.hidden = true;
    feedback.textContent = '';
    stage.removeAttribute('aria-busy');
    selectors.forEach(button => button.removeAttribute('data-pending'));
  }
  function imageAvailability(panel: HTMLElement, available: boolean) {
    const photo = panel.querySelector<HTMLElement>('.atmosphere-photo')!;
    photo.classList.toggle('image-unavailable', !available);
    photo.querySelector<HTMLElement>('[data-image-unavailable]')!.hidden = available;
  }
  function updateControls() {
    selectors.forEach((button, index) => button.setAttribute('aria-pressed', String(index === active)));
  }
  function label(index: number) {
    return selectors[index].textContent?.replace(/0\d|↘/g, '').trim() || '';
  }

  async function select(index: number, animate = false, updateURL = true) {
    requested = (index + panels.length) % panels.length;
    const nextIndex = requested;
    const token = ++generation;
    settle();
    clearFeedback();
    stage.setAttribute('aria-busy', 'true');
    selectors[nextIndex].setAttribute('data-pending', '');
    feedbackTimer = setTimeout(() => {
      if (token !== generation) return;
      feedback.textContent = `Carregando ${label(nextIndex)}…`;
      feedback.hidden = false;
      // This live region is outside aria-busy; assistive announcements need not wait for decoding.
      status.textContent = feedback.textContent;
    }, 200);
    const next = panels[nextIndex];
    const image = next.querySelector<HTMLImageElement>('img')!;
    image.loading = 'eager';
    const available = await image.decode().then(() => image.naturalWidth > 0, () => false);
    if (token !== generation) return;
    clearFeedback();
    imageAvailability(next, available);
    if (!available) {
      requested = active;
      feedback.textContent = 'Esta imagem não carregou. Explore outra atmosfera.';
      feedback.hidden = false;
      status.textContent = feedback.textContent;
      return;
    }
    const previous = panels[active];
    const changed = active !== nextIndex;
    active = nextIndex;
    next.hidden = false;
    next.inert = false;
    if (changed && animate && !reduced.matches && typeof next.animate === 'function') {
      previous.hidden = false;
      previous.inert = true;
      previous.style.zIndex = '1';
      next.style.zIndex = '2';
      // The old photograph remains opaque until the new one covers it.
      // The new margin stays still and legible, with no text ghosting or displacement.
      const photo = next.querySelector<HTMLElement>('.atmosphere-photo')!;
      animations = [photo.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 420, easing: 'cubic-bezier(.22,.61,.36,1)',
      })];
      void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        if (token === generation) settle();
      });
    } else settle();
    updateControls();
    status.textContent = `${label(active)}, ${active + 1} de ${panels.length}.`;
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('ambiente', next.dataset.atmosphere!);
      history.replaceState(history.state, '', url);
    }
  }

  const initial = panels.findIndex(panel => panel.dataset.atmosphere === new URL(location.href).searchParams.get('ambiente'));
  active = requested = initial >= 0 ? initial : 0;
  panels.forEach(panel => {
    const image = panel.querySelector<HTMLImageElement>('img')!;
    image.addEventListener('error', () => imageAvailability(panel, false));
    image.addEventListener('load', () => imageAvailability(panel, true));
    if (image.complete && !image.naturalWidth) imageAvailability(panel, false);
  });
  settle();
  updateControls();
  root.classList.add('is-enhanced');
  root.querySelectorAll<HTMLElement>('[data-gallery-controls]').forEach(control => control.hidden = false);
  selectors.forEach((button, index) => {
    button.addEventListener('click', event => { void select(index, event.detail > 0); });
    button.addEventListener('keydown', event => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
      event.preventDefault();
      const next = key === 'Home' ? 0 : key === 'End' ? panels.length - 1 : (index + (key === 'ArrowRight' ? 1 : -1) + panels.length) % panels.length;
      selectors[next].focus();
      void select(next);
    });
  });
  root.querySelector('[data-gallery-next]')!.addEventListener('click', event => { void select(requested + 1, (event as MouseEvent).detail > 0); });
  root.querySelector('[data-gallery-previous]')!.addEventListener('click', event => { void select(requested - 1, (event as MouseEvent).detail > 0); });
  let start: { x: number; y: number; id: number } | undefined;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') start = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  stage.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    start = undefined;
    if (Math.abs(dx) > 55 && Math.abs(dy) < 40) void select(requested + (dx < 0 ? 1 : -1), true);
  });
  stage.addEventListener('pointercancel', () => { start = undefined; });
  reduced.addEventListener('change', settle);
  window.addEventListener('popstate', () => {
    const index = panels.findIndex(panel => panel.dataset.atmosphere === new URL(location.href).searchParams.get('ambiente'));
    void select(index >= 0 ? index : 0, false, false);
  });
  window.addEventListener('pagehide', () => { generation++; start = undefined; clearFeedback(); settle(); });
}
