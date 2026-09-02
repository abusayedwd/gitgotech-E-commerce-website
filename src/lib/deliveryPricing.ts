/** USD per km (distance component) */
export const RATE_PER_KM = 2;
/** USD per kg of product weight (shipping weight component) */
export const RATE_PER_KG = 2;
/** Minimum charge for the distance component only */
export const MIN_DISTANCE_DELIVERY = 5;
/** Fallback distance charge when map / coordinates are not ready yet */
export const FALLBACK_DISTANCE_DELIVERY_USD = 20;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Distance-only delivery: max(min, km × rate). Caller adds weight charge separately. */
export function calcDistanceDeliveryUsd(
  customerLat: number,
  customerLon: number,
  showroomLng: number,
  showroomLat: number,
  ratePerKm: number = RATE_PER_KM,
): number {
  const distKm = haversineKm(customerLat, customerLon, showroomLat, showroomLng);
  return Math.max(
    MIN_DISTANCE_DELIVERY,
    parseFloat((distKm * ratePerKm).toFixed(2)),
  );
}

export type ProductWeightLike = {
  amount?: number;
  unit?: string;
} | null | undefined;

/** Convert a weight amount + unit to kilograms. Unknown units are treated as kg. */
export function weightAmountToKg(amount: number, unit?: string): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const u = (unit || "kg").toLowerCase();
  if (u === "kg" || u === "kgs") return amount;
  if (u === "g" || u === "gm" || u === "gram" || u === "grams") return amount / 1000;
  if (u === "mg") return amount / 1_000_000;
  if (u === "lb" || u === "lbs" || u === "pound" || u === "pounds") {
    return amount * 0.453592;
  }
  if (u === "oz" || u === "ounce" || u === "ounces") return amount * 0.0283495;
  return amount;
}

/** Normalise API `product_weight` to kilograms for one product unit. */
export function productWeightToKg(weight: ProductWeightLike): number {
  if (!weight || typeof weight.amount !== "number" || !Number.isFinite(weight.amount)) {
    return 0;
  }
  return Math.max(0, weightAmountToKg(weight.amount, weight.unit));
}

export function calcWeightChargeUsd(
  kg: number,
  ratePerKg: number = RATE_PER_KG,
): number {
  if (!Number.isFinite(kg) || kg <= 0) return 0;
  return parseFloat((kg * Math.max(0, ratePerKg)).toFixed(2));
}

/** GeoJSON [lng, lat]. Treats [0, 0] as unset. */
export function validLngLat(
  coordinates?: number[] | null,
): [number, number] | null {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  if (lng === 0 && lat === 0) return null;
  return [lng, lat];
}

/** Weight-based delivery: sum over lines (kg × qty × rate). */
export function calcWeightDeliveryUsdForItems(
  items: Array<{
    product?: { product_weight?: ProductWeightLike };
    quantity?: number;
  }>,
  ratePerKg: number = RATE_PER_KG,
): number {
  const raw = items.reduce((sum, item) => {
    const kg = productWeightToKg(item.product?.product_weight ?? null);
    const qty = item.quantity ?? 1;
    return sum + kg * qty * ratePerKg;
  }, 0);
  return parseFloat(raw.toFixed(2));
}
