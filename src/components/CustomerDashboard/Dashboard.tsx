"use client";
import { useState } from 'react';

export default function MyDashboard() {
  const [orders] = useState([
    {
      id: 1,
      productName: 'Flowy Skirt',
      brand: 'PRINCE OF DARZI',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=200&fit=crop',
      price: 14.99,
      quantity: 1,
      otp: '5R7T8956',
      total: 14.99,
      status: 'Completed',
      hasReview: false
    },
    {
      id: 2,
      productName: 'Flowy Skirt',
      brand: 'PRINCE OF DARZI',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=200&fit=crop',
      price: 14.99,
      quantity: 1,
      otp: '5R7T8956',
      total: 14.99,
      status: 'Reward',
      hasReview: false,
      showRewardBadge: true
    },
    {
      id: 3,
      productName: 'Flowy Skirt',
      brand: 'PRINCE OF DARZI',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=200&fit=crop',
      price: 14.99,
      quantity: 1,
      otp: '5R7T8956',
      total: 14.99,
      status: 'Processing',
      hasReview: false
    },
    {
      id: 4,
      productName: 'Flowy Skirt',
      brand: 'PRINCE OF DARZI',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=200&fit=crop',
      price: 14.99,
      quantity: 1,
      otp: '5R7T8956',
      total: 14.99,
      status: 'Cancelled',
      hasReview: false
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'text-green-500';
      case 'Processing':
        return 'text-blue-500';
      case 'Cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen md:mt-24 mt-20  bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className=" container mx-auto mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3">My Dashboard</h1>
        <p className="text-gray-400 text-sm md:text-base">View all of your order history and keep track of your shopping.</p>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {orders.map((order) => (
          <div 
            key={order.id}
            className="bg-gradient-to-br from-gray-900/50 to-purple-900/10 border border-gray-800 rounded-2xl p-4 md:p-6 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Product Image */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                <img 
                  src={order.image}
                  alt={order.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 w-full md:w-auto">
                <h3 className="text-lg md:text-xl font-semibold mb-1">{order.productName}</h3>
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <span className="text-purple-400 text-xs md:text-sm">👑</span>
                  <span className="text-gray-400 text-xs md:text-sm">{order.brand}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base">
                  <span className="text-white">${order.price}</span>
                  <span className="text-gray-400">Qty: {order.quantity}</span>
                </div>
              </div>

              {/* Right Side - Status & Actions */}
              <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3 md:gap-4">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  {order.status === 'Completed' && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  )}
                  {order.status === 'Processing' && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs font-medium">
                      Processing
                    </span>
                  )}
                  {order.status === 'Cancelled' && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-medium">
                      Cancelled
                    </span>
                  )}
                </div>

                {/* OTP & Total */}
                <div className="text-right w-full md:w-auto">
                  <div className="text-xs md:text-sm text-gray-400 mb-1">OTP: {order.otp}</div>
                  <div className="text-sm md:text-base font-semibold">Total: ${order.total}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
                  {order.status === 'Completed' && !order.hasReview && (
                    <button className="px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-colors">
                      Leave Review
                    </button>
                  )}
                  
                  {order.showRewardBadge && (
                    <div className="relative">
                      <button className="px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-colors">
                        Reward
                      </button>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">M</span>
                      </div>
                    </div>
                  )}
                  
                  <button className="px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-colors">
                    View Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Icon - Top Right */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
          <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}