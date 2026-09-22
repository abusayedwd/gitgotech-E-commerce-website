"use client";

import { ArrowLeft, Home, Shirt, Sparkles, Store, RotateCcw } from "lucide-react";
import Link from "next/link";

const shortcuts = [
  { href: "/hotdeals", label: "Hot Deals", hint: "Today’s markdowns" },
  { href: "/vendors", label: "Vendors", hint: "Meet the makers" },
  { href: "/showroom", label: "Showrooms", hint: "Browse collections" },
  { href: "/design-request", label: "Custom design", hint: "Made to measure" },
];

type FallbackScreenProps = {
  variant?: "not-found" | "error";
  standalone?: boolean;
  onRetry?: () => void;
};

export default function FallbackScreen({
  variant = "not-found",
  standalone = false,
  onRetry,
}: FallbackScreenProps) {
  const isError = variant === "error";

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-gray-950 via-purple-900/20 to-black light:from-white light:via-purple-50 light:to-white text-white light:text-gray-900 ${
        standalone ? "min-h-screen py-16" : "min-h-[calc(100vh-4rem)] pt-28 md:pt-36 pb-16"
      } px-4 sm:px-6 lg:px-8`}
    >
      <div className="pointer-events-none absolute -top-24 left-[-4rem] h-72 w-72 rounded-full bg-[#6100FF]/25 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-[-3rem] h-80 w-80 rounded-full bg-[#2ACCED]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[#B630F4]/15 blur-3xl" />

      <div className="relative container mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-purple-200 light:text-purple-700">
          <Sparkles className="h-3 w-3 text-[#2ACCED]" />
          SLEEKNIT
        </span>

        <p className="font-cormorant mt-6 text-[6.5rem] leading-none font-semibold sm:text-[8rem] bg-gradient-to-r from-[#2ACCED] via-[#B630F4] to-[#6100FF] bg-clip-text text-transparent">
          {isError ? "Oops" : "404"}
        </p>

        <h1 className="font-cormorant mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold text-white light:text-gray-900">
          {isError ? "This look didn’t load" : "This piece left the rack"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-gray-400 light:text-gray-500 leading-relaxed">
          {isError
            ? "Something went wrong while we were styling this page. Try again, or head back to the marketplace."
            : "The page you’re looking for isn’t in the collection. It may have been moved, sold, or never tailored. Let’s get you back to something that fits."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {isError && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#2ACCED] to-[#B630F4] hover:opacity-90 shadow-lg shadow-purple-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
          )}
          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${
              isError
                ? "border border-purple-400/40 text-white light:text-gray-900 hover:bg-white/10 light:hover:bg-gray-100"
                : "text-white bg-gradient-to-r from-[#2ACCED] to-[#B630F4] hover:opacity-90 shadow-lg shadow-purple-500/20"
            }`}
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/hotdeals"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-purple-400/40 text-gray-200 light:text-gray-700 hover:text-white light:hover:text-gray-900 hover:bg-white/10 light:hover:bg-gray-100"
          >
            <Shirt className="h-4 w-4 text-[#2ACCED]" />
            Shop hot deals
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-purple-500/20 bg-black/40 light:bg-purple-50 p-4 text-left transition-colors hover:border-purple-400/50 hover:bg-purple-950/30 light:hover:bg-purple-100"
            >
              <p className="text-sm font-medium text-white light:text-gray-900">{item.label}</p>
              <p className="mt-1 text-xs text-gray-500 light:text-gray-400">{item.hint}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/vendors"
          className="mt-8 inline-flex items-center gap-2 text-sm text-gray-400 light:text-gray-500 hover:text-[#2ACCED]"
        >
          <Store className="h-4 w-4" />
          Or explore vendor showrooms
          <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
