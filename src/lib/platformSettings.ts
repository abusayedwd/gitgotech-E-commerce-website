import { RATE_PER_KG, RATE_PER_KM } from "@/lib/deliveryPricing";

export const FALLBACK_TAX_PERCENTAGE = 10;
export const FALLBACK_REFUND_DEDUCTION_PERCENTAGE = 0;

export type PlatformSettings = {
  taxPercentage: number;
  perKgWeightPrice: number;
  perKmDistancePrice: number;
  returnWindowDays: number | null;
  refundDeductionPercentage: number;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function looksLikeSettings(value: Record<string, unknown> | null) {
  if (!value) return false;
  return (
    "taxPercentage" in value ||
    "perKgWeightPrice" in value ||
    "perKmDistancePrice" in value ||
    "returnSetting" in value
  );
}

function unwrapSettings(payload: unknown): Record<string, unknown> | null {
  const root = asRecord(payload);
  if (!root) return null;

  if (looksLikeSettings(root)) return root;

  const data = asRecord(root.data);
  if (looksLikeSettings(data)) return data;

  const nested = asRecord(data?.data);
  if (looksLikeSettings(nested)) return nested;

  return data ?? root;
}

function toNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toNullableDays(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function parsePlatformSettings(payload: unknown): PlatformSettings {
  const data = unwrapSettings(payload);
  const returnSetting = asRecord(data?.returnSetting);

  return {
    taxPercentage: Math.max(
      0,
      toNumber(data?.taxPercentage, FALLBACK_TAX_PERCENTAGE),
    ),
    perKgWeightPrice: Math.max(
      0,
      toNumber(data?.perKgWeightPrice, RATE_PER_KG),
    ),
    perKmDistancePrice: Math.max(
      0,
      toNumber(data?.perKmDistancePrice, RATE_PER_KM),
    ),
    returnWindowDays: toNullableDays(returnSetting?.returnWindowDays),
    refundDeductionPercentage: Math.max(
      0,
      toNumber(
        returnSetting?.refundDeductionPercentage,
        FALLBACK_REFUND_DEDUCTION_PERCENTAGE,
      ),
    ),
  };
}
