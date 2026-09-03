"use client";

import FallbackScreen from "@/components/shared/FallbackScreen";
import { Cormorant_Garamond } from "next/font/google";
import { useEffect } from "react";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={cormorantGaramond.variable}>
      <body className={`${cormorantGaramond.variable} bg-black text-white antialiased`}>
        <FallbackScreen variant="error" standalone onRetry={reset} />
      </body>
    </html>
  );
}
