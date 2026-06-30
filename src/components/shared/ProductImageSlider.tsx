"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import url from "@/redux/api/baseUrl";

const FALLBACK_IMG = "/images/jacket.png";

interface Props {
  /** Raw image paths from the product object (relative paths get prefixed with the base URL). */
  images?: string[] | null;
  /** Alt text — usually the product name. */
  alt?: string;
  /** Auto-cycle interval in ms when hovered (desktop). */
  cycleMs?: number;
  /** Tailwind class for the outer aspect-ratio box. Defaults to a square. */
  aspectClass?: string;
  /** Extra classes applied to the outer wrapper. */
  className?: string;
  /** Slot for badges / overlay UI (rendered on top of the slider). */
  children?: React.ReactNode;
}

/**
 * Reusable product image carousel for grid/list cards.
 *
 * - Renders all `images` as cross-faded layers (consistent dimensions per card).
 * - Hovering the card auto-cycles through the images.
 * - Manual prev/next arrows and dot indicators (only when multiple images).
 * - Falls back to a placeholder when there are no images.
 *
 * Place this directly inside the card. The card itself remains the click
 * target (this component swallows clicks only on its own controls).
 */
export default function ProductImageSlider({
  images,
  alt = "Product image",
  cycleMs = 1500,
  aspectClass = "aspect-square",
  className = "",
  children,
}: Props) {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resolved: string[] = (images || [])
    .filter(Boolean)
    .map((img) => (img.startsWith("http") ? img : `${url}/${img}`));
  const list = resolved.length > 0 ? resolved : [FALLBACK_IMG];

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const start = () => {
    if (list.length <= 1 || intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setActive((p) => (p + 1) % list.length);
    }, cycleMs);
  };

  useEffect(() => stop, []);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActive((p) => (p - 1 + list.length) % list.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActive((p) => (p + 1) % list.length);
  };

  return (
    <div
      onMouseEnter={start}
      onMouseLeave={() => {
        stop();
        setActive(0);
      }}
      className={`relative ${aspectClass} overflow-hidden bg-black ${className}`}
    >
      {list.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      ))}

      {/* Caller-provided overlays (badges, etc.) */}
      {children}

      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActive(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "bg-white w-4" : "bg-white/50 w-1.5"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
