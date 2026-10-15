import ButtonLink from "@/components/ui/ButtonLink";
import { type Service } from "@/lib/services";

export default function StickyQuoteCta({ service }: { service: Service }) {
  return (
    <div className="sticky bottom-4 z-40 mx-auto mt-16 max-w-3xl px-4">
      <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-line bg-surface/95 p-3 pl-6 shadow-lg backdrop-blur sm:flex-row sm:rounded-full">
        <p className="text-center font-display text-primary sm:text-left">
          Ready to start your {service.label.toLowerCase()} project?
        </p>
        <ButtonLink href="/contact" className="rounded-full">
          Request a quote for this
        </ButtonLink>
      </div>
    </div>
  );
}
