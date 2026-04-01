"use client";

import {
  useAcceptOrDeclineCustomOrderMutation,
  useGetCustomOrdersQuery,
} from "@/redux/features/vendor/order/orderSlice";
import { selectShowroomId } from "@/redux/features/vendor/showroomSlice/selectedShowroomSlice";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

interface CustomOrder {
  _id: string;
  customer: {
    _id: string;
    name: string;
  };
  product: {
    _id: string;
    product_name: string;
  };
  orderStatus: string;
  price?: {
    amount: number;
    unit: string;
  };
  reason?: string;
  createdAt: string;
}

const CUSTOM_ORDER_FILTERS = [
  "All Custom Orders",
  "Vendor Accepted",
  "Vendor Rejected",
  "Customer Accepted",
  "Customer Rejected",
  "Paid",
  "Driver Accepted",
  "Picked Up",
  "Delivered",
];

export default function CustomRequest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Filter");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [modalType, setModalType] = useState<"accept" | "decline" | null>(null);
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("usd");
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showroomId = useSelector(selectShowroomId);
  console.log(showroomId)
  const limit = 10;

  const [acceptOrDeclineCustomOrder] = useAcceptOrDeclineCustomOrderMutation();

  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useGetCustomOrdersQuery({
    page: currentPage,
    limit,
    searchQ: searchTerm,
    filter: filterType,
    showroomId,
  });

  const allOrders: CustomOrder[] = ordersData?.data || [];
  const meta = ordersData?.meta;

  const filteredOrders = allOrders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleAccept = (order: CustomOrder) => {
    setSelectedOrder(order);
    setModalType("accept");
    setIsModalOpen(true);
    setPrice("");
    setPriceUnit("usd");
  };

  const handleDecline = (order: CustomOrder) => {
    setSelectedOrder(order);
    setModalType("decline");
    setIsModalOpen(true);
    setReason("");
  };

  const handleSubmitPrice = async () => {
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) return;
    if (!selectedOrder) return;

    try {
      await acceptOrDeclineCustomOrder({
        id: selectedOrder._id,
        action: "accepted",
        price: parseFloat(price),
        priceUnit,
        showroomId,
      }).unwrap();
      refetch();
      closeModal();
    } catch (err) {
      console.error("Failed to accept order:", err);
    }
  };

  const handleSendReason = async () => {
    if (!reason.trim() || !selectedOrder) return;

    try {
      await acceptOrDeclineCustomOrder({
        id: selectedOrder._id,
        action: "declined",
        reason,
        showroomId,
      }).unwrap();
      refetch();
      closeModal();
    } catch (err) {
      console.error("Failed to decline order:", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setModalType(null);
    setPrice("");
    setPriceUnit("usd");
    setReason("");
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (meta?.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: string } = {
      "Vendor Accepted":
        "bg-green-900/30 text-green-400 border border-green-500/30",
      "Vendor Rejected": "bg-red-900/30 text-red-400 border border-red-500/30",
      "Customer Accepted":
        "bg-blue-900/30 text-blue-400 border border-blue-500/30",
      "Customer Rejected":
        "bg-orange-900/30 text-orange-400 border border-orange-500/30",
      Paid: "bg-purple-900/30 text-purple-400 border border-purple-500/30",
      "Driver Accepted":
        "bg-cyan-900/30 text-cyan-400 border border-cyan-500/30",
      "Picked Up":
        "bg-indigo-900/30 text-indigo-400 border border-indigo-500/30",
      Delivered: "bg-green-900/30 text-green-400 border border-green-500/30",
      Pending: "bg-gray-900/30 text-gray-400 border border-gray-500/30",
    };
    return (
      styles[status] || "bg-gray-900/30 text-gray-400 border border-gray-500/30"
    );
  };

  return (
    <div className="mt-24 min-h-screen bg-linear-to-r from-black via-[#0f0924] to-black text-white font-sans">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">
          Custom Requests
        </h1>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1a1a2e] border border-[#4d4dff] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
          >
            <option>Filter</option>
            {CUSTOM_ORDER_FILTERS.map((filter) => (
              <option key={filter}>{filter}</option>
            ))}
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a2e] border border-[#4d4dff] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-[#8a8a9d]"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8a8a9d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-[#1a1a2e] border border-[#4d4dff] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#22223b]">
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">
                    Order
                  </th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">
                    View
                  </th>
                  <th className="text-left px-6 py-4 font-medium text-[#a8a8b8]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#a8a8b8]">
                      Loading...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#a8a8b8]">
                      No custom orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-[#2d2d41] hover:bg-[#22223b] transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-[#e0e0ff]">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-[#c7c7d9]">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[#c7c7d9]">
                        {order.customer?.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/vendor-dashboard/custom-orders/details?id=${order._id}`}
                        >
                          <button className="bg-[#4d4dff] hover:bg-[#5d5dff] text-white font-medium py-1.5 px-3.5 rounded-lg transition-colors text-sm">
                            View Details
                          </button>
                        </Link>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleAccept(order)}
                          disabled={
                            order.orderStatus === "Vendor Accepted" ||
                            order.orderStatus === "Vendor Rejected"
                          }
                          className="bg-[#4d4dff] hover:bg-[#5d5dff] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-1.5 px-3.5 rounded-lg transition-colors text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(order)}
                          disabled={
                            order.orderStatus === "Vendor Accepted" ||
                            order.orderStatus === "Vendor Rejected"
                          }
                          className="bg-[#ff4d6d] hover:bg-[#ff6b8b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-1.5 px-3.5 rounded-lg transition-colors text-sm"
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="bg-[#22223b] border-t border-[#2d2d41] px-6 py-4 flex items-center justify-between">
              <div className="text-[#a8a8b8] text-sm">{meta.total} Results</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2d2d41] hover:bg-[#4d4dff] disabled:opacity-50 transition-colors text-white"
                >
                  ←
                </button>
                {Array.from(
                  { length: Math.min(5, meta.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (meta.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= meta.totalPages - 2) {
                      pageNum = meta.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return pageNum;
                  },
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg transition-colors text-sm ${
                      page === currentPage
                        ? "bg-[#4d4dff] text-white font-medium"
                        : "bg-[#2d2d41] hover:bg-[#4d4dff] text-[#a8a8b8]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === meta.totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2d2d41] hover:bg-[#4d4dff] disabled:opacity-50 transition-colors text-white"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          {/* MODAL CONTAINER */}
          <div
            className="bg-[#0f0f1b] border border-[#4d4dff] rounded-xl w-full max-w-md shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#8a8a9d] hover:text-white transition-colors z-10 text-xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Accept Modal */}
            {modalType === "accept" && (
              <div className="p-8 pt-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">
                  Provide A Price
                </h2>
                <div className="mb-6">
                  <label className="block text-sm text-[#a8a8b8] mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter an offered price"
                    className="w-full bg-[#1a1a2e] border border-[#4d4dff] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#a8a8b8] mb-2">
                    Currency
                  </label>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-[#4d4dff] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="gbp">GBP</option>
                    <option value="bdt">BDT</option>
                  </select>
                </div>
                <button
                  onClick={handleSubmitPrice}
                  disabled={
                    !price || isNaN(parseFloat(price)) || parseFloat(price) <= 0
                  }
                  className="w-full bg-[#4d4dff] hover:bg-[#5d5dff] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            )}

            {/* Decline Modal */}
            {modalType === "decline" && (
              <div className="p-8 pt-12">
                <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-500">
                  Reason
                </h2>
                <p className="text-center text-[#a8a8b8] mb-6">
                  Give a reason why do you want to decline the order.
                </p>
                <div className="mb-6">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Write your reason"
                    rows={4}
                    className="w-full bg-[#1a1a2e] border border-[#4d4dff] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none"
                  ></textarea>
                </div>
                <button
                  onClick={handleSendReason}
                  disabled={!reason.trim()}
                  className="w-full bg-[#4d4dff] hover:bg-[#5d5dff] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
