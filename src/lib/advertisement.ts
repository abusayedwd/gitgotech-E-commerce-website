export const AD_SECTION_BELOW_HEADER = "below_header_section";
export const AD_SECTION_ABOVE_FAQ = "above_faq_section";
export const AD_SECTION_BOTTOM_FAQ = "bottom_faq_section";

export const AD_MARQUEE_FIELDS = [
  "businessName",
  "logo",
  "website",
  "verificationAndTrust",
  "appearance",
  "promotionalHeadline",
  "shortDescription",
  "ctaButtonText",
  "banner",
  "category",
  "rating",
].join(",");

export type AdvertisementAppearance = {
  background?: string;
  button?: string;
  text?: string;
};

export type AdvertisementSocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
};

export type AdvertisementAttachment = {
  type?: string;
  url?: string;
  label?: string;
};

export type Advertisement = {
  _id: string;
  businessName?: string;
  logo?: string;
  banner?: string;
  coverImage?: string;
  website?: string;
  status?: string;
  category?: string;
  placement?: string[];
  promotionalHeadline?: string;
  shortDescription?: string;
  companyOverview?: string;
  productsAndServices?: string[];
  ctaButtonText?: string;
  verificationAndTrust?: {
    isVerified?: boolean;
    badges?: string[];
  };
  rating?: number;
  reviewCount?: number;
  yearsInBusiness?: number;
  contactPerson?: string;
  contactEmail?: string;
  phone?: string;
  businessHours?: string;
  physicalAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  tags?: string[];
  industriesServed?: string[];
  languagesSupported?: string[];
  gallery?: string[];
  attachments?: AdvertisementAttachment[];
  socialLinks?: AdvertisementSocialLinks;
  createdAt?: string;
  startDate?: string;
  endDate?: string;
  appearance?: AdvertisementAppearance;
  views?: number;
  clicks?: number;
  likes?: number;
  shares?: number;
  saves?: number;
};

export type AdvertisementListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

export function unwrapAdvertisementList(payload: unknown): {
  items: Advertisement[];
  meta: AdvertisementListMeta;
} {
  const root = asRecord(payload);
  const data = asRecord(root?.data) ?? root;
  const items = Array.isArray(data?.data)
    ? (data.data as Advertisement[])
    : Array.isArray(root?.data)
      ? (root.data as Advertisement[])
      : [];
  const meta = asRecord(data?.meta);

  return {
    items,
    meta: {
      total: Number(meta?.total ?? items.length) || 0,
      page: Number(meta?.page ?? 1) || 1,
      limit: Number(meta?.limit ?? items.length) || 10,
      totalPages: Number(meta?.totalPages ?? 1) || 1,
    },
  };
}

export function unwrapAdvertisement(payload: unknown): Advertisement | null {
  const root = asRecord(payload);
  const data = root?.data;
  if (data && typeof data === "object" && !Array.isArray(data) && "_id" in data) {
    return data as Advertisement;
  }
  if (root && "_id" in root) return root as unknown as Advertisement;
  return null;
}

export function websiteHost(url?: string) {
  if (!url) return "";
  try {
    const href = url.startsWith("http") ? url : `https://${url}`;
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export function websiteHref(url?: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}
