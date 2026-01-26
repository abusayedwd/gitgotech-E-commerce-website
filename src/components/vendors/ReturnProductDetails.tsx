'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function ReturnDetails() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  const returnData = {
    orderId: '#72517B',
    customer: 'Tom Anderson',
    date: 'May 5, 4:20 PM',
    product: {
      name: 'Brown Bomber Jacket',
      image: '/api/placeholder/400/400',
      price: '$89.99',
      quantity: 1
    },
    reason: 'Lorem ipsum dolor sit amet consectetur. Enim non sit varius ut vulpat amet nisi. Faucibus lacus elit faucibus tempus scelerisque. Sagittis at orci rutrum lorem arcu at massa. Ac sed accumsan ipsum ornare blandit. Facilisi lacus lorem sodales diam.'
  };

  const handleAccept = () => {
    console.log('Return accepted');
    // Add your accept logic here
  };

  const handleDecline = () => {
    console.log('Return declined');
    // Add your decline logic here
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center hover:bg-blue-600/30 transition-colors"
            >
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-white">View Details</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all shadow-lg shadow-purple-500/20"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 bg-transparent border border-red-500/50 hover:bg-red-500/10 rounded-lg text-red-400 font-medium transition-all"
            >
              Decline
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
            <img
              src={returnData.product.image}
              alt={returnData.product.name}
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* Reason Box */}
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Reason</h2>
              <p className="text-gray-300 leading-relaxed">
                {returnData.reason}
              </p>
            </div>

            {/* Chat Button */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Order Information */}
        <div className="mt-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/30 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Order Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Order ID</p>
              <p className="text-white font-medium">{returnData.orderId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Customer</p>
              <p className="text-white font-medium">{returnData.customer}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Date</p>
              <p className="text-white font-medium">{returnData.date}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{returnData.product.name}</p>
                <p className="text-gray-400 text-sm">Quantity: {returnData.product.quantity}</p>
              </div>
              <p className="text-white font-semibold text-lg">{returnData.product.price}</p>
            </div>
          </div>
        </div>

        {/* Chat Panel (Optional) */}
        {showChat && (
          <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
              <h3 className="text-white font-semibold">Chat with Customer</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-gray-400 text-center text-sm">Chat functionality coming soon...</p>
            </div>
            <div className="p-4 border-t border-gray-700/30">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}