"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setActiveSection, type SectionId } from "@/lib/scrollStore";
import EdgeTab from "@/components/showcase/ui/EdgeTab";

// The whole three.js stage is its own lazy chunk, mounted after first paint.
const Stage = dynamic(() => import("@/components/showcase/stage/Stage"), { ssr: false });

const SECTIONS: SectionId[] = ["top", "claim", "ritual", "formula", "ingredients", "ayurveda", "choose", "promise", "best-sellers", "faq"];

/**
 * Hosts the fixed 3D stage behind the page, the warm backdrop glow, and section scroll-spy.
 * Everything meaningful is server-rendered DOM in `children`; the canvas is decoration.
 */
export default function ShowcaseRoot({ children }: { children: ReactNode }) {
  const [mountStage, setMountStage] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Wait for the first paint (static hero is the LCP), then bring in WebGL.
    const start = () => setMountStage(true);
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const raf = requestAnimationFrame(() => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 1200 });
      else timeoutId = globalThis.setTimeout(start, 200) as unknown as number;
    });
    return () => {
      cancelAnimationFrame(raf);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  useGSAP(() => {
    // Scroll-spy: whichever section spans the viewport centre is active. Evaluated on every update
    // (not per-trigger toggles), so big jumps — anchor links, keyboard End — always land correctly.
    const spies = SECTIONS.flatMap((id) => {
      const el = document.getElementById(id);
      return el ? [{ id, trigger: ScrollTrigger.create({ trigger: el, start: "top 50%", end: "bottom 50%" }) }] : [];
    });
    const spy = () => {
      const y = window.scrollY;
      let current: SectionId = spies[0]?.id ?? "top";
      for (const { id, trigger } of spies) if (y >= trigger.start) current = id;
      setActiveSection(current);
    };
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: spy, onRefresh: spy });

    // Pinned heights depend on fonts and images; re-measure once everything has settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  });

  return (
    <>
      <div id="stage-backdrop" aria-hidden="true" className="stage-backdrop pointer-events-none fixed inset-0 z-0" />
      {mountStage && <Stage />}
      <EdgeTab />
      <div className="relative z-1">{children}</div>
    </>
  );
}
