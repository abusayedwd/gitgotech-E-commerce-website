'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function ReturnDetails() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  const returnData = {
    orderId: '#72517B',
    customer: 'Tom Anderson',
    date: 'May 5, 4:20 PM',
    product: {
      name: 'Brown Bomber Jacket',
      image: '/images/jacket.png',
      price: '$89.99',
      quantity: 1
    },
    reason: 'Lorem ipsum dolor sit amet consectetur. Enim non sit varius ut vulpat amet nisi. Faucibus lacus elit faucibus tempus scelerisque. Sagittis at orci rutrum lorem arcu at massa. Ac sed accumsan ipsum ornare blandit. Facilisi lacus lorem sodales diam.'
  };

  const handleAccept = () => {
    setShowConfirmModal(true);
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleBack = () => {
    router.back();
  };

  const confirmAccept = () => {
    console.log('Return accepted');
    setShowConfirmModal(false);
    // Add your accept logic here
  };

  const confirmDecline = () => {
    console.log('Return declined with reason:', declineReason);
    setShowDeclineModal(false);
    // Add your decline logic here
  };

  const submitReport = () => {
    console.log('Report submitted with reason:', reportReason, 'and images:', uploadedImages);
    setShowReportModal(false);
    // Add your report submission logic here
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
            <button
              onClick={handleReport}
              className="px-6 py-2.5 bg-transparent border border-yellow-500/50 hover:bg-yellow-500/10 rounded-lg text-yellow-400 font-medium transition-all"
            >
              Report
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

        {/* Modal for Decline */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0f] border border-purple-500/30 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Reason</h3>
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">G</div>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
              </div>
              <p className="text-purple-400 text-sm mb-4">Tell us why you're declining this return request.</p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Write your reason"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 resize-none h-24"
              />
              <button
                onClick={confirmDecline}
                disabled={!declineReason.trim()}
                className={`w-full mt-4 px-6 py-3 rounded-lg font-medium transition-all ${
                  declineReason.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Modal for Confirm Accept */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0f] border border-green-500/30 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Confirm Acceptance</h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-green-400 text-sm mb-4">Are you sure you want to accept this return request?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAccept}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg text-white font-medium transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Report */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0a0f] border border-purple-500/30 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Report</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-purple-400 text-sm mb-4 text-center">Your report will go to admin</p>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Upload Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img src={image} alt="Uploaded" className="w-full h-full object-cover rounded" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 border-2 border-dashed border-gray-600 rounded flex items-center justify-center cursor-pointer hover:border-purple-500">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Write your reason"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-500 resize-none h-24 mb-4"
              />
              <button
                onClick={submitReport}
                disabled={!reportReason.trim()}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
                  reportReason.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
