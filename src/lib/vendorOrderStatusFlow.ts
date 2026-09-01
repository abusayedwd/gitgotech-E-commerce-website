/**
 * Vendor regular-order status rules, keyed by fulfillment type.
 *
 * pick-up (customer collects at the showroom):
 *   Order Placed → Processing → Ready for Pickup → Delivered
 *
 * delivery (driver collects from the showroom):
 *   Order Placed → Processing → Ready for Pickup
 *   After Ready for Pickup the driver owns the rest
 *   (Driver Accepted → Picked Up → Delivered).
 */

export const ORDER_STATUS = {
  ORDER_PLACED: "Order Placed",
  PROCESSING: "Processing",
  READY_FOR_PICKUP: "Ready for Pickup",
  DRIVER_ACCEPTED: "Driver Accepted",
  PICKED_UP: "Picked Up",
  DELIVERED: "Delivered",
  PENDING: "Pending",
  REJECTED: "Rejected",
} as const;

export type OrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type DeliveryType = "pick-up" | "delivery";

export type VendorOrderAction = {
  status: string;
  label: string;
};

const PICKUP_TIMELINE = [
  ORDER_STATUS.ORDER_PLACED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY_FOR_PICKUP,
  ORDER_STATUS.DELIVERED,
] as const;

const DELIVERY_TIMELINE = [
  ORDER_STATUS.ORDER_PLACED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY_FOR_PICKUP,
  ORDER_STATUS.DRIVER_ACCEPTED,
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.DELIVERED,
] as const;

const PICKUP_NEXT: Record<string, VendorOrderAction> = {
  [ORDER_STATUS.ORDER_PLACED]: {
    status: ORDER_STATUS.PROCESSING,
    label: "Processing",
  },
  [ORDER_STATUS.PROCESSING]: {
    status: ORDER_STATUS.READY_FOR_PICKUP,
    label: "Ready for Pickup",
  },
  [ORDER_STATUS.READY_FOR_PICKUP]: {
    status: ORDER_STATUS.DELIVERED,
    label: "Delivered",
  },
};

const DELIVERY_NEXT: Record<string, VendorOrderAction> = {
  [ORDER_STATUS.ORDER_PLACED]: {
    status: ORDER_STATUS.PROCESSING,
    label: "Processing",
  },
  [ORDER_STATUS.PROCESSING]: {
    status: ORDER_STATUS.READY_FOR_PICKUP,
    label: "Ready for Pickup",
  },
};

export function normalizeDeliveryType(
  value?: string | null,
): DeliveryType {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "pick-up" || v === "pickup" || v === "pick_up") return "pick-up";
  return "delivery";
}

export function normalizeOrderStatus(status?: string | null): string {
  const s = (status ?? "").trim();
  if (!s) return "";
  if (/^placed\s*order$/i.test(s) || /^pending$/i.test(s)) {
    return ORDER_STATUS.ORDER_PLACED;
  }
  return s;
}

export function getVendorOrderTimeline(deliveryType: DeliveryType): string[] {
  return deliveryType === "pick-up"
    ? [...PICKUP_TIMELINE]
    : [...DELIVERY_TIMELINE];
}

export function getNextVendorOrderAction(
  currentStatus: string | null | undefined,
  deliveryType: DeliveryType,
): VendorOrderAction | null {
  const current = normalizeOrderStatus(currentStatus);
  if (!current || current === ORDER_STATUS.REJECTED) return null;

  const map = deliveryType === "pick-up" ? PICKUP_NEXT : DELIVERY_NEXT;
  return map[current] ?? null;
}

export function vendorHasFinishedOrder(
  currentStatus: string | null | undefined,
  deliveryType: DeliveryType,
): boolean {
  const current = normalizeOrderStatus(currentStatus);
  if (current === ORDER_STATUS.DELIVERED || current === ORDER_STATUS.REJECTED) {
    return true;
  }
  if (deliveryType === "delivery") {
    return (
      current === ORDER_STATUS.READY_FOR_PICKUP ||
      current === ORDER_STATUS.DRIVER_ACCEPTED ||
      current === ORDER_STATUS.PICKED_UP
    );
  }
  return false;
}

export function getVendorOrderIdleCopy(
  currentStatus: string | null | undefined,
  deliveryType: DeliveryType,
): string {
  const current = normalizeOrderStatus(currentStatus);
  if (current === ORDER_STATUS.REJECTED) {
    return "This order was rejected. No further action is needed.";
  }
  if (current === ORDER_STATUS.DELIVERED) {
    return "This order is complete. No further action is needed from you.";
  }
  if (deliveryType === "delivery") {
    if (current === ORDER_STATUS.READY_FOR_PICKUP) {
      return "Ready for the driver. A driver will accept and complete delivery.";
    }
    if (
      current === ORDER_STATUS.DRIVER_ACCEPTED ||
      current === ORDER_STATUS.PICKED_UP
    ) {
      return "A driver is handling this order. No further action is needed from you.";
    }
  }
  return "No status update is available right now.";
}

export function getOrderStatusStyle(status: string): string {
  const styles: Record<string, string> = {
    [ORDER_STATUS.ORDER_PLACED]:
      "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30",
    [ORDER_STATUS.PROCESSING]:
      "bg-purple-900/30 text-purple-300 border border-purple-500/30",
    [ORDER_STATUS.READY_FOR_PICKUP]:
      "bg-blue-900/30 text-blue-300 border border-blue-500/30",
    [ORDER_STATUS.DRIVER_ACCEPTED]:
      "bg-cyan-900/30 text-cyan-300 border border-cyan-500/30",
    [ORDER_STATUS.PICKED_UP]:
      "bg-indigo-900/30 text-indigo-300 border border-indigo-500/30",
    [ORDER_STATUS.DELIVERED]:
      "bg-green-900/30 text-green-300 border border-green-500/30",
    [ORDER_STATUS.PENDING]:
      "bg-gray-900/30 text-gray-300 border border-gray-500/30",
    [ORDER_STATUS.REJECTED]:
      "bg-red-900/30 text-red-300 border border-red-500/30",
  };
  return (
    styles[normalizeOrderStatus(status)] ||
    "bg-gray-900/30 text-gray-300 border border-gray-500/30"
  );
}
