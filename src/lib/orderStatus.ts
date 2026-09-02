export type StatusTone = "success" | "danger" | "warning" | "info" | "neutral";

function normalizeStatusKey(status?: string) {
  return (status || "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function formatStatusLabel(status?: string) {
  const raw = (status || "").trim();
  if (!raw) return "";
  if (!raw.includes("_")) return raw;
  return raw
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

const SUCCESS_KEYS = new Set([
  "COMPLETED",
  "DELIVERED",
  "REFUNDED",
  "RETURNED",
  "VENDOR_FAULT",
  "REFUND_PAID",
  "PASSED",
  "APPROVED",
  "SETTLED",
  "PAID",
  "CONSUMED",
]);

const DANGER_KEYS = new Set([
  "VENDOR_REJECTED",
  "CANCELLED",
  "INSPECTION_FAILED",
  "REFUND_REJECTED",
  "CUSTOMER_FAULT",
  "REJECTED",
  "RETURN_DECLINED",
  "CUSTOMER_REJECTED",
  "FAILED",
  "DECLINED",
]);

const WARNING_KEYS = new Set([
  "PENDING",
  "RETURN_RECEIVED",
  "UNDER_INSPECTION",
  "REFUND_PENDING",
  "PARTIAL_REFUND_PENDING",
  "CUSTOMER_REPORTED",
  "ADMIN_REVIEW",
  "PARTIAL",
  "RETURN_ORDER_PLACED",
  "VENDOR_REVIEW",
  "PROCESSING",
  "ORDER_PLACED",
  "RETURN_OPENED",
  "HELD",
  "INSPECTION_STARTED",
  "ADMIN_REVIEWED",
  "REFUND_READY",
]);

const INFO_KEYS = new Set([
  "VENDOR_APPROVED",
  "VENDOR_ACCEPTED",
  "DRIVER_ACCEPTED",
  "PICKED_UP",
  "READY_FOR_PICKUP",
  "RETURN_ACCEPTED",
  "RELEASED",
  "AVAILABLE",
  "VENDOR",
  "CUSTOMER",
  "PRODUCT_RECOVERY",
]);

export function getStatusTone(status?: string): StatusTone {
  const key = normalizeStatusKey(status);
  if (SUCCESS_KEYS.has(key)) return "success";
  if (DANGER_KEYS.has(key)) return "danger";
  if (WARNING_KEYS.has(key)) return "warning";
  if (INFO_KEYS.has(key)) return "info";
  return "neutral";
}

export function statusBadgeClass(
  status?: string,
  variant: "pill" | "chip" = "pill",
) {
  const tone = getStatusTone(status);
  if (variant === "chip") {
    if (tone === "success") return "bg-green-900/30 text-green-300 border border-green-500/30";
    if (tone === "danger") return "bg-red-900/30 text-red-300 border border-red-500/30";
    if (tone === "warning") return "bg-amber-900/30 text-amber-300 border border-amber-500/30";
    if (tone === "info") return "bg-blue-900/30 text-blue-300 border border-blue-500/30";
    return "bg-purple-900/30 text-purple-300 border border-purple-500/30";
  }

  if (tone === "success") return "bg-green-500/20 text-green-400";
  if (tone === "danger") return "bg-red-500/20 text-red-400";
  if (tone === "warning") return "bg-amber-500/20 text-amber-300";
  if (tone === "info") return "bg-blue-500/20 text-blue-300";
  return "bg-purple-500/20 text-purple-300";
}
