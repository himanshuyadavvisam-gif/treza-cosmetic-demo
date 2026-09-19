/** Vertical scroll-progress rail. The parent scrubs `[data-rail-fill]` (scaleY 0 → 1). */
export default function ScrollRail({ labels, className = "" }: { labels: string[]; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none flex-col items-center gap-4 ${className}`}>
      <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-bone/50 [writing-mode:vertical-rl]">{labels[0]}</span>
      <div className="relative h-[38svh] w-px bg-bone/15">
        <div data-rail-fill className="absolute inset-0 origin-top bg-gold" style={{ transform: "scaleY(0)" }} />
        {labels.map((label, index) => (
          <span
            key={label}
            className="absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold bg-ink"
            style={{ top: `${labels.length > 1 ? (index / (labels.length - 1)) * 100 : 0}%` }}
          />
        ))}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-bone/50 [writing-mode:vertical-rl]">
        {labels[labels.length - 1]}
      </span>
    </div>
  );
}
