"use client";

import BackButton from "@/customComponent/BackButton";
import { showApiErrorToast } from "@/lib/apiErrorToast";
import { calcDistanceDeliveryUsd } from "@/lib/deliveryPricing";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import {
  canRequestOrderReturn,
  getReturnDeadline,
  getOrderDeliveredAt,
  getReturnWindowDays,
} from "@/lib/returnWindow";
import {
  useAddReturnOrderMutation,
  useGetMainOrderDetailsQuery,
} from "@/redux/features/order/orderSlice";
import { usePlatformFreeQuery } from "@/redux/features/settings/settingsSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import MapComponent from "./Location";

type RefundMethod = "card" | "mobileMoney" | "bank";

type SelectedLocation = {
  name?: string;
  address?: string;
  displayName?: string;
  country?: string;
  state?: string;
  zipCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

type ReturnableLine = {
  key: string;
  orderProductId: string;
  sizeType: string;
  maxQuantity: number;
  name: string;
  image?: string;
  category?: string;
  paidUnitPrice: number;
};

type LineDraft = {
  selected: boolean;
  quantity: number;
  reason: string;
  file: File | null;
  preview: string;
};

function getApiMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const direct = (payload as { message?: unknown }).message;
  if (typeof direct === "string" && direct.trim()) return direct;
  const nested = (payload as { data?: { message?: unknown } }).data?.message;
  if (typeof nested === "string" && nested.trim()) return nested;
  return fallback;
}

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

function getProductLines(product: any) {
  if (product?.sizes?.length) return product.sizes;
  return product?.size || [];
}

function getReturnableLines(products: any[]): ReturnableLine[] {
  const lines: ReturnableLine[] = [];
  for (const product of products) {
    const orderProductId = product?.product?._id;
    if (!orderProductId) continue;
    const sizes = getProductLines(product);
    for (const size of sizes) {
      const sizeType = String(size?.type || size?.size || "").trim();
      const maxQuantity = Number(size?.quantity || 0);
      if (!sizeType || maxQuantity < 1) continue;
      lines.push({
        key: `${orderProductId}-${sizeType}`,
        orderProductId,
        sizeType,
        maxQuantity,
        name:
          product?.product?.product_name ||
          product?.productSnapshot?.name ||
          "Product",
        image:
          product?.product?.product_images?.[0] ||
          product?.productSnapshot?.thumbnail,
        category: product?.productSnapshot?.category,
        paidUnitPrice: Number(
          size?.pricing?.paidUnitPrice ?? size?.pricing?.totalPaidPrice ?? 0,
        ),
      });
    }
  }
  return lines;
}

function emptyDraft(maxQuantity: number): LineDraft {
  return {
    selected: false,
    quantity: Math.min(1, maxQuantity),
    reason: "",
    file: null,
    preview: "",
  };
}

export default function ReturnRequestForm() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const router = useRouter();
  const [returnOrderSubmitted, { isLoading: isSubmitting }] =
    useAddReturnOrderMutation();

  const { data: mainOrderDetails, isLoading } = useGetMainOrderDetailsQuery(
    orderId,
    { skip: !orderId || orderId === "undefined" },
  );
  const { data: platformSettings } = usePlatformFreeQuery(undefined);

  const orderData = mainOrderDetails?.data;
  const products = orderData?.products || [];
  const price = orderData?.price;
  const unit = price?.unit || "usd";
  const returnableLines = useMemo(
    () => getReturnableLines(products),
    [products],
  );

  const [drafts, setDrafts] = useState<Record<string, LineDraft>>({});
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [tip, setTip] = useState("0");
  const [refundMethod, setRefundMethod] = useState<RefundMethod>("card");
  const [cardLast4, setCardLast4] = useState("");
  const [cardBrand, setCardBrand] = useState("Visa");
  const [mobileProvider, setMobileProvider] = useState("MTN");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  useEffect(() => {
    setDrafts((prev) => {
      const next: Record<string, LineDraft> = {};
      for (const line of returnableLines) {
        next[line.key] = prev[line.key] || emptyDraft(line.maxQuantity);
      }
      return next;
    });
  }, [returnableLines]);

  useEffect(() => {
    const info = orderData?.deliveryInfo;
    if (!info) return;
    setFullName((current) => current || info.name || "");
    setLocation((current) => current || info.address || "");
    setCountry((current) => current || info.country || "");
    setState((current) => current || info.state || "");
    setZipCode((current) =>
      current || (info.zipcode ? String(info.zipcode) : ""),
    );
    setEmail((current) => current || info.email || "");
    setPhone((current) => current || (info.phone ? String(info.phone) : ""));

    const coords = info.location?.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      setSelectedLocation((current) =>
        current || {
          address: info.address,
          country: info.country,
          state: info.state,
          zipCode: info.zipcode ? String(info.zipcode) : "",
          coordinates: {
            longitude: Number(coords[0]),
            latitude: Number(coords[1]),
          },
        },
      );
    }
  }, [orderData]);

  const selectedLines = returnableLines.filter(
    (line) => drafts[line.key]?.selected,
  );

  const refundSubtotal = selectedLines.reduce((sum, line) => {
    const qty = drafts[line.key]?.quantity || 0;
    return sum + line.paidUnitPrice * qty;
  }, 0);

  const showroomCoords = orderData?.pickUpInfo?.location?.coordinates;
  const pickupCoords = selectedLocation?.coordinates;
  const deliveryCharge = useMemo(() => {
    if (
      pickupCoords &&
      Array.isArray(showroomCoords) &&
      showroomCoords.length >= 2
    ) {
      return calcDistanceDeliveryUsd(
        pickupCoords.latitude,
        pickupCoords.longitude,
        Number(showroomCoords[0]),
        Number(showroomCoords[1]),
      );
    }
    return Number(price?.deliveryCharge || 10);
  }, [pickupCoords, showroomCoords, price?.deliveryCharge]);

  const tipAmount = Math.max(0, Number(tip) || 0);

  const updateDraft = (key: string, patch: Partial<LineDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || emptyDraft(1)), ...patch },
    }));
  };

  const handleLocationSave = (saved: SelectedLocation) => {
    setSelectedLocation(saved);
    const address = saved.name || saved.address || saved.displayName;
    if (address) setLocation(address);
    if (saved.country) setCountry(saved.country);
    if (saved.state) setState(saved.state);
    if (saved.zipCode) setZipCode(saved.zipCode);
  };

  const handleItemFile = (key: string, file: File | null) => {
    const current = drafts[key];
    if (current?.preview) URL.revokeObjectURL(current.preview);
    updateDraft(key, {
      file,
      preview: file ? URL.createObjectURL(file) : "",
    });
  };

  const buildRefundAccount = () => {
    if (refundMethod === "card") {
      return {
        last4: cardLast4.trim(),
        brand: cardBrand.trim(),
        paymentMethodId: "card",
      };
    }
    if (refundMethod === "mobileMoney") {
      return {
        mobileMoneyProvider: mobileProvider.trim(),
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
      };
    }
    return {
      bankName: bankName.trim(),
      branchName: branchName.trim(),
      routingNumber: routingNumber.trim(),
      accountNumber: accountNumber.trim(),
    };
  };

  const validate = () => {
    if (!orderId) return "Missing order id";
    if (orderData?.orderStatus && orderData.orderStatus !== "Delivered") {
      return "Only delivered orders can be returned";
    }
    if (
      !canRequestOrderReturn(
        orderData,
        getReturnWindowDays(platformSettings),
      )
    ) {
      return "The return window for this order has ended";
    }
    if (selectedLines.length === 0) {
      return "Select at least one item from this order to return";
    }

    for (const line of selectedLines) {
      const draft = drafts[line.key];
      if (!draft.reason.trim()) {
        return `Add a reason for ${line.name} (${line.sizeType})`;
      }
      if (draft.quantity < 1 || draft.quantity > line.maxQuantity) {
        return `Quantity for ${line.name} (${line.sizeType}) must be between 1 and ${line.maxQuantity}`;
      }
      if (!draft.file) {
        return `Upload an image for ${line.name} (${line.sizeType})`;
      }
    }

    if (!fullName.trim() || !location.trim() || !email.trim() || !phone.trim()) {
      return "Fill in pickup name, address, email, and phone";
    }
    if (!selectedLocation?.coordinates) {
      return "Set your pickup location on the map";
    }

    if (refundMethod === "card") {
      if (!/^\d{4,16}$/.test(cardLast4.trim()) || !cardBrand.trim()) {
        return "Enter a valid card last digits and brand";
      }
    } else if (refundMethod === "mobileMoney") {
      if (!mobileProvider.trim() || !accountName.trim() || !accountNumber.trim()) {
        return "Enter mobile money provider, account name, and number";
      }
    } else if (!bankName.trim() || !accountNumber.trim()) {
      return "Enter bank name and account number";
    }

    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validate();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    const items = selectedLines.map((line) => ({
      orderProductId: line.orderProductId,
      sizeType: line.sizeType,
      quantity: drafts[line.key].quantity,
      reason: drafts[line.key].reason.trim(),
    }));

    const payload = {
      refundMethod,
      refundAccount: buildRefundAccount(),
      items,
      price: {
        tip: tipAmount,
        deliveryCharge,
      },
      pickUpInfo: {
        name: fullName.trim(),
        address: location.trim(),
        country: country.trim(),
        state: state.trim(),
        zipcode: Number(zipCode) || 0,
        email: email.trim(),
        phone: Number(String(phone).replace(/\D/g, "")) || phone.trim(),
        location: {
          type: "Point",
          coordinates: [
            selectedLocation!.coordinates!.longitude,
            selectedLocation!.coordinates!.latitude,
          ],
        },
      },
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    selectedLines.forEach((line, index) => {
      const file = drafts[line.key].file;
      if (file) formData.append(`product-${index}`, file);
    });

    try {
      const result = await returnOrderSubmitted({
        orderId,
        formData,
      }).unwrap();
      toast.success(getApiMessage(result, "Return request submitted successfully"));
      router.push("/customer-dashboard");
      // console.log(orderId, payload)
    } catch (error) {
      showApiErrorToast(error, "Failed to submit return request");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-8 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading order details...</div>
      </div>
    );
  }

  if (!orderId || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-8 flex items-center justify-center">
        <div className="text-red-400 text-xl">Order not found</div>
      </div>
    );
  }

  const returnWindowDays = getReturnWindowDays(platformSettings);
  const canReturn = canRequestOrderReturn(orderData, returnWindowDays);
  const returnDeadline = getReturnDeadline(
    getOrderDeliveredAt(orderData),
    returnWindowDays,
  );

  return (
    <div className="bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-16 md:mt-20">
        <BackButton title="Return Request" className="text-3xl" />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-cormorant font-bold mb-2">
          Return
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Select items from this order and tell us why you are returning them.
        </p>
      </div>

      {!canReturn && (
        <div className="max-w-6xl mx-auto mb-6 rounded-xl border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          {orderData.orderStatus !== "Delivered"
            ? `Only delivered orders can be returned. This order is ${orderData.orderStatus || "not delivered"}.`
            : returnDeadline
              ? `The return window for this order ended on ${returnDeadline.toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}.`
              : "This order is no longer eligible for return."}
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Items to return</h3>
            {returnableLines.length === 0 ? (
              <p className="text-gray-500">No returnable items on this order.</p>
            ) : (
              <div className="space-y-4">
                {returnableLines.map((line) => {
                  const draft = drafts[line.key] || emptyDraft(line.maxQuantity);
                  return (
                    <div
                      key={line.key}
                      className="rounded-xl border border-gray-700 bg-black/40 p-4 space-y-4"
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={draft.selected}
                          onChange={(e) =>
                            updateDraft(line.key, { selected: e.target.checked })
                          }
                          className="mt-1 w-4 h-4"
                        />
                        <img
                          src={buildImageUrl(line.image, "/images/jacket.png")}
                          alt={line.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold">{line.name}</p>
                          <p className="text-sm text-gray-400">
                            Size {line.sizeType} · Bought {line.maxQuantity}
                            {line.paidUnitPrice
                              ? ` · ${formatMoney(line.paidUnitPrice, unit)} each`
                              : ""}
                          </p>
                        </div>
                      </label>

                      {draft.selected && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={line.maxQuantity}
                              value={draft.quantity}
                              onChange={(e) =>
                                updateDraft(line.key, {
                                  quantity: Math.min(
                                    line.maxQuantity,
                                    Math.max(1, Number(e.target.value) || 1),
                                  ),
                                })
                              }
                              className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">
                              Photo
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <span className="px-3 py-2 rounded-lg border border-purple-500/50 text-purple-300 text-sm">
                                {draft.file ? "Change image" : "Upload image"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleItemFile(
                                    line.key,
                                    e.target.files?.[0] || null,
                                  )
                                }
                              />
                              {draft.preview && (
                                <img
                                  src={draft.preview}
                                  alt="Return item"
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                            </label>
                          </div>
                          <div className="md:col-span-2">
                            <textarea
                              value={draft.reason}
                              onChange={(e) =>
                                updateDraft(line.key, { reason: e.target.value })
                              }
                              placeholder="Why are you returning this item?"
                              className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-h-[90px] resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border border-gray-700 p-2 rounded-2xl">
            <div className="bg-gradient-to-r from-[#2ACCED] to-[#B630F4] py-2">
              <h3 className="py-3 p-6 text-[24px]">Pickup address</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Set location on map
                </label>
                <MapComponent onLocationSave={handleLocationSave} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Zip code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-700 p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-semibold">Refund method</h3>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  ["card", "Card"],
                  ["mobileMoney", "Mobile money"],
                  ["bank", "Bank"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRefundMethod(value)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    refundMethod === value
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-gray-600 text-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {refundMethod === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={cardLast4}
                  onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ""))}
                  placeholder="Card number"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={cardBrand}
                  onChange={(e) => setCardBrand(e.target.value)}
                  placeholder="Brand (Visa)"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {refundMethod === "mobileMoney" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={mobileProvider}
                  onChange={(e) => setMobileProvider(e.target.value)}
                  placeholder="Provider (MTN)"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Account name"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account number"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {refundMethod === "bank" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank name"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Branch name"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="Routing number"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Account number"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/10 border border-gray-800 rounded-2xl p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Return summary</h3>
            <div className="mb-6 pb-6 border-b border-gray-700 space-y-3">
              {selectedLines.length === 0 ? (
                <p className="text-sm text-gray-500">No items selected yet.</p>
              ) : (
                selectedLines.map((line) => (
                  <div key={line.key} className="flex justify-between gap-3 text-sm">
                    <span className="text-gray-300">
                      {line.name} · {line.sizeType} × {drafts[line.key].quantity}
                    </span>
                    <span>
                      {formatMoney(
                        line.paidUnitPrice * drafts[line.key].quantity,
                        unit,
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Refund subtotal</span>
                <span>{formatMoney(refundSubtotal, unit)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pickup charge</span>
                <span>{formatMoney(deliveryCharge, unit)}</span>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Driver tip
                </label>
                <input
                  type="number"
                  min={0}
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !canReturn}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-semibold"
            >
              {isSubmitting ? "Sending..." : "Send request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
