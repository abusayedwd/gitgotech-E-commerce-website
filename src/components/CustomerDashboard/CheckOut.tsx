"use client";
import MapComponent, {
  SelectedLocation,
} from "@/components/CustomerDashboard/Location";
import { useGetProductEventWishesSizeQuery } from "@/redux/features/event/eventSlice";
import { useGetWishlistAndCartQuery } from "@/redux/features/home/homeSlice";
import { useAddVendorOrderMutation } from "@/redux/features/order/orderSlice";
import { Loader2, MapPin, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get cart data from URL params (passed from shopping cart)
  const tipFromCart = searchParams.get("tip") || "5";
  const cartDataFromUrl = searchParams.get("cartData");
  const parsedCartData = cartDataFromUrl ? JSON.parse(cartDataFromUrl) : [];

  console.log(parsedCartData);

 
    const product = searchParams.get("productId");
    const event = searchParams.get("eventId");
  
    const data = {
      product: product,
      event: event,
    };
  
    const { data: sizesData, isLoading } =
      useGetProductEventWishesSizeQuery(data);
      console.log(sizesData)

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [tipAmount, setTipAmount] = useState(tipFromCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [orderSubmitted] = useAddVendorOrderMutation();

  // Get cart items from API (for product details)
  const { data: cartData } = useGetWishlistAndCartQuery({
    type: "cart",
    page: 1,
  });

  console.log(cartData);

  const allCartItems =
    cartData?.data?.filter((item: any) => item.product !== null) || [];

  // Get only the selected product from cart
  const selectedCartItem =
    parsedCartData.length > 0
      ? allCartItems.find(
          (item: any) => item.product._id === parsedCartData[0].product,
        )
      : null;

  const cartItems = selectedCartItem
    ? [
        {
          ...selectedCartItem,
          quantity: parsedCartData[0]?.size[0]?.quantity || 1,
          selectedSize:
            parsedCartData[0]?.size[0]?.type ||
            selectedCartItem.product.product_stocks?.[0]?.size ||
            "M",
          orderData: parsedCartData[0] || null,
          priceFromCart: parsedCartData[0]?.price || null,
        },
      ]
    : [];

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    country: "United States",
    state: "",
    zipcode: "",
    email: "",
    phone: "",
  });

  // Calculate subtotal - use price from cart data
  const calculateSubtotal = () => {
    if (cartItems.length === 0) return 0;
    const item = cartItems[0];
    const price = item.priceFromCart?.amount || item.product.product_price || 0;
    return price * (item.quantity || 1);
  };

  const deliveryChargeFromCart =
    cartItems[0]?.priceFromCart?.deliveryCharge || 20.0;
  const tipFromCartData =
    cartItems[0]?.priceFromCart?.tip || parseFloat(tipAmount) || 0;

  const tax = calculateSubtotal() * 0.1;
  const discount = couponCode ? calculateSubtotal() * 0.1 : 0;
  const tip = tipFromCartData;
  const total =
    calculateSubtotal() + deliveryChargeFromCart + tax - discount + tip;

  // Handle location save from MapComponent
  const handleLocationSave = (location: SelectedLocation) => {
    console.log("Saved location:", location);
    setSelectedLocation(location);
    toast.success("Location saved successfully!");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCouponSubmit = () => {
    if (couponCode.trim()) {
      toast.success("Coupon applied successfully!");
    }
    setShowCouponModal(false);
    setCouponCode("");
  };

  const handleTipSubmit = () => {
    setShowTipModal(false);
  };

  const handleSubmitOrder = async () => {
    // Validation
    if (
      !formData.fullName ||
      !formData.address ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedLocation) {
      toast.error("Please provide your delivery location");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order for the selected product only
      const item = cartItems[0];

      const orderData = {
        product: item.product._id,
        size: [
          {
            type: item.selectedSize || "M",
            quantity: item.quantity || 1,
          },
        ],
        orderType: item.orderData?.orderType || "vendor",
        deliveryType: item.orderData?.deliveryType || deliveryMethod,
        price: {
          unit: item.priceFromCart?.unit || "usd",
          amount: item.priceFromCart?.amount || item.product.product_price || 0,
          tip: item.priceFromCart?.tip || tip,
          coupon: couponCode,
          deliveryCharge:
            item.priceFromCart?.deliveryCharge || deliveryChargeFromCart,
        },
        deliveryInfo: {
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
        },
      };

      console.log("Order Data:", orderData);

      const response = await orderSubmitted(orderData).unwrap();

      toast.success("Order placed successfully!");

      // Clear cart and redirect
      setTimeout(() => {
        router.push("/customer-dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Order submission error:", error);
      toast.error(
        error?.data?.message || "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mt-24 bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="container mx-auto flex items-center gap-4">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Method */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="delivery"
                name="deliveryMethod"
                checked={deliveryMethod === "delivery"}
                onChange={() => setDeliveryMethod("delivery")}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="delivery" className="text-sm font-medium">
                Delivery
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="pickup"
                name="deliveryMethod"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="pickup" className="text-sm font-medium">
                Pick up
              </label>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-[#b88ccc] relative overflow-hidden">
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

              {/* Address */}
              <div>
                <label className="block text-sm mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={selectedLocation?.name || formData.address}
                  onChange={handleInputChange}
                  placeholder="Select from map below"
                  readOnly
                  className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Location Selection using MapComponent */}
              <div>
                <label className="block text-sm mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Delivery Location *
                </label>
                <MapComponent onLocationSave={handleLocationSave} />
                {selectedLocation && (
                  <div className="mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <p className="text-xs text-gray-300">
                      <span className="font-medium">Selected Location:</span>{" "}
                      {selectedLocation.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Coordinates: [
                      {selectedLocation.coordinates.longitude.toFixed(6)},{" "}
                      {selectedLocation.coordinates.latitude.toFixed(6)}]
                    </p>
                  </div>
                )}
              </div>

              {/* Country, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">
                    Country / Region *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                    <option value="Australia">Australia</option>
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

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cartItems.length > 0 ? (
                cartItems.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 pb-3 border-b border-gray-700 last:border-b-0"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.product.product_images?.[0]}`}
                        alt={item.product.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.product_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      $
                      {(
                        (item.priceFromCart?.amount ||
                          item.product.product_price ||
                          0) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No items in cart</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Charge</span>
                <span className="font-medium">
                  ${deliveryChargeFromCart.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Discount</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tip</span>
                <button
                  onClick={() => setShowTipModal(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  ${tip.toFixed(2)}
                </button>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-3">
                <span>Total</span>
                <span className="text-purple-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <button
              onClick={() => setShowCouponModal(true)}
              className="w-full mb-3 border border-purple-500/30 text-purple-400 py-3 rounded-lg font-medium hover:bg-purple-900/20 transition-colors"
            >
              Apply Coupon Code
            </button>

            {/* Tip Driver Button */}
            <button
              onClick={() => setShowTipModal(true)}
              className="w-full mb-4 border border-purple-500/30 text-purple-400 py-3 rounded-lg font-medium hover:bg-purple-900/20 transition-colors"
            >
              Tip Your Driver
            </button>

            {/* Place Order Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || cartItems.length === 0}
              className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                isSubmitting || cartItems.length === 0
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

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-md w-full">
            <button
              onClick={() => setShowCouponModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">
              Apply Coupon
            </h2>

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

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-md w-full">
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
                  ${amount}
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
              onClick={handleTipSubmit}
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
