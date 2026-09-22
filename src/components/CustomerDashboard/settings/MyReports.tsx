"use client";

import {
  useGetMyReportByIdQuery,
  useGetMyReportsQuery,
} from "@/redux/features/report/reportSlice";
import { Flag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const statusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30 light:bg-yellow-50 light:text-yellow-700 light:border-yellow-300";
    case "DISMISSED":
      return "text-gray-400 bg-gray-500/10 border-gray-500/30 light:bg-gray-50 light:text-gray-700 light:border-gray-300";
    case "RESOLVED":
    case "APPROVED":
      return "text-green-400 bg-green-500/10 border-green-500/30 light:bg-green-50 light:text-green-700 light:border-green-300";
    default:
      return "text-purple-400 bg-purple-500/10 border-purple-500/30 light:bg-purple-50 light:text-purple-700 light:border-purple-300";
  }
};

export default function MyReportsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyReportsQuery({ page, limit: 10 });
  const { data: detailData, isLoading: detailLoading } = useGetMyReportByIdQuery(
    selectedReportId || "",
    { skip: !selectedReportId },
  );

  const reports = data?.data?.data || [];
  const meta = data?.data?.meta;
  const reportDetail = detailData?.data;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen mt-16 md:mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black light:from-white light:via-purple-50 light:to-white text-white light:text-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] flex items-center justify-center">
              <FaArrowLeft className="text-black" />
            </div>
          </button>
          <h1 className="text-[32px] font-semibold text-gray-300 light:text-gray-700 font-cormorant">
            My Reports
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 text-gray-400 light:text-gray-500">
            <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reports submitted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report: any) => (
              <button
                key={report._id}
                type="button"
                onClick={() => setSelectedReportId(report._id)}
                className="w-full text-left bg-[#1B1B1F] light:bg-white border border-gray-700/50 light:border-gray-200 rounded-xl p-4 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-white light:text-gray-900 capitalize">
                      {report.targetType?.toLowerCase()} report
                    </p>
                    <p className="text-sm text-gray-400 light:text-gray-500 truncate mt-1">
                      {report.reason}
                    </p>
                    <p className="text-xs text-gray-500 light:text-gray-400 mt-2">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${statusColor(report.status)}`}
                  >
                    {report.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-800 light:bg-gray-200 rounded-lg disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-4 py-2 text-gray-400 light:text-gray-500">
              {page} / {meta.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-800 light:bg-gray-200 rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedReportId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-gray-900 border border-purple-500/30 rounded-xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Report Details</h3>
              <button
                type="button"
                onClick={() => setSelectedReportId(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reportDetail ? (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="text-white capitalize">
                    {reportDetail.targetType?.toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Reason</p>
                  <p className="text-white">{reportDetail.reason}</p>
                </div>
                {reportDetail.description && (
                  <div>
                    <p className="text-gray-400">Description</p>
                    <p className="text-white">{reportDetail.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Status</p>
                  <span
                    className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full border capitalize ${statusColor(reportDetail.status)}`}
                  >
                    {reportDetail.status}
                  </span>
                </div>
                {reportDetail.adminNote && (
                  <div>
                    <p className="text-gray-400">Admin note</p>
                    <p className="text-white">{reportDetail.adminNote}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Submitted</p>
                  <p className="text-white">
                    {formatDate(reportDetail.createdAt)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                Could not load report details
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
