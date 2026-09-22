"use client";

import {
  ReturnAdminReviewCards,
  ReturnReviewTrail,
  getReturnProductId,
  getReturnProductImage,
  getReturnProductName,
  type ReturnDeliveryRequest,
} from "@/components/shared/ReturnAdminSections";
import ReturnDeliveryRequestPanel from "@/components/shared/ReturnDeliveryRequestPanel";
import { showApiErrorToast } from "@/lib/apiErrorToast";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import { formatStatusLabel, statusBadgeClass } from "@/lib/orderStatus";
import {
  useGetReturnOrderDetailsQuery,
  useReportCustomerReturnMutation,
} from "@/redux/features/order/orderSlice";
import {
  ArrowLeft,
  Flag,
  History,
  MapPin,
  Package,
  Store,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

const TRACKING_PREVIEW_COUNT = 3;

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
  size?: { type?: string; quantity?: number }[];
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

function getItemOrderProductId(item: ReturnItem) {
  return item.orderProductId || getReturnProductId(item.product);
}

function findOrderProduct(
  orderProducts: OrderProduct[] | undefined,
  productId?: string,
) {
  if (!orderProducts || !productId) return undefined;
  return orderProducts.find((item) => getProductId(item.product) === productId);
}

function getProductLines(product: OrderProduct) {
  if (product.sizes?.length) return product.sizes;
  return product.size || [];
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
    <div className="bg-gradient-to-tr from-[#05011a] via-[#090322] to-[#05011a] light:from-white light:via-purple-50/40 light:to-white border border-gray-800 light:border-gray-200 rounded-2xl p-6">
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
    expanded || !canToggle ? sorted : sorted.slice(-TRACKING_PREVIEW_COUNT);

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
                {!isLast && <span className="w-px flex-1 bg-gray-700/80 my-1" />}
              </div>
              <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-4"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(event.status, "chip")}`}
                  >
                    {formatStatusLabel(event.status)}
                  </span>
                  {event.createdAt && (
                    <span className="text-xs text-gray-500 light:text-gray-400">
                      {formatDate(event.createdAt)}
                    </span>
                  )}
                </div>
                {event.message && (
                  <p className="text-sm text-gray-300 light:text-gray-700 mt-1">{event.message}</p>
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

function AttachmentGrid({ files }: { files?: string[] }) {
  if (!files?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file) => (
        <a
          key={file}
          href={buildImageUrl(file, file)}
          target="_blank"
          rel="noreferrer"
          className="block w-16 h-16 rounded-lg overflow-hidden border border-gray-700"
        >
          <img
            src={buildImageUrl(file, "/images/jacket.png")}
            alt="Return attachment"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/jacket.png";
            }}
          />
        </a>
      ))}
    </div>
  );
}

function isVendorRejected(status?: string) {
  return /^vendor rejected$/i.test((status || "").trim());
}

function ReportToAdminModal({
  open,
  onClose,
  returnData,
  unit,
}: {
  open: boolean;
  onClose: () => void;
  returnData: ReturnDetailsData;
  unit: string;
}) {
  const [explanation, setExplanation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [reportReturn, { isLoading }] = useReportCustomerReturnMutation();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, isLoading]);

  useEffect(() => {
    if (open) return;
    setExplanation("");
    setFiles([]);
    setPreviews((current) => {
      current.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
  }, [open]);

  const handleFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const next = Array.from(list);
    const nextPreviews = next.map((file) => URL.createObjectURL(file));
    setFiles((current) => [...current, ...next]);
    setPreviews((current) => [...current, ...nextPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((current) => current.filter((_, i) => i !== index));
    setPreviews((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const text = explanation.trim();
    if (!text) {
      toast.error("Please explain why you are reporting this return.");
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify({ explanation: text }));
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await reportReturn({
        orderId: returnData._id,
        formData,
      }).unwrap();
      toast.success(getApiMessage(res, "Report sent to admin"));
      onClose();
    } catch (err) {
      showApiErrorToast(err, "Failed to send report");
    }
  };

  if (!open) return null;

  const rejectedItems = returnData.items || [];

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Report to admin">
      <button
        type="button"
        aria-label="Close report"
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      <div className="relative z-10 flex h-full items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-2xl max-h-[min(90vh,860px)] flex flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0a0a0f]/95 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-gray-800 p-5">
            <div>
              <h2 className="text-xl font-semibold text-white">Report to Admin</h2>
              <p className="text-sm text-gray-400 mt-1">
                The vendor rejected this return. Send your explanation and evidence for admin review.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Close report"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0 p-5 space-y-5">
            <div className="rounded-xl border border-gray-800 bg-black/20 p-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Return summary
              </p>
              <DetailRow label="Return ID" value={`#${returnData._id.slice(-8)}`} />
              <DetailRow label="Status" value={formatStatusLabel(returnData.status)} />
              <DetailRow
                label="Showroom"
                value={returnData.showroom?.showroom_name}
              />
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
              <DetailRow label="Vendor note" value={returnData.vendorReason} />
            </div>

            {rejectedItems.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Items for review
                </p>
                {rejectedItems.map((item, index) => {
                  const matched = findOrderProduct(
                    returnData.order?.products,
                    getItemOrderProductId(item),
                  );
                  const name = getReturnProductName(
                    item.product,
                    matched?.productSnapshot?.name || "Returned product",
                  );
                  return (
                    <div
                      key={`${getItemOrderProductId(item)}-${item.sizeType}-${index}`}
                      className="rounded-xl border border-gray-800 bg-black/20 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white font-medium truncate">
                          {name}
                        </p>
                        {item.itemStatus && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadgeClass(item.itemStatus, "chip")}`}
                          >
                            {formatStatusLabel(item.itemStatus)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Size {item.sizeType || "—"} · Qty {item.quantity ?? 1}
                        {item.refundLine?.refundAmount != null
                          ? ` · Refund ${formatMoney(item.refundLine.refundAmount, unit)}`
                          : ""}
                      </p>
                      {item.customerReason && (
                        <DetailRow label="Your reason" value={item.customerReason} />
                      )}
                      {item.vendorReview?.reason && (
                        <DetailRow
                          label="Vendor reason"
                          value={item.vendorReview.reason}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Explanation for admin
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why this rejection should be reviewed"
                className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-h-[120px] resize-none"
              />
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-2">Evidence photos</p>
              <div className="flex flex-wrap gap-3">
                {previews.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
                  >
                    <img
                      src={src}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 bg-gray-900/50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  <span className="text-purple-400 text-xs">Upload</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 p-5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !explanation.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold"
            >
              {isLoading ? "Sending report..." : "Submit report"}
            </button>
          </div>
        </div>
      </div>
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
              <p className="text-sm text-gray-300 light:text-gray-700 mt-2">
                Size {item.sizeType || "—"} · Qty {item.quantity ?? 1}
              </p>
            </div>
            {item.itemStatus && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadgeClass(item.itemStatus, "chip")}`}
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
          <p className="text-xs text-gray-400 light:text-gray-500 mb-1">Your reason</p>
          <p className="text-sm text-gray-200 light:text-gray-700">{item.customerReason}</p>
        </div>
      )}

      {item.attachments && item.attachments.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 light:text-gray-500 mb-2">Photos you uploaded</p>
          <AttachmentGrid files={item.attachments} />
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
            label="Refund amount"
            value={formatMoney(item.refundLine?.refundAmount, unit)}
          />
          <DetailRow
            label="Refund issued"
            value={item.refundConsumed ? "Yes" : "Not yet"}
          />
        </div>
        <div className="rounded-lg border border-gray-800 light:border-gray-200 p-3 space-y-2">
          <p className="text-xs uppercase tracking-wide text-gray-500 light:text-gray-400">
            Refund hold
          </p>
          <DetailRow label="Amount" value={formatMoney(item.holdAmount, unit)} />
          {item.holdStatus && (
            <div className="flex justify-between items-center gap-3">
              <span className="text-gray-400 light:text-gray-500 text-sm">Status</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.holdStatus, "chip")}`}
              >
                {formatStatusLabel(item.holdStatus)}
              </span>
            </div>
          )}
          <DetailRow
            label="Released"
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
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.vendorReview.decision, "chip")}`}
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
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusBadgeClass(item.inspection.result, "chip")}`}
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

export default function ReturnOrderDetails() {
  const router = useRouter();
  const params = useParams();
  const returnId = String(params.id || "");
  const [showReportModal, setShowReportModal] = useState(false);

  const { data, isLoading, error, refetch } = useGetReturnOrderDetailsQuery(returnId, {
    skip: !returnId || returnId === "undefined",
  });

  const envelope = data as ApiEnvelope<ReturnDetailsData> | undefined;
  const returnData = envelope?.data ?? null;
  const items = returnData?.items || [];

  if (!returnId || returnId === "undefined") {
    return (
      <div className="min-h-screen mt-20 bg-[#0a0a0f] light:bg-white flex items-center justify-center">
        <div className="text-red-400 text-xl">Missing return id</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen mt-20 bg-[#0a0a0f] light:bg-white flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading return details...</div>
      </div>
    );
  }

  if (error || !returnData) {
    return (
      <div className="min-h-screen mt-20 bg-[#0a0a0f] light:bg-white flex items-center justify-center">
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
  const originalProducts = returnData.order?.products || [];

  return (
    <div className="min-h-screen mt-20 bg-[#0a0a0f] light:bg-white p-4 md:p-8">
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
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(returnData.status, "chip")}`}
              >
                {formatStatusLabel(returnData.status)}
              </span>
            )}
            {isVendorRejected(returnData.status) && (
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#6100FF] hover:bg-[#6100FF]/80 text-white transition-colors inline-flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Report to Admin
              </button>
            )}
            {returnData.order?._id && (
              <Link
                href={`/customer-dashboard/details/${returnData.order._id}`}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                View Original Order
              </Link>
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

            {originalProducts.length > 0 && (
              <SectionCard title="Original order items">
                <div className="space-y-3">
                  {originalProducts.map((product, index) => {
                    const name =
                      product.productSnapshot?.name ||
                      (typeof product.product === "object"
                        ? product.product.product_name
                        : "Product");
                    const image = product.productSnapshot?.thumbnail;
                    const lines = getProductLines(product);
                    return (
                      <div
                        key={product._id || `${getProductId(product.product)}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-800/80 light:border-gray-200 bg-black/20 light:bg-gray-50 p-3"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 light:bg-gray-100 shrink-0">
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
                          <p className="text-sm font-medium text-white light:text-gray-900 truncate">
                            {name}
                          </p>
                          {product.productSnapshot?.category && (
                            <p className="text-xs text-gray-400 light:text-gray-500">
                              {product.productSnapshot.category}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 light:text-gray-500 mt-1">
                            {lines
                              .map((line) => `${line.type} × ${line.quantity}`)
                              .join(", ") || "—"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            <SectionCard
              title="Pickup address"
              icon={<MapPin className="w-4 h-4 text-purple-400" />}
            >
              <AddressBlock info={returnData.pickUpInfo} />
            </SectionCard>
          </div>

          <div className="space-y-6 min-w-0">
            <SectionCard title="Return information">
              <div className="space-y-3">
                <DetailRow
                  label="Return ID"
                  value={`#${returnData._id.slice(-8)}`}
                />
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
                  <span className="text-gray-300 light:text-gray-700 font-medium">Total</span>
                  <span className="text-white light:text-gray-900 font-semibold text-lg">
                    {formatMoney(total, unit)}
                  </span>
                </div>
              </div>
            </SectionCard>

            {returnData.attachment && returnData.attachment.length > 0 && (
              <SectionCard title="Return attachments">
                <AttachmentGrid files={returnData.attachment} />
              </SectionCard>
            )}

            <SectionCard
              title="Return to showroom"
              icon={<Store className="w-4 h-4 text-purple-400" />}
            >
              <AddressBlock info={returnData.deliveryInfo} />
            </SectionCard>
          </div>
        </div>
      </div>

      <ReportToAdminModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        returnData={returnData}
        unit={unit}
      />
    </div>
  );
}
