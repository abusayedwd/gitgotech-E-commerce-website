"use client";

import React, { useMemo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductReviewsQuery } from "@/redux/features/review/reviewSlice";

type ApiReviewRow = {
  _id: string;
  createdAt?: string;
  product?: {
    rating?: number;
    comment?: string;
    id?: string;
  };
};

export default function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const { data: reviewsData, isLoading, isFetching } = useGetProductReviewsQuery(
    { id: productId!, page: 1, limit: 10 },
    { skip: !productId },
  );

  const reviews = useMemo(() => {
    const raw = (reviewsData as { data?: { data?: ApiReviewRow[] } } | undefined)?.data
      ?.data;
    return Array.isArray(raw) ? raw : [];
  }, [reviewsData]);

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className={`w-5 h-5 ${filled ? "text-yellow-400" : "text-gray-600"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  const loading = isLoading || isFetching;

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black light:from-white light:via-purple-50 light:to-white text-white light:text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="container mx-auto flex mb-6 items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
              <FaArrowLeft className="text-black" />
            </div>
          </button>
          <h1 className="text-[32px] font-semibold text-gray-300 light:text-gray-700 font-cormorant">
            Product reviews
          </h1>
        </div>

        {!productId && (
          <p className="text-gray-400 light:text-gray-500 text-sm">
            No product selected. Open reviews from a product page.
          </p>
        )}

        {productId && loading && (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {productId && !loading && reviews.length === 0 && (
          <p className="text-gray-400 light:text-gray-500 text-sm">No product reviews yet.</p>
        )}

        {productId && !loading && reviews.length > 0 && (
          <div className="space-y-6">
            {reviews.map((row) => {
              const rating = Math.min(
                5,
                Math.max(0, Math.round(Number(row.product?.rating ?? 0))),
              );
              const message = (row.product?.comment ?? "").trim() || "—";

              return (
                <div
                  key={row._id}
                  className="bg-gray-900 light:bg-white rounded-lg p-6 border border-gray-800 light:border-gray-200"
                >
                  <p className="text-xs text-gray-500 light:text-gray-400 uppercase tracking-wide mb-3">
                    Product rating
                  </p>
                  <div className="flex gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} filled={star <= rating} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 light:text-gray-400 uppercase tracking-wide mb-2">
                    Message
                  </p>
                  <p className="text-gray-300 light:text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
