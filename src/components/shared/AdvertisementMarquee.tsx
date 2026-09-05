"use client";

import AdvertisementDetailsModal from "@/components/shared/AdvertisementDetailsModal";
import {
  AD_MARQUEE_FIELDS,
  unwrapAdvertisementList,
  websiteHost,
  type Advertisement,
} from "@/lib/advertisement";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import {
  advertisementSlice,
  useGetAdvertisementsQuery,
} from "@/redux/features/advertisement/advertisementSlice";
import { BadgeCheck, Megaphone, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const LIMIT = 10;
const ITEM_PX = 260;

export default function AdvertisementMarquee({
  section,
  fields = AD_MARQUEE_FIELDS,
}: {
  section: string;
  fields?: string;
}) {
  const [page, setPage] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState<Advertisement | null>(null);
  const [viewportItems, setViewportItems] = useState(4);

  const { data, isLoading } = useGetAdvertisementsQuery({
    section,
    page,
    limit: LIMIT,
    fields,
  });
  const prefetch = advertisementSlice.usePrefetch("getAdvertisements");
  const { items, meta } = useMemo(() => unwrapAdvertisementList(data), [data]);

  useEffect(() => {
    const compute = () => {
      setViewportItems(Math.ceil((window.innerWidth || 800) / ITEM_PX) + 2);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    if (meta.totalPages <= 1) return;
    const nextPage = page >= meta.totalPages ? 1 : page + 1;
    prefetch({ section, page: nextPage, limit: LIMIT, fields });
  }, [page, meta.totalPages, prefetch, section, fields]);

  if (isLoading || items.length === 0) return null;

  const copiesPerHalf = Math.max(1, Math.ceil(viewportItems / items.length));
  const half = Array.from({ length: copiesPerHalf }, () => items).flat();
  const track = [...half, ...half];
  const duration = Math.max(18, half.length * 5);
  const isPaused = paused || hovered || Boolean(selected);

  const advancePage = () => {
    if (meta.totalPages <= 1) return;
    setPage((current) => (current >= meta.totalPages ? 1 : current + 1));
  };

  return (
    <>
      <section
        className="px-4 pt-4 md:pt-5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="container mx-auto overflow-hidden">
          <div className="flex items-center justify-between px-1 pb-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" />
              Sponsored
            </p>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/5"
              aria-label={isPaused ? "Play advertisements" : "Pause advertisements"}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="overflow-hidden p-1">
            <div
              key={`${section}-${page}`}
              className="flex w-max ad-marquee-track"
              style={{
                animationDuration: `${duration}s`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
              onAnimationIteration={advancePage}
            >
              {track.map((ad, index) => (
                <AdPill
                  key={`${ad._id}-${index}`}
                  ad={ad}
                  onOpen={() => setSelected(ad)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdvertisementDetailsModal
        open={Boolean(selected)}
        advertisementId={selected?._id}
        initialData={selected}
        onClose={() => setSelected(null)}
      />

      <style jsx>{`
        @keyframes ad-marquee-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ad-marquee-track {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
}

function AdPill({
  ad,
  onOpen,
}: {
  ad: Advertisement;
  onOpen: () => void;
}) {
  const logo = buildImageUrl(ad.logo);
  const host = websiteHost(ad.website);
  const text = ad.appearance?.text || "#F8FAFC";
  const background = ad.appearance?.background || "#141A2E";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex-shrink-0 mx-2 flex items-center gap-3 rounded-4xl border border-white/10 px-3 py-2 min-w-[220px] max-w-[280px] text-left transition-shadow hover:shadow-[0_0_0_1px_rgba(34,211,238,0.75),0_0_18px_rgba(34,211,238,0.28)]"
      style={{ background, color: text }}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/15 shrink-0">
        {logo ? (
          <img src={logo} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-semibold">
            {(ad.businessName || "A").charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate flex items-center gap-1">
          <span className="truncate">{ad.businessName}</span>
          {ad.verificationAndTrust?.isVerified && (
            <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          )}
        </p>
        {host && <p className="text-xs text-slate-400 truncate">{host}</p>}
      </div>
    </button>
  );
}
