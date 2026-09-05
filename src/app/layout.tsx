import Providers from "@/redux/Providers";
import ToastProvider from "@/components/ToastProvider";
import { FilterProvider } from "@/context/FilterContext";
import { SupportModalProvider } from "@/context/SupportModalContext";
import { PrivacyTermsModalProvider } from "@/context/PrivacyTermsModalContext";
import { SocketProvider } from "@/components/providers/SocketProvider";
import FcmTokenSync from "@/components/providers/FcmTokenSync";
import TokenExpiredModal from "@/components/providers/TokenExpiredModal";
import PrivacyTermsModal from "@/components/providers/PrivacyTermsModal";
import ToastErrorGuard from "@/components/providers/ToastErrorGuard";

import JsonLd from "@/components/shared/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  KEYWORDS,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
} from "@/lib/seo";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/customComponent/ConditionalLayout";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: { icon: DEFAULT_OG_IMAGE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cormorantGaramond.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} antialiased`}
        suppressHydrationWarning>
        <Providers>
          <ToastErrorGuard />
          <FcmTokenSync />
          <TokenExpiredModal />
          <SupportModalProvider>
            <PrivacyTermsModalProvider>
              <Suspense fallback={null}>
                <FilterProvider>
                  <SocketProvider>
                    <ConditionalLayout>{children}</ConditionalLayout>
                  </SocketProvider>
                </FilterProvider>
              </Suspense>
              <PrivacyTermsModal />
            </PrivacyTermsModalProvider>
          </SupportModalProvider>
        </Providers>
        <ToastProvider />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
