"use client";

import SearchResults from "@/components/landingPage/SearchResults";
import { Search, X } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setInput("");
      setDebouncedQuery("");
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (value: string) => {
    setInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value.trim());
    }, 300);
  };

  const submitSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setDebouncedQuery(input.trim());
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-full items-start justify-center px-3 pt-8 sm:pt-16 pb-6 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-4xl max-h-[min(88vh,880px)] flex flex-col overflow-hidden rounded-2xl border border-gray-700/80 bg-[#0b0618]/95 shadow-2xl shadow-purple-950/40"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-700/80 p-3 sm:p-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                value={input}
                onChange={(event) => handleChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitSearch();
                  }
                }}
                placeholder="Search vendors, showrooms, or products"
                className="w-full min-w-0 rounded-lg border border-gray-700 bg-transparent py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 text-base sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="button"
              onClick={submitSearch}
              className="shrink-0 hidden sm:inline-flex bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0">
            <Suspense
              fallback={
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
                </div>
              }
            >
              <SearchResults
                query={debouncedQuery}
                variant="modal"
                onNavigate={onClose}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
