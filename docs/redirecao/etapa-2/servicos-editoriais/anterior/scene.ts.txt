export interface Crop { x: number; y: number; width: number; height: number }
export interface Frame { x: number; y: number; width: number; height: number }
export interface SceneSpec {
  vertical: boolean;
  width: number;
  height: number;
  editorial: Crop;
  water: [number, number, number];
}
export const palettes = { deep: '#083c63', aqua: '#16c7ad', sun: '#f6d567', light: '#e9f9e7', blue: '#1658ba' };
export const horizontal: SceneSpec = { vertical: false, width: 1586, height: 992, editorial: { x: 0, y: 0, width: 1, height: 1 }, water: [.425, .502, .55] };
export const vertical: SceneSpec = { vertical: true, width: 1024, height: 1536, editorial: { x: 0, y: 0, width: 1, height: 1 }, water: [.503, .377, .50] };
export const clamp = (n: number, low=0, high=1) => Math.max(low, Math.min(high, n));
export const lerp = (a: number, b: number, t: number) => a+(b-a)*t;
export const smooth = (n: number) => { const t=clamp(n); return t*t*(3-2*t); };

/** Recorte em coordenadas da fotografia. Mantém a proporção, inclusive durante a mudança de moldura. */
export function coverCrop(window: Crop, image: SceneSpec, aspect: number): Crop {
  const imageAspect = image.width/image.height;
  const currentAspect = imageAspect*window.width/window.height;
  const width = currentAspect > aspect ? window.width*aspect/currentAspect : window.width;
  const height = currentAspect < aspect ? window.height*currentAspect/aspect : window.height;
  return { x: window.x+(window.width-width)*.5, y: window.y+(window.height-height)*.5, width, height };
}

export function pose(spec: SceneSpec, from: Frame, target: Frame, progress: number) {
  const framing = smooth((progress-.13)/.87);
  const camera = smooth((progress-.08)/.92);
  const frame = { x: lerp(from.x,target.x,framing), y: lerp(from.y,target.y,framing), width: lerp(from.width,target.width,framing), height: lerp(from.height,target.height,framing) };
  const window = { x: lerp(0,spec.editorial.x,camera), y: lerp(0,spec.editorial.y,camera), width: lerp(1,spec.editorial.width,camera), height: lerp(1,spec.editorial.height,camera) };
  // Aproximação breve, ancorada no mesmo recorte, que se acomoda completamente no destino.
  const zoom = 1+.025*Math.sin(Math.PI*camera);
  window.x += window.width*(1-1/zoom)*.5;
  window.y += window.height*(1-1/zoom)*.5;
  window.width /= zoom; window.height /= zoom;
  return { frame, crop: coverCrop(window,spec,frame.width/frame.height) };
}
