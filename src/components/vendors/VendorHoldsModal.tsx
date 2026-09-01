"use client";

import { useGetVendorHoldsQuery } from "@/redux/features/vendor/order/orderSlice";
import { Package, Store, X } from "lucide-react";
import { useRouter } from "next/navigation";

type WindowHold = {
  orderId: string;
  trackingNumber?: number | string;
  deliveredAt?: string;
  holdUntil?: string;
  heldAmount?: number;
  showroom?: string;
  showroomName?: string;
};

type ReturnHoldItem = {
  orderProductId?: string;
  product?: string;
  sizeType?: string;
  quantity?: number;
  holdAmount?: number;
  holdStatus?: string;
  itemStatus?: string;
};

type ReturnHold = {
  returnId: string;
  trackingNumber?: number | string;
  status?: string;
  heldAmount?: number;
  items?: ReturnHoldItem[];
};

type VendorHoldsData = {
  windowHolds?: WindowHold[];
  returnHolds?: ReturnHold[];
  totalHeldBalance?: number;
};

function formatMoney(amount?: number) {
  return (
    "₵" +
    Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status?: string) {
  const value = (status || "").toUpperCase();
  if (["APPROVED", "SETTLED", "COMPLETED", "RELEASED"].includes(value)) {
    return "bg-green-900/30 text-green-300 border border-green-500/30";
  }
  if (["REJECTED", "DECLINED"].includes(value)) {
    return "bg-red-900/30 text-red-300 border border-red-500/30";
  }
  if (["HELD", "PENDING"].includes(value)) {
    return "bg-amber-900/30 text-amber-300 border border-amber-500/30";
  }
  return "bg-purple-900/30 text-purple-300 border border-purple-500/30";
}

export default function VendorHoldsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { data, isLoading, error } = useGetVendorHoldsQuery(undefined, {
    skip: !open,
  });

  if (!open) return null;

  const holds = (data?.data || {}) as VendorHoldsData;
  const windowHolds = holds.windowHolds || [];
  const returnHolds = holds.returnHolds || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-purple-500/30 bg-[#0f0b1a]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#0f0b1a]">
          <div>
            <h3 className="text-xl font-semibold text-white">Held balance</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Total held {formatMoney(holds.totalHeldBalance)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:text-white flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {isLoading && (
            <p className="text-purple-300 text-center py-8">Loading holds...</p>
          )}
          {error && (
            <p className="text-red-400 text-center py-8">
              {(error as { data?: { message?: string } })?.data?.message ||
                "Failed to load holds"}
            </p>
          )}

          {!isLoading && !error && (
            <>
              <section>
                <h4 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
                  Order window holds
                </h4>
                {windowHolds.length === 0 ? (
                  <p className="text-sm text-gray-500">No order holds right now.</p>
                ) : (
                  <div className="space-y-3">
                    {windowHolds.map((hold) => (
                      <button
                        key={hold.orderId}
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push(
                            `/vendor-dashboard/orders/details?id=${hold.orderId}`,
                          );
                        }}
                        className="w-full text-left rounded-xl cursor-pointer border border-gray-800 bg-black/30 p-4 hover:border-purple-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-white font-medium">
                              Tracking #{hold.trackingNumber}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Store size={12} />
                              {hold.showroomName || "Showroom"}
                            </p>
                          </div>
                          <p className="text-amber-300 font-semibold">
                            {formatMoney(hold.heldAmount)}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
                          <p className="text-gray-400">
                            Delivered:{" "}
                            <span className="text-gray-200">
                              {formatDate(hold.deliveredAt)}
                            </span>
                          </p>
                          <p className="text-gray-400">
                            Hold until:{" "}
                            <span className="text-gray-200">
                              {formatDate(hold.holdUntil)}
                            </span>
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h4 className="text-sm uppercase tracking-wide text-gray-400 mb-3">
                  Return holds
                </h4>
                {returnHolds.length === 0 ? (
                  <p className="text-sm text-gray-500">No return holds right now.</p>
                ) : (
                  <div className="space-y-3">
                    {returnHolds.map((hold) => (
                      <button
                        key={hold.returnId}
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push(
                            `/vendor-dashboard/orders/return-product?id=${hold.returnId}`,
                          );
                        }}
                        className="w-full text-left rounded-xl border border-gray-800 bg-black/30 p-4 hover:border-purple-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-white font-medium">
                              Return #{hold.trackingNumber}
                            </p>
                            {hold.status && (
                              <span
                                className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[11px] ${statusClass(hold.status)}`}
                              >
                                {hold.status}
                              </span>
                            )}
                          </div>
                          <p className="text-amber-300 font-semibold">
                            {formatMoney(hold.heldAmount)}
                          </p>
                        </div>
                        <div className="mt-3 space-y-2">
                          {(hold.items || []).map((item, index) => (
                            <div
                              key={`${item.orderProductId}-${item.sizeType}-${index}`}
                              className="flex items-center justify-between gap-3 text-sm rounded-lg bg-gray-900/50 px-3 py-2"
                            >
                              <span className="text-gray-300 flex items-center gap-2">
                                <Package size={14} className="text-purple-300" />
                                Size {item.sizeType} · Qty {item.quantity}
                                {item.holdStatus ? ` · ${item.holdStatus}` : ""}
                              </span>
                              <span className="text-white">
                                {formatMoney(item.holdAmount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
