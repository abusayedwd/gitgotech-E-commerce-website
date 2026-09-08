export type ProductDiscount = {
  isValid?: boolean;
  percentage?: number | null;
  startDate?: string | null;
  endDate?: string | null;
} | null | undefined;

// A discount only counts if it's turned on, has a positive percentage, and
// today falls inside its start/end window (an expired discount must not
// keep showing just because `isValid` was never flipped back off).
export function isDiscountActive(discount: ProductDiscount): boolean {
  if (!discount?.isValid) return false;
  if (!(Number(discount.percentage) > 0)) return false;

  const now = Date.now();
  if (discount.startDate) {
    const start = new Date(discount.startDate).getTime();
    if (!Number.isNaN(start) && now < start) return false;
  }
  if (discount.endDate) {
    const end = new Date(discount.endDate).getTime();
    if (!Number.isNaN(end) && now > end) return false;
  }
  return true;
}

export function getActiveDiscountPercentage(discount: ProductDiscount): number {
  return isDiscountActive(discount) ? Number(discount?.percentage) || 0 : 0;
}

export function applyProductDiscount(
  price: number,
  discount: ProductDiscount,
): number {
  const percentage = getActiveDiscountPercentage(discount);
  return percentage > 0 ? price * (1 - percentage / 100) : price;
}
