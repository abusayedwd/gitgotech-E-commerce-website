"use client";

import { showApiErrorToast } from "@/lib/apiErrorToast";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import {
  getNextVendorOrderAction,
  getOrderStatusStyle,
  getVendorOrderIdleCopy,
  getVendorOrderTimeline,
  normalizeDeliveryType,
  type DeliveryType,
} from "@/lib/vendorOrderStatusFlow";
import {
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/vendor/order/orderSlice";
import { selectShowroomId } from "@/redux/features/vendor/showroomSlice/selectedShowroomSlice";
import {
  ArrowLeft,
  History,
  MapPin,
  Package,
  Store,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const TRACKING_PREVIEW_COUNT = 3;

type SizePricing = {
  originalUnitPrice?: number;
  productDiscountPercentage?: number;
  productDiscountPerUnit?: number;
  productDiscountedUnitPrice?: number;
  couponDiscountPerUnit?: number;
  paidUnitPrice?: number;
  totalOriginalPrice?: number;
  totalProductDiscount?: number;
  totalCouponDiscount?: number;
  totalPaidPrice?: number;
};

type SizeLine = {
  _id?: string;
  type: string;
  quantity: number;
  pricing?: SizePricing;
};

type ContactInfo = {
  name?: string;
  address?: string;
  country?: string;
  state?: string;
  zipcode?: number | string;
  email?: string;
  phone?: number | string;
};

type OrderProduct = {
  _id: string;
  product?: {
    _id?: string;
    product_name?: string;
    product_images?: string[];
  };
  sizes?: SizeLine[];
  size?: SizeLine[];
  productSnapshot?: {
    name?: string;
    thumbnail?: string;
    category?: string;
    vendor?: string;
    showroom?: string;
  };
};

type OrderPrice = {
  unit?: string;
  amount?: number;
  tip?: number;
  tax?: number;
  weightCharge?: number;
  deliveryCharge?: number;
  subtotal?: number;
  productDiscountTotal?: number;
  couponDiscountTotal?: number;
  productTotalAfterDiscount?: number;
  taxPercentage?: number;
  grandTotal?: number;
  coupon?: string;
};

type OrderDriver = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: number | string;
  image?: string;
};

type VendorSettlement = {
  vendor?: string;
  amount?: number;
  status?: string;
  heldAt?: string;
  availableAt?: string;
};

type TrackingEvent = {
  _id?: string;
  status: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
};

type VendorOrderDetails = {
  _id: string;
  customer?: {
    _id?: string;
    name?: string;
    username?: string;
    email?: string;
    phone?: number | string;
  };
  driver?: OrderDriver | null;
  products?: OrderProduct[];
  orderStatus: string;
  deliveryType?: string;
  price?: OrderPrice;
  vendorSettlement?: VendorSettlement | null;
  tracking?: TrackingEvent[];
  deliveryInfo?: ContactInfo;
  pickUpInfo?: ContactInfo;
  createdAt?: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  status?: number;
  message?: string;
  data?: T;
};

function formatMoney(amount: number | undefined, unit = "usd") {
  const value = Number(amount ?? 0);
  const code = (unit || "usd").toUpperCase();
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

function getProductLines(product: OrderProduct): SizeLine[] {
  if (product.sizes?.length) return product.sizes;
  return product.size || [];
}

function getAssignedDriver(driver?: OrderDriver | null): OrderDriver | null {
  if (!driver || typeof driver !== "object") return null;
  if (!driver._id && !driver.name && !driver.email) return null;
  return driver;
}

function driverInitials(name?: string) {
  const parts = (name || "Driver").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "D") + (parts[1]?.[0] || "")).toUpperCase();
}

function getSettlementStatusStyle(status?: string) {
  const value = (status || "").toUpperCase();
  if (value === "HELD") {
    return "bg-amber-900/30 text-amber-300 border border-amber-500/30";
  }
  if (value === "AVAILABLE" || value === "RELEASED") {
    return "bg-blue-900/30 text-blue-300 border border-blue-500/30";
  }
  if (value === "PAID" || value === "SETTLED") {
    return "bg-green-900/30 text-green-300 border border-green-500/30";
  }
  return "bg-gray-900/30 text-gray-300 border border-gray-500/30";
}

function sortTrackingEvents(events: TrackingEvent[]) {
  return [...events].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
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
      <span className="text-gray-400 text-sm shrink-0">{label}</span>
      <span className="text-white font-medium text-sm text-right break-all">
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
    <div className="bg-gradient-to-tr from-[#05011a] via-[#090322] to-[#05011a] border border-gray-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-5 border-b border-gray-700/50 pb-3 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function DriverBlock({ driver }: { driver: OrderDriver }) {
  const photo = buildImageUrl(driver.image);
  const name = driver.name || "Assigned driver";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border border-purple-500/30"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-sm font-semibold text-purple-200">
            {driverInitials(name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white font-medium truncate">{name}</p>
          {driver.email && (
            <p className="text-xs text-gray-400 truncate">{driver.email}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <DetailRow label="Name" value={driver.name} />
        <DetailRow label="Email" value={driver.email} />
        <DetailRow label="Phone" value={driver.phone} />
      </div>
    </div>
  );
}

function AddressBlock({ info }: { info?: ContactInfo }) {
  if (!info) {
    return <p className="text-sm text-gray-500">No address on this order.</p>;
  }

  const location = [info.address, info.state, info.country, info.zipcode]
    .filter((part) => part !== undefined && part !== null && String(part).trim() && String(part) !== "0")
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

function SettlementBlock({
  settlement,
  unit,
}: {
  settlement: VendorSettlement;
  unit: string;
}) {
  return (
    <div className="space-y-3">
      <DetailRow
        label="Amount"
        value={formatMoney(settlement.amount, unit)}
      />
      {settlement.status && (
        <div className="flex justify-between items-center gap-4">
          <span className="text-gray-400 text-sm">Status</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSettlementStatusStyle(settlement.status)}`}
          >
            {settlement.status}
          </span>
        </div>
      )}
      <DetailRow label="Held at" value={formatDate(settlement.heldAt)} />
      <DetailRow
        label="Available at"
        value={formatDate(settlement.availableAt)}
      />
    </div>
  );
}

function TrackingBlock({ events }: { events: TrackingEvent[] }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = sortTrackingEvents(events);
  const canToggle = sorted.length > TRACKING_PREVIEW_COUNT;
  const visible =
    expanded || !canToggle
      ? sorted
      : sorted.slice(-TRACKING_PREVIEW_COUNT);

  if (sorted.length === 0) {
    return <p className="text-sm text-gray-500">No tracking updates yet.</p>;
  }

  return (
    <div>
      <ol className="space-y-0">
        {visible.map((event, index) => {
          const isLast = index === visible.length - 1;
          return (
            <li key={event._id || `${event.status}-${event.createdAt}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                    isLast
                      ? "bg-purple-400"
                      : "bg-green-400/80"
                  }`}
                />
                {!isLast && (
                  <span className="w-px flex-1 bg-gray-700/80 my-1" />
                )}
              </div>
              <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-4"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getOrderStatusStyle(event.status)}`}
                  >
                    {event.status}
                  </span>
                  {event.createdAt && (
                    <span className="text-xs text-gray-500">
                      {formatDate(event.createdAt)}
                    </span>
                  )}
                </div>
                {event.message && (
                  <p className="text-sm text-gray-300 mt-1">{event.message}</p>
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
          className="mt-4 text-sm text-purple-300 hover:text-purple-200 font-medium"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}

function StatusTimeline({
  currentStatus,
  deliveryType,
}: {
  currentStatus: string;
  deliveryType: DeliveryType;
}) {
  const steps = getVendorOrderTimeline(deliveryType);
  const currentIndex = steps.findIndex((step) => step === currentStatus);

  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const reached = currentIndex >= 0 && index <= currentIndex;
        const isCurrent = step === currentStatus;
        return (
          <li
            key={step}
            className={`px-2.5 py-1 rounded-full text-[11px] border ${
              isCurrent
                ? getOrderStatusStyle(step)
                : reached
                  ? "bg-green-950/40 text-green-300 border-green-500/20"
                  : "bg-gray-900/40 text-gray-500 border-gray-700/50"
            }`}
          >
            {step}
          </li>
        );
      })}
    </ol>
  );
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "";
  const showroomId = useSelector(selectShowroomId);

  const { data, isLoading, error, refetch } = useGetOrderDetailsQuery(
    { id: orderId, showroomId },
    { skip: !orderId || !showroomId },
  );

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const envelope = data as ApiEnvelope<VendorOrderDetails> | undefined;
  const order = envelope?.data ?? null;
  const deliveryType = normalizeDeliveryType(order?.deliveryType);
  const nextAction = order
    ? getNextVendorOrderAction(order.orderStatus, deliveryType)
    : null;

  const handleStatusUpdate = async () => {
    if (!order || !nextAction) return;

    try {
      const res = await updateOrderStatus({
        id: orderId,
        orderStatus: nextAction.status,
        showroomId,
      }).unwrap();
      toast.success(getApiMessage(res, "Order status updated successfully"));
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Failed to update order status");
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-red-400 text-xl">Missing order id</div>
      </div>
    );
  }

  if (!showroomId || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-purple-400 text-xl">
          {!showroomId
            ? "Select a showroom to load this order."
            : "Loading order details..."}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-red-400 text-xl">
          {getApiMessage(error, "Failed to load order details")}
        </div>
      </div>
    );
  }

  const products = order.products || [];
  const assignedDriver = getAssignedDriver(order.driver);
  const price = order.price || {};
  const unit = price.unit || "usd";
  const grandTotal =
    price.grandTotal ??
    (price.amount || 0) +
      (price.tax || 0) +
      (price.tip || 0) +
      (price.weightCharge || 0) +
      (price.deliveryCharge || 0);

  const priceRows = [
    { label: "Subtotal", value: price.subtotal ?? price.amount, always: true },
    {
      label: "Product discount",
      value: price.productDiscountTotal,
      negative: true,
    },
    {
      label: "Coupon discount",
      value: price.couponDiscountTotal,
      negative: true,
    },
    {
      label: "After discount",
      value: price.productTotalAfterDiscount,
    },
    {
      label: "Delivery charge",
      value: price.deliveryCharge,
      hideOnPickup: true,
    },
    { label: "Weight charge", value: price.weightCharge },
    {
      label: price.taxPercentage
        ? `Tax (${price.taxPercentage}%)`
        : "Tax",
      value: price.tax,
    },
    { label: "Tip", value: price.tip },
  ].filter((row) => {
    if (row.always) return true;
    if (row.hideOnPickup && deliveryType === "pick-up") {
      return Number(row.value) > 0;
    }
    return Number(row.value) > 0;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center hover:bg-purple-600/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-purple-400" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-200 font-cormorant">
                Order Details
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                #{order._id.slice(-8)}
                {order.createdAt ? ` · ${formatDate(order.createdAt)}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/60 text-slate-200 border border-slate-500/30 capitalize">
              {deliveryType}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusStyle(order.orderStatus)}`}
            >
              {order.orderStatus}
            </span>
          </div>
        </div>

        <SectionCard title="Status">
          <div className="space-y-4">
            <StatusTimeline
              currentStatus={order.orderStatus}
              deliveryType={deliveryType}
            />
            {nextAction ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <p className="text-sm text-gray-400">
                  Mark this {deliveryType} order as{" "}
                  <span className="text-white font-medium">
                    {nextAction.label}
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : nextAction.label}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                {getVendorOrderIdleCopy(order.orderStatus, deliveryType)}
              </p>
            )}
          </div>
        </SectionCard>

        {order.tracking && order.tracking.length > 0 && (
          <SectionCard
            title="Tracking"
            icon={<History className="w-4 h-4 text-purple-400" />}
          >
            <TrackingBlock events={order.tracking} />
          </SectionCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6 min-w-0">
            <SectionCard
              title="Products"
              icon={<Package className="w-4 h-4 text-purple-400" />}
            >
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((item) => {
                    const name =
                      item.product?.product_name ||
                      item.productSnapshot?.name ||
                      "Product";
                    const image =
                      item.product?.product_images?.[0] ||
                      item.productSnapshot?.thumbnail;
                    const lines = getProductLines(item);

                    return (
                      <div
                        key={item._id}
                        className="rounded-xl border border-gray-800/80 bg-black/20 p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center shrink-0">
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
                            <p className="font-semibold text-white truncate">
                              {name}
                            </p>
                            {item.productSnapshot?.category && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {item.productSnapshot.category}
                              </p>
                            )}
                            <div className="mt-3 space-y-2">
                              {lines.length > 0 ? (
                                lines.map((line, index) => (
                                  <div
                                    key={line._id || `${line.type}-${index}`}
                                    className="flex items-center justify-between text-sm gap-3"
                                  >
                                    <span className="text-gray-300">
                                      Size {line.type} · Qty {line.quantity}
                                    </span>
                                    <span className="text-white font-medium">
                                      {formatMoney(
                                        line.pricing?.totalPaidPrice ??
                                          (line.pricing?.paidUnitPrice || 0) *
                                            (line.quantity || 1),
                                        unit,
                                      )}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">
                                  No size details
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No product info available
                </div>
              )}
            </SectionCard>

            {deliveryType === "delivery" && (
              <SectionCard
                title="Delivery address"
                icon={<MapPin className="w-4 h-4 text-purple-400" />}
              >
                <AddressBlock info={order.deliveryInfo} />
              </SectionCard>
            )}

            {deliveryType === "pick-up" && (
              <SectionCard
                title="Pickup location"
                icon={<Store className="w-4 h-4 text-purple-400" />}
              >
                <AddressBlock info={order.pickUpInfo} />
              </SectionCard>
            )}

            {deliveryType === "pick-up" && order.deliveryInfo && (
              <SectionCard
                title="Customer contact on order"
                icon={<User className="w-4 h-4 text-purple-400" />}
              >
                <AddressBlock info={order.deliveryInfo} />
              </SectionCard>
            )}
          </div>

          <div className="space-y-6 min-w-0">
            <SectionCard title="Price details">
              <div className="space-y-3">
                {priceRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-400 text-sm">{row.label}</span>
                    <span
                      className={`font-medium text-sm ${row.negative ? "text-green-400" : "text-white"}`}
                    >
                      {row.negative ? "-" : ""}
                      {formatMoney(row.value, unit)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                  <span className="text-gray-300 font-medium">Grand total</span>
                  <span className="text-white font-semibold text-lg">
                    {formatMoney(grandTotal, unit)}
                  </span>
                </div>
              </div>
            </SectionCard>

            {order.vendorSettlement && (
              <SectionCard
                title="Vendor settlement"
                icon={<Wallet className="w-4 h-4 text-purple-400" />}
              >
                <SettlementBlock
                  settlement={order.vendorSettlement}
                  unit={unit}
                />
              </SectionCard>
            )}

            <SectionCard
              title="Customer"
              icon={<User className="w-4 h-4 text-purple-400" />}
            >
              <div className="space-y-3">
                <DetailRow label="Name" value={order.customer?.name} />
                <DetailRow label="Username" value={order.customer?.username} />
                <DetailRow label="Email" value={order.customer?.email} />
                <DetailRow label="Phone" value={order.customer?.phone} />
              </div>
            </SectionCard>

            {deliveryType === "delivery" && assignedDriver && (
              <SectionCard
                title="Driver"
                icon={<Truck className="w-4 h-4 text-purple-400" />}
              >
                <DriverBlock driver={assignedDriver} />
              </SectionCard>
            )}

            {deliveryType === "delivery" && (
              <SectionCard
                title="Pickup from showroom"
                icon={<Store className="w-4 h-4 text-purple-400" />}
              >
                <AddressBlock info={order.pickUpInfo} />
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
