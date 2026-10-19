import Reveal from "@/components/animation/Reveal";

interface ClientBadge {
  name: string;
  renderLogo: () => React.ReactNode;
}

const CLIENTS: ClientBadge[] = [
  // 1. UNICEF
  {
    name: "UNICEF",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-[#00aeef]">
        <svg viewBox="0 0 48 48" className="h-10 w-10 sm:h-12 sm:w-12" fill="currentColor">
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="24" cy="14" r="4.5" />
          <path d="M16 34c0-5 3.5-9 8-9s8 4 8 9z" />
          <circle cx="28" cy="22" r="3" />
          <path d="M24 34c0-3 2-6 5-6s5 3 5 6z" fill="#00aeef" />
          <path d="M10 24c0 7 6 13 14 13s14-6 14-13" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="mt-1 font-display text-[11px] sm:text-xs font-black tracking-tight text-[#00aeef]">
          unicef
        </span>
      </div>
    ),
  },
  // 2. Bata
  {
    name: "Bata",
    renderLogo: () => (
      <div className="flex items-center justify-center">
        <span className="font-serif italic font-black text-2xl sm:text-3xl tracking-tight text-[#d81e05] drop-shadow-sm">
          Bata
        </span>
      </div>
    ),
  },
  // 3. British Council
  {
    name: "British Council",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 gap-1 mb-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#00aeef]" />
        </div>
        <span className="font-display text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#002f6c] leading-none">
          BRITISH
        </span>
        <span className="font-display text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#002f6c] leading-tight">
          COUNCIL
        </span>
      </div>
    ),
  },
  // 4. Alliance Française
  {
    name: "Alliance Française Zimbabwe",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-serif italic font-black text-2xl sm:text-3xl text-[#d6001c] leading-none">
          af
        </span>
        <span className="mt-1 font-display text-[8px] sm:text-[9px] font-bold text-[#1f2937] leading-none">
          AllianceFrançaise
        </span>
        <span className="font-display text-[7px] font-medium text-[#d6001c] tracking-wider uppercase">
          Zimbabwe
        </span>
      </div>
    ),
  },
  // 5. FAO
  {
    name: "FAO",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-[#0072bc]">
        <svg viewBox="0 0 44 44" className="h-10 w-10 sm:h-12 sm:w-12" fill="currentColor">
          <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M22 8 v24 M18 14 l4 -3 l4 3 M17 20 l5 -3 l5 3 M18 26 l4 -3 l4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <text x="7" y="24" fontSize="7" fontWeight="bold" fill="currentColor">F</text>
          <text x="21" y="9" fontSize="6" fontWeight="bold" fill="currentColor" textAnchor="middle">A</text>
          <text x="33" y="24" fontSize="7" fontWeight="bold" fill="currentColor">O</text>
          <text x="22" y="38" fontSize="4.5" fontWeight="bold" fill="currentColor" textAnchor="middle">FIAT PANIS</text>
        </svg>
      </div>
    ),
  },
  // 6. ILO
  {
    name: "International Labour Organization",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-[#004785] text-center">
        <svg viewBox="0 0 40 40" className="h-9 w-9 sm:h-10 sm:w-10 mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="20" cy="20" r="16" strokeDasharray="3 2" />
          <circle cx="20" cy="20" r="11" />
          <path d="M20 9v22 M9 20h22 M12 12l16 16 M28 12l-16 16" strokeWidth="1" />
        </svg>
        <span className="font-display text-[8px] sm:text-[9px] font-bold text-[#004785] leading-none">
          International
        </span>
        <span className="font-display text-[7px] text-[#4b5563] leading-tight">
          Labour Organization
        </span>
      </div>
    ),
  },
  // 7. fastjet
  {
    name: "fastjet",
    renderLogo: () => (
      <div className="flex items-center gap-1.5 justify-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#71717a]" fill="currentColor">
          <circle cx="12" cy="7" r="4" />
          <path d="M9 11c-2 2-3 6-1 9 3 0 5-2 6-5l-2-4z" />
          <path d="M14 8l4-2-2 4z" fill="#f59e0b" />
        </svg>
        <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#18181b]">
          fastjet
        </span>
      </div>
    ),
  },
  // 8. UNDP
  {
    name: "UNDP",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded bg-[#006699] px-2.5 py-1 text-white shadow-sm">
          <span className="font-display text-xs sm:text-sm font-black tracking-widest">
            U N
          </span>
          <br />
          <span className="font-display text-xs sm:text-sm font-black tracking-widest">
            D P
          </span>
        </div>
        <span className="mt-1 font-display text-[6.5px] text-[#4b5563] leading-none">
          Empowered lives.
        </span>
      </div>
    ),
  },
  // 9. ZIMRA
  {
    name: "ZIMRA",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#15803d] to-[#eab308] p-1 shadow-sm">
          <span className="text-[10px] text-white">⚖️</span>
        </div>
        <span className="mt-1 font-display text-[10px] sm:text-xs font-black tracking-wider text-[#1e293b]">
          ZIMRA
        </span>
      </div>
    ),
  },
  // 10. PSI Zimbabwe
  {
    name: "PSI Zimbabwe",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative border-l-2 border-r-2 border-t-2 border-[#16a34a] px-2 py-0.5">
          <div className="absolute -bottom-1 -left-1 -right-1 h-0.5 bg-[#ea580c]" />
          <span className="font-display text-base sm:text-lg font-black tracking-tight text-[#1e293b]">
            psi
          </span>
        </div>
        <span className="mt-1 font-display text-[8px] font-bold text-[#1e293b]">
          Zimbabwe
        </span>
      </div>
    ),
  },
  // 11. USAID
  {
    name: "USAID",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-1">
          <span className="text-xs">🤝</span>
          <span className="font-display text-sm sm:text-base font-black tracking-wider text-[#1e3a8a]">
            USAID
          </span>
        </div>
        <span className="font-display text-[6px] sm:text-[6.5px] uppercase font-bold text-[#b91c1c] tracking-tight leading-none">
          FROM THE AMERICAN PEOPLE
        </span>
      </div>
    ),
  },
  // 12. Old Mutual
  {
    name: "Old Mutual",
    renderLogo: () => (
      <div className="flex items-center gap-1.5 justify-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6 text-[#008752]" fill="currentColor">
          <circle cx="8" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="16" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="12" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <div className="text-left leading-none">
          <span className="font-display text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tight text-[#008752] block">
            OLD MUTUAL
          </span>
        </div>
      </div>
    ),
  },
  // 13. Oxfam
  {
    name: "Oxfam",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-[#61a534]">
        <svg viewBox="0 0 36 28" className="h-6 w-8 sm:h-7 sm:w-9" fill="currentColor">
          <circle cx="18" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M8 24 c0-8 8-10 10-10 s10 2 10 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="18" cy="19" r="2.5" fill="currentColor" />
        </svg>
        <span className="font-display text-[11px] sm:text-xs font-black tracking-wider text-[#61a534]">
          OXFAM
        </span>
      </div>
    ),
  },
  // 14. BancABC
  {
    name: "BancABC",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-display text-xs sm:text-sm font-extrabold text-[#003366] tracking-tight">
          BancABC
        </span>
        <span className="font-display text-[7px] text-[#4b5563] leading-none">
          part of atlasmara
        </span>
      </div>
    ),
  },
  // 15. RTG
  {
    name: "Rainbow Tourism Group",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-1 text-[#b45309]">
          <span className="font-display text-sm sm:text-base font-black tracking-tight text-[#78350f]">
            RTG
          </span>
        </div>
        <span className="font-display text-[6.5px] sm:text-[7px] text-[#4b5563] leading-none">
          Unique African hospitality
        </span>
      </div>
    ),
  },
];

export default function AboutClientsGrid() {
  return (
    <section
      aria-labelledby="clients-heading"
      className="mx-auto w-full max-w-screen-2xl bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-10"
    >
      {/* Section Heading: Some of our Clients. (matching reference screenshot) */}
      <Reveal className="text-center">
        <h2
          id="clients-heading"
          className="font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl"
        >
          Some of our <span className="text-magenta">Clients.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Trusted by international agencies, public institutions, and forward-thinking enterprises in Zimbabwe.
        </p>
      </Reveal>

      {/* 15 Circular Badges in a balanced responsive grid matching screenshot */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6 lg:gap-8">
        {CLIENTS.map((client, index) => (
          <Reveal
            key={client.name}
            delay={index * 0.03}
            className="flex items-center justify-center"
          >
            <div
              title={client.name}
              className="group relative flex aspect-square w-32 sm:w-36 md:w-40 items-center justify-center rounded-full border border-line/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-magenta/40 hover:shadow-[0_12px_28px_rgba(236,0,140,0.15)]"
            >
              {/* Subtle Ambient Inner Rim */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-1.5 rounded-full border border-black/[0.03] transition-colors group-hover:border-magenta/15"
              />
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                {client.renderLogo()}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
