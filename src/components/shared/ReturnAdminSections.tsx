"use client";

import { formatStatusLabel, statusBadgeClass } from "@/lib/orderStatus";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export type ReturnProductRef =
  | string
  | { _id?: string; product_name?: string; product_images?: string[] };

export type ReturnAdminFields = {
  customerReason?: string;
  vendorReview?: {
    decision?: string;
    reason?: string;
    reviewedAt?: string;
  };
  adminReview?: {
    status?: string;
    assignedTo?: string;
    assignedAt?: string;
    completedAt?: string;
  };
  adminDecision?: {
    decision?: string;
    reason?: string;
    decidedAt?: string;
    decidedBy?: string;
  };
  productOwnership?: string;
};

export type ReturnDeliveryRequest = {
  canCreate?: boolean;
  reason?: string | null;
  role?: string;
  purpose?: string;
  payer?: string;
  requiresDeliveryAddress?: boolean;
  existingRequestId?: string | null;
  eligibleItems?: {
    orderProductId?: string;
    product?: ReturnProductRef;
    sizeType?: string;
    quantity?: number;
    location?: string;
    itemStatus?: string;
  }[];
};

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Row({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-400 light:text-gray-500 text-sm shrink-0">{label}</span>
      <span className="text-white light:text-gray-900 font-medium text-sm text-right break-all">
        {value}
      </span>
    </div>
  );
}

export function getReturnProductId(product?: ReturnProductRef) {
  if (!product) return "";
  if (typeof product === "string") return product;
  return product._id || "";
}

export function getReturnProductName(product?: ReturnProductRef, fallback = "Returned product") {
  if (!product) return fallback;
  if (typeof product === "string") return fallback;
  return product.product_name || fallback;
}

export function getReturnProductImage(product?: ReturnProductRef) {
  if (!product || typeof product === "string") return "";
  return product.product_images?.[0] || "";
}

export function canCreateReturnDelivery(request?: ReturnDeliveryRequest | null) {
  return (
    request?.canCreate === true && (request.eligibleItems?.length ?? 0) > 0
  );
}

export function hasAdminReview(item: ReturnAdminFields) {
  return Boolean(item.adminReview || item.adminDecision || item.productOwnership);
}

function ownershipHint(ownership?: string) {
  const key = (ownership || "").trim().toUpperCase();
  if (key === "VENDOR") return "Vendor recovers the product";
  if (key === "CUSTOMER") return "Customer keeps the product";
  return "";
}

export function ReturnReviewTrail({ item }: { item: ReturnAdminFields }) {
  const steps = [
    item.customerReason
      ? { label: "Customer", value: "Requested" }
      : null,
    item.vendorReview?.decision
      ? { label: "Vendor", value: item.vendorReview.decision }
      : null,
    item.adminDecision?.decision || item.adminReview?.status
      ? {
          label: "Admin",
          value: item.adminDecision?.decision || item.adminReview?.status,
        }
      : null,
    item.productOwnership
      ? { label: "Ownership", value: item.productOwnership }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  if (steps.length < 2) return null;

  return (
    <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 light:bg-purple-50 p-3">
      <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400 mb-3">
        Review path
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={`${step.label}-${index}`} className="flex items-center gap-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 light:text-gray-400">
                {step.label}
              </p>
              <span
                className={`inline-flex mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(step.value, "chip")}`}
              >
                {formatStatusLabel(step.value)}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="text-gray-600 light:text-gray-400 pb-1">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReturnAdminReviewCards({ item }: { item: ReturnAdminFields }) {
  if (!hasAdminReview(item)) return null;

  return (
    <div className="space-y-3">
      {item.adminReview && (
        <div className="rounded-lg border border-gray-800 light:border-gray-200 p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Admin review
            </p>
            {item.adminReview.status && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.adminReview.status, "chip")}`}
              >
                {formatStatusLabel(item.adminReview.status)}
              </span>
            )}
          </div>
          <Row label="Assigned" value={formatDate(item.adminReview.assignedAt)} />
          <Row label="Completed" value={formatDate(item.adminReview.completedAt)} />
        </div>
      )}

      {item.adminDecision && (
        <div className="rounded-lg border border-purple-500/20 bg-purple-950/10 light:bg-purple-50 p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400">
              Admin decision
            </p>
            {item.adminDecision.decision && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.adminDecision.decision, "chip")}`}
              >
                {formatStatusLabel(item.adminDecision.decision)}
              </span>
            )}
          </div>
          <Row label="Reason" value={item.adminDecision.reason} />
          <Row label="Decided" value={formatDate(item.adminDecision.decidedAt)} />
        </div>
      )}

      {item.productOwnership && (
        <div className="rounded-lg border border-gray-800 light:border-gray-200 p-3 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400">
              Product ownership
            </p>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.productOwnership, "chip")}`}
            >
              {formatStatusLabel(item.productOwnership)}
            </span>
          </div>
          {ownershipHint(item.productOwnership) && (
            <p className="text-sm text-gray-300 light:text-gray-600">
              {ownershipHint(item.productOwnership)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
