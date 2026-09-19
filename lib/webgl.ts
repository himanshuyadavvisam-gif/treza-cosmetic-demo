/** Probe for WebGL without letting three.js log context-creation errors. */
export function hasWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Media query for the side-by-side ("wide") showcase layout; mirrors the `wide:` Tailwind variant. */
export const WIDE_QUERY = "(min-width: 1024px), (orientation: landscape) and (min-width: 640px)";
