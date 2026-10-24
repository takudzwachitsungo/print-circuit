import { SITE } from "@/lib/site";
import ButtonLink from "@/components/ui/ButtonLink";

const MAP_SRC =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(SITE.address) +
  "&output=embed";

export default function ContactInfo() {
  return (
    <aside aria-label="Our contact details" className="space-y-6 rounded-3xl bg-tint-butter p-8">
      <div>
        <h2 className="font-display text-xl font-medium text-primary">
          Visit or call us
        </h2>
        <address className="mt-4 space-y-2 not-italic text-primary/75">
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
          <p>
            
            <a href={`mailto:${SITE.careersEmail}`} className="hover:text-primary">
              {SITE.careersEmail}
            </a>
          </p>
        </address>
        <ButtonLink href={SITE.whatsapp} variant="whatsapp" external className="mt-4">
          Chat on WhatsApp
        </ButtonLink>
      </div>

      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">
          Opening hours
        </h3>
        <dl className="mt-3 space-y-1 text-sm">
          {SITE.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-6">
              <dt className="text-primary/70">{h.days}</dt>
              <dd className="text-primary">{h.time}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
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
