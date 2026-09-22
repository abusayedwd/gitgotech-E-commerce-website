'use client';

import { useGetHomeCategoriesQuery } from '@/redux/features/home/homeSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import url from '@/redux/api/baseUrl';

const gradients = [
  'from-purple-600 to-blue-500',
  'from-pink-500 to-rose-400',
  'from-green-500 to-teal-400',
  'from-orange-500 to-yellow-400',
  'from-blue-600 to-cyan-400',
  'from-indigo-600 to-purple-400',
  'from-red-500 to-orange-400',
  'from-teal-500 to-green-400',
];

type Category = {
  _id: string;
  name: string;
  image?: string;
};

export default function CategoryMarquee() {
  const router = useRouter();

  const { data: categoriesRes, isLoading } = useGetHomeCategoriesQuery({});
  const categories: Category[] = categoriesRes?.data ?? [];
  // console.log(categories)

  // For a seamless `translateX(-50%)` loop the track must be split into two
  // IDENTICAL halves, and each half must be at least as wide as the viewport
  // — otherwise a blank gap appears at the end while the second half hasn't
  // slid in yet. We measure the viewport on mount + resize, then compute how
  // many copies of `categories` each half needs to fully cover it.
  // ITEMS_PER_HALF_MIN is a floor for SSR / very small viewports.
  const ITEMS_PER_HALF_MIN = 10;
  // ~144px per item at lg sizing (w-32 + mx-4) — slightly under-estimate so
  // we err on the side of "too many copies" rather than too few.
  const ITEM_PX_ESTIMATE = 144;

  const [viewportItemsNeeded, setViewportItemsNeeded] = useState(0);
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth || 0;
      // +2 buffer so a partial item at the edge doesn't reveal a gap.
      setViewportItemsNeeded(Math.ceil(vw / ITEM_PX_ESTIMATE) + 2);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  if (isLoading || categories.length === 0) return null;

  const itemsPerHalf = Math.max(ITEMS_PER_HALF_MIN, viewportItemsNeeded);
  const copiesPerHalf = Math.max(
    1,
    Math.ceil(itemsPerHalf / categories.length),
  );
  const half: Category[] = Array.from(
    { length: copiesPerHalf },
    () => categories,
  ).flat();
  const repeated: Category[] = [...half, ...half];

  return (
    <div className="py-8 sm:py-10 md:py-12 mt-4 sm:mt-6 md:mt-8 overflow-hidden">
      {/* marquee track — no container/mx-auto so width is unconstrained */}
      <div className="animate-marquee">
        {repeated.map((category, index) => {
          const imageUrl = category.image
            ? `${url}/${category.image}`
            : null;

          return (
            <div
              key={`${category._id}-${index}`}
              onClick={() =>
                router.push(`/category/${encodeURIComponent(category.name.toLowerCase())}`)
              }
              className="flex-shrink-0 mx-2 sm:mx-3 md:mx-4 group cursor-pointer"
            >
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                  !imageUrl ? `bg-gradient-to-br ${gradients[index % gradients.length]}` : ''
                }`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold uppercase">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              <p className="text-white light:text-gray-900 text-center mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-medium capitalize">
                {category.name}
              </p>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
