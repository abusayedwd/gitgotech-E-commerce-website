"use client";

import ApplyForm from '@/components/landingPage/career/ApplyForm';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApplyJobPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black">
    

      {/* Application Form */}
      <div className="pb-12">
        <ApplyForm />
      </div>
    </div>
  );
}
