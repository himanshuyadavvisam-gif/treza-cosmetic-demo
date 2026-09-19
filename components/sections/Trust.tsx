import Reveal from "@/components/ui/Reveal";

const BADGES = [
  {
    label: "Cruelty Free",
    note: "Never tested on animals",
    paths: [
      "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
    ],
  },
  {
    label: "Paraben Free",
    note: "Formulated without parabens",
    paths: [
      "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
      "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
    ],
  },
  {
    label: "Dermatologically Tested",
    note: "Safe for every skin type",
    paths: [
      "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      "m9 12 2 2 4-4",
    ],
  },
  {
    label: "Hydrogen Peroxide Free",
    note: "No hydrogen peroxide in the formula",
    paths: [
      "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2",
      "M8.5 2h7",
      "M7 16h10",
    ],
  },
] as const;

export default function Trust() {
  return (
    <section aria-label="Our promises" className="border-y border-gold/10 bg-ink px-5 py-16 md:px-10 md:py-24">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8">
        {BADGES.map((badge, index) => (
          <Reveal as="li" key={badge.label} delay={index * 0.08} y={24} className="flex flex-col items-center text-center">
            <span className="grid size-16 place-items-center rounded-full border border-gold/30 bg-gold/5 text-gold md:size-20">
              <svg
                viewBox="0 0 24 24"
                className="size-7 md:size-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {badge.paths.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
            </span>
            <h3 className="mt-5 font-display text-xl leading-tight text-bone md:text-2xl">{badge.label}</h3>
            <p className="mt-2 max-w-[14rem] text-[13px] leading-relaxed text-mist">{badge.note}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
