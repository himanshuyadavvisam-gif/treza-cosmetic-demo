/**
 * Tiny mutable store shared by the DOM sections and the WebGL stage.
 * Per-frame values are plain mutable fields (read inside tickers, never trigger React renders);
 * only the active section and variant are subscribable, for the nav, live region and picker.
 */

export type SectionId = "top" | "claim" | "ritual" | "formula" | "ingredients" | "ayurveda" | "choose" | "promise" | "best-sellers" | "faq";

type Listener = () => void;

export const stage = {
  /** True once the 3D stage has rendered its first frame with textures. */
  ready: false,
  /** Epoch (performance.now) of the last "reaction" pulse requested by a section. */
  pulseAt: -1,
  /** Product position projected to CSS pixels, for DOM overlays that track it. */
  screen: { x: 0, y: 0, halfHeight: 0, visible: false },
};

let activeSection: SectionId = "top";
let variant = 0;
const sectionListeners = new Set<Listener>();
const variantListeners = new Set<Listener>();

export const getActiveSection = (): SectionId => activeSection;

export function setActiveSection(id: SectionId): void {
  if (id === activeSection) return;
  activeSection = id;
  sectionListeners.forEach((listener) => listener());
}

export function subscribeActiveSection(listener: Listener): () => void {
  sectionListeners.add(listener);
  return () => sectionListeners.delete(listener);
}

export const getVariant = (): number => variant;

export function setVariant(index: number): void {
  if (index === variant) return;
  variant = index;
  variantListeners.forEach((listener) => listener());
}

export function subscribeVariant(listener: Listener): () => void {
  variantListeners.add(listener);
  return () => variantListeners.delete(listener);
}

export function pulseStage(): void {
  stage.pulseAt = performance.now();
}
