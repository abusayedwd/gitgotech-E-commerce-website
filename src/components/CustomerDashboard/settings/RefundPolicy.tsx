"use client";

import { useGetRefundPolicyQuery } from "@/redux/features/settings/settingsSlice";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function RefundPolicyPage() {
  const router = useRouter();
  const { data: refundData, isLoading, isError } = useGetRefundPolicyQuery({});

  const refundInfo = refundData?.data;

  return (
    <div className="min-h-screen md:mt-24 mt-12 bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="container mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
              <FaArrowLeft className="text-black" />
            </div>
          </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">
            Refund Policy
          </h1>
        </div>

        {refundInfo?.updatedAt && (
          <div className="my-6">
            <p className="text-sm text-gray-400">
              Last Updated:{" "}
              {new Date(refundInfo.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/20 border-2 border-blue-500/50 rounded-3xl p-6 md:p-10 backdrop-blur-sm mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-400">Loading refund policy...</span>
            </div>
          ) : isError ? (
            <p className="text-red-400 text-center py-8">
              Failed to load refund policy.
            </p>
          ) : (
            <div className="overflow-y-auto pr-2 custom-scrollbar">
              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{
                  __html:
                    refundInfo?.value ||
                    refundInfo?.content ||
                    "No refund policy content available.",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
