/** One explicit selection, no autoplay; latest requested scene wins during decoding. */
export function initAtmospheres() {
  const root = document.querySelector<HTMLElement>('[data-atmospheres]');
  if (!root) return;
  const panels = [...root.querySelectorAll<HTMLElement>('[data-atmosphere]')];
  const selectors = [...root.querySelectorAll<HTMLButtonElement>('[data-atmosphere-select]')];
  const stage = root.querySelector<HTMLElement>('.atmosphere-stage')!;
  const status = root.querySelector<HTMLElement>('[data-gallery-status]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let requested = 0;
  let generation = 0;
  let animations: Animation[] = [];

  function settle() {
    animations.forEach(animation => animation.cancel());
    animations = [];
    panels.forEach((panel, i) => {
      panel.hidden = i !== active;
      panel.inert = i !== active;
      panel.style.removeProperty('z-index');
    });
  }

  function updateControls() {
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
  }

  async function select(index: number, animate = false, updateURL = true) {
    requested = (index + panels.length) % panels.length;
    const nextIndex = requested;
    const token = ++generation;
    stage.setAttribute('aria-busy', 'true');
    const image = panels[nextIndex].querySelector<HTMLImageElement>('img')!;
    image.loading = 'eager';
    await image.decode().catch(() => undefined);
    if (token !== generation) return;
    stage.removeAttribute('aria-busy');
    const previous = panels[active];
    const next = panels[nextIndex];
    const changed = active !== nextIndex;
    settle();
    active = nextIndex;
    next.hidden = false;
    next.inert = false;
    if (changed && animate && !reduced.matches && typeof next.animate === 'function') {
      previous.hidden = false;
      previous.inert = true;
      next.style.zIndex = '2';
      previous.style.zIndex = '1';
      animations = [
        next.animate([{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 580, easing: 'cubic-bezier(.22,.68,.12,1)' }),
        previous.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' }),
      ];
      void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        if (token === generation) settle();
      });
    } else {
      settle();
    }
    updateControls();
    status.textContent = `${selectors[active].textContent?.replace(/0\d|↘/g, '').trim()}, ${active + 1} de ${panels.length}.`;
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.set('ambiente', next.dataset.atmosphere!);
      history.replaceState(history.state, '', url);
    }
  }

  const initial = panels.findIndex(panel => panel.dataset.atmosphere === new URL(location.href).searchParams.get('ambiente'));
  active = requested = initial >= 0 ? initial : 0;
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

  // Swiping is optional; visible buttons provide the same action on every device.
  let start: { x: number; y: number; id: number } | undefined;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') start = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  stage.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = undefined;
    if (Math.abs(dx) > 55 && Math.abs(dy) < 40) void select(requested + (dx < 0 ? 1 : -1), true);
  });
  stage.addEventListener('pointercancel', () => { start = undefined; });
  reduced.addEventListener('change', settle);
  window.addEventListener('popstate', () => {
    const index = panels.findIndex(panel => panel.dataset.atmosphere === new URL(location.href).searchParams.get('ambiente'));
    void select(index >= 0 ? index : 0, false, false);
  });
  window.addEventListener('pagehide', settle);
}
