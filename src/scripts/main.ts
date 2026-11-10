import { initGallery } from "./gallery";
import { initQuote } from "./quote";
import { initSurface } from "./surface";

export function initPrototype() {
  initGallery();
  initQuote();
  void initSurface();
}
