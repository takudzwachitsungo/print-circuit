const DEFAULT_ITEMS = [
  "Business Cards",
  "Flyers",
  "Large Format Printing",
  "Banners",
  "Signage",
  "Branding",
  "Stationery",
  "Stickers",
];

export default function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  // Duplicate the track so translateX(-50%) loops seamlessly.
  const track = [...items, ...items];
  return (
    <section
      aria-label="What we print"
      className="overflow-hidden border-y border-white/10 bg-base py-6"
    >
      <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="font-display text-sm uppercase tracking-[0.2em] text-muted">
              {item}
            </span>
            <span className="text-cyan">/</span>
          </span>
        ))}
      </div>
    </section>
  );
}
