"use client";

import {
  canCreateReturnDelivery,
  getReturnProductId,
  getReturnProductImage,
  getReturnProductName,
  type ReturnDeliveryRequest,
} from "@/components/shared/ReturnAdminSections";
import MapComponent, {
  type SelectedLocation,
} from "@/components/CustomerDashboard/Location";
import { showApiErrorToast } from "@/lib/apiErrorToast";
import {
  calcDistanceDeliveryUsd,
  calcWeightChargeUsd,
  FALLBACK_DISTANCE_DELIVERY_USD,
  haversineKm,
  validLngLat,
  weightAmountToKg,
} from "@/lib/deliveryPricing";
import { buildImageUrl } from "@/lib/imageBaseUrl";
import { formatStatusLabel } from "@/lib/orderStatus";
import { parsePlatformSettings } from "@/lib/platformSettings";
import { useCreateReturnDeliveryRequestMutation } from "@/redux/features/order/orderSlice";
import { usePlatformFreeQuery } from "@/redux/features/settings/settingsSlice";
import { Scale, Truck, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type AddressForm = {
  name: string;
  phone: string;
  email: string;
  location: string;
  country: string;
  state: string;
  zipCode: string;
  coordinates: [number, number];
};

type ContactPrefill = {
  name?: string;
  address?: string;
  country?: string;
  state?: string;
  zipcode?: number | string;
  email?: string;
  phone?: number | string;
  location?: { type?: string; coordinates?: number[] };
};

const WEIGHT_UNITS = ["kg", "mg", "gm", "gram", "pound", "ounce"] as const;

const ALLOWED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".heic",
  ".heif",
] as const;

const FILE_ACCEPT = [...ALLOWED_IMAGE_EXTENSIONS, "image/*"].join(",");

type Attachment = {
  file: File;
  previewUrl: string;
};

function fileExtension(name: string) {
  const match = name.trim().toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match?.[1] || "";
}

function isAllowedImageFile(file: File) {
  const ext = fileExtension(file.name);
  if ((ALLOWED_IMAGE_EXTENSIONS as readonly string[]).includes(ext)) return true;
  return file.type.startsWith("image/") && file.type !== "image/gif";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const inputClass =
  "w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500";

function money(amount: number) {
  return `₵${amount.toFixed(2)}`;
}

function cleanPart(value?: number | string | null) {
  if (value === undefined || value === null) return "";
  const text = String(value).trim();
  if (!text || text === "0" || text.toUpperCase() === "N/A") return "";
  return text;
}

function prefillAddress(info?: ContactPrefill | null): AddressForm {
  const coords = validLngLat(info?.location?.coordinates) ?? [0, 0];
  return {
    name: cleanPart(info?.name),
    phone: cleanPart(info?.phone),
    email: cleanPart(info?.email),
    location: cleanPart(info?.address),
    country: cleanPart(info?.country),
    state: cleanPart(info?.state),
    zipCode: cleanPart(info?.zipcode),
    coordinates: coords,
  };
}

function hasValidCoordinates(coordinates: [number, number]) {
  return Boolean(validLngLat(coordinates));
}

export default function ReturnDeliveryRequestPanel({
  returnOrderId,
  request,
  addressPrefill,
  pickupPrefill,
  onCreated,
}: {
  returnOrderId: string;
  request?: ReturnDeliveryRequest | null;
  addressPrefill?: ContactPrefill | null;
  pickupPrefill?: ContactPrefill | null;
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<AddressForm>(() =>
    prefillAddress(addressPrefill),
  );
  const [tip, setTip] = useState("0");
  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<(typeof WEIGHT_UNITS)[number]>("kg");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [createRequest, { isLoading }] = useCreateReturnDeliveryRequestMutation();
  const { data: platformData } = usePlatformFreeQuery(undefined);
  const settings = parsePlatformSettings(platformData);

  const canCreate = canCreateReturnDelivery(request);
  const items = request?.eligibleItems || [];

  const pickupCoords = validLngLat(pickupPrefill?.location?.coordinates);
  const dropoffCoords = validLngLat(address.coordinates);

  const quote = useMemo(() => {
    const ratePerKm = settings.perKmDistancePrice;
    const ratePerKg = settings.perKgWeightPrice;
    const enteredWeight = Number(weightValue);
    const hasWeight =
      weightValue.trim() !== "" &&
      Number.isFinite(enteredWeight) &&
      enteredWeight > 0;
    const weightKg = hasWeight
      ? weightAmountToKg(enteredWeight, weightUnit)
      : 0;
    const weightFee = calcWeightChargeUsd(weightKg, ratePerKg);

    if (pickupCoords && dropoffCoords) {
      const km = haversineKm(
        pickupCoords[1],
        pickupCoords[0],
        dropoffCoords[1],
        dropoffCoords[0],
      );
      const distanceFee = calcDistanceDeliveryUsd(
        pickupCoords[1],
        pickupCoords[0],
        dropoffCoords[0],
        dropoffCoords[1],
        ratePerKm,
      );
      return {
        km: parseFloat(km.toFixed(1)),
        distanceFee,
        weightFee,
        weightKg: parseFloat(weightKg.toFixed(3)),
        hasWeight,
        usingFallback: false,
        deliveryFee: parseFloat((distanceFee + weightFee).toFixed(2)),
      };
    }

    const distanceFee = FALLBACK_DISTANCE_DELIVERY_USD;
    return {
      km: null as number | null,
      distanceFee,
      weightFee,
      weightKg: parseFloat(weightKg.toFixed(3)),
      hasWeight,
      usingFallback: true,
      deliveryFee: parseFloat((distanceFee + weightFee).toFixed(2)),
    };
  }, [
    pickupCoords,
    dropoffCoords,
    settings.perKmDistancePrice,
    settings.perKgWeightPrice,
    weightValue,
    weightUnit,
  ]);

  const tipAmount = Number(tip);
  const safeTip = Number.isFinite(tipAmount) && tipAmount > 0 ? tipAmount : 0;
  const totalToSubmit = parseFloat((quote.deliveryFee + safeTip).toFixed(2));

  useEffect(() => {
    if (!open) return;
    setAddress(prefillAddress(addressPrefill));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, addressPrefill, isLoading]);

  useEffect(() => {
    if (open) return;
    setTip("0");
    setWeightValue("");
    setWeightUnit("kg");
    setAttachments((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  }, [open]);

  if (!request) return null;

  const handleMapSave = (location: SelectedLocation) => {
    setAddress((current) => ({
      ...current,
      location: location.name || current.location,
      coordinates: [
        location.coordinates.longitude,
        location.coordinates.latitude,
      ],
      country: location.country || current.country,
      state: location.state || current.state,
      zipCode: location.zipCode || current.zipCode,
    }));
  };

  const handleFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const accepted: Attachment[] = [];
    let rejected = 0;
    Array.from(list).forEach((file) => {
      if (!isAllowedImageFile(file)) {
        rejected += 1;
        return;
      }
      accepted.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    });
    if (rejected > 0) {
      toast.error("Only image files are supported.");
    }
    if (accepted.length === 0) return;
    setAttachments((current) => [...current, ...accepted]);
  };

  const removeFile = (index: number) => {
    setAttachments((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (
      !address.name.trim() ||
      !address.phone.trim() ||
      !address.location.trim() ||
      !address.country.trim() ||
      !address.state.trim() ||
      !address.zipCode.trim()
    ) {
      toast.error("Name, phone, location, country, state, and zip code are required.");
      return;
    }
    if (!isValidEmail(address.email)) {
      toast.error("A valid drop-off email is required.");
      return;
    }
    if (!hasValidCoordinates(address.coordinates)) {
      toast.error("Select a drop-off point on the map.");
      return;
    }

    const payload: {
      deliveryAddress: {
        name: string;
        phone: string;
        coordinates: [number, number];
        location: string;
        email: string;
        country: string;
        state: string;
        zipCode: string;
      };
      deliveryFee: number;
      tip: number;
      category: string;
      weight?: { unit: (typeof WEIGHT_UNITS)[number]; value: number };
    } = {
      deliveryAddress: {
        name: address.name.trim(),
        phone: address.phone.trim(),
        coordinates: address.coordinates,
        location: address.location.trim(),
        email: address.email.trim(),
        country: address.country.trim(),
        state: address.state.trim(),
        zipCode: address.zipCode.trim(),
      },
      deliveryFee: quote.deliveryFee,
      tip: safeTip,
      category: "return",
    };

    if (quote.hasWeight) {
      payload.weight = {
        unit: weightUnit,
        value: Number(weightValue),
      };
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    attachments.forEach((item) => formData.append("files", item.file));

    try {
      const res = await createRequest({
        orderId: returnOrderId,
        formData,
      }).unwrap();
      const message =
        typeof (res as { message?: string })?.message === "string"
          ? (res as { message: string }).message
          : "Delivery request created";
      toast.success(message);
      setOpen(false);
      onCreated?.();
    } catch (err) {
      showApiErrorToast(err, "Failed to create delivery request");
    }
  };

  return (
    <>
      <div className="rounded-xl border border-purple-500/25 bg-gradient-to-br from-purple-950/30 to-black/30 p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-medium text-white">
                Request delivery
              </p>
            </div>
            <p className="text-sm text-gray-300 mt-1">
              {canCreate
                ? "Request a driver for these eligible items. Confirm the drop-off address, then review the amount due."
                : request.existingRequestId
                  ? "A delivery request already exists for this return."
                  : request.reason || "A delivery request cannot be created right now."}
            </p>
          </div>
          {request.payer && (
            <span className="text-[11px] text-gray-400 shrink-0">
              Payer: {formatStatusLabel(request.payer)}
            </span>
          )}
        </div>

        {canCreate && (
          <div className="rounded-lg border border-gray-800 bg-black/30 px-3 py-2.5 space-y-1.5 text-xs text-gray-400">
            <div className="flex justify-between gap-3">
              <span>Distance</span>
              <span className="text-gray-200">
                ₵{settings.perKmDistancePrice}/km
                {quote.km != null ? ` · ${quote.km} km` : " · estimate until route is ready"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Weight charge</span>
              <span className="text-gray-200">
                Optional · ₵{settings.perKgWeightPrice}/kg
              </span>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Eligible items
            </p>
            {items.map((item, index) => {
              const name = getReturnProductName(item.product);
              const image = getReturnProductImage(item.product);
              return (
                <div
                  key={`${getReturnProductId(item.product) || item.orderProductId}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-black/30 p-2.5"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
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
                    <p className="text-sm text-white truncate">{name}</p>
                    <p className="text-xs text-gray-400">
                      Size {item.sizeType || "—"} · Qty {item.quantity ?? 1}
                      {item.location ? ` · ${formatStatusLabel(item.location)}` : ""}
                    </p>
                  </div>
                  {item.itemStatus && (
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {formatStatusLabel(item.itemStatus)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {canCreate && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium"
          >
            Request delivery
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close delivery request"
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={() => {
              if (!isLoading) setOpen(false);
            }}
          />
          <div className="relative z-10 flex h-full items-center justify-center p-4 pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-2xl max-h-[min(92vh,900px)] flex flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0a0a0f]/95 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-gray-800 p-5">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Request delivery
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    One request covers all eligible items. Confirm the drop-off
                    address, then review the amount due.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 min-h-0 p-5 space-y-5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Items in this request
                  </p>
                  {items.map((item, index) => (
                    <div
                      key={`${getReturnProductId(item.product)}-${index}`}
                      className="flex justify-between gap-3 text-sm text-gray-200 rounded-lg border border-gray-800 bg-black/30 px-3 py-2"
                    >
                      <span className="truncate">
                        {getReturnProductName(item.product)}
                      </span>
                      <span className="text-gray-400 shrink-0">
                        Size {item.sizeType || "—"} × {item.quantity ?? 1}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Drop-off address
                    </p>
                    <MapComponent
                      onLocationSave={handleMapSave}
                      showroomCoordinates={
                        pickupCoords ??
                        (hasValidCoordinates(address.coordinates)
                          ? address.coordinates
                          : null)
                      }
                      showroomName={pickupPrefill?.name || "Pickup"}
                      weightDeliveryUsd={quote.weightFee}
                      ratePerKm={settings.perKmDistancePrice}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        placeholder="Name"
                        value={address.name}
                        onChange={(e) =>
                          setAddress((current) => ({ ...current, name: e.target.value }))
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Phone"
                        value={address.phone}
                        onChange={(e) =>
                          setAddress((current) => ({ ...current, phone: e.target.value }))
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Email"
                        value={address.email}
                        onChange={(e) =>
                          setAddress((current) => ({ ...current, email: e.target.value }))
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Country"
                        value={address.country}
                        onChange={(e) =>
                          setAddress((current) => ({
                            ...current,
                            country: e.target.value,
                          }))
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="State"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((current) => ({ ...current, state: e.target.value }))
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Zip code"
                        value={address.zipCode}
                        onChange={(e) =>
                          setAddress((current) => ({
                            ...current,
                            zipCode: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <textarea
                      className={`${inputClass} min-h-[72px] resize-none`}
                      placeholder="Street address"
                      value={address.location}
                      onChange={(e) =>
                        setAddress((current) => ({
                          ...current,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>

                <div className="rounded-xl border border-dashed border-gray-700 bg-black/20 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <Scale className="w-4 h-4 text-purple-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-white">
                          Package weight
                          <span className="ml-2 text-[11px] uppercase tracking-wide text-purple-300">
                            Optional
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Add weight only if you know it. This adds ₵
                          {settings.perKgWeightPrice}/kg to the delivery fee so
                          you can see the extra cost before submitting.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Leave blank to skip"
                      value={weightValue}
                      onChange={(e) => setWeightValue(e.target.value)}
                    />
                    <select
                      className={inputClass}
                      value={weightUnit}
                      onChange={(e) =>
                        setWeightUnit(e.target.value as (typeof WEIGHT_UNITS)[number])
                      }
                    >
                      {WEIGHT_UNITS.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  {quote.hasWeight && (
                    <p className="text-xs text-purple-300">
                      {quote.weightKg} kg × ₵{settings.perKgWeightPrice}/kg ={" "}
                      {money(quote.weightFee)}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2">
                    Photos (optional)
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {attachments.map((item, index) => (
                      <div
                        key={`${item.file.name}-${index}`}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700 bg-black/40"
                      >
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <label className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500">
                      <input
                        type="file"
                        multiple
                        accept={FILE_ACCEPT}
                        className="hidden"
                        onChange={(e) => {
                          handleFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                      <Upload className="w-4 h-4 text-purple-400" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 p-5 space-y-4 bg-black/40">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3 text-gray-400">
                    <span>
                      Distance
                      {quote.km != null ? (
                        <span className="ml-1 text-xs text-purple-300/80">
                          ({quote.km} km · ₵{settings.perKmDistancePrice}/km)
                        </span>
                      ) : (
                        <span className="ml-1 text-xs text-gray-500">
                          ({quote.usingFallback ? "estimate" : "route pending"})
                        </span>
                      )}
                    </span>
                    <span className="text-white">{money(quote.distanceFee)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-gray-400">
                    <span>
                      Weight
                      {quote.hasWeight ? (
                        <span className="ml-1 text-xs text-purple-300/80">
                          ({quote.weightKg} kg · ₵{settings.perKgWeightPrice}/kg)
                        </span>
                      ) : (
                        <span className="ml-1 text-xs text-gray-500">(not added)</span>
                      )}
                    </span>
                    <span className="text-white">{money(quote.weightFee)}</span>
                  </div>
                  <div className="flex justify-between gap-3 text-gray-300 font-medium pt-1">
                    <span>Delivery fee</span>
                    <span className="text-white">{money(quote.deliveryFee)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-gray-400">Driver tip</label>
                    <input
                      className={`${inputClass} w-28 text-right`}
                      type="number"
                      min="0"
                      value={tip}
                      onChange={(e) => setTip(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between gap-3 border-t border-gray-700 pt-3 text-base font-semibold">
                    <span className="text-white">Total to submit</span>
                    <span className="text-purple-300">{money(totalToSubmit)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white font-semibold"
                >
                  {isLoading
                    ? "Creating request..."
                    : `Submit ${money(totalToSubmit)}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
