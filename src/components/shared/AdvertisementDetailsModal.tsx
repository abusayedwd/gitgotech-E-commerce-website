"use client";

import {
  unwrapAdvertisement,
  websiteHost,
  websiteHref,
  type Advertisement,
} from "@/lib/advertisement";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import { useGetAdvertisementDetailsQuery } from "@/redux/features/advertisement/advertisementSlice";
import {
  BadgeCheck,
  Bookmark,
  Calendar,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  Eye,
  Flag,
  Globe,
  Heart,
  Info,
  Mail,
  MapPin,
  MousePointerClick,
  Phone,
  Share2,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SOCIAL_BUTTONS: {
  key: keyof NonNullable<Advertisement["socialLinks"]>;
  label: string;
  Icon: typeof FaFacebookF;
}[] = [
  { key: "facebook", label: "Facebook", Icon: FaFacebookF },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
  { key: "linkedin", label: "LinkedIn", Icon: FaLinkedinIn },
  { key: "x", label: "X", Icon: FaXTwitter },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "tiktok", label: "TikTok", Icon: FaTiktok },
  { key: "whatsapp", label: "WhatsApp", Icon: FaWhatsapp },
];

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCount(value?: number) {
  const n = Number(value ?? 0);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-sm font-medium text-white">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  href,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex items-center justify-center gap-2 rounded-lg border border-white/15 py-2.5 text-sm text-white hover:bg-white/5 transition-colors";
  if (href) {
    return (
      <a href={href} className={className}>
        {icon}
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      {label}
    </button>
  );
}

export default function AdvertisementDetailsModal({
  open,
  advertisementId,
  initialData,
  onClose,
}: {
  open: boolean;
  advertisementId?: string | null;
  initialData?: Advertisement | null;
  onClose: () => void;
}) {
  const skip = !open || !advertisementId;
  const { data, isFetching } = useGetAdvertisementDetailsQuery(
    advertisementId as string,
    { skip },
  );
  const ad = unwrapAdvertisement(data) || initialData || null;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLiked(false);
    setSaved(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, advertisementId, onClose]);

  if (!open) return null;

  const logo = buildImageUrl(ad?.logo);
  const hero = buildImageUrl(ad?.banner || ad?.coverImage);
  const href = websiteHref(ad?.website);
  const host = websiteHost(ad?.website);
  const location = [ad?.city, ad?.state, ad?.country].filter(Boolean).join(", ");
  const cta = ad?.appearance?.button || "#2563EB";
  const published = formatDate(ad?.startDate || ad?.createdAt);
  const expires = formatDate(ad?.endDate);

  const copyWebsite = async () => {
    if (!href) return;
    try {
      await navigator.clipboard.writeText(href);
      toast.success("Website link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareAd = async () => {
    const shareUrl = href || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: ad?.businessName,
          text: ad?.promotionalHeadline,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch {
      /* user cancelled share */
    }
  };

  return (
    <div className="fixed inset-0 z-[220]" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close advertisement"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg max-h-[min(94vh,900px)] overflow-hidden rounded-2xl border border-[#1d2a44] bg-[#07101f] text-white shadow-2xl flex flex-col"
          onClick={(event) => event.stopPropagation()}
        >
          {isFetching && !ad ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !ad ? (
            <div className="p-8 text-center text-slate-400">
              Advertisement not found.
            </div>
          ) : (
            <>
              <div className="relative shrink-0 h-36 sm:h-40 bg-[#0b1a33]">
                {hero ? (
                  <img src={hero} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#12325c] via-[#0b1a33] to-[#07101f]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101f] via-[#07101f]/25 to-transparent" />
                <span className="absolute top-3 left-4 text-[10px] font-bold tracking-[0.22em] text-white/90">
                  SPONSORED
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-2.5 right-2.5 p-1.5 bg-black/70 rounded-4xl text-white/80 hover:bg-black/40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 min-h-0 px-4 sm:px-5 pb-5 mt-8 custom-scrollbar [scrollbar-color:rgba(147,51,234,0.7)_rgba(75,85,99,0.2)] [scrollbar-width:thin]">
                <div className="flex items-end gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#122033] border border-white/15 shrink-0 shadow-lg">
                    {logo ? (
                      <img src={logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-semibold">
                        {(ad.businessName || "A").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 pb-0.5">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-lg font-semibold truncate">
                        {ad.businessName}
                      </h2>
                      {ad.verificationAndTrust?.isVerified && (
                        <BadgeCheck className="w-5 h-5 text-[#3b82f6] shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mt-0.5">
                      {ad.category && <span>{ad.category}</span>}
                      {ad.rating != null && (
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {ad.rating.toFixed(1)}
                          {ad.reviewCount != null ? ` (${ad.reviewCount})` : ""}
                        </span>
                      )}
                    </div>
                    {location && (
                      <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {location}
                      </p>
                    )}
                  </div>
                </div>

                {ad.promotionalHeadline && (
                  <h3 className="text-xl font-semibold leading-snug mt-4">
                    {ad.promotionalHeadline}
                  </h3>
                )}
                {(ad.shortDescription || ad.companyOverview) && (
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {ad.shortDescription || ad.companyOverview}
                  </p>
                )}

                {href && (
                  <div className="mt-4 flex items-center rounded-lg border border-white/15 overflow-hidden">
                    <p className="flex-1 px-3 py-2.5 text-sm text-slate-200 truncate">
                      {href}
                    </p>
                    <button
                      type="button"
                      onClick={copyWebsite}
                      className="shrink-0 px-3 py-2.5 text-xs font-medium text-white border-l border-white/15 hover:bg-white/5 inline-flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Website Link
                    </button>
                  </div>
                )}

                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white"
                    style={{ background: cta }}
                  >
                    {ad.ctaButtonText || "Visit Website"}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <ActionButton
                    icon={<Phone className="w-4 h-4" />}
                    label="Call"
                    href={ad.phone ? `tel:${ad.phone}` : undefined}
                    onClick={!ad.phone ? () => toast.error("No phone listed") : undefined}
                  />
                  <ActionButton
                    icon={<Mail className="w-4 h-4" />}
                    label="Email"
                    href={ad.contactEmail ? `mailto:${ad.contactEmail}` : undefined}
                    onClick={!ad.contactEmail ? () => toast.error("No email listed") : undefined}
                  />
                </div>

                <div className="mt-4">
                  <Accordion title="Contact & Details" defaultOpen>
                    <div className="space-y-2.5 text-sm text-slate-300">
                      {ad.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500" />
                          {ad.phone}
                        </p>
                      )}
                      {ad.contactEmail && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500" />
                          {ad.contactEmail}
                        </p>
                      )}
                      {ad.businessHours && (
                        <p className="flex items-center gap-2">
                          <Clock3 className="w-4 h-4 text-slate-500" />
                          {ad.businessHours}
                        </p>
                      )}
                      {host && (
                        <p className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-500" />
                          {host}
                        </p>
                      )}
                      {ad.physicalAddress && (
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                          {[ad.physicalAddress, location].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </Accordion>

                  <Accordion title="Tags, Industries & Languages">
                    <div className="space-y-3">
                      {ad.tags && ad.tags.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Tags</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ad.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2.5 py-1 rounded-full bg-[#1d4ed8]/25 text-[#93c5fd]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {ad.industriesServed && ad.industriesServed.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Industries served</p>
                          <p className="text-sm text-slate-300">
                            {ad.industriesServed.join(", ")}
                          </p>
                        </div>
                      )}
                      {ad.languagesSupported && ad.languagesSupported.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Languages</p>
                          <p className="text-sm text-slate-300">
                            {ad.languagesSupported.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </Accordion>

                  <Accordion title="Social media">
                    <div className="flex flex-wrap gap-2">
                      {SOCIAL_BUTTONS.map(({ key, label, Icon }) => {
                        const url = ad.socialLinks?.[key];
                        if (!url) return null;
                        return (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm text-white hover:bg-white/5"
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                          </a>
                        );
                      })}
                    </div>
                  </Accordion>

                  <Accordion title="Why am I seeing this advertisement?">
                    <p className="text-sm text-slate-400 leading-relaxed flex gap-2">
                      <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      This sponsored listing is shown because it is published for
                      this page
                      {ad.category ? ` in ${ad.category}` : ""}. You can visit the
                      business site or report the ad if it looks wrong.
                    </p>
                  </Accordion>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-2">
                  {published && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Published {published}
                    </span>
                  )}
                  {expires && (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-3 h-3" />
                      Expires {expires}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
