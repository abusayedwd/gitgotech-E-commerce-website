"use client";

import { showApiErrorToast } from "@/lib/apiErrorToast";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import { formatStatusLabel, statusBadgeClass as sharedStatusBadgeClass } from "@/lib/orderStatus";
import {
  ReturnAdminReviewCards,
  ReturnReviewTrail,
  getReturnProductId,
  getReturnProductImage,
  getReturnProductName,
  type ReturnDeliveryRequest,
} from "@/components/shared/ReturnAdminSections";
import ReturnDeliveryRequestPanel from "@/components/shared/ReturnDeliveryRequestPanel";
import {
  useGetReturnDetailsQuery,
  useInspectReturnOrderMutation,
  useReturnOrderActionMutation,
  useReviewReturnOrderMutation,
} from "@/redux/features/vendor/order/orderSlice";
import { selectShowroomId } from "@/redux/features/vendor/showroomSlice/selectedShowroomSlice";
import {
  ArrowLeft,
  ClipboardCheck,
  History,
  MapPin,
  Package,
  SearchCheck,
  Store,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const TRACKING_PREVIEW_COUNT = 3;

const ACCEPT_DECLINE_STATUSES = new Set(["Return Order Placed"]);

type ReviewDecision = "APPROVED" | "REJECTED";
type InspectResult = "PASSED" | "FAILED";

const TERMINAL_STATUSES = new Set([
  "Completed",
  "Refund Paid",
  "Vendor Approved",
  "Vendor Rejected",
  "Return Declined",
  "Rejected",
]);

type ContactInfo = {
  name?: string;
  address?: string;
  country?: string;
  state?: string;
  zipcode?: number | string;
  email?: string;
  phone?: number | string;
  location?: { type?: string; coordinates?: number[] };
};

type SizePricing = {
  originalUnitPrice?: number;
  paidUnitPrice?: number;
  totalPaidPrice?: number;
};

type OrderProduct = {
  _id?: string;
  product?: string | { _id?: string; product_name?: string; product_images?: string[] };
  sizes?: { type?: string; quantity?: number; pricing?: SizePricing }[];
  productSnapshot?: {
    name?: string;
    thumbnail?: string;
    category?: string;
  };
};

type ReturnItem = {
  orderProductId?: string;
  product?: string | { _id?: string; product_name?: string; product_images?: string[] };
  sizeType?: string;
  quantity?: number;
  customerReason?: string;
  attachments?: string[];
  refundLine?: {
    productId?: string;
    paidUnitPrice?: number;
    refundAmount?: number;
  };
  holdAmount?: number;
  holdStatus?: string;
  itemStatus?: string;
  holdConsumed?: boolean;
  refundConsumed?: boolean;
  vendorReview?: {
    decision?: string;
    reason?: string;
    reviewedAt?: string;
    reviewedBy?: string;
  };
  inspection?: {
    result?: string;
    reason?: string;
    inspectedAt?: string;
    inspectedBy?: string;
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

type TrackingEvent = {
  _id?: string;
  status: string;
  message?: string;
  createdAt?: string;
};

type ReturnDetailsData = {
  _id: string;
  order?: {
    _id?: string;
    products?: OrderProduct[];
    trackingNumber?: number | string;
  };
  showroom?: {
    _id?: string;
    showroom_name?: string;
  };
  items?: ReturnItem[];
  attachment?: string[];
  vendorReason?: string | null;
  status?: string;
  trackingNumber?: number | string;
  price?: {
    unit?: string;
    amount?: number;
    tip?: number;
    deliveryCharge?: number;
  };
  deliveryInfo?: ContactInfo;
  pickUpInfo?: ContactInfo;
  tracking?: TrackingEvent[];
  deliveryRequest?: ReturnDeliveryRequest | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  status?: number;
  message?: string;
  data?: T;
};

function formatMoney(amount: number | undefined, unit = "ghs") {
  const value = Number(amount ?? 0);
  const code = (unit || "ghs").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(value);
  } catch {
    return `${code} ${value.toFixed(2)}`;
  }
}

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

function getApiMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const direct = (payload as { message?: unknown }).message;
  if (typeof direct === "string" && direct.trim()) return direct;
  const nested = (payload as { data?: { message?: unknown } }).data?.message;
  if (typeof nested === "string" && nested.trim()) return nested;
  return fallback;
}

function getProductId(product?: OrderProduct["product"]) {
  if (!product) return "";
  if (typeof product === "string") return product;
  return product._id || "";
}

function findOrderProduct(orderProducts: OrderProduct[] | undefined, productId?: string) {
  if (!orderProducts || !productId) return undefined;
  return orderProducts.find((item) => getProductId(item.product) === productId);
}

function normalizeReturnStatus(status?: string) {
  return (status || "").trim();
}

function isPendingReturn(status?: string) {
  return /^pending$/i.test(normalizeReturnStatus(status));
}

function isReturnReceived(status?: string) {
  return /^return received$/i.test(normalizeReturnStatus(status));
}

function itemsAlreadyReviewed(items: ReturnItem[] = []) {
  return items.some((item) => Boolean(item.vendorReview?.decision));
}

function vendorCanSubmitItemReview(status?: string, items: ReturnItem[] = []) {
  if (!isPendingReturn(status)) return false;
  return items.length > 0;
}

function isReviewApprovedItem(item: ReturnItem) {
  const decision = (item.vendorReview?.decision || "").trim().toUpperCase();
  const itemStatus = (item.itemStatus || "").trim().toUpperCase();
  return decision === "APPROVED" || itemStatus === "APPROVED";
}

function getReviewApprovedItems(items: ReturnItem[] = []) {
  return items.filter(isReviewApprovedItem);
}

function vendorCanInspectReturn(status?: string, items: ReturnItem[] = []) {
  if (!isReturnReceived(status)) return false;
  return getReviewApprovedItems(items).length > 0;
}

function vendorCanAcceptDecline(status?: string, items: ReturnItem[] = []) {
  const current = normalizeReturnStatus(status);
  if (isPendingReturn(current)) return false;
  if (TERMINAL_STATUSES.has(current)) return false;
  if (itemsAlreadyReviewed(items)) return false;
  return ACCEPT_DECLINE_STATUSES.has(current);
}

function getItemOrderProductId(item: ReturnItem) {
  return item.orderProductId || getReturnProductId(item.product) || getProductId(item.product);
}

function statusBadgeClass(status?: string) {
  return sharedStatusBadgeClass(status, "chip");
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) {
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

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-gradient-to-tr from-[#05011a] via-[#090322] to-[#05011a] light:from-white light:via-purple-50 light:to-white border border-gray-800 light:border-gray-200 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-5 border-b border-gray-700/50 light:border-gray-200 pb-3 flex items-center gap-2 text-white light:text-gray-900">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function AddressBlock({ info }: { info?: ContactInfo }) {
  if (!info) {
    return <p className="text-sm text-gray-500 light:text-gray-400">No address on this return.</p>;
  }

  const location = [info.address, info.state, info.country, info.zipcode]
    .filter(
      (part) =>
        part !== undefined &&
        part !== null &&
        String(part).trim() &&
        String(part) !== "0" &&
        String(part).toUpperCase() !== "N/A",
    )
    .join(", ");

  return (
    <div className="space-y-3">
      <DetailRow label="Name" value={info.name} />
      <DetailRow label="Email" value={info.email} />
      <DetailRow label="Phone" value={info.phone} />
      <DetailRow label="Address" value={location || info.address} />
    </div>
  );
}

function TrackingBlock({ events }: { events: TrackingEvent[] }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...events].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
  const canToggle = sorted.length > TRACKING_PREVIEW_COUNT;
  const visible =
    expanded || !canToggle
      ? sorted
      : sorted.slice(-TRACKING_PREVIEW_COUNT);

  if (sorted.length === 0) {
    return <p className="text-sm text-gray-500 light:text-gray-400">No tracking updates yet.</p>;
  }

  return (
    <div>
      <ol>
        {visible.map((event, index) => {
          const isLast = index === visible.length - 1;
          return (
            <li
              key={event._id || `${event.status}-${event.createdAt}`}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                    isLast ? "bg-purple-400" : "bg-green-400/80"
                  }`}
                />
                {!isLast && <span className="w-px flex-1 bg-gray-700/80 light:bg-gray-300 my-1" />}
              </div>
              <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-4"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(event.status)}`}
                  >
                    {event.status}
                  </span>
                  {event.createdAt && (
                    <span className="text-xs text-gray-500 light:text-gray-400">
                      {formatDate(event.createdAt)}
                    </span>
                  )}
                </div>
                {event.message && (
                  <p className="text-sm text-gray-300 light:text-gray-600 mt-1">{event.message}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {canToggle && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="mt-4 text-sm text-purple-300 light:text-purple-600 hover:text-purple-200 light:hover:text-purple-700 font-medium"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}

function ReturnItemCard({
  item,
  snapshot,
  unit,
}: {
  item: ReturnItem;
  snapshot?: OrderProduct["productSnapshot"];
  unit: string;
}) {
  const name =
    getReturnProductName(item.product, snapshot?.name || "Returned product");
  const image =
    getReturnProductImage(item.product) || snapshot?.thumbnail;

  return (
    <div className="rounded-xl border border-gray-800/80 light:border-gray-200 bg-black/20 light:bg-gray-50 p-4 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 light:bg-gray-100 flex items-center justify-center shrink-0">
          <img
            src={buildImageUrl(image, "/images/jacket.png")}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/jacket.png";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-white light:text-gray-900 truncate">{name}</p>
              {snapshot?.category && (
                <p className="text-xs text-gray-400 light:text-gray-500 mt-0.5">{snapshot.category}</p>
              )}
              <p className="text-sm text-gray-300 light:text-gray-600 mt-2">
                Size {item.sizeType || "—"} · Qty {item.quantity ?? 1}
              </p>
            </div>
            {item.itemStatus && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadgeClass(item.itemStatus)}`}
              >
                {formatStatusLabel(item.itemStatus)}
              </span>
            )}
          </div>
        </div>
      </div>

      <ReturnReviewTrail item={item} />

      {item.customerReason && (
        <div>
          <p className="text-xs text-gray-400 light:text-gray-500 mb-1">Customer reason</p>
          <p className="text-sm text-gray-200 light:text-gray-700">{item.customerReason}</p>
        </div>
      )}

      {item.attachments && item.attachments.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 light:text-gray-500 mb-2">Attachments</p>
          <div className="flex flex-wrap gap-2">
            {item.attachments.map((file) => (
              <a
                key={file}
                href={buildImageUrl(file, file)}
                target="_blank"
                rel="noreferrer"
                className="block w-16 h-16 rounded-lg overflow-hidden border border-gray-700 light:border-gray-300"
              >
                <img
                  src={buildImageUrl(file, "/images/jacket.png")}
                  alt={file}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/jacket.png";
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-gray-800 light:border-gray-200 p-3 space-y-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400">Refund</p>
          <DetailRow
            label="Paid unit"
            value={formatMoney(item.refundLine?.paidUnitPrice, unit)}
          />
          <DetailRow
            label="Refund"
            value={formatMoney(item.refundLine?.refundAmount, unit)}
          />
          <DetailRow
            label="Refunded"
            value={item.refundConsumed ? "Yes" : "No"}
          />
        </div>
        <div className="rounded-lg border border-gray-800 light:border-gray-200 p-3 space-y-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400">Hold</p>
          <DetailRow label="Amount" value={formatMoney(item.holdAmount, unit)} />
          {item.holdStatus && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-gray-400 light:text-gray-500 text-sm">Status</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.holdStatus)}`}
              >
                {formatStatusLabel(item.holdStatus)}
              </span>
            </div>
          )}
          <DetailRow
            label="Consumed"
            value={item.holdConsumed ? "Yes" : "No"}
          />
        </div>
      </div>

      {item.vendorReview && (
        <div className="rounded-lg border border-gray-800 light:border-gray-200 p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400">
              Vendor review
            </p>
            {item.vendorReview.decision && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.vendorReview.decision)}`}
              >
                {formatStatusLabel(item.vendorReview.decision)}
              </span>
            )}
          </div>
          <DetailRow label="Reason" value={item.vendorReview.reason} />
          <DetailRow
            label="Reviewed"
            value={formatDate(item.vendorReview.reviewedAt)}
          />
        </div>
      )}

      {item.inspection && (
        <div className="rounded-lg border border-gray-800 light:border-gray-200 p-3 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400">
              Inspection
            </p>
            {item.inspection.result && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.inspection.result)}`}
              >
                {formatStatusLabel(item.inspection.result)}
              </span>
            )}
          </div>
          <DetailRow label="Note" value={item.inspection.reason} />
          <DetailRow
            label="Inspected"
            value={formatDate(item.inspection.inspectedAt)}
          />
        </div>
      )}

      <ReturnAdminReviewCards item={item} />
    </div>
  );
}

type ReviewDraft = {
  key: string;
  orderProductId: string;
  decision: ReviewDecision | "";
  reason: string;
  name: string;
  image?: string;
  category?: string;
  sizeType?: string;
  quantity?: number;
  customerReason?: string;
};

function buildReviewDrafts(
  items: ReturnItem[],
  orderProducts: OrderProduct[] | undefined,
): ReviewDraft[] {
  return items.map((item, index) => {
    const matched = findOrderProduct(
      orderProducts,
      getItemOrderProductId(item),
    );
    const snapshot = matched?.productSnapshot;
    return {
      key: `${getItemOrderProductId(item)}-${item.sizeType || index}`,
      orderProductId: getItemOrderProductId(item),
      decision:
        item.vendorReview?.decision === "REJECTED"
          ? "REJECTED"
          : item.vendorReview?.decision === "APPROVED"
            ? "APPROVED"
            : "",
      reason: item.vendorReview?.reason || "",
      name: snapshot?.name || "Returned product",
      image: snapshot?.thumbnail,
      category: snapshot?.category,
      sizeType: item.sizeType,
      quantity: item.quantity,
      customerReason: item.customerReason,
    };
  });
}

function validateReviewDrafts(drafts: ReviewDraft[]) {
  if (drafts.length === 0) return "There are no items to review.";
  if (drafts.some((item) => !item.orderProductId)) {
    return "A returned item is missing its product id.";
  }
  if (drafts.some((item) => !item.decision)) {
    return "Choose Approve or Reject for every item.";
  }
  if (
    drafts.some(
      (item) => item.decision === "REJECTED" && !item.reason.trim(),
    )
  ) {
    return "Add a reason for every rejected item.";
  }
  return "";
}

function ReturnReviewModal({
  drafts,
  isSubmitting,
  error,
  onChange,
  onClose,
  onSubmit,
}: {
  drafts: ReviewDraft[];
  isSubmitting: boolean;
  error: string;
  onChange: (key: string, patch: Partial<ReviewDraft>) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0f] border border-purple-500/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-white">Review Return</h3>
            <p className="text-sm text-gray-400 mt-1">
              Approve or reject each item. A reason is required when you reject.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white text-2xl leading-none disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1 min-h-0">
          {drafts.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-gray-800 bg-black/20 p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                  <img
                    src={buildImageUrl(item.image, "/images/jacket.png")}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/jacket.png";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white truncate">{item.name}</p>
                  {item.category && (
                    <p className="text-xs text-gray-400">{item.category}</p>
                  )}
                  <p className="text-sm text-gray-300 mt-1">
                    Size {item.sizeType || "—"} · Qty {item.quantity ?? 1}
                  </p>
                </div>
              </div>

              {item.customerReason && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer reason</p>
                  <p className="text-sm text-gray-300">{item.customerReason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange(item.key, { decision: "APPROVED" })}
                  disabled={isSubmitting}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${
                    item.decision === "APPROVED"
                      ? "bg-green-600/20 border-green-500 text-green-300"
                      : "border-gray-700 text-gray-400 hover:border-green-500/50"
                  }`}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onChange(item.key, { decision: "REJECTED" })}
                  disabled={isSubmitting}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${
                    item.decision === "REJECTED"
                      ? "bg-red-600/20 border-red-500 text-red-300"
                      : "border-gray-700 text-gray-400 hover:border-red-500/50"
                  }`}
                >
                  Reject
                </button>
              </div>

              <textarea
                value={item.reason}
                onChange={(e) => onChange(item.key, { reason: e.target.value })}
                disabled={isSubmitting}
                placeholder={
                  item.decision === "REJECTED"
                    ? "Reason for rejecting this item"
                    : "Optional note"
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 resize-none h-20 text-sm disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3 shrink-0">{error}</p>
        )}

        <div className="flex gap-3 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit review"}
          </button>
        </div>
      </div>
    </div>
  );
}

type InspectDraft = {
  key: string;
  orderProductId: string;
  result: InspectResult | "";
  reason: string;
  name: string;
  image?: string;
  category?: string;
  sizeType?: string;
  quantity?: number;
  customerReason?: string;
};

function buildInspectDrafts(
  items: ReturnItem[],
  orderProducts: OrderProduct[] | undefined,
): InspectDraft[] {
  return getReviewApprovedItems(items).map((item, index) => {
    const matched = findOrderProduct(
      orderProducts,
      getItemOrderProductId(item),
    );
    const snapshot = matched?.productSnapshot;
    return {
      key: `${getItemOrderProductId(item)}-${item.sizeType || index}`,
      orderProductId: getItemOrderProductId(item),
      result:
        item.inspection?.result === "FAILED"
          ? "FAILED"
          : item.inspection?.result === "PASSED"
            ? "PASSED"
            : "",
      reason: item.inspection?.reason || "",
      name: snapshot?.name || "Returned product",
      image: snapshot?.thumbnail,
      category: snapshot?.category,
      sizeType: item.sizeType,
      quantity: item.quantity,
      customerReason: item.customerReason,
    };
  });
}

function validateInspectDrafts(drafts: InspectDraft[]) {
  if (drafts.length === 0) return "There are no review-approved items to inspect.";
  if (drafts.some((item) => !item.orderProductId)) {
    return "A returned item is missing its product id.";
  }
  if (drafts.some((item) => !item.result)) {
    return "Choose Passed or Failed for every item.";
  }
  if (drafts.some((item) => item.result === "FAILED" && !item.reason.trim())) {
    return "Add a reason for every failed item.";
  }
  return "";
}

function ReturnInspectModal({
  drafts,
  isSubmitting,
  error,
  onChange,
  onClose,
  onSubmit,
}: {
  drafts: InspectDraft[];
  isSubmitting: boolean;
  error: string;
  onChange: (key: string, patch: Partial<InspectDraft>) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0f] border border-purple-500/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-white">Inspect Return</h3>
            <p className="text-sm text-gray-400 mt-1">
              Inspect only the products that passed vendor review. Mark each as
              passed or failed. A reason is required when an item fails
              inspection.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white text-2xl leading-none disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1 flex-1 min-h-0">
          {drafts.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-gray-800 bg-black/20 p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                  <img
                    src={buildImageUrl(item.image, "/images/jacket.png")}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/jacket.png";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white truncate">{item.name}</p>
                  {item.category && (
                    <p className="text-xs text-gray-400">{item.category}</p>
                  )}
                  <p className="text-sm text-gray-300 mt-1">
                    Size {item.sizeType || "—"} · Qty {item.quantity ?? 1}
                  </p>
                </div>
              </div>

              {item.customerReason && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer reason</p>
                  <p className="text-sm text-gray-300">{item.customerReason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange(item.key, { result: "PASSED" })}
                  disabled={isSubmitting}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${
                    item.result === "PASSED"
                      ? "bg-green-600/20 border-green-500 text-green-300"
                      : "border-gray-700 text-gray-400 hover:border-green-500/50"
                  }`}
                >
                  Passed
                </button>
                <button
                  type="button"
                  onClick={() => onChange(item.key, { result: "FAILED" })}
                  disabled={isSubmitting}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${
                    item.result === "FAILED"
                      ? "bg-red-600/20 border-red-500 text-red-300"
                      : "border-gray-700 text-gray-400 hover:border-red-500/50"
                  }`}
                >
                  Failed
                </button>
              </div>

              <textarea
                value={item.reason}
                onChange={(e) => onChange(item.key, { reason: e.target.value })}
                disabled={isSubmitting}
                placeholder={
                  item.result === "FAILED"
                    ? "Reason this item failed inspection"
                    : "Optional inspection note"
                }
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 resize-none h-20 text-sm disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-3 shrink-0">{error}</p>
        )}

        <div className="flex gap-3 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit inspection"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReturnDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnId = searchParams.get("id") || "";
  const showroomId = useSelector(selectShowroomId);

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showInspectModal, setShowInspectModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState<ReviewDraft[]>([]);
  const [reviewError, setReviewError] = useState("");
  const [inspectDrafts, setInspectDrafts] = useState<InspectDraft[]>([]);
  const [inspectError, setInspectError] = useState("");

  const { data, isLoading, error, refetch } = useGetReturnDetailsQuery(
    { id: returnId, showroomId },
    { skip: !returnId || !showroomId },
  );

  const [returnOrderAction, { isLoading: isActionLoading }] =
    useReturnOrderActionMutation();
  const [reviewReturnOrder, { isLoading: isReviewLoading }] =
    useReviewReturnOrderMutation();
  const [inspectReturnOrder, { isLoading: isInspectLoading }] =
    useInspectReturnOrderMutation();

  const envelope = data as ApiEnvelope<ReturnDetailsData> | undefined;
  const returnData = envelope?.data ?? null;
  const items = returnData?.items || [];
  const canReviewItems = vendorCanSubmitItemReview(returnData?.status, items);
  const canInspectItems = vendorCanInspectReturn(returnData?.status, items);
  const canAcceptDecline = vendorCanAcceptDecline(returnData?.status, items);

  const openReviewModal = () => {
    setReviewDrafts(
      buildReviewDrafts(items, returnData?.order?.products),
    );
    setReviewError("");
    setShowReviewModal(true);
  };

  const updateReviewDraft = (key: string, patch: Partial<ReviewDraft>) => {
    setReviewDrafts((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
    setReviewError("");
  };

  const handleSubmitReview = async () => {
    const errorMessage = validateReviewDrafts(reviewDrafts);
    if (errorMessage) {
      setReviewError(errorMessage);
      return;
    }

    if (!returnData?._id) {
      setReviewError("Missing return order id.");
      return;
    }

    try {
      const res = await reviewReturnOrder({
        orderId: returnData._id,
        showroomId,
        items: reviewDrafts.map((item) => ({
          orderProductId: item.orderProductId,
          decision: item.decision as ReviewDecision,
          reason: item.reason.trim(),
        })),
      }).unwrap();
      toast.success(getApiMessage(res, "Return review submitted"));
      setShowReviewModal(false);
      setReviewDrafts([]);
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Failed to submit return review");
    }
  };

  const openInspectModal = () => {
    setInspectDrafts(
      buildInspectDrafts(items, returnData?.order?.products),
    );
    setInspectError("");
    setShowInspectModal(true);
  };

  const updateInspectDraft = (key: string, patch: Partial<InspectDraft>) => {
    setInspectDrafts((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
    setInspectError("");
  };

  const handleSubmitInspect = async () => {
    const errorMessage = validateInspectDrafts(inspectDrafts);
    if (errorMessage) {
      setInspectError(errorMessage);
      return;
    }

    if (!returnData?._id) {
      setInspectError("Missing return order id.");
      return;
    }

    try {
      const res = await inspectReturnOrder({
        returnOrderId: returnData._id,
        showroomId,
        items: inspectDrafts.map((item) => ({
          orderProductId: item.orderProductId,
          result: item.result as InspectResult,
          reason: item.reason.trim(),
        })),
      }).unwrap();
      toast.success(getApiMessage(res, "Return inspection submitted"));
      setShowInspectModal(false);
      setInspectDrafts([]);
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Failed to submit return inspection");
    }
  };

  const handleAccept = async () => {
    try {
      const res = await returnOrderAction({
        id: returnId,
        action: "accept",
        showroomId,
      }).unwrap();
      toast.success(getApiMessage(res, "Return accepted successfully"));
      setShowConfirmModal(false);
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Failed to accept return");
    }
  };

  const handleDecline = async () => {
    try {
      const res = await returnOrderAction({
        id: returnId,
        action: "decline",
        showroomId,
        reason: declineReason.trim(),
      }).unwrap();
      toast.success(getApiMessage(res, "Return declined successfully"));
      setShowDeclineModal(false);
      setDeclineReason("");
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Failed to decline return");
    }
  };

  if (!returnId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] light:bg-white flex items-center justify-center">
        <div className="text-red-400 text-xl">Missing return id</div>
      </div>
    );
  }

  if (!showroomId || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] light:bg-white flex items-center justify-center">
        <div className="text-purple-400 text-xl">
          {!showroomId
            ? "Select a showroom to load this return."
            : "Loading return details..."}
        </div>
      </div>
    );
  }

  if (error || !returnData) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] light:bg-white flex items-center justify-center">
        <div className="text-red-400 text-xl">
          {getApiMessage(error, "Failed to load return details")}
        </div>
      </div>
    );
  }

  const unit = returnData.price?.unit || "ghs";
  const price = returnData.price || {};
  const total =
    (price.amount || 0) + (price.tip || 0) + (price.deliveryCharge || 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] light:bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center hover:bg-purple-600/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-purple-400" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-200 light:text-gray-800 font-cormorant">
                Return Details
              </h1>
              <p className="text-xs text-gray-500 light:text-gray-400 mt-0.5">
                #{returnData._id.slice(-8)}
                {returnData.trackingNumber
                  ? ` · Tracking ${returnData.trackingNumber}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {returnData.status && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(returnData.status)}`}
              >
                {formatStatusLabel(returnData.status)}
              </span>
            )}
            {canReviewItems && (
              <button
                type="button"
                onClick={openReviewModal}
                disabled={isReviewLoading}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4" />
                Review
              </button>
            )}
            {canInspectItems && (
              <button
                type="button"
                onClick={openInspectModal}
                disabled={isInspectLoading}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                <SearchCheck className="w-4 h-4" />
                Inspect
              </button>
            )}
            {canAcceptDecline && (
              <>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isActionLoading}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeclineModal(true)}
                  disabled={isActionLoading}
                  className="px-5 py-2 border border-red-500/50 hover:bg-red-500/10 rounded-lg text-red-400 text-sm font-medium transition-all disabled:opacity-50 light:text-red-700 light:border-red-300 light:hover:bg-red-50"
                >
                  Decline
                </button>
              </>
            )}
          </div>
        </div>

        {returnData.tracking && returnData.tracking.length > 0 && (
          <SectionCard
            title="Tracking"
            icon={<History className="w-4 h-4 text-purple-400" />}
          >
            <TrackingBlock events={returnData.tracking} />
          </SectionCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6 min-w-0">
            <SectionCard
              title="Returned items"
              icon={<Package className="w-4 h-4 text-purple-400" />}
            >
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const matched = findOrderProduct(
                      returnData.order?.products,
                      getItemOrderProductId(item),
                    );
                    return (
                      <ReturnItemCard
                        key={`${getItemOrderProductId(item)}-${item.sizeType}-${index}`}
                        item={item}
                        snapshot={matched?.productSnapshot}
                        unit={unit}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 light:text-gray-400 text-center py-6">
                  No returned items on this request.
                </p>
              )}
            </SectionCard>

            <SectionCard
              title="Pickup from customer"
              icon={<MapPin className="w-4 h-4 text-purple-400" />}
            >
              <AddressBlock info={returnData.pickUpInfo} />
            </SectionCard>
          </div>

          <div className="space-y-6 min-w-0">
            <SectionCard title="Return information">
              <div className="space-y-3">
                <DetailRow label="Return ID" value={`#${returnData._id.slice(-8)}`} />
                <DetailRow
                  label="Showroom"
                  value={returnData.showroom?.showroom_name}
                />
                <DetailRow label="Status" value={formatStatusLabel(returnData.status)} />
                <DetailRow
                  label="Return tracking"
                  value={returnData.trackingNumber}
                />
                <DetailRow
                  label="Original order"
                  value={
                    returnData.order?._id
                      ? `#${returnData.order._id.slice(-8)}`
                      : undefined
                  }
                />
                <DetailRow
                  label="Order tracking"
                  value={returnData.order?.trackingNumber}
                />
                <DetailRow label="Vendor note" value={returnData.vendorReason} />
              </div>
            </SectionCard>

            {returnData.deliveryRequest && (
              <ReturnDeliveryRequestPanel
                returnOrderId={returnData._id}
                request={returnData.deliveryRequest}
                pickupPrefill={returnData.pickUpInfo}
                addressPrefill={returnData.deliveryInfo}
                onCreated={refetch}
              />
            )}

            <SectionCard title="Price details">
              <div className="space-y-3">
                <DetailRow
                  label="Amount"
                  value={formatMoney(price.amount, unit)}
                />
                {Number(price.tip) > 0 && (
                  <DetailRow label="Tip" value={formatMoney(price.tip, unit)} />
                )}
                {Number(price.deliveryCharge) > 0 && (
                  <DetailRow
                    label="Delivery charge"
                    value={formatMoney(price.deliveryCharge, unit)}
                  />
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-700/50 light:border-gray-200">
                  <span className="text-gray-300 light:text-gray-600 font-medium">Total</span>
                  <span className="text-white light:text-gray-900 font-semibold text-lg">
                    {formatMoney(total, unit)}
                  </span>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Return to showroom"
              icon={<Store className="w-4 h-4 text-purple-400" />}
            >
              <AddressBlock info={returnData.deliveryInfo} />
            </SectionCard>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReturnReviewModal
          drafts={reviewDrafts}
          isSubmitting={isReviewLoading}
          error={reviewError}
          onChange={updateReviewDraft}
          onClose={() => {
            if (isReviewLoading) return;
            setShowReviewModal(false);
            setReviewError("");
          }}
          onSubmit={handleSubmitReview}
        />
      )}

      {showInspectModal && (
        <ReturnInspectModal
          drafts={inspectDrafts}
          isSubmitting={isInspectLoading}
          error={inspectError}
          onChange={updateInspectDraft}
          onClose={() => {
            if (isInspectLoading) return;
            setShowInspectModal(false);
            setInspectError("");
          }}
          onSubmit={handleSubmitInspect}
        />
      )}

      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0f] border border-purple-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Decline Return</h3>
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-purple-400 text-sm mb-4">
              Tell us why you are declining this return request.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Write your reason"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 resize-none h-24"
            />
            <button
              type="button"
              onClick={handleDecline}
              disabled={!declineReason.trim() || isActionLoading}
              className={`w-full mt-4 px-6 py-3 rounded-lg font-medium transition-all ${
                declineReason.trim() && !isActionLoading
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isActionLoading ? "Processing..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0f] border border-green-500/30 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Confirm Acceptance</h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="text-green-400 text-sm mb-4">
              Are you sure you want to accept this return request?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAccept}
                disabled={isActionLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-medium disabled:opacity-50"
              >
                {isActionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
