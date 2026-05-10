


// "use client";
// import MapComponent, {
//   SelectedLocation,
// } from "@/components/CustomerDashboard/Location";
// import { useGetProductEventWishesSizeQuery } from "@/redux/features/event/eventSlice";
// import { useGetWishlistAndCartQuery } from "@/redux/features/home/homeSlice";
// import { useAddVendorOrderMutation } from "@/redux/features/order/orderSlice";
// import { Loader2, MapPin, X } from "lucide-react";
// import { useRouter, useSearchParams } from "next/navigation";
// import React, { useMemo, useState } from "react";
// import toast from "react-hot-toast";
// import { FaArrowLeft } from "react-icons/fa";

// // ---------------------------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------------------------

// /** Haversine distance in km between two lat/lng points */
// function haversineKm(
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number,
// ): number {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// const RATE_PER_KM = 2; // ₵2 per km
// const MIN_DELIVERY = 5; // minimum ₵5

// /** Calculate delivery charge from customer → showroom coordinates */
// function calcDeliveryCharge(
//   customerLocation: SelectedLocation | null,
//   showroomCoordinates: [number, number] | null, // [lng, lat]
// ): number {
//   if (!customerLocation || !showroomCoordinates) return 20; // fallback

//   const distKm = haversineKm(
//     customerLocation.coordinates.latitude,
//     customerLocation.coordinates.longitude,
//     showroomCoordinates[1], // lat
//     showroomCoordinates[0], // lng
//   );

//   return Math.max(MIN_DELIVERY, parseFloat((distKm * RATE_PER_KM).toFixed(2)));
// }

// // ---------------------------------------------------------------------------
// // Component
// // ---------------------------------------------------------------------------

// export default function CheckoutPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // URL params
//   const tipFromCart = searchParams.get("tip") || "5";
//   const cartDataFromUrl = searchParams.get("cartData");
//   const parsedCartData = cartDataFromUrl ? JSON.parse(cartDataFromUrl) : [];

//   const product = searchParams.get("productId");
//   const event = searchParams.get("eventId");

//   // ── Event wishlist sizes ──────────────────────────────────────────────────
//   const { data: sizesData, isLoading: sizesLoading } =
//     useGetProductEventWishesSizeQuery({ product, event });

//   const isEventOrder = (sizesData?.data?.length ?? 0) > 0;

//   // Build sizes array for the event order payload
//   const eventSizes = useMemo(
//     () =>
//       sizesData?.data?.map((item: any) => ({
//         type: item.size,
//         quantity: 1,
//       })) ?? [],
//     [sizesData],
//   );

//   // Derive display items from sizesData when it is an event order.
//   // Each wish entry has its own product info.
//   const eventDisplayItems = useMemo(
//     () =>
//       sizesData?.data?.map((item: any) => ({
//         _id: item._id,
//         product: item.product, // { _id, product_name, product_images, product_price, showroom }
//         size: item.size,
//         quantity: 1,
//         showroomCoordinates:
//           item.product?.showroom?.location?.coordinates ?? null,
//       })) ?? [],
//     [sizesData],
//   );

//   // ── Cart data ─────────────────────────────────────────────────────────────
//   const { data: cartData } = useGetWishlistAndCartQuery({
//     type: "cart",
//     page: 1,
//   });

//   const allCartItems =
//     cartData?.data?.filter((item: any) => item.product !== null) ?? [];

//   // Build cart display items from parsedCartData + API cart details
//   const cartDisplayItems = useMemo(() => {
//     if (parsedCartData.length === 0) return [];
//     return parsedCartData
//       .map((pc: any) => {
//         const found = allCartItems.find(
//           (ci: any) => ci.product?._id === pc.product,
//         );
//         if (!found) return null;
//         return {
//           ...found,
//           quantity: pc.size?.[0]?.quantity ?? 1,
//           selectedSize:
//             pc.size?.[0]?.type ??
//             found.product.product_stocks?.[0]?.size ??
//             "M",
//           orderData: pc,
//           priceFromCart: pc.price ?? null,
//           showroomCoordinates:
//             found.product?.showroom?.location?.coordinates ?? null,
//         };
//       })
//       .filter(Boolean);
//   }, [parsedCartData, allCartItems]);

//   // The items we actually display in the summary
//   const displayItems = isEventOrder ? eventDisplayItems : cartDisplayItems;

//   // Showroom coordinates – use the first item's showroom (single vendor assumed)
//   const showroomCoordinates: [number, number] | null =
//     displayItems[0]?.showroomCoordinates ?? null;

//   // ── State ─────────────────────────────────────────────────────────────────
//   const [deliveryMethod, setDeliveryMethod] = useState("delivery");
//   const [showCouponModal, setShowCouponModal] = useState(false);
//   const [showTipModal, setShowTipModal] = useState(false);
//   const [couponCode, setCouponCode] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState("");
//   const [tipAmount, setTipAmount] = useState(tipFromCart);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedLocation, setSelectedLocation] =
//     useState<SelectedLocation | null>(null);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     address: "",
//     country: "United States",
//     state: "",
//     zipcode: "",
//     email: "",
//     phone: "",
//   });

//   const [orderSubmitted] = useAddVendorOrderMutation();

//   // ── Price calculations ────────────────────────────────────────────────────
//   const subtotal = useMemo(() => {
//     if (isEventOrder) {
//       return eventDisplayItems.reduce((sum: number, item: any) => {
//         return sum + (item.product?.product_price ?? 0) * item.quantity;
//       }, 0);
//     }
//     return cartDisplayItems.reduce((sum: number, item: any) => {
//       const price =
//         item.priceFromCart?.amount ?? item.product?.product_price ?? 0;
//       return sum + price * item.quantity;
//     }, 0);
//   }, [isEventOrder, eventDisplayItems, cartDisplayItems]);

//   const deliveryCharge = useMemo(
//     () => calcDeliveryCharge(selectedLocation, showroomCoordinates),
//     [selectedLocation, showroomCoordinates],
//   );

//   const distanceKm = useMemo(() => {
//     if (!selectedLocation || !showroomCoordinates) return null;
//     return haversineKm(
//       selectedLocation.coordinates.latitude,
//       selectedLocation.coordinates.longitude,
//       showroomCoordinates[1],
//       showroomCoordinates[0],
//     ).toFixed(1);
//   }, [selectedLocation, showroomCoordinates]);

//   const tax = subtotal * 0.1;
   
//   const discount = appliedCoupon ? subtotal * 0.1 : 0;
//   const tip = parseFloat(tipAmount) || 0;
//   const total = subtotal + deliveryCharge + tax - discount + tip;

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const handleLocationSave = (location: SelectedLocation) => {
//     setSelectedLocation(location);
//     toast.success("Location saved successfully!");
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCouponSubmit = () => {
//     if (couponCode.trim()) {
//       setAppliedCoupon(couponCode.trim());
//       toast.success("Coupon applied! 10% discount added.");
//     }
//     setShowCouponModal(false);
//     setCouponCode("");
//   };

//   const handleSubmitOrder = async () => {
//     // if (
//     //   !formData.fullName ||
//     //   !formData.address ||
//     //   !formData.email ||
//     //   !formData.phone
//     // ) {
//     //   toast.error("Please fill in all required fields");
//     //   return;
//     // }
//     if (!isEventOrder && displayItems.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }
//     if (!selectedLocation) {
//       toast.error("Please provide your delivery location on the map");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const deliveryInfo = {
//         name: formData.fullName,
//         address: selectedLocation.name,
//         country: formData.country,
//         state: formData.state,
//         zipcode: formData.zipcode,
//         email: formData.email,
//         phone: formData.phone,
//         location: {
//           type: "Point",
//           coordinates: [
//             selectedLocation.coordinates.longitude,
//             selectedLocation.coordinates.latitude,
//           ],
//         },
//       };

//       const pricePayload = {
//         unit: "usd",
//         amount: subtotal,
//         tax: tax,
//         tip,
//         coupon: appliedCoupon,
//         deliveryCharge,
//       };

//       console.log("Price Payload being sent:", JSON.stringify(pricePayload, null, 2));

//       const orderData = isEventOrder
//         ? {
//             product,
//             size: eventSizes,
//             orderType: "vendor",
//             deliveryType: deliveryMethod,
//             price: pricePayload,
//             deliveryInfo,
//           }
//         : {
//             product: cartDisplayItems[0]?.product?._id,
//             size: [
//               {
//                 type: cartDisplayItems[0]?.selectedSize ?? "M",
//                 quantity: cartDisplayItems[0]?.quantity ?? 1,
//               },
//             ],
//             orderType: cartDisplayItems[0]?.orderData?.orderType ?? "vendor",
//             deliveryType:
//               cartDisplayItems[0]?.orderData?.deliveryType ?? deliveryMethod,
//             price: pricePayload,
//             deliveryInfo,
//           };


//       console.log("Order payload:", orderData);

//     const res =  await orderSubmitted(orderData).unwrap();
//     console.log(res)
//       toast.success("Order placed successfully!");
//       setTimeout(() => router.push("/customer-dashboard"), 2000);
//     } catch (error: any) {
//       console.error("Order submission error:", error);
//       toast.error(
//         error?.data?.message ?? "Failed to place order. Please try again.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen mt-24 bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white p-4 md:p-8">
//       {/* Back Button */}
//       <div className="container mx-auto flex items-center gap-4 mb-4">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
//         >
//           <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
//             <FaArrowLeft className="text-black" />
//           </div>
//         </button>
//         <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant hidden md:block">
//           Check Out
//         </h1>
//       </div>

//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-6 md:mb-8 text-center">
//         <h1 className="text-3xl md:text-4xl font-bold font-cormorant mb-2">
//           Checkout
//         </h1>
//         <p className="text-gray-400 font-poppins text-sm">
//           One step away from your dream purchase.
//         </p>
//       </div>

//       {/* Main Grid */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* ── Left column ── */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Delivery Method */}
//           <div className="space-y-3">
//             {["delivery", "pickup"].map((method) => (
//               <div key={method} className="flex items-center gap-3">
//                 <input
//                   type="radio"
//                   id={method}
//                   name="deliveryMethod"
//                   checked={deliveryMethod === method}
//                   onChange={() => setDeliveryMethod(method)}
//                   className="w-4 h-4 text-purple-600"
//                 />
//                 <label htmlFor={method} className="text-sm font-medium capitalize">
//                   {method === "delivery" ? "Delivery" : "Pick up"}
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* Delivery Address */}
//           <div className="rounded-2xl border border-[#b88ccc] overflow-hidden">
//             <div className="bg-gradient-to-r from-[#2ACCED] to-[#B630F4] p-4">
//               <h2 className="text-xl font-bold">Delivery Address</h2>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* Full Name */}
//               <div>
//                 <label className="block text-sm mb-2">Full name *</label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   placeholder="John Doe"
//                   className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                 />
//               </div>

//               {/* Address (auto-filled from map) */}
//               <div>
//                 <label className="block text-sm mb-2">Address *</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={selectedLocation?.name || formData.address}
//                   onChange={handleInputChange}
//                   placeholder="Select from map below"
//                   readOnly={!!selectedLocation}
//                   className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                 />
//               </div>

//               {/* Map */}
//               <div>
//                 <label className="block text-sm mb-2">
//                   <MapPin className="w-4 h-4 inline mr-1" />
//                   Delivery Location *
//                 </label>
//                 <MapComponent
//                   onLocationSave={handleLocationSave}
//                   showroomCoordinates={showroomCoordinates}
//                   showroomName={
//                     displayItems[0]?.product?.showroom?.showroom_name ?? "Showroom"
//                   }
//                 />

//                 {selectedLocation && (
//                   <div className="mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg space-y-1">
//                     <p className="text-xs text-gray-300">
//                       <span className="font-medium">Selected:</span>{" "}
//                       {selectedLocation.name}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       Coordinates: [{selectedLocation.coordinates.longitude.toFixed(6)},{" "}
//                       {selectedLocation.coordinates.latitude.toFixed(6)}]
//                     </p>
//                     {distanceKm !== null && (
//                       <p className="text-xs text-purple-300 font-medium">
//                         Distance to store: {distanceKm} km → Delivery charge: ₵
//                         {deliveryCharge.toFixed(2)}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Country / State / Zip */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm mb-2">Country / Region *</label>
//                   <select
//                     name="country"
//                     value={formData.country}
//                     onChange={handleInputChange}
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
//                   >
//                     <option value="United States">United States</option>
//                     <option value="Canada">Canada</option>
//                     <option value="UK">UK</option>
//                     <option value="Australia">Australia</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-2">State *</label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     placeholder="New York"
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-2">Zip Code *</label>
//                   <input
//                     type="text"
//                     name="zipcode"
//                     value={formData.zipcode}
//                     onChange={handleInputChange}
//                     placeholder="10001"
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                 </div>
//               </div>

//               {/* Email & Phone */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm mb-2">Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     placeholder="john.doe@example.com"
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-2">Phone *</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="+1 212 555 1234"
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Right column – Order Summary ── */}
//         <div className="lg:col-span-1">
//           <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-8">
//             <h2 className="text-xl font-bold mb-6">Order Summary</h2>

//             {/* Order Items */}
//             <div className="space-y-4 mb-6">
//               {sizesLoading ? (
//                 <div className="flex justify-center py-4">
//                   <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
//                 </div>
//               ) : displayItems.length > 0 ? (
//                 displayItems.map((item: any) => {
//                   const price = isEventOrder
//                     ? item.product?.product_price ?? 0
//                     : item.priceFromCart?.amount ?? item.product?.product_price ?? 0;
//                   const imgSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.product?.product_images?.[0]}`;

//                   return (
//                     <div
//                       key={item._id}
//                       className="flex items-center gap-3 pb-3 border-b border-gray-700 last:border-b-0"
//                     >
//                       {/* Product Image */}
//                       <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
//                         <img
//                           src={imgSrc}
//                           alt={item.product?.product_name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src =
//                               "/placeholder-product.png";
//                           }}
//                         />
//                       </div>

//                       {/* Product Info */}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium truncate">
//                           {item.product?.product_name}
//                         </p>
//                         <p className="text-xs text-gray-400">
//                           Size: {isEventOrder ? item.size : item.selectedSize} | Qty:{" "}
//                           {item.quantity}
//                         </p>
//                         {item.product?.showroom?.showroom_name && (
//                           <p className="text-xs text-purple-300/70">
//                             {item.product.showroom.showroom_name}
//                           </p>
//                         )}
//                       </div>

//                       {/* Line total */}
//                       <p className="text-sm font-semibold">
//                         ₵{(price * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="text-gray-400 text-sm">No items in cart</p>
//               )}
//             </div>

//             {/* Price Breakdown */}
//             <div className="space-y-3 border-t border-gray-700 pt-4 mb-6">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Subtotal</span>
//                 <span className="font-medium">₵{subtotal.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">
//                   Delivery Charge
//                   {distanceKm !== null && (
//                     <span className="ml-1 text-xs text-purple-300/70">
//                       ({distanceKm} km × ₵2)
//                     </span>
//                   )}
//                 </span>
//                 <span className="font-medium">₵{deliveryCharge.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Tax (10%)</span>
//                 <span className="font-medium">₵{tax.toFixed(2)}</span>
//               </div>

//               {discount > 0 && (
//                 <div className="flex justify-between text-sm text-green-400">
//                   <span>Discount ({appliedCoupon})</span>
//                   <span className="font-medium">-₵{discount.toFixed(2)}</span>
//                 </div>
//               )}

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Tip</span>
//                 <button
//                   onClick={() => setShowTipModal(true)}
//                   className="text-purple-400 hover:text-purple-300 font-medium"
//                 >
//                   ₵{tip.toFixed(2)}
//                 </button>
//               </div>

//               <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-3">
//                 <span>Total</span>
//                 <span className="text-purple-400">₵{total.toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Coupon */}
//             <button
//               onClick={() => setShowCouponModal(true)}
//               className="w-full mb-3 border border-purple-500/30 text-purple-400 py-3 rounded-lg font-medium hover:bg-purple-900/20 transition-colors"
//             >
//               {appliedCoupon ? `Coupon: ${appliedCoupon} ✓` : "Apply Coupon Code"}
//             </button>

//             {/* Tip */}
//             <button
//               onClick={() => setShowTipModal(true)}
//               className="w-full mb-4 border border-purple-500/30 text-purple-400 py-3 rounded-lg font-medium hover:bg-purple-900/20 transition-colors"
//             >
//               Tip Your Driver
//             </button>

//             {/* Place Order */}
//             <button
//               onClick={handleSubmitOrder}
//               disabled={isSubmitting || displayItems.length === 0}
//               className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
//                 isSubmitting || displayItems.length === 0
//                   ? "bg-gray-600 text-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transform hover:scale-105"
//               }`}
//             >
//               {isSubmitting ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Processing...
//                 </span>
//               ) : (
//                 "Place Order"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Coupon Modal ── */}
//       {showCouponModal && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
//           <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-md w-full">
//             <button
//               onClick={() => setShowCouponModal(false)}
//               className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <h2 className="text-2xl font-bold text-center mb-6">Apply Coupon</h2>
//             <input
//               type="text"
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
//               placeholder="Enter coupon code"
//               className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4 uppercase"
//             />
//             <button
//               onClick={handleCouponSubmit}
//               className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all"
//             >
//               Apply Coupon
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ── Tip Modal ── */}
//       {showTipModal && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
//           <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-md w-full">
//             <button
//               onClick={() => setShowTipModal(false)}
//               className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <h2 className="text-2xl font-bold text-center mb-6">Add Tip</h2>
//             <p className="text-gray-400 text-sm text-center mb-6">
//               Show appreciation for your delivery person
//             </p>
//             <div className="grid grid-cols-4 gap-3 mb-6">
//               {["0", "5", "10", "15"].map((amount) => (
//                 <button
//                   key={amount}
//                   onClick={() => setTipAmount(amount)}
//                   className={`py-3 rounded-lg font-medium transition-colors ${
//                     tipAmount === amount
//                       ? "bg-purple-600 text-white"
//                       : "bg-gray-800 text-gray-400 hover:bg-gray-700"
//                   }`}
//                 >
//                   ₵{amount}
//                 </button>
//               ))}
//             </div>
//             <input
//               type="number"
//               value={tipAmount}
//               onChange={(e) => setTipAmount(e.target.value)}
//               placeholder="Custom amount"
//               className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4"
//             />
//             <button
//               onClick={() => setShowTipModal(false)}
//               className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all"
//             >
//               Save Tip
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";
import MapComponent, {
  SelectedLocation,
} from "@/components/CustomerDashboard/Location";
import { useGetProductEventWishesSizeQuery } from "@/redux/features/event/eventSlice";
import { useGetWishlistAndCartQuery } from "@/redux/features/home/homeSlice";
import { useAddVendorOrderMutation } from "@/redux/features/order/orderSlice";
import { Loader2, MapPin, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import {
  calcDistanceDeliveryUsd,
  calcWeightDeliveryUsdForItems,
  FALLBACK_DISTANCE_DELIVERY_USD,
  haversineKm,
  productWeightToKg,
  RATE_PER_KG,
  RATE_PER_KM,
} from "@/lib/deliveryPricing";

const TAX_RATE = 0.1; // 10%

const CHECKOUT_COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "UK",
  "Australia",
] as const;

function distanceDeliveryUsd(
  customerLocation: SelectedLocation | null,
  showroomCoordinates: [number, number] | null,
): number {
  if (!customerLocation || !showroomCoordinates) {
    return FALLBACK_DISTANCE_DELIVERY_USD;
  }
  return calcDistanceDeliveryUsd(
    customerLocation.coordinates.latitude,
    customerLocation.coordinates.longitude,
    showroomCoordinates[0],
    showroomCoordinates[1],
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL params
  const tipFromCart = searchParams.get("tip") || "5";
  const cartDataFromUrl = searchParams.get("cartData");
  const parsedCartData = cartDataFromUrl ? JSON.parse(cartDataFromUrl) : [];
 console.log(parsedCartData)
  const product = searchParams.get("productId");
  const event = searchParams.get("eventId");

  // ── Event wishlist sizes ──────────────────────────────────────────────────
  const { data: sizesData, isLoading: sizesLoading } =
    useGetProductEventWishesSizeQuery({ product, event });

    console.log(sizesData)

  const isEventOrder = (sizesData?.data?.length ?? 0) > 0;

  // Build sizes array for the event order payload
  const eventSizes = useMemo(
    () =>
      sizesData?.data?.map((item: any) => ({
        type: item.size,
        quantity: 1,
      })) ?? [],
    [sizesData],
  );

  // Derive display items from sizesData when it is an event order.
  const eventDisplayItems = useMemo(
    () =>
      sizesData?.data?.map((item: any) => ({
        _id: item._id,
        product: item.product,
        size: item.size,
        quantity: 1,
        showroomCoordinates:
          item.product?.showroom?.location?.coordinates ?? null,
      })) ?? [],
    [sizesData],
  );

  // ── Cart data ─────────────────────────────────────────────────────────────
  const { data: cartData } = useGetWishlistAndCartQuery({
    type: "cart",
    page: 1,
  });

  const allCartItems =
    cartData?.data?.filter((item: any) => item.product !== null) ?? [];

  // Build cart display items from parsedCartData + API cart details
  const cartDisplayItems = useMemo(() => {
    if (parsedCartData.length === 0) return [];
    return parsedCartData
      .map((pc: any) => {
        const found = allCartItems.find(
          (ci: any) => ci.product?._id === pc.product,
        );
        if (!found) return null;
        return {
          ...found,
          quantity: pc.size?.[0]?.quantity ?? 1,
          selectedSize:
            pc.size?.[0]?.type ??
            found.product.product_stocks?.[0]?.size ??
            "M",
          orderData: pc,
          priceFromCart: pc.price ?? null,
          showroomCoordinates:
            found.product?.showroom?.location?.coordinates ?? null,
        };
      })
      .filter(Boolean);
  }, [parsedCartData, allCartItems]);

  // The items we actually display in the summary
  const displayItems = isEventOrder ? eventDisplayItems : cartDisplayItems;

  // Showroom coordinates – use the first item's showroom (single vendor assumed)
  const showroomCoordinates: [number, number] | null =
    displayItems[0]?.showroomCoordinates ?? null;

  // ── State ─────────────────────────────────────────────────────────────────
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [tipAmount, setTipAmount] = useState(tipFromCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    country: "United States",
    state: "",
    zipcode: "",
    email: "",
    phone: "",
  });

  const [orderSubmitted] = useAddVendorOrderMutation();

  // ── Price calculations ────────────────────────────────────────────────────
  const subtotal = useMemo(() => {
    if (isEventOrder) {
      return eventDisplayItems.reduce((sum: number, item: any) => {
        return sum + (item.product?.product_price ?? 0) * item.quantity;
      }, 0);
    }
    return cartDisplayItems.reduce((sum: number, item: any) => {
      const price =
        item.priceFromCart?.amount ?? item.product?.product_price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }, [isEventOrder, eventDisplayItems, cartDisplayItems]);

  const distanceDeliveryCharge = useMemo(
    () => distanceDeliveryUsd(selectedLocation, showroomCoordinates),
    [selectedLocation, showroomCoordinates],
  );

  const weightDeliveryCharge = useMemo(
    () => calcWeightDeliveryUsdForItems(displayItems),
    [displayItems],
  );

  const deliveryCharge = distanceDeliveryCharge + weightDeliveryCharge;

  const totalWeightKg = useMemo(() => {
    return parseFloat(
      displayItems
        .reduce((sum: number, item: any) => {
          const kg = productWeightToKg(item.product?.product_weight ?? null);
          const qty = item.quantity ?? 1;
          return sum + kg * qty;
        }, 0)
        .toFixed(2),
    );
  }, [displayItems]);

  const distanceKm = useMemo(() => {
    if (!selectedLocation || !showroomCoordinates) return null;
    return haversineKm(
      selectedLocation.coordinates.latitude,
      selectedLocation.coordinates.longitude,
      showroomCoordinates[1],
      showroomCoordinates[0],
    ).toFixed(1);
  }, [selectedLocation, showroomCoordinates]);

  // ✅ TAX: Calculated as 10% of subtotal
  const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));

  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const tip = parseFloat(tipAmount) || 0;
  const total = subtotal + deliveryCharge + tax - discount + tip;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLocationSave = (location: SelectedLocation) => {
    setSelectedLocation(location);
    setFormData((prev) => ({
      ...prev,
      ...(location.country ? { country: location.country } : {}),
      ...(location.state ? { state: location.state } : {}),
      ...(location.zipCode ? { zipcode: location.zipCode } : {}),
    }));
    toast.success("Location saved successfully!");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCouponSubmit = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.trim());
      toast.success("Coupon applied! 10% discount added.");
    }
    setShowCouponModal(false);
    setCouponCode("");
  };

  const handleSubmitOrder = async () => {
    if (!isEventOrder && displayItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!selectedLocation) {
      toast.error("Please provide your delivery location on the map");
      return;
    }

    setIsSubmitting(true);
    try {
      const deliveryInfo = {
        name: formData.fullName,
        address: selectedLocation.name,
        country: formData.country,
        state: formData.state,
        zipcode: formData.zipcode,
        email: formData.email,
        phone: formData.phone,
        location: {
          type: "Point",
          coordinates: [
            selectedLocation.coordinates.longitude,
            selectedLocation.coordinates.latitude,
          ],
        },
      };

      // ✅ TAX FIX: tax is explicitly sent as a number (e.g. 7.04 not 0)
      // If backend still saves 0, the issue is server-side — backend must
      // be told to accept and store req.body.price.tax instead of overriding it.
      const pricePayload = {
        unit: "usd",
        amount: subtotal,
        tax: tax,           // ✅ e.g. 7.04 for a ₵70.40 subtotal
        tip,
        coupon: appliedCoupon,
        deliveryCharge,
      };

      const orderData = isEventOrder
        ? {
            product,
            size: eventSizes,
            orderType: "vendor",
            deliveryType: deliveryMethod,
            price: pricePayload,
            deliveryInfo,
          }
        : {
            product: cartDisplayItems[0]?.product?._id,
            size: [
              {
                type: cartDisplayItems[0]?.selectedSize ?? "M",
                quantity: cartDisplayItems[0]?.quantity ?? 1,
              },
            ],
            orderType: cartDisplayItems[0]?.orderData?.orderType ?? "vendor",
            deliveryType:
              cartDisplayItems[0]?.orderData?.deliveryType ?? deliveryMethod,
            price: pricePayload,
            deliveryInfo,
          };

      console.log("Order payload:", orderData);

      const res = await orderSubmitted(orderData).unwrap();
      console.log(res);
      toast.success("Order placed successfully!");
      setTimeout(() => router.push("/customer-dashboard"), 2000);
    } catch (error: any) {
      console.error("Order submission error:", error);
      toast.error(
        error?.data?.message ?? "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen mt-24 bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="container mx-auto flex items-center gap-4 mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className="text-black" />
          </div>
        </button>
        <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant hidden md:block">
          Check Out
        </h1>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-cormorant mb-2">
          Checkout
        </h1>
        <p className="text-gray-400 font-poppins text-sm">
          One step away from your dream purchase.
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Method */}
          <div className="space-y-3">
            {["delivery", "pickup"].map((method) => (
              <div key={method} className="flex items-center gap-3">
                <input
                  type="radio"
                  id={method}
                  name="deliveryMethod"
                  checked={deliveryMethod === method}
                  onChange={() => setDeliveryMethod(method)}
                  className="w-4 h-4 text-purple-600"
                />
                <label htmlFor={method} className="text-sm font-medium capitalize">
                  {method === "delivery" ? "Delivery" : "Pick up"}
                </label>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-[#b88ccc] overflow-hidden">
            <div className="bg-gradient-to-r from-[#2ACCED] to-[#B630F4] p-4">
              <h2 className="text-xl font-bold">Delivery Address</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm mb-2">Full name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Address (auto-filled from map) */}
              <div>
                <label className="block text-sm mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={selectedLocation?.name || formData.address}
                  onChange={handleInputChange}
                  placeholder="Select from map below"
                  readOnly={!!selectedLocation}
                  className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Map */}
              <div>
                <label className="block text-sm mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Delivery Location *
                </label>
                <MapComponent
                  onLocationSave={handleLocationSave}
                  showroomCoordinates={showroomCoordinates}
                  showroomName={
                    displayItems[0]?.product?.showroom?.showroom_name ?? "Showroom"
                  }
                  weightDeliveryUsd={weightDeliveryCharge}
                />

                {selectedLocation && (
                  <div className="mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg space-y-1">
                    <p className="text-xs text-gray-300">
                      <span className="font-medium">Selected:</span>{" "}
                      {selectedLocation.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Coordinates: [{selectedLocation.coordinates.longitude.toFixed(6)},{" "}
                      {selectedLocation.coordinates.latitude.toFixed(6)}]
                    </p>
                    {distanceKm !== null && (
                      <p className="text-xs text-purple-300 font-medium">
                        Distance: {distanceKm} km × ₵{RATE_PER_KM}/km → distance fee ₵
                        {distanceDeliveryCharge.toFixed(2)}
                      </p>
                    )}
                    {totalWeightKg > 0 && (
                      <p className="text-xs text-purple-300/90">
                        Weight: {totalWeightKg} km × ₵{RATE_PER_KG}/kg → weight fee ₵
                        {weightDeliveryCharge.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-gray-300">
                      Total delivery:{" "}
                      <span className="font-semibold text-white">
                        ₵{deliveryCharge.toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Country / State / Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Country / Region *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    {[...CHECKOUT_COUNTRY_OPTIONS].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    {formData.country &&
                      !CHECKOUT_COUNTRY_OPTIONS.includes(
                        formData.country as (typeof CHECKOUT_COUNTRY_OPTIONS)[number],
                      ) && (
                        <option value={formData.country}>
                          {formData.country}
                        </option>
                      )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Zip Code *</label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 212 555 1234"
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column – Order Summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {sizesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                </div>
              ) : displayItems.length > 0 ? (
                displayItems.map((item: any) => {
                  const price = isEventOrder
                    ? item.product?.product_price ?? 0
                    : item.priceFromCart?.amount ?? item.product?.product_price ?? 0;
                  const imgSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.product?.product_images?.[0]}`;

                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 pb-3 border-b border-gray-700 last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                        <img
                          src={imgSrc}
                          alt={item.product?.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-product.png";
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product?.product_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Size: {isEventOrder ? item.size : item.selectedSize} | Qty:{" "}
                          {item.quantity}
                        </p>
                        {item.product?.showroom?.showroom_name && (
                          <p className="text-xs text-purple-300/70">
                            {item.product.showroom.showroom_name}
                          </p>
                        )}
                      </div>

                      {/* Line total */}
                      <p className="text-sm font-semibold">
                        ₵{(price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm">No items in cart</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium">₵{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Delivery (distance)
                  {distanceKm !== null ? (
                    <span className="ml-1 text-xs text-purple-300/70">
                      ({distanceKm} km × ₵{RATE_PER_KM})
                    </span>
                  ) : (
                    <span className="ml-1 text-xs text-purple-300/70">
                      (estimate until pin set)
                    </span>
                  )}
                </span>
                <span className="font-medium">₵{distanceDeliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Delivery (weight)
                  {totalWeightKg > 0 ? (
                    <span className="ml-1 text-xs text-purple-300/70">
                      ({totalWeightKg} km × ₵{RATE_PER_KG})
                    </span>
                  ) : (
                    <span className="ml-1 text-xs text-gray-500">(no weight on product)</span>
                  )}
                </span>
                <span className="font-medium">₵{weightDeliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-gray-700/60 pb-2">
                <span className="text-gray-300 font-medium">Delivery total</span>
                <span className="font-semibold text-white">₵{deliveryCharge.toFixed(2)}</span>
              </div>

              {/* ✅ Tax displayed as calculated 10% of subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax (10%)</span>
                <span className="font-medium">₵{tax.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Discount ({appliedCoupon})</span>
                  <span className="font-medium">-₵{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tip</span>
                <button
                  onClick={() => setShowTipModal(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  ₵{tip.toFixed(2)}
                </button>
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-3">
                <span>Total</span>
                <span className="text-purple-400">₵{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <button
              onClick={() => setShowCouponModal(true)}
              className="w-full mb-3 border border-purple-500/30 text-purple-400 py-3 rounded-lg font-medium hover:bg-purple-900/20 transition-colors"
            >
              {appliedCoupon ? `Coupon: ${appliedCoupon} ✓` : "Apply Coupon Code"}
            </button>

            {/* Tip */}
            <button
              onClick={() => setShowTipModal(true)}
              className="w-full mb-4 border border-purple-500/30 text-purple-400 py-3 rounded-lg font-medium hover:bg-purple-900/20 transition-colors"
            >
              Tip Your Driver
            </button>

            {/* Place Order */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || displayItems.length === 0}
              className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                isSubmitting || displayItems.length === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transform hover:scale-105"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Coupon Modal ── */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-md w-full">
            <button
              onClick={() => setShowCouponModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">Apply Coupon</h2>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4 uppercase"
            />
            <button
              onClick={handleCouponSubmit}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all"
            >
              Apply Coupon
            </button>
          </div>
        </div>
      )}

      {/* ── Tip Modal ── */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-md w-full">
            <button
              onClick={() => setShowTipModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-center mb-6">Add Tip</h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Show appreciation for your delivery person
            </p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {["0", "5", "10", "15"].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTipAmount(amount)}
                  className={`py-3 rounded-lg font-medium transition-colors ${
                    tipAmount === amount
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  ₵{amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4"
            />
            <button
              onClick={() => setShowTipModal(false)}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all"
            >
              Save Tip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
