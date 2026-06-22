// Image URL helper — single source of truth.
// Backed by NEXT_PUBLIC_IMAGE_URL. Falls back to an empty string so that a
// missing env var fails loudly (broken <img> tags) rather than silently
// pointing at a stale tunnel.

const RAW = (process.env.NEXT_PUBLIC_IMAGE_URL ?? "").trim();

// Strip trailing slash(es) so we can always do `${BASE}/${path}` safely.
export const IMAGE_BASE_URL = RAW.replace(/\/+$/, "");

if (
  typeof window !== "undefined" &&
  !IMAGE_BASE_URL &&
  process.env.NODE_ENV !== "production"
) {
  console.warn(
    "[imageBaseUrl] NEXT_PUBLIC_IMAGE_URL is not set. All server-hosted images " +
      "will fail to load. Set it in .env / .env.local and restart `npm run dev`.",
  );
}

const ABSOLUTE_URL_RE = /^(https?:\/\/|data:|blob:)/i;

/**
 * Build a safe absolute image URL from a server-stored path.
 *
 * - `null` / `undefined` / `""`             → returns `fallback` (default: empty string)
 * - already an absolute URL (`http(s)://`, `data:`, `blob:`) → returned unchanged
 * - starts with `/`                          → treated as a public-folder path, returned unchanged
 * - otherwise                                → joined as `${IMAGE_BASE_URL}/${path}`
 *
 * Always strips redundant slashes between the base and the path.
 */
export function buildImageUrl(
  path: string | null | undefined,
  fallback: string = "",
): string {
  if (!path) return fallback;
  const p = String(path).trim();
  if (!p) return fallback;
  if (ABSOLUTE_URL_RE.test(p)) return p;
  if (p.startsWith("/")) return p; // public folder asset
  if (!IMAGE_BASE_URL) return fallback;
  return `${IMAGE_BASE_URL}/${p.replace(/^\/+/, "")}`;
}
