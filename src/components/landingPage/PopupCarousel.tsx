"use client";

import { buildImageUrl } from "@/lib/imageBaseUrl";
import { getActiveWebsitePopups, type Popup } from "@/lib/popup";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SESSION_KEY = "website-popup-shown";
const ROTATION_MS = 3000;

function safeButtonUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

export default function PopupCarousel() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shownThisMount = useRef(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const controller = new AbortController();
    getActiveWebsitePopups(controller.signal)
      .then((items) => {
        setPopups(items);
        setCurrentSlide(0);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Could not load website popups", error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isLoading || popups.length === 0 || isOpen || shownThisMount.current) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // Private browsing can deny storage; the popup can still be shown.
    }

    const delay = Number.isFinite(popups[0].delaySeconds)
      ? Math.max(0, popups[0].delaySeconds) * 1000
      : 0;
    const timeout = window.setTimeout(() => {
      shownThisMount.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Continue without session persistence when storage is unavailable.
      }
      setIsOpen(true);
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [isLoading, isOpen, popups]);

  useEffect(() => {
    if (!isOpen || popups.length < 2) return;
    const interval = window.setInterval(() => {
      setCurrentSlide((index) => (index + 1) % popups.length);
    }, ROTATION_MS);
    return () => window.clearInterval(interval);
  }, [isOpen, popups.length]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isOpen, close]);

  if (isLoading || !isOpen || popups.length === 0) return null;

  const popup = popups[currentSlide];
  const imageUrl = buildImageUrl(popup.image);
  const buttonUrl = safeButtonUrl(popup.button?.url);

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby={popup.description ? "popup-description" : undefined}
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#111024] text-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto overscroll-contain">
          {imageUrl && (
            <div className="relative h-48 w-full bg-white/5 sm:h-72">
              <Image
                src={imageUrl}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 576px"
                className="object-contain"
              />
            </div>
          )}
          <div className="px-5 pb-5 pt-6 text-center sm:px-8 sm:pb-7">
            <h2 id="popup-title" className="text-xl font-semibold leading-tight sm:text-2xl">
              {popup.title}
            </h2>
            {popup.description && (
              <p id="popup-description" className="mt-3 whitespace-pre-line wrap-break-word text-sm leading-relaxed text-white/75 sm:text-base">
                {popup.description}
              </p>
            )}
            {buttonUrl && popup.button?.text && (
              <a
                href={buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 max-w-full items-center justify-center rounded-lg bg-purple-600 px-6 py-2 text-center font-medium text-white transition hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {popup.button.text}
              </a>
            )}
          </div>
        </div>

        {popups.length > 1 && (
          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setCurrentSlide((index) => (index - 1 + popups.length) % popups.length)}
              aria-label="Previous popup"
              className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Choose popup">
              {popups.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Show popup ${index + 1} of ${popups.length}`}
                  aria-current={index === currentSlide ? "true" : undefined}
                  className={`size-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${index === currentSlide ? "bg-purple-400" : "bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentSlide((index) => (index + 1) % popups.length)}
              aria-label="Next popup"
              className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
