import { readdirSync } from "node:fs";
import { join } from "node:path";

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * Build-time read of `public/work/<slug>/`. Returns web paths for any images
 * dropped in that folder (sorted by filename), or an empty array when the
 * folder is missing/empty — in which case the case-study gallery falls back to
 * its styled placeholders. To swap a project's gallery, drop real photos into
 * `public/work/<slug>/` and rebuild. Server-only (uses node:fs).
 */
export function getGalleryImages(slug: string): string[] {
  try {
    return readdirSync(join(process.cwd(), "public", "work", slug))
      .filter((file) => IMAGE_RE.test(file))
      .sort()
      .map((file) => `/work/${slug}/${file}`);
  } catch {
    return [];
  }
}
