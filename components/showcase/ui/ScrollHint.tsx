/** Small "scroll to continue" pill pinned to the bottom of the hero. */
export default function ScrollHint({ className = "" }: { className?: string }) {
  return (
    <a
      href="#claim"
      data-scroll-hint
      className={`inline-flex items-center gap-2.5 rounded-full border border-bone/20 bg-ink/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-bone/80 backdrop-blur-md transition-colors hover:border-gold/60 hover:text-gold ${className}`}
    >
      Scroll to continue
      <svg viewBox="0 0 12 12" className="size-3 animate-nudge" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
