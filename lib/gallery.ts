import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Build-time read of `public/<...segments>/`. Returns web paths for any images
 * in that folder (sorted by filename), or an empty array when it's
 * missing/empty — so consumers can fall back to placeholders. Drop files in the
 * folder and rebuild to populate. Server-only (uses node:fs).
 */
function listImages(...segments: string[]): string[] {
  try {
    return readdirSync(join(process.cwd(), "public", ...segments))
      .filter((file) => IMAGE_RE.test(file))
      .sort()
      .map((file) => `/${segments.join("/")}/${file}`);
  } catch {
    return [];
  }
}

/** Case-study gallery images from `public/work/<slug>/`. */
export function getGalleryImages(slug: string): string[] {
  return listImages("work", slug);
}

/** "Sample work" images for a service page, from `public/services/<slug>/`. */
export function getServiceSamples(slug: string): string[] {
  return listImages("services", slug);
}

/** Cover image for a project = the first image in its folder, or null. */
export function getCover(slug: string): string | null {
  return getGalleryImages(slug)[0] ?? null;
}

/** Team headshot under public/team/<file>, or null when the file isn't there
    (so a member without a photo gets the gradient avatar — no broken image). */
export function getTeamPhoto(file: string | undefined): string | null {
  if (!file) return null;
  return existsSync(join(process.cwd(), "public", "team", file))
    ? `/team/${file}`
    : null;
}
