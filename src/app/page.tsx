'use client';

import BannerSection from '@/components/Banner';
import CategoryMarquee from '@/components/CategoryMarquee';
import HotDealsSection from '@/components/HotDeals';
import TopRated from '@/components/TopRated';
 
import { Button } from 'antd';
import { ArrowRight, Code, Smartphone, Cloud, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="">
         <BannerSection />
         {/* <CategoryMarquee /> */}
         <HotDealsSection />
         <TopRated />
       
    </div>
  );
}