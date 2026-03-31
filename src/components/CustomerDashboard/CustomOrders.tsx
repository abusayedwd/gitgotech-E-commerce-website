"use client";

import url from "@/redux/api/baseUrl";
import {
  useCustomOrderPlaceMutation,
  useGetCustomerCustomOrdersQuery,
} from "@/redux/features/order/orderSlice";
import { Circle, Eye, ShoppingCart, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

// --- Types ---
type OrderStatus =
  | "Order Placed"
  | "Vendor Accepted"
  | "Vendor Rejected"
  | "Customer Accepted"
  | "Customer Rejected"
  | "Paid"
  | "Ready for Pickup"
  | "Driver Accepted"
  | "Picked Up"
  | "Delivered";
type DisplayStatus =
  | "Approved"
  | "Pending"
  | "Cancel"
  | "Delivered"
  | "Processing";

interface DesignItem {
  id: string;
  productName: string;
  brand: string;
  price: string;
  status: DisplayStatus;
  imageUrl: string;
  quantity: number;
  measurements: any;
  deliveryInfo: any;
  pickUpInfo: any;
  trackingNumber: string;
  orderStatus: OrderStatus;
}

// --- Components ---

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  // Map API statuses to display statuses
  const getDisplayStatus = (orderStatus: OrderStatus): DisplayStatus => {
    if (orderStatus === "Order Placed") return "Pending";
    if (orderStatus === "Vendor Accepted") return "Approved";
    if (orderStatus === "Vendor Rejected") return "Cancel";
    if (orderStatus === "Delivered") return "Delivered";
    if (
      [
        "Processing",
        "Paid",
        "Ready for Pickup",
        "Driver Accepted",
        "Picked Up",
        "Customer Accepted",
        "Customer Rejected",
      ].includes(orderStatus)
    )
      return "Processing";
    return "Pending";
  };

  const displayStatus = getDisplayStatus(status);

  const styles: any = {
    Approved: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Cancel: "bg-red-500/10 text-red-400 border-red-500/20",
    Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    Processing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded text-xs font-medium border ${styles[displayStatus]}`}
    >
      {status}
    </span>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({
  order,
  onClose,
}: {
  order: DesignItem;
  onClose: () => void;
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex mt-20 items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
            <img
              src={`${url}/${order.imageUrl}`}
              alt={order.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/jacket.png";
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {order.productName}
            </h3>
            <p className="text-sm text-gray-400">Quantity: {order.quantity}</p>
            <p className="text-sm text-purple-400 font-medium">
              ${order.price}
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Order Status
          </h4>
          <StatusBadge status={order.orderStatus} />
        </div>

        {/* Measurements */}
        {order.measurements && Object.keys(order.measurements).length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              Measurements
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(order.measurements).map(([key, value]: any) => (
                <div key={key} className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 capitalize">{key}</p>
                  <p className="text-sm font-medium text-white">{value} cm</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Info */}
        {order.deliveryInfo && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              Delivery Information
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Name:</span>{" "}
                {order.deliveryInfo.name}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Address:</span>{" "}
                {order.deliveryInfo.address}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">City:</span>{" "}
                {order.deliveryInfo.state}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">ZIP:</span>{" "}
                {order.deliveryInfo.zipcode}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Country:</span>{" "}
                {order.deliveryInfo.country}
              </p>
            </div>
          </div>
        )}

        {/* Pickup Info */}
        {order.pickUpInfo && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              Pickup Information
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Showroom:</span>{" "}
                {order.pickUpInfo.name}
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Address:</span>{" "}
                {order.pickUpInfo.address}
              </p>
            </div>
          </div>
        )}

        {/* Tracking */}
        {order.trackingNumber && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              Tracking Information
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Tracking Number:</span>{" "}
                <span className="font-mono text-white">
                  {order.trackingNumber}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Total Price */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-300">
              Total Price
            </span>
            <span className="text-2xl font-bold text-purple-400">
              ${order.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Now Modal Component
const OrderNowModal = ({
  order,
  onClose,
}: {
  order: DesignItem;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    action: "accepted",
    quantity: order.quantity || 1,
    deliveryCharge: 30,
    tips: 10,
  });

  const [customOrderPlace] = useCustomOrderPlaceMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order Now Data:", formData, order.id);
    const res = await customOrderPlace({ id: order.id, data: formData });
    if (res?.data) {
      toast.success("Order confirmed!");
    } else {
      toast.error("Failed to place order");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex mt-20 items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/30 rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Complete Order</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
            <img
              src={`${url}/${order.imageUrl}`}
              alt={order.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/jacket.png";
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {order.productName}
            </h3>
            <p className="text-sm text-purple-400 font-medium">
              ${order.price}
            </p>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
       

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              min="1"
            />
          </div>

          {/* Delivery Charge */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Delivery Charge ($)
            </label>
            <input
              type="number"
              value={formData.deliveryCharge}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deliveryCharge: parseInt(e.target.value) || 0,
                })
              }
              className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              min="0"
            />
          </div>

          {/* Tips */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tips ($)
            </label>
            <input
              type="number"
              value={formData.tips}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tips: parseInt(e.target.value) || 0,
                })
              }
              className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              min="0"
            />
          </div>

          {/* Total */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-300">Total</span>
              <span className="text-2xl font-bold text-purple-400">
                $
                {(
                  parseFloat(order.price) +
                  formData.deliveryCharge +
                  formData.tips
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default function CustomDesignManagement() {
  const [selectedOrder, setSelectedOrder] = useState<DesignItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrderNowModal, setShowOrderNowModal] = useState(false);

  const {
    data: customOrdersData,
    isLoading,
    error,
  } = useGetCustomerCustomOrdersQuery({ page: 1, limit: 10 });
  console.log(customOrdersData);

  // Transform API data
  const designItems: DesignItem[] =
    customOrdersData?.data?.map((order: any) => ({
      id: order._id,
      productName: order.productId?.product_name || "Custom Order",
      brand: order.showroomId?.showroom_name || "Custom",
      price: (order.price?.amount || 0).toFixed(2),
      status:
        order.orderStatus === "Delivered"
          ? "Delivered"
          : order.orderStatus === "Processing"
            ? "Processing"
            : "Pending",
      imageUrl: order.productId?.product_images?.[0] || "/images/jacket.png",
      quantity: order.quantity || 1,
      measurements: order.measurements || {},
      deliveryInfo: order.deliveryInfo || {},
      pickUpInfo: order.pickUpInfo || {},
      trackingNumber: order.trackingNumber || "",
      orderStatus: order.orderStatus || "Order Placed",
    })) || [];

  const handleViewDetails = (order: DesignItem) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleOrderNow = (order: DesignItem) => {
    setSelectedOrder(order);
    setShowOrderNowModal(true);
  };

  return (
    <div className="min-h-screen mt-16 md:mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black text-white">
      {/* Background Gradient Effect */}
      <div className="fixed top-0 left-0 w-full h-96 bg-purple-900/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-100">
            Custom Design Management
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Track the progress of your custom design requests in one place. Once
            your design is reviewed and approved, you will be able to complete
            the payment and proceed with the order seamlessly.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Main Table Container */}
        <div className="border border-blue-500/50 rounded-lg overflow-hidden bg-[#0f0f13]/80 backdrop-blur-sm shadow-2xl shadow-blue-900/10">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 bg-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-6 md:col-span-5">Product</div>
            <div className="col-span-3 md:col-span-2 text-center md:text-left">
              Price
            </div>
            <div className="col-span-3 md:col-span-3 text-center">Status</div>
            <div className="col-span-3 md:col-span-2 text-right hidden md:block">
              Action
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-800">
            {designItems.length > 0 ? (
              designItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors duration-200"
                >
                  {/* Product Info */}
                  <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                      <img
                        src={`${url}/${item.imageUrl}`}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/jacket.png";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-200">
                        {item.productName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Circle className="w-2 h-2 fill-red-500 text-red-500" />
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {item.brand}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-3 md:col-span-2 font-mono text-gray-300">
                    ${item.price}
                  </div>

                  {/* Status */}
                  <div className="col-span-3 md:col-span-3 flex justify-center md:justify-start">
                    <StatusBadge status={item.orderStatus} />
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-12 md:col-span-2 flex justify-end mt-4 md:mt-0 gap-2">
                    {/* View Details Button - Show for all statuses */}
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20 transition-all duration-200 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden md:inline">View</span>
                    </button>

                    {/* Order Now Button - Show only for Vendor Accepted */}
                    {item.orderStatus === "Vendor Accepted" && (
                      <button
                        onClick={() => handleOrderNow(item)}
                        className="px-4 py-1 w-44 rounded-full text-sm font-medium bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-all duration-200 flex items-center gap-1"
                      >
                        <span className="hidden md:inline">Order Now</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-lg">No custom orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Order Now Modal */}
      {showOrderNowModal && selectedOrder && (
        <OrderNowModal
          order={selectedOrder}
          onClose={() => setShowOrderNowModal(false)}
        />
      )}
    </div>
  );
}
