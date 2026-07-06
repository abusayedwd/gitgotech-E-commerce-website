"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ReportTargetType,
  useSubmitReportMutation,
} from "@/redux/features/report/reportSlice";

const TARGET_TYPE_OPTIONS: { value: ReportTargetType; label: string }[] = [
  { value: "USER", label: "User" },
  { value: "VENDOR", label: "Vendor" },
  { value: "SHOWROOM", label: "Showroom" },
  { value: "PRODUCT", label: "Product" },
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetLabel?: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  targetType: initialTargetType,
  targetId,
  targetLabel,
}: ReportModalProps) {
  const [targetType, setTargetType] = useState<ReportTargetType>(initialTargetType);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitReport, { isLoading }] = useSubmitReportMutation();

  useEffect(() => {
    if (isOpen) {
      setTargetType(initialTargetType);
      setReason("");
      setDescription("");
    }
  }, [isOpen, initialTargetType]);

  if (!isOpen || !targetId) return null;

  const handleClose = () => {
    setReason("");
    setDescription("");
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 3) {
      toast.error("Reason must be at least 3 characters");
      return;
    }
    if (trimmedReason.length > 200) {
      toast.error("Reason must be 200 characters or less");
      return;
    }
    if (description.length > 2000) {
      toast.error("Description must be 2000 characters or less");
      return;
    }

    try {
      await submitReport({
        targetType,
        targetId,
        reason: trimmedReason,
        ...(description.trim() ? { description: description.trim() } : {}),
      }).unwrap();
      toast.success("Report submitted successfully");
      handleClose();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to submit report");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md bg-gray-900 border border-purple-500/30 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Report</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-purple-400 text-sm mb-4 text-center">
          Your report will go to admin
          {targetLabel ? ` — ${targetLabel}` : ""}
        </p>

        <label className="block text-sm text-gray-300 mb-2">Target Type *</label>
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value as ReportTargetType)}
          className="w-full px-3 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {TARGET_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="block text-sm text-gray-300 mb-2">Reason *</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason (3–200 characters)"
          maxLength={200}
          className="w-full px-3 py-2 mb-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label className="block text-sm text-gray-300 mb-2">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={4}
          maxLength={2000}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-4"
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
