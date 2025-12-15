import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RouteConditionalNav from "@/customComponent/RouteConditionalNav";
import Providers from "@/redux/Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitGoTech - Digital Solutions for Your Business",
  description:
    "Transform your digital presence with cutting-edge web and app development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <RouteConditionalNav />
        <main className="">
          <Providers>{children}</Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}
