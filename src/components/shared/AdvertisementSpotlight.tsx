"use client";

import AdvertisementDetailsModal from "@/components/shared/AdvertisementDetailsModal";
import {
  AD_MARQUEE_FIELDS,
  unwrapAdvertisementList,
  websiteHref,
  type Advertisement,
} from "@/lib/advertisement";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import {
  advertisementSlice,
  useGetAdvertisementsQuery,
} from "@/redux/features/advertisement/advertisementSlice";
import { ChevronLeft, ChevronRight, ExternalLink, Info, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const LIMIT = 10;
const INTERVAL_MS = 3000;

export default function AdvertisementSpotlight({
  section,
  fields = AD_MARQUEE_FIELDS,
}: {
  section: string;
  fields?: string;
}) {
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState<Advertisement | null>(null);

  const { data, isLoading } = useGetAdvertisementsQuery({
    section,
    page,
    limit: LIMIT,
    fields,
  });
  const prefetch = advertisementSlice.usePrefetch("getAdvertisements");
  const { items, meta } = useMemo(() => unwrapAdvertisementList(data), [data]);

  useEffect(() => {
    setIndex(0);
  }, [page, items.length]);

  useEffect(() => {
    if (meta.totalPages <= 1) return;
    const nextPage = page >= meta.totalPages ? 1 : page + 1;
    prefetch({ section, page: nextPage, limit: LIMIT, fields });
  }, [page, meta.totalPages, prefetch, section, fields]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (items.length === 0) return;
      if (nextIndex >= items.length) {
        if (meta.totalPages > 1) {
          setPage((current) => (current >= meta.totalPages ? 1 : current + 1));
          return;
        }
        setIndex(0);
        return;
      }
      if (nextIndex < 0) {
        if (meta.totalPages > 1) {
          setPage((current) => (current <= 1 ? meta.totalPages : current - 1));
          return;
        }
        setIndex(items.length - 1);
        return;
      }
      setIndex(nextIndex);
    },
    [items.length, meta.totalPages],
  );

  if (isLoading || items.length === 0) return null;

  const ad = items[index] || items[0];
  const showControls = items.length > 1 || meta.totalPages > 1;
  const paused = hovered || Boolean(selected);

  return (
    <>
      <style>{`
        @keyframes ad-spotlight-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          18% { transform: translateX(-5px) rotate(-0.45deg); }
          36% { transform: translateX(5px) rotate(0.45deg); }
          54% { transform: translateX(-3px) rotate(-0.25deg); }
          72% { transform: translateX(3px) rotate(0.2deg); }
        }
        @keyframes ad-spotlight-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .ad-spotlight-shake {
          animation: ad-spotlight-shake 0.45s ease-in-out;
        }
        .ad-spotlight-fill {
          transform-origin: left center;
          animation: ad-spotlight-fill ${INTERVAL_MS}ms linear forwards;
        }
      `}</style>
      <section
        className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="container mx-auto max-w-5xl">
          <SpotlightCard
            ad={ad}
            showControls={showControls}
            paused={paused}
            onPrev={() => goTo(index - 1)}
            onNext={() => goTo(index + 1)}
            onLearnMore={() => setSelected(ad)}
          />

          {showControls && (
            <div className="flex justify-center items-center gap-1.5 mt-4">
              {items.map((item, i) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to ad ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-7 bg-gradient-to-r from-[#2ACCED] to-[#B630F4]"
                      : "w-1.5 bg-gray-400/40 light:bg-gray-400/60 hover:bg-gray-400/60 light:hover:bg-gray-500/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <AdvertisementDetailsModal
        open={Boolean(selected)}
        advertisementId={selected?._id}
        initialData={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function SpotlightCard({
  ad,
  showControls,
  paused,
  onPrev,
  onNext,
  onLearnMore,
}: {
  ad: Advertisement;
  showControls: boolean;
  paused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onLearnMore: () => void;
}) {
  const image = buildImageUrl(ad.banner || ad.coverImage || ad.logo);
  const href = websiteHref(ad.website);
  const previousId = useRef(ad._id);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (previousId.current === ad._id) return;
    previousId.current = ad._id;
    setShaking(true);
    const timer = window.setTimeout(() => setShaking(false), 450);
    return () => window.clearTimeout(timer);
  }, [ad._id]);

  return (
    <div className={shaking ? "ad-spotlight-shake" : undefined}>
    <article className="relative overflow-hidden rounded-2xl border border-purple-500/25 light:border-purple-200 bg-gradient-to-r from-black via-[#0f0924] to-black light:from-white light:via-purple-50 light:to-white shadow-[0_0_40px_rgba(97,0,255,0.12)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6100FF]/10 via-transparent to-[#2ACCED]/10 pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-purple-200 light:text-purple-700">
            <Sparkles className="w-3 h-3 text-[#2ACCED]" />
            SPONSORED
          </span>
          {showControls && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onPrev}
                className="p-1.5 rounded-lg text-white/70 light:text-gray-500 hover:text-white light:hover:text-gray-900 hover:bg-white/10 light:hover:bg-gray-100"
                aria-label="Previous ad"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="p-1.5 rounded-lg text-white/70 light:text-gray-500 hover:text-white light:hover:text-gray-900 hover:bg-white/10 light:hover:bg-gray-100"
                aria-label="Next ad"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-36 h-40 sm:h-36 rounded-2xl overflow-hidden bg-purple-950/40 border border-purple-500/20 shrink-0">
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-semibold bg-gradient-to-br from-[#6100FF]/40 to-[#2ACCED]/30">
                {(ad.businessName || "A").charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-[#2ACCED]">{ad.businessName}</p>
            {ad.promotionalHeadline && (
              <h3 className="font-cormorant text-2xl sm:text-3xl font-semibold text-white light:text-gray-900 mt-1 leading-snug">
                {ad.promotionalHeadline}
              </h3>
            )}
            {ad.shortDescription && (
              <p className="text-sm text-gray-400 light:text-gray-500 mt-2 leading-relaxed line-clamp-3">
                {ad.shortDescription}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2ACCED] to-[#B630F4] hover:opacity-90 shadow-lg shadow-purple-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  {ad.ctaButtonText || "Visit Website"}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onLearnMore}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#2ACCED] to-[#B630F4] hover:opacity-90 shadow-lg shadow-purple-500/20"
                >
                  <Info className="w-4 h-4" />
                  Learn More
                </button>
              )}
              {href && (
                <button
                  type="button"
                  onClick={onLearnMore}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-300 light:text-gray-600 hover:text-white light:hover:text-gray-900"
                >
                  <Info className="w-4 h-4 text-purple-300" />
                  Learn More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showControls && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 light:bg-gray-200"
          aria-hidden
        >
          <div
            key={ad._id}
            className="ad-spotlight-fill h-full bg-gradient-to-r from-[#2ACCED] via-[#B630F4] to-[#6100FF] shadow-[0_0_10px_rgba(42,204,237,0.65)]"
            style={{ animationPlayState: paused ? "paused" : "running" }}
            onAnimationEnd={(event) => {
              if (event.animationName !== "ad-spotlight-fill") return;
              onNext();
            }}
          />
        </div>
      )}
    </article>
    </div>
  );
}
