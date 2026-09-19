/** Dashed hairline border with solid corner brackets — the "technical drawing" frame. */
export default function DashedFrame({ className = "" }: { className?: string }) {
  const corner = "absolute size-4 border-gold md:size-5";
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <svg className="absolute inset-0 h-full w-full overflow-visible text-gold/45">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className={`${corner} -left-px -top-px border-l-[1.5px] border-t-[1.5px]`} />
      <span className={`${corner} -right-px -top-px border-r-[1.5px] border-t-[1.5px]`} />
      <span className={`${corner} -bottom-px -left-px border-b-[1.5px] border-l-[1.5px]`} />
      <span className={`${corner} -bottom-px -right-px border-b-[1.5px] border-r-[1.5px]`} />
    </div>
  );
}
