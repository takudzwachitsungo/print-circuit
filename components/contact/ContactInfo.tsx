import { SITE } from "@/lib/site";

const MAP_SRC =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(SITE.address) +
  "&output=embed";

export default function ContactInfo() {
  return (
    <aside aria-label="Our contact details" className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-primary">
          Visit or call us
        </h2>
        <address className="mt-4 space-y-2 not-italic text-muted">
          <p>{SITE.address}</p>
          {SITE.phones.map((phone) => (
            <p key={phone}>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="hover:text-primary"
              >
                {phone}
              </a>
            </p>
          ))}
          <p>
            <a href={`mailto:${SITE.email}`} className="hover:text-primary">
              {SITE.email}
            </a>
          </p>
        </address>
        <a
          href={SITE.whatsapp}
          className="mt-4 inline-block rounded-full border border-cyan/40 px-5 py-2 text-sm text-cyan hover:border-cyan"
        >
          Chat on WhatsApp
        </a>
      </div>

      <div>
        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-muted">
          Opening hours
        </h3>
        <dl className="mt-3 space-y-1 text-sm">
          {SITE.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-6">
              <dt className="text-muted">{h.days}</dt>
              <dd className="text-primary">{h.time}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <iframe
          title="Print Circuit location map"
          src={MAP_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full"
        />
      </div>
    </aside>
  );
}
