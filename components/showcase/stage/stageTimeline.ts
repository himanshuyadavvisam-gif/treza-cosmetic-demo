import type { SectionId } from "@/lib/scrollStore";
import { clamp01, easeInOutCubic, lerp } from "@/lib/easing";

/**
 * THE STORY TABLE — tweak the whole 3D choreography here.
 *
 * Each keyframe pins the product's pose to a scroll position inside a section:
 *   at    0 = section top reaches the viewport top, 1 = section bottom reaches the viewport bottom
 *         (for 100vh sections both are the same point; use `shift` to move earlier/later).
 *   shift extra offset in viewport heights (negative = earlier).
 *   x, y  position as a fraction of half the viewport (x: -1 left edge … 1 right edge, y: -1 bottom … 1 top).
 *   scale 1 = bottle is 60% of the viewport height.
 *   rx/ry/rz rotation in radians (ry accumulates, so it can spin several turns).
 *   plinth 0..1 raises the stone plinth, shadow 0..1 contact shadow strength, glow 0..1 warm backdrop light.
 * `mobile` overrides x/y/scale in the stacked layout (phones and portrait tablets, see WIDE_QUERY).
 */
export type Pose = {
  x: number;
  y: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
  plinth: number;
  shadow: number;
  glow: number;
};

export type StageKey = Pose & {
  section: SectionId;
  at: number;
  shift?: number;
  mobile?: Partial<Pick<Pose, "x" | "y" | "scale">>;
};

const TAU = Math.PI * 2;
// Resting yaw in the formula scene: label turned slightly toward the copy on the left.
const R_FORMULA = TAU - 0.3;
const R_CHOOSE = R_FORMULA + TAU * 2 + 0.3;

export const STAGE_KEYS: StageKey[] = [
  // Hero — product stands to the right of the headline.
  { section: "top", at: 0, x: 0.55, y: -0.04, scale: 1, rx: 0, ry: -0.35, rz: 0.06, plinth: 0, shadow: 0.35, glow: 0.6, mobile: { x: 0, y: -0.5, scale: 0.46 } },
  // Big claim — rises beneath the headline while turning ~120°.
  { section: "claim", at: 0, shift: 0.15, x: 0, y: -0.46, scale: 1.08, rx: 0.04, ry: 1.75, rz: 0, plinth: 0, shadow: 0.25, glow: 0.35, mobile: { y: -0.42, scale: 0.62 } },
  // Ritual strip — dives out of frame so the photography can lead.
  { section: "ritual", at: 0, shift: -0.1, x: 0, y: -1.9, scale: 0.9, rx: 0.2, ry: 3.2, rz: 0, plinth: 0, shadow: 0, glow: 0.12 },
  { section: "ritual", at: 1, x: 0.38, y: -1.9, scale: 0.95, rx: 0, ry: R_FORMULA - 0.6, rz: 0, plinth: 0, shadow: 0, glow: 0.2, mobile: { x: 0 } },
  // Formula — lands on the plinth, flips to show the back label, tilts, settles.
  { section: "formula", at: 0, x: 0.38, y: -0.1, scale: 0.95, rx: 0, ry: R_FORMULA, rz: 0, plinth: 1, shadow: 1, glow: 0.5, mobile: { x: 0, y: -0.4, scale: 0.58 } },
  { section: "formula", at: 0.33, x: 0.38, y: -0.06, scale: 0.95, rx: 0, ry: R_FORMULA + Math.PI, rz: 0, plinth: 1, shadow: 0.9, glow: 0.55, mobile: { x: 0, y: -0.36, scale: 0.58 } },
  { section: "formula", at: 0.66, x: 0.36, y: 0.06, scale: 0.98, rx: 0.14, ry: R_FORMULA + TAU, rz: 0.2, plinth: 1, shadow: 0.55, glow: 0.65, mobile: { x: 0, y: -0.26, scale: 0.6 } },
  { section: "formula", at: 1, x: 0.38, y: -0.1, scale: 0.95, rx: 0, ry: R_FORMULA + TAU, rz: 0, plinth: 1, shadow: 1, glow: 0.5, mobile: { x: 0, y: -0.4, scale: 0.58 } },
  // Ingredients + Ayurveda are opaque sections: park the product above, then bring it up from below.
  { section: "ingredients", at: 0, shift: -0.35, x: 0.38, y: 1.9, scale: 0.95, rx: 0, ry: R_FORMULA + TAU + 0.8, rz: 0, plinth: 0, shadow: 0, glow: 0, mobile: { x: 0 } },
  { section: "choose", at: 0, shift: -0.7, x: 0, y: -1.9, scale: 1, rx: 0.05, ry: R_CHOOSE - 1.2, rz: 0, plinth: 0, shadow: 0, glow: 0.4 },
  // Choose — centre stage, one full turn across the pinned scroll.
  { section: "choose", at: 0, x: 0, y: 0.1, scale: 1, rx: 0.05, ry: R_CHOOSE, rz: 0, plinth: 0, shadow: 0.5, glow: 1, mobile: { y: 0.1, scale: 0.66 } },
  { section: "choose", at: 1, x: 0, y: 0.1, scale: 1, rx: 0.05, ry: R_CHOOSE + TAU, rz: 0, plinth: 0, shadow: 0.5, glow: 1, mobile: { y: 0.1, scale: 0.66 } },
  // Promise list — sits in the gap between the text and media columns.
  { section: "promise", at: 0, x: 0.3, y: -0.02, scale: 0.78, rx: 0, ry: R_CHOOSE + TAU + 0.3, rz: -0.05, plinth: 0, shadow: 0.3, glow: 0.35, mobile: { x: 0, y: -1.9 } },
  { section: "promise", at: 1, x: 0.3, y: -0.02, scale: 0.78, rx: 0, ry: R_CHOOSE + TAU + 1.1, rz: -0.05, plinth: 0, shadow: 0.3, glow: 0.35, mobile: { x: 0, y: -1.9 } },
  // Shop grid onward — exits upward.
  { section: "best-sellers", at: 0, shift: -0.45, x: 0.3, y: 1.9, scale: 0.78, rx: 0, ry: R_CHOOSE + TAU + 1.6, rz: 0, plinth: 0, shadow: 0, glow: 0, mobile: { x: 0 } },
];

/** The formula-scene resting pose; the plinth top is placed under the bottle at this pose. */
export const PLINTH_REST = { y: -0.1, scale: 0.95, mobileY: -0.4, mobileScale: 0.58 };

export type Anchor = { key: StageKey; scroll: number };

/** Resolve every keyframe to an absolute scroll position. Call on load / resize / ScrollTrigger refresh. */
export function resolveAnchors(viewportHeight: number): Anchor[] {
  const anchors: Anchor[] = [];
  for (const key of STAGE_KEYS) {
    const el = document.getElementById(key.section);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const range = Math.max(rect.height - viewportHeight, 0);
    anchors.push({ key, scroll: top + key.at * range + (key.shift ?? 0) * viewportHeight });
  }
  return anchors.sort((a, b) => a.scroll - b.scroll);
}

const FIELDS: (keyof Pose)[] = ["x", "y", "scale", "rx", "ry", "rz", "plinth", "shadow", "glow"];

const poseOf = (key: StageKey, mobile: boolean): Pose => ({
  x: mobile && key.mobile?.x !== undefined ? key.mobile.x : key.x,
  y: mobile && key.mobile?.y !== undefined ? key.mobile.y : key.y,
  scale: mobile && key.mobile?.scale !== undefined ? key.mobile.scale : key.scale,
  rx: key.rx,
  ry: key.ry,
  rz: key.rz,
  plinth: key.plinth,
  shadow: key.shadow,
  glow: key.glow,
});

/** Target pose for a scroll position: eased interpolation between the two surrounding keyframes. */
export function samplePose(anchors: Anchor[], scroll: number, mobile: boolean, out: Pose): Pose {
  if (anchors.length === 0) return out;
  let i = 0;
  while (i < anchors.length - 1 && anchors[i + 1].scroll <= scroll) i++;
  const a = anchors[i];
  const b = anchors[Math.min(i + 1, anchors.length - 1)];
  const span = b.scroll - a.scroll;
  const t = span > 0 ? easeInOutCubic(clamp01((scroll - a.scroll) / span)) : 0;
  const pa = poseOf(a.key, mobile);
  const pb = poseOf(b.key, mobile);
  for (const field of FIELDS) out[field] = lerp(pa[field], pb[field], t);
  return out;
}
