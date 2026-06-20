import MagneticButton from "@/components/ui/MagneticButton";
import { type Service } from "@/lib/services";

export default function StickyQuoteCta({ service }: { service: Service }) {
  return (
    <div className="sticky bottom-4 z-40 mx-auto mt-20 max-w-5xl px-6">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/90 px-6 py-5 backdrop-blur sm:flex-row">
        <p className="text-center font-display text-lg text-primary sm:text-left">
          Ready to start your {service.label.toLowerCase()} project?
        </p>
        <MagneticButton href="/contact">
          Request a quote for this
        </MagneticButton>
      </div>
    </div>
  );
}
