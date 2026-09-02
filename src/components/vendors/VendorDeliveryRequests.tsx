"use client";

import { buildImageUrl } from "@/lib/imageBaseUrl";
import { formatStatusLabel, statusBadgeClass } from "@/lib/orderStatus";
import { useGetVendorDeliveryRequestsQuery } from "@/redux/features/deliveryRequest/deliveryRequest";
import {
  History,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type AddressBlock = {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  country?: string;
  state?: string;
  zipCode?: string;
  coordinates?: number[];
};

type TrackingEvent = {
  _id?: string;
  status?: string;
  message?: string;
  createdAt?: string;
};

type VendorDeliveryRequest = {
  _id: string;
  trackingNumber?: string | number;
  status?: string;
  type?: string;
  category?: string;
  purpose?: string;
  payer?: string;
  numberOfItems?: number;
  rejectedReason?: string;
  images?: string[];
  createdAt?: string;
  sourceReturn?: string;
  weight?: { unit?: string; value?: number };
  price?: { currency?: string; tip?: number; deliveryFee?: number };
  pickupLocation?: AddressBlock;
  deliveryAddress?: AddressBlock;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
  };
  tracking?: TrackingEvent[];
};

function unwrapRequests(payload: unknown): VendorDeliveryRequest[] {
  const root = payload as { data?: unknown } | unknown[] | null | undefined;
  if (Array.isArray(root)) return root as VendorDeliveryRequest[];
  const data = (root as { data?: unknown } | null)?.data;
  if (Array.isArray(data)) return data as VendorDeliveryRequest[];
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: VendorDeliveryRequest[] }).data;
  }
  return [];
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

function formatMoney(amount?: number, currency = "ghs") {
  const value = Number(amount ?? 0);
  const code = (currency || "ghs").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(value);
  } catch {
    return `${code} ${value.toFixed(2)}`;
  }
}

function AddressCard({
  title,
  address,
}: {
  title: string;
  address?: AddressBlock;
}) {
  if (!address) return null;
  return (
    <div className="bg-black/30 border border-gray-800 rounded-xl p-4 space-y-2">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <MapPin className="w-4 h-4 text-purple-400" />
        {title}
      </h3>
      {address.name && (
        <p className="text-sm text-gray-200 flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          {address.name}
        </p>
      )}
      {address.phone && (
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          {address.phone}
        </p>
      )}
      {address.email && (
        <p className="text-sm text-gray-300 flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          {address.email}
        </p>
      )}
      {address.location && (
        <p className="text-sm text-gray-400">{address.location}</p>
      )}
      {(address.country || address.state || address.zipCode) && (
        <p className="text-xs text-gray-500">
          {[address.country, address.state, address.zipCode]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
    </div>
  );
}

export default function VendorDeliveryRequests() {
  const { data, isLoading, isError } = useGetVendorDeliveryRequestsQuery({});
  const [selected, setSelected] = useState<VendorDeliveryRequest | null>(null);

  const requests = useMemo(() => unwrapRequests(data), [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-cormorant font-semibold text-white">
          Delivery Request
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Delivery requests created for your showroom, including return recovery.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-300 bg-[#2E2E34] rounded-xl border border-red-500/30">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Failed to load delivery requests.</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-[#2E2E34] rounded-xl border border-gray-800">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No delivery requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const total =
              Number(request.price?.deliveryFee || 0) +
              Number(request.price?.tip || 0);
            const image = buildImageUrl(request.images?.[0] || request.user?.image);

            return (
              <button
                key={request._id}
                type="button"
                onClick={() => setSelected(request)}
                className="w-full text-left cursor-pointer bg-[#2E2E34] border border-gray-800 rounded-xl p-4 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">
                          {request.deliveryAddress?.name ||
                            request.pickupLocation?.name ||
                            "Delivery request"}
                        </p>
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {request.deliveryAddress?.location ||
                            request.pickupLocation?.location ||
                            "No address"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          #{request.trackingNumber || request._id.slice(-8)} ·{" "}
                          {formatStatusLabel(request.purpose || request.category || request.type)} ·{" "}
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${statusBadgeClass(request.status, "chip")}`}
                      >
                        {formatStatusLabel(request.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                      <span>
                        {formatMoney(total, request.price?.currency)}
                      </span>
                      <span>{request.numberOfItems ?? 0} item{(request.numberOfItems ?? 0) === 1 ? "" : "s"}</span>
                      {request.payer && (
                        <span>Payer: {formatStatusLabel(request.payer)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close delivery request"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 flex h-full items-center justify-center p-4 pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-3xl max-h-[min(92vh,900px)] overflow-hidden rounded-2xl border border-gray-800 bg-[#1e1e24] shadow-2xl flex flex-col"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-gray-800 p-5">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Delivery details
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Tracking #{selected.trackingNumber || selected._id.slice(-8)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusBadgeClass(selected.status, "chip")}`}>
                    {formatStatusLabel(selected.status)}
                  </span>
                  {selected.purpose && (
                    <span className={`text-xs px-2.5 py-1 rounded-full ${statusBadgeClass(selected.purpose, "chip")}`}>
                      {formatStatusLabel(selected.purpose)}
                    </span>
                  )}
                  {selected.payer && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300">
                      Payer: {formatStatusLabel(selected.payer)}
                    </span>
                  )}
                </div>

                {selected.user && (
                  <div className="bg-black/30 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-gray-700 shrink-0">
                      {buildImageUrl(selected.user.image) ? (
                        <img
                          src={buildImageUrl(selected.user.image)}
                          alt={selected.user.name || "Requester"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {selected.user.name || "Requester"}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {selected.user.email}
                      </p>
                      {selected.user.phone && (
                        <p className="text-sm text-gray-500">{selected.user.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AddressCard title="Pickup" address={selected.pickupLocation} />
                  <AddressCard title="Drop-off" address={selected.deliveryAddress} />
                </div>

                <div className="bg-black/30 border border-gray-800 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    Package
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Items</p>
                      <p className="text-white">{selected.numberOfItems ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Weight</p>
                      <p className="text-white">
                        {Number(selected.weight?.value) > 0
                          ? `${selected.weight?.value} ${selected.weight?.unit || "kg"}`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="text-white capitalize">
                        {selected.category || selected.type || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="text-white">{formatDate(selected.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 border border-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery fee</span>
                    <span className="text-white">
                      {formatMoney(selected.price?.deliveryFee, selected.price?.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tip</span>
                    <span className="text-white">
                      {formatMoney(selected.price?.tip, selected.price?.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold border-t border-gray-800 pt-2">
                    <span className="text-white">Total</span>
                    <span className="text-purple-300">
                      {formatMoney(
                        Number(selected.price?.deliveryFee || 0) +
                          Number(selected.price?.tip || 0),
                        selected.price?.currency,
                      )}
                    </span>
                  </div>
                </div>

                {selected.tracking && selected.tracking.length > 0 && (
                  <div className="bg-black/30 border border-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <History className="w-4 h-4 text-purple-400" />
                      Tracking
                    </h3>
                    <div className="space-y-3">
                      {selected.tracking.map((event, index) => (
                        <div key={event._id || `${event.status}-${index}`} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5" />
                            {index < selected.tracking!.length - 1 && (
                              <div className="w-px flex-1 bg-gray-700 mt-1" />
                            )}
                          </div>
                          <div className="pb-3">
                            <p className="text-sm text-white">
                              {formatStatusLabel(event.status)}
                            </p>
                            {event.message && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {event.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDate(event.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.images && selected.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selected.images.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
                      >
                        <img
                          src={buildImageUrl(image, "/images/jacket.png")}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selected.rejectedReason && (
                  <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
                    <p className="text-sm font-medium text-red-300">Rejected</p>
                    <p className="text-sm text-gray-300 mt-1">{selected.rejectedReason}</p>
                  </div>
                )}

                {selected.sourceReturn && (
                  <Link
                    href={`/vendor-dashboard/orders/return-product?id=${selected.sourceReturn}`}
                    className="inline-flex text-sm text-purple-300 hover:text-purple-200"
                  >
                    View source return
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
