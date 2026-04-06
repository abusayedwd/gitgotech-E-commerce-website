'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/landingPage/Navbar";
import Footer from "@/components/landingPage/Footer";
import RouteConditionalNav from "@/customComponent/RouteConditionalNav";
import SupportMessage from "@/components/landingPage/SupportMessage";

export default function ConditionalLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
const isDashboardRoute =
  pathname?.startsWith('/vendor-dashboard') ||
  pathname?.startsWith('/messaging');


  if (isDashboardRoute) {
    // Only return children for vendor dashboard (no navbar, footer)
    return <>
    <Navbar />
    {children}
    <SupportMessage />
    </>;
  }

  // Return full layout with navbar and footer for other routes
  return (
    <>
      <Navbar />
      <RouteConditionalNav />
      <main className="">
        {children}
      </main>
      <Footer />
      <SupportMessage />
    </>
  );
}