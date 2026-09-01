"use client";

import BackButton from "@/customComponent/BackButton";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import {
  canRequestOrderReturn,
  getReturnWindowDays,
} from "@/lib/returnWindow";
import { useAddToCartWishListMutation } from "@/redux/features/home/homeSlice";
import {
  useGetMainOrderDetailsQuery,
  useGetReturnOrderDetailsQuery,
} from "@/redux/features/order/orderSlice";
import { usePlatformFreeQuery } from "@/redux/features/settings/settingsSlice";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";

const TRACKING_PREVIEW_COUNT = 3;

type SizeLine = {
  _id?: string;
  type?: string;
  size?: string;
  quantity?: number;
  pricing?: {
    paidUnitPrice?: number;
    totalPaidPrice?: number;
  };
};

type OrderProduct = {
  _id?: string;
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
  };
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

type TrackingEvent = {
  _id?: string;
  status: string;
  message?: string;
  createdAt?: string;
};

type OrderDriver = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: number | string;
  image?: string;
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

type MainOrder = {
  _id?: string;
  products?: OrderProduct[];
  deliveryType?: string;
  orderStatus?: string;
  deliveredAt?: string;
  price?: OrderPrice;
  deliveryInfo?: ContactInfo;
  pickUpInfo?: ContactInfo;
  driver?: OrderDriver | null;
  tracking?: TrackingEvent[];
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

function normalizeDeliveryType(value?: string | null) {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "pick-up" || v === "pickup" || v === "pick_up") return "pick-up";
  return "delivery";
}

function getProductLines(product: OrderProduct): SizeLine[] {
  if (product.sizes?.length) return product.sizes;
  return product.size || [];
}

function getAssignedDriver(driver?: OrderDriver | null) {
  if (!driver || typeof driver !== "object") return null;
  if (!driver._id && !driver.name && !driver.email) return null;
  return driver;
}

function driverInitials(name?: string) {
  const parts = (name || "Driver").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "D") + (parts[1]?.[0] || "")).toUpperCase();
}

function statusClass(status?: string) {
  if (status === "Delivered" || status === "Completed" || status === "Returned") {
    return "bg-[#0070254D] text-[#00DD00]";
  }
  if (
    status === "Rejected" ||
    status === "Vendor Rejected" ||
    status === "Customer Rejected" ||
    status === "Return Declined"
  ) {
    return "bg-red-500/20 text-red-400";
  }
  if (status === "Processing" || status === "Order Placed") {
    return "bg-orange-500/20 text-orange-400";
  }
  return "bg-blue-500/20 text-blue-400";
}

function productsFromReturn(returnData: any): OrderProduct[] {
  if (returnData?.order?.products?.length) return returnData.order.products;
  if (returnData?.items?.length) {
    return returnData.items.map((item: any, index: number) => ({
      _id: item.orderProductId || `${item.product}-${index}`,
      product: {
        _id: item.product,
        product_name: item.productSnapshot?.name,
        product_images: item.productSnapshot?.thumbnail
          ? [item.productSnapshot.thumbnail]
          : [],
      },
      productSnapshot: item.productSnapshot,
      sizes: [
        {
          type: item.sizeType,
          quantity: item.quantity,
          pricing: {
            paidUnitPrice: item.refundLine?.paidUnitPrice,
            totalPaidPrice: item.refundLine?.refundAmount,
          },
        },
      ],
    }));
  }
  if (returnData?.product) {
    return [
      {
        _id: returnData._id,
        product: returnData.product,
        size: returnData.size || [],
      },
    ];
  }
  return [];
}

function InfoRow({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <p className="text-sm text-gray-300">
      <span className="text-gray-500">{label}:</span> {value}
    </p>
  );
}

function AddressCard({
  title,
  info,
}: {
  title: string;
  info?: ContactInfo;
}) {
  if (!info) return null;
  const location = [info.address, info.state, info.country, info.zipcode]
    .filter(
      (part) =>
        part !== undefined &&
        part !== null &&
        String(part).trim() &&
        String(part) !== "0" &&
        String(part).toUpperCase() !== "N/A",
    )
    .join(", ");

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-purple-500/40">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        <InfoRow label="Name" value={info.name} />
        <InfoRow label="Email" value={info.email} />
        <InfoRow label="Phone" value={info.phone} />
        <InfoRow label="Address" value={location || info.address} />
      </div>
    </div>
  );
}

function TrackingCard({ events }: { events: TrackingEvent[] }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...events].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
  const canToggle = sorted.length > TRACKING_PREVIEW_COUNT;
  const visible =
    expanded || !canToggle ? sorted : sorted.slice(-TRACKING_PREVIEW_COUNT);

  if (!sorted.length) return null;

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-purple-500/40">
      <h3 className="text-lg font-semibold mb-4">Order tracking</h3>
      <ol>
        {visible.map((event, index) => {
          const isLast = index === visible.length - 1;
          return (
            <li
              key={event._id || `${event.status}-${event.createdAt}`}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                    isLast ? "bg-purple-400" : "bg-green-400/80"
                  }`}
                />
                {!isLast && <span className="w-px flex-1 bg-gray-700 my-1" />}
              </div>
              <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-4"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClass(event.status)}`}
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

const OrderDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isBuyingAgain, setIsBuyingAgain] = useState(false);

  const [addToCartWishList] = useAddToCartWishListMutation();

  const { data: mainOrderDetails, isLoading: isMainOrderDetailsLoading } =
    useGetMainOrderDetailsQuery(id, {
      skip: !id || id === "undefined",
    });
  const { data: returnOrderDetails, isLoading: isReturnOrderDetailsLoading } =
    useGetReturnOrderDetailsQuery(id, {
      skip: !id || id === "undefined",
    });
  const { data: platformSettings, isLoading: isPlatformSettingsLoading } =
    usePlatformFreeQuery(undefined);

  const mainOrder = (mainOrderDetails?.data || null) as MainOrder | null;
  const returnData = returnOrderDetails?.data;
  const mainOrderStatus = mainOrder?.orderStatus;
  const returnOrderStatus = returnData?.status;
  const deliveryType = normalizeDeliveryType(mainOrder?.deliveryType);
  const priceInfo = mainOrder?.price || returnData?.price;
  const unit = priceInfo?.unit || "usd";
  const deliveryInfo = mainOrder?.deliveryInfo || returnData?.deliveryInfo;
  const pickUpInfo = mainOrder?.pickUpInfo || returnData?.pickUpInfo;
  const assignedDriver = getAssignedDriver(mainOrder?.driver);
  const tracking = mainOrder?.tracking || returnData?.tracking || [];

  const products: OrderProduct[] =
    mainOrder?.products?.length
      ? mainOrder.products
      : productsFromReturn(returnData);

  const totalQuantity =
    products.reduce((sum, product) => {
      return (
        sum +
        getProductLines(product).reduce(
          (lineSum, line) => lineSum + (line.quantity || 0),
          0,
        )
      );
    }, 0) || 1;

  const isDecline =
    mainOrderStatus === "Rejected" ||
    mainOrderStatus === "Return Declined" ||
    returnOrderStatus === "Return Declined";
  const returnWindowDays = getReturnWindowDays(platformSettings);
  const canShowReturn =
    !isPlatformSettingsLoading &&
    canRequestOrderReturn(mainOrder, returnWindowDays);
  const showroomName =
    pickUpInfo?.name || returnData?.showroom?.showroom_name || "Order";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files);
    setImageFiles([...imageFiles, ...filesArray]);

    const newImages: string[] = [];
    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          if (newImages.length === filesArray.length) {
            setUploadedImages([...uploadedImages, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleBuyAgain = async () => {
    if (products.length === 0) return;
    setIsBuyingAgain(true);
    try {
      const results = await Promise.allSettled(
        products.map((p) =>
          addToCartWishList({
            product: p.product?._id,
            saveType: "cart",
            size: (getProductLines(p).length
              ? getProductLines(p)
              : [{ type: "M", quantity: 1 }]
            ).map((s) => ({
              type: s.type || s.size || "M",
              quantity: s.quantity || 1,
            })),
          }).unwrap(),
        ),
      );

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      if (succeeded === 0) {
        const firstError = results.find(
          (r): r is PromiseRejectedResult => r.status === "rejected",
        );
        toast.error(
          firstError?.reason?.data?.message || "Failed to add items to cart",
        );
        return;
      }

      toast.success(
        succeeded < products.length
          ? `Added ${succeeded} of ${products.length} items to cart`
          : "Added to cart!",
      );
      router.push("/shopping-cart");
    } finally {
      setIsBuyingAgain(false);
    }
  };

  const handleSubmit = () => {
    alert("Report submitted! Check console for details.");
    setShowReportModal(false);
    setUploadedImages([]);
    setImageFiles([]);
    setReason("");
  };

  const priceRows = [
    { label: "Subtotal", value: priceInfo?.subtotal ?? priceInfo?.amount, always: true },
    { label: "Product discount", value: priceInfo?.productDiscountTotal, negative: true },
    { label: "Coupon discount", value: priceInfo?.couponDiscountTotal, negative: true },
    {
      label: "Delivery fee",
      value: priceInfo?.deliveryCharge,
      hideOnPickup: true,
    },
    { label: "Weight charge", value: priceInfo?.weightCharge },
    {
      label: priceInfo?.taxPercentage
        ? `Tax (${priceInfo.taxPercentage}%)`
        : "Tax",
      value: priceInfo?.tax,
    },
    { label: "Driver tip", value: priceInfo?.tip },
  ].filter((row) => {
    if (row.always) return true;
    if (row.hideOnPickup && deliveryType === "pick-up") {
      return Number(row.value) > 0;
    }
    return Number(row.value) > 0;
  });

  const grandTotal =
    priceInfo?.grandTotal ??
    (priceInfo?.amount || 0) +
      (priceInfo?.tax || 0) +
      (priceInfo?.tip || 0) +
      (priceInfo?.weightCharge || 0) +
      (priceInfo?.deliveryCharge || 0);

  if (
    id &&
    id !== "undefined" &&
    (isMainOrderDetailsLoading || isReturnOrderDetailsLoading)
  ) {
    return (
      <div className="min-h-screen mt-20 container mx-auto bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 container mx-auto bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <BackButton title="View Details" className="text-[24px]" />
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">{showroomName}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {totalQuantity} item{totalQuantity === 1 ? "" : "s"} in this order
            {mainOrder?._id ? ` · #${mainOrder._id.slice(-8)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {mainOrder?.deliveryType && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-200 capitalize">
              {deliveryType}
            </span>
          )}
          {mainOrderStatus && (
            <div
              className={`px-4 py-1 rounded-lg text-sm font-medium ${statusClass(mainOrderStatus)}`}
            >
              {mainOrderStatus}
            </div>
          )}
          {returnOrderStatus && (
            <div
              className={`px-4 py-1 rounded-lg text-sm font-medium ${statusClass(returnOrderStatus)}`}
            >
              Return: {returnOrderStatus}
            </div>
          )}
          {canShowReturn && (
            <Link href={`/customer-dashboard/return-request?id=${id}`}>
              <div className="bg-[#6100FF] px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#6100FF]/80">
                Return
              </div>
            </Link>
          )}
        </div>
      </div>

      {tracking.length > 0 && (
        <div className="mb-6">
          <TrackingCard events={tracking} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((p, idx) => {
              const name =
                p.product?.product_name || p.productSnapshot?.name || "Product";
              const image =
                p.product?.product_images?.[0] || p.productSnapshot?.thumbnail;
              const lines = getProductLines(p);

              return (
                <div
                  key={p._id || idx}
                  className="bg-gray-900 rounded-lg p-4 border border-purple-500/40"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={buildImageUrl(image, "/images/jacket.png")}
                      alt={name}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/images/jacket.png";
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{name}</p>
                      {p.productSnapshot?.category && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {p.productSnapshot.category}
                        </p>
                      )}
                      <div className="mt-2 space-y-1">
                        {lines.length > 0 ? (
                          lines.map((line, sIdx) => (
                            <div
                              key={line._id || `${line.type}-${sIdx}`}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span className="text-gray-400">
                                Size {line.type || line.size || "M"} · Qty{" "}
                                {line.quantity || 1}
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
                          <span className="text-sm text-gray-500">
                            No size details
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-400">No product info available</div>
          )}
        </div>

        <div className="space-y-6">
          {priceInfo?.coupon && (
            <div className="bg-purple-600 text-white px-4 py-2 rounded-full w-fit text-sm font-medium">
              Coupon: {priceInfo.coupon}
            </div>
          )}

          {priceInfo && (
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 bg-gradient-to-br from-gray-900 via-purple-950/20 to-gray-900">
              <div className="px-5 py-4 border-b border-purple-500/20 bg-purple-900/10">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-purple-300">
                  Price breakdown
                </h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                {priceRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-400">{row.label}</span>
                    <span
                      className={`text-sm font-medium tabular-nums ${row.negative ? "text-green-400" : "text-gray-200"}`}
                    >
                      {row.negative ? "-" : ""}
                      {formatMoney(row.value, unit)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mx-5 mb-5 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/10 border border-purple-500/30 px-5 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-300 tracking-wide uppercase">
                  Total
                </span>
                <span className="text-xl font-bold text-white tabular-nums">
                  {formatMoney(grandTotal, unit)}
                </span>
              </div>
            </div>
          )}

          {deliveryType === "delivery" && assignedDriver && (
            <div className="bg-gray-900 rounded-lg p-4 border border-purple-500/40">
              <h3 className="text-lg font-semibold mb-3">Driver</h3>
              <div className="flex items-center gap-3">
                {buildImageUrl(assignedDriver.image) ? (
                  <img
                    src={buildImageUrl(assignedDriver.image)}
                    alt={assignedDriver.name || "Driver"}
                    className="w-12 h-12 rounded-full object-cover border border-purple-500/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-sm font-semibold text-purple-200">
                    {driverInitials(assignedDriver.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {assignedDriver.name || "Assigned driver"}
                  </p>
                  {assignedDriver.email && (
                    <p className="text-sm text-gray-400 truncate">
                      {assignedDriver.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {deliveryType === "delivery" ? (
            <AddressCard title="Delivery address" info={deliveryInfo} />
          ) : (
            <AddressCard title="Pickup location" info={pickUpInfo} />
          )}

          {deliveryType === "delivery" && (
            <AddressCard title="Picked up from" info={pickUpInfo} />
          )}

          {returnData?.clientReason && (
            <div className="bg-gray-900 rounded-lg p-4 border border-purple-500/40">
              <h3 className="text-lg font-semibold mb-3">Return reason</h3>
              <p className="text-sm text-gray-300">{returnData.clientReason}</p>
              {returnData.vendorReason && (
                <div className="mt-3 pt-3 border-t border-purple-500/30">
                  <p className="text-purple-400 text-xs mb-1">Vendor response</p>
                  <p className="text-sm text-gray-300">
                    {returnData.vendorReason}
                  </p>
                </div>
              )}
            </div>
          )}

          {isDecline ? (
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="w-full bg-[#6100FF] cursor-pointer text-white py-3 rounded-lg font-medium"
              >
                Report
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full max-w-md border text-[#6100FF] cursor-pointer border-gray-500 py-3 rounded-lg font-medium hover:bg-[#6100FF]/10"
              >
                View Reason
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleBuyAgain}
              disabled={isBuyingAgain || products.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium"
            >
              {isBuyingAgain ? "Adding to cart..." : "Buy Again"}
            </button>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md bg-black border border-gray-800 rounded-2xl p-6">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-center mb-2">Report</h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Your report will go to admin
            </p>
            <div className="mb-6">
              <label className="block text-sm mb-3">Upload Images</label>
              <div className="flex gap-3">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 border border-gray-700"
                  >
                    <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 bg-gray-900/50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-purple-400 text-xs">Upload</span>
                </label>
              </div>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write your reason"
              className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-h-[120px] resize-none mb-6"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-lg bg-black border-2 border-[#6100FF] rounded-2xl p-8">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              ×
            </button>
            <h2 className="text-3xl font-serif text-center mb-8">Reason</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              {returnData?.vendorReason ||
                returnData?.clientReason ||
                "No reason was provided for this order."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
