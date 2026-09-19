"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { stage } from "@/lib/scrollStore";
import { WIDE_QUERY } from "@/lib/webgl";

type AnnotationProps = {
  notes: string[];
  /** Fallback anchor (fractions of the overlay) used when the 3D stage is off. */
  fallback: { x: number; y: number; mobileX: number; mobileY: number };
};

/**
 * CAD / blueprint style callout that tracks the 3D product on screen:
 * crosshair lines, a dashed orbit circle, square handles and tiny labels.
 * The draw-in and note swaps are driven by the parent section's timeline via data attributes.
 */
export default function Annotation({ notes, fallback }: AnnotationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const group = svg.querySelector<SVGGElement>("[data-anno-group]");
    const hLine = svg.querySelector<SVGLineElement>("[data-anno-h]");
    const vLine = svg.querySelector<SVGLineElement>("[data-anno-v]");
    const orbit = svg.querySelectorAll<SVGCircleElement>("[data-anno-orbit]");
    const placed = svg.querySelectorAll<SVGGElement>("[data-anno-pos]");
    const notesEls = svg.querySelectorAll<SVGTextElement>("[data-anno-note]");
    const fig = svg.querySelector<SVGTextElement>("[data-anno-fig]");
    if (!group || !hLine || !vLine) return;

    const wide = window.matchMedia(WIDE_QUERY);
    const state = { x: 0, y: 0, r: 0, init: false };
    const update = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const mobile = !wide.matches;
      let x: number;
      let y: number;
      let r: number;
      if (stage.ready && stage.screen.visible) {
        x = stage.screen.x - rect.left;
        y = stage.screen.y - rect.top;
        r = stage.screen.halfHeight * 0.92;
      } else {
        x = rect.width * (mobile ? fallback.mobileX : fallback.x);
        y = rect.height * (mobile ? fallback.mobileY : fallback.y);
        r = rect.height * (mobile ? 0.22 : 0.3);
      }
      // Ease toward the target so the overlay feels attached but never jittery.
      const k = state.init ? 0.25 : 1;
      state.x += (x - state.x) * k;
      state.y += (y - state.y) * k;
      state.r += (r - state.r) * k;
      state.init = true;
      group.setAttribute("transform", `translate(${state.x.toFixed(1)} ${state.y.toFixed(1)})`);
      orbit.forEach((circle) => circle.setAttribute("r", state.r.toFixed(1)));
      placed.forEach((el) => {
        const dx = Number(el.dataset.dx) * state.r;
        const dy = Number(el.dataset.dy) * state.r;
        el.setAttribute("transform", `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
      });
      // Notes hang off the left handle (toward the copy), the figure label sits top-right.
      notesEls.forEach((el) => {
        el.setAttribute("x", (-state.r - 46).toFixed(1));
        el.setAttribute("y", "4");
      });
      fig?.setAttribute("x", (state.r * 0.72 + 10).toFixed(1));
      fig?.setAttribute("y", (-state.r * 0.72 - 10).toFixed(1));
      // Horizontal crosshair starts just left of the orbit so it never runs through the headline.
      hLine.setAttribute("x1", Math.max(0, state.x - state.r * 1.6).toFixed(1));
      hLine.setAttribute("y1", state.y.toFixed(1));
      hLine.setAttribute("y2", state.y.toFixed(1));
      hLine.setAttribute("x2", rect.width.toFixed(0));
      vLine.setAttribute("x1", state.x.toFixed(1));
      vLine.setAttribute("x2", state.x.toFixed(1));
      vLine.setAttribute("y2", rect.height.toFixed(0));
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [fallback]);

  return (
    <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-gold">
      <defs>
        <mask id="anno-draw" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="8000" height="8000">
          <circle data-anno-orbit data-anno-draw r="100" fill="none" stroke="#fff" strokeWidth="8" pathLength={1} strokeDasharray="1 1" strokeDashoffset="1" transform="rotate(-90)" />
        </mask>
      </defs>
      <line data-anno-line data-anno-h x1="0" y1="0" x2="0" y2="0" stroke="currentColor" strokeOpacity="0.28" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />
      <line data-anno-line data-anno-v x1="0" y1="0" x2="0" y2="0" stroke="currentColor" strokeOpacity="0.28" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />
      <g data-anno-group>
        <g mask="url(#anno-draw)">
          <circle data-anno-orbit r="100" fill="none" stroke="currentColor" strokeOpacity="0.75" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        </g>
        {[
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ].map(([dx, dy]) => (
          <g key={`${dx}${dy}`} data-anno-pos data-dx={dx} data-dy={dy}>
            <rect data-anno-handle x="-4" y="-4" width="8" height="8" className="fill-gold" />
          </g>
        ))}
        <g data-anno-pos data-dx={-1} data-dy={0}>
          <line data-anno-line x1="-10" y1="0" x2="-38" y2="0" stroke="currentColor" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
        </g>
        <g data-anno-labels className="hidden wide:block short:hidden">
          {notes.map((note, index) => (
            <text
              key={note}
              data-anno-note
              x="0"
              y="0"
              textAnchor="end"
              className="fill-bone font-sans text-[11px] uppercase tracking-[0.2em]"
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              {note}
            </text>
          ))}
          <text data-anno-fig className="fill-gold font-sans text-[10px] uppercase tracking-[0.3em]">
            Fig. 01 — Pro-Vitamin
          </text>
        </g>
      </g>
    </svg>
  );
}
