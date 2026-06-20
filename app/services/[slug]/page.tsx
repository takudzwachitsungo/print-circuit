import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/lib/services";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceIncluded from "@/components/services/ServiceIncluded";
import ServiceGallery from "@/components/services/ServiceGallery";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    openGraph: { title: service.seoTitle, description: service.seoDescription },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <main>
      <ServiceHero service={service} />
      <ServiceIncluded service={service} />
      <ServiceGallery service={service} />
    </main>
  );
}
