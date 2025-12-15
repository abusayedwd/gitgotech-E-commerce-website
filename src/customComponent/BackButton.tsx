"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackUrl?: string;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export default function BackButton({ 
  fallbackUrl = '/', 
  label = 'Back',
  className = 'cursor-pointer',
  showIcon = true
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to fallback URL
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors group ${className}`}
    >
      {showIcon && (
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      )}
      <span className="font-medium">{label}</span>
    </button>
  );
}
