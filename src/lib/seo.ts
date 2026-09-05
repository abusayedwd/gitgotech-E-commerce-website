import { buildImageUrl } from "@/lib/imageBaseUrl";
import type { Metadata } from "next";

export const SITE_NAME = "Sleeknit";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sleeknit.com"
).replace(/\/+$/, "");
export const SUPPORT_EMAIL = "support@sleeknit.com";
export const DEFAULT_TITLE =
  "Sleeknit | Global fashion marketplace, custom tailoring, and vendor showrooms";
export const DEFAULT_DESCRIPTION =
  "Shop premium fashion or request a custom design from expert tailors. Sleeknit connects customers with vendor showrooms worldwide, with delivery in 3–4 days.";
export const DEFAULT_OG_IMAGE = "/images/logo.png";
export const KEYWORDS = [
  "Sleeknit",
  "fashion marketplace",
  "custom clothing",
  "custom tailoring",
  "vendor showroom",
  "designer fashion",
  "buy custom clothes",
  "online tailor",
];

export const NO_INDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productPath(id: string) {
  return `/product/${id}`;
}

export function categoryPath(name: string) {
  return `/category/${encodeURIComponent(String(name).trim().toLowerCase())}`;
}

export function truncate(text: string, max = 160) {
  const value = text.replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

function stripHtml(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? NO_INDEX_ROBOTS
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl(DEFAULT_OG_IMAGE),
        email: SUPPORT_EMAIL,
        sameAs: [
          "https://www.tiktok.com/@_sleeknit",
          "https://www.instagram.com/sleek.nit",
          "https://www.facebook.com/share/1CgSqqRaiw/",
        ],
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export type SeoProduct = {
  _id?: string;
  product_name?: string;
  name?: string;
  product_description?: string;
  description?: string;
  product_price?: number;
  price?: number;
  product_images?: string[];
  product_category?: string;
  vendor?: string | { _id?: string; name?: string };
  review_rating?: number;
  review_count?: number;
};

export function buildProductJsonLd(product: SeoProduct) {
  const id = String(product._id || "");
  const name = product.product_name || product.name || "Product";
  const description =
    stripHtml(product.product_description || product.description) ||
    DEFAULT_DESCRIPTION;
  const images = (product.product_images || [])
    .map((src) => buildImageUrl(src))
    .filter(Boolean);
  const vendorName =
    typeof product.vendor === "string"
      ? product.vendor
      : product.vendor?.name || SITE_NAME;
  const price = Number(product.product_price ?? product.price ?? 0);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: truncate(description, 300),
    image: images.length ? images : [absoluteUrl(DEFAULT_OG_IMAGE)],
    sku: id,
    url: absoluteUrl(productPath(id)),
    brand: { "@type": "Brand", name: vendorName },
    category: product.product_category,
    ...(Number(product.review_count) > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.review_rating || 0),
            reviewCount: Number(product.review_count),
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productPath(id)),
      priceCurrency: "GHS",
      price: Number.isFinite(price) ? price.toFixed(2) : "0.00",
      availability: "https://schema.org/InStock",
    },
  };
}

function apiBase() {
  return (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
}

export async function fetchApiJson(path: string): Promise<unknown> {
  const base = apiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

export function unwrapList(payload: unknown): Record<string, unknown>[] {
  const root = asRecord(payload);
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (!root) return [];
  if (Array.isArray(root.data)) return root.data as Record<string, unknown>[];
  const nested = asRecord(root.data);
  if (Array.isArray(nested?.data)) return nested.data as Record<string, unknown>[];
  return [];
}

export function unwrapItem(payload: unknown): Record<string, unknown> | null {
  const root = asRecord(payload);
  if (!root) return null;
  const data = asRecord(root.data);
  if (data && ("_id" in data || "product_name" in data || "name" in data)) {
    return data;
  }
  const nested = asRecord(data?.data);
  if (nested) return nested;
  if ("_id" in root) return root;
  return data;
}

export async function fetchProductForSeo(id: string): Promise<SeoProduct | null> {
  if (!id) return null;
  const payload = await fetchApiJson(`/product/customer/details/${id}`);
  return unwrapItem(payload) as SeoProduct | null;
}

export function productSeoDescription(product: SeoProduct | null) {
  if (!product) return DEFAULT_DESCRIPTION;
  const text =
    stripHtml(product.product_description || product.description) ||
    `${product.product_name || product.name || "Fashion"} on Sleeknit. Shop from vendor showrooms with delivery in 3–4 days.`;
  return truncate(text);
}

export function productSeoImage(product: SeoProduct | null) {
  const src = product?.product_images?.[0];
  return buildImageUrl(src, DEFAULT_OG_IMAGE);
}

export function categoryNameFromItem(item: Record<string, unknown>) {
  const name = item.name ?? item.category_name ?? item.category ?? item.slug;
  return typeof name === "string" && name.trim() ? name.trim() : "";
}
