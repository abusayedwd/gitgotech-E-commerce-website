"use client";

import { useGetReportsOnMyEntitiesQuery } from "@/redux/features/report/reportSlice";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import { Flag, User, X } from "lucide-react";
import { useState } from "react";

type VendorReport = {
  _id: string;
  targetType: string;
  targetId: string;
  reason: string;
  description?: string;
  status: string;
  adminAction?: string;
  createdAt: string;
  reporterDetails?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
};

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

export default function VendorReportsPage() {
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<VendorReport | null>(
    null,
  );

  const { data, isLoading } = useGetReportsOnMyEntitiesQuery({
    page,
    limit: 10,
  });

  const reports: VendorReport[] = data?.data?.data || [];
  const meta = data?.data?.meta;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-cormorant font-semibold text-white light:text-gray-900">
          Reports on My Entities
        </h1>
        <p className="text-gray-400 light:text-gray-500 text-sm mt-2">
          Reports filed against your products and showrooms by customers.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 text-gray-400 light:text-gray-500 bg-[#2E2E34] light:bg-gray-50 rounded-xl border border-gray-800 light:border-gray-200">
          <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No reports on your entities yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const reporter = report.reporterDetails;
            const reporterImage = buildImageUrl(reporter?.image);

            return (
              <button
                key={report._id}
                type="button"
                onClick={() => setSelectedReport(report)}
                className="w-full text-left bg-[#2E2E34] light:bg-white border border-gray-800 light:border-gray-200 rounded-xl p-4 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 light:bg-gray-100 border border-gray-700 light:border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                    {reporterImage ? (
                      <img
                        src={reporterImage}
                        alt={reporter?.name || "Reporter"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-white light:text-gray-900 capitalize">
                          {report.targetType?.toLowerCase()} report
                        </p>
                        <p className="text-sm text-gray-400 light:text-gray-500 truncate mt-1">
                          {report.reason}
                        </p>
                        {reporter?.name && (
                          <p className="text-xs text-gray-500 light:text-gray-400 mt-1">
                            By {reporter.name}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 light:text-gray-400 mt-1">
                          {formatDate(report.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${statusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
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

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-gray-900 border border-purple-500/30 rounded-xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Report Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {selectedReport.reporterDetails && (
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center shrink-0">
                    {buildImageUrl(selectedReport.reporterDetails.image) ? (
                      <img
                        src={buildImageUrl(selectedReport.reporterDetails.image)}
                        alt={selectedReport.reporterDetails.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {selectedReport.reporterDetails.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {selectedReport.reporterDetails.email}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-gray-400">Reported entity</p>
                <p className="text-white capitalize">
                  {selectedReport.targetType?.toLowerCase()}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Reason</p>
                <p className="text-white">{selectedReport.reason}</p>
              </div>

              {selectedReport.description && (
                <div>
                  <p className="text-gray-400">Description</p>
                  <p className="text-white">{selectedReport.description}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400">Status</p>
                <span
                  className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full border capitalize ${statusColor(selectedReport.status)}`}
                >
                  {selectedReport.status}
                </span>
              </div>

              {selectedReport.adminAction &&
                selectedReport.adminAction !== "NONE" && (
                  <div>
                    <p className="text-gray-400">Admin action</p>
                    <p className="text-white capitalize">
                      {selectedReport.adminAction?.toLowerCase()}
                    </p>
                  </div>
                )}

              <div>
                <p className="text-gray-400">Reported on</p>
                <p className="text-white">
                  {formatDate(selectedReport.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
