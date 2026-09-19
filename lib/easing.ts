/** Named GSAP eases used across the showcase, so the whole page moves with one feel. */
export const EASE = {
  /** Text and card reveals. */
  reveal: "power3.out",
  /** Big section-to-section moves. */
  section: "expo.inOut",
  /** Idle, breathing loops. */
  float: "sine.inOut",
  /** Small UI handles that pop in. */
  pop: "back.out(2)",
  /** Nav underline and other UI glides. */
  glide: "expo.out",
} as const;

export const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

/** Smooth S-curve used between stage keyframes, so the product "rests" at each section. */
export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Frame-rate independent exponential smoothing (same maths as THREE.MathUtils.damp). */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));
