import { parsePlatformSettings } from "@/lib/platformSettings";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type TrackingLike = {
  status?: string;
  createdAt?: string;
};

type OrderLike = {
  orderStatus?: string;
  deliveredAt?: string;
  tracking?: TrackingLike[];
} | null | undefined;

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function getOrderDeliveredAt(order: OrderLike): Date | null {
  const fromField = parseDate(order?.deliveredAt);
  if (fromField) return fromField;

  const deliveredEvent = (order?.tracking || []).find(
    (event) => (event.status || "").trim().toLowerCase() === "delivered",
  );
  return parseDate(deliveredEvent?.createdAt);
}

export function getReturnWindowDays(settings: unknown): number | null {
  return parsePlatformSettings(settings).returnWindowDays;
}

export function getReturnDeadline(
  deliveredAt: Date | null,
  returnWindowDays: number | null,
): Date | null {
  if (!deliveredAt || returnWindowDays === null) return null;
  return new Date(deliveredAt.getTime() + returnWindowDays * MS_PER_DAY);
}

export function isWithinReturnWindow(
  deliveredAt: Date | null,
  returnWindowDays: number | null,
  now = Date.now(),
): boolean {
  const deadline = getReturnDeadline(deliveredAt, returnWindowDays);
  if (!deadline) return false;
  return now <= deadline.getTime();
}

export function canRequestOrderReturn(
  order: OrderLike,
  returnWindowDays: number | null,
  now = Date.now(),
): boolean {
  if ((order?.orderStatus || "").trim() !== "Delivered") return false;
  return isWithinReturnWindow(
    getOrderDeliveredAt(order),
    returnWindowDays,
    now,
  );
}
