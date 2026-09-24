"use client";

import FallbackScreen from "@/components/shared/FallbackScreen";
import { cormorantGaramond } from "@/lib/fonts";
import { useEffect } from "react";
import "./globals.css";

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
