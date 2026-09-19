type LetterRollProps = {
  href: string;
  label: string;
  className?: string;
  external?: boolean;
};

/** Link whose letters roll up one by one on hover/focus, revealing an accent copy underneath. */
export default function LetterRoll({ href, label, className = "", external = false }: LetterRollProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className={`group/roll relative inline-flex py-1.5 leading-[1.25] ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span aria-hidden="true" className="flex overflow-hidden whitespace-pre">
        {Array.from(label).map((char, index) => (
          <span
            key={index}
            className="relative inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full motion-reduce:transition-none"
            style={{ transitionDelay: `${index * 16}ms` }}
          >
            <span className="block">{char}</span>
            <span className="absolute left-0 top-full block text-gold">{char}</span>
          </span>
        ))}
      </span>
    </a>
  );
}
