'use client';

import BannerSection from '@/components/Banner';
import { Button } from 'antd';
import { ArrowRight, Code, Smartphone, Cloud, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
         <BannerSection />
    </div>
  );
}