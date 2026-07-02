 

import Providers from "@/redux/Providers";
import ToastProvider from "@/components/ToastProvider";
import { FilterProvider } from "@/context/FilterContext";
import { SupportModalProvider } from "@/context/SupportModalContext";
import { SocketProvider } from "@/components/providers/SocketProvider";
import FcmTokenSync from "@/components/providers/FcmTokenSync";

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
  title: "Sleeknit - Digital Solutions for Your Business",
  description:
    "Transform your digital presence with cutting-edge web and app development",
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
  suppressHydrationWarning
      >
        <Providers>
          <FcmTokenSync />
          <SupportModalProvider>
             <Suspense fallback={null}>
      <FilterProvider>
        <SocketProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </SocketProvider>
      </FilterProvider>
    </Suspense>
          </SupportModalProvider>
        </Providers>
        <ToastProvider />
      </body>
    </html>
  );
}