"use client"

import BackButton from '@/customComponent/BackButton';
import React, { useState } from 'react';

// Types
interface OrderDetails {
  productName: string;
  size: string;
  quantity: number;
  price: number;
  subTotal: number;
  customDetail: string;
}

interface CustomerDetails {
  fullName: string;
  country: string;
  state: string;
  zipCode: string;
  streetAddress: string;
  email: string;
  phone: string;
  paymentMethod: string;
}

interface OrderDetailsPageProps {
  order?: OrderDetails;
  customer?: CustomerDetails;
  productImage?: string;
}

const CustomRequestDetails: React.FC<OrderDetailsPageProps> = ({
  order = {
    productName: 'Bomber Jacket',
    size: 'M',
    quantity: 1,
    price: 20,
    subTotal: 21,
    customDetail: 'Color blue with vertical stripes',
  },
  customer = {
    fullName: 'Dianne',
    country: 'United States',
    state: 'Washington DC',
    zipCode: '20033',
    streetAddress: '4140 Parl',
    email: 'dianne.russell@gmail.com',
    phone: '(603) 555-0123',
    paymentMethod: 'Debit Card',
  },
  productImage = '/images/jacket.png',
}) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleAccept = () => {
    setShowAcceptModal(true);
  };

  const handleDecline = () => {
    setShowDeclineModal(true);
  };

  const confirmAccept = () => {
    alert('Order accepted successfully!');
    setShowAcceptModal(false);
  };

  const submitDecline = () => {
    if (declineReason.trim()) {
      alert(`Order declined. Reason: ${declineReason}`);
      setShowDeclineModal(false);
      setDeclineReason('');
    }
  };

  const closeModal = () => {
    setShowDeclineModal(false);
    setShowAcceptModal(false);
    setDeclineReason('');
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] text-white p-5 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <BackButton title='view details' />
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)]"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-none px-8 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 rounded-lg font-medium transition-all duration-300"
            >
              Decline
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-xl p-6 flex items-center justify-center h-80">
            <img
              src={productImage}
              alt={order.productName}
              className=" object-contain"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            {/* Order Details Card */}
            <div className="bg-[#1e1e32]/80 border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Order Details</h2>

              <div className="space-y-4">
                <DetailRow label="Product Name:" value={order.productName} />
                <DetailRow label="Size:" value={order.size} />
                <DetailRow label="Quantity:" value={order.quantity.toString()} />
                <DetailRow label="Price:" value={`$${order.price}`} />
                <DetailRow label="Sub Total:" value={`$${order.subTotal}`} />
                <DetailRow label="Custom Detail:" value={order.customDetail} />
              </div>

              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg">
                  👤
                </div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-[#1e1e32]/80 border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Customer Details</h2>

              <div className="space-y-4">
                <DetailRow label="Full Name:" value={customer.fullName} />
                <DetailRow label="Country:" value={customer.country} />
                <DetailRow label="State:" value={customer.state} />
                <DetailRow label="Zip Code:" value={customer.zipCode} />
                <DetailRow label="Street Address:" value={customer.streetAddress} />
                <DetailRow label="Email:" value={customer.email} />
                <DetailRow label="Phone:" value={customer.phone} />
                <DetailRow label="Payment Method:" value={customer.paymentMethod} />
              </div>
            </div>
          </div>
        </div>

        {/* Chat Icon */}
        
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <Modal onClose={closeModal}>
          <div className="relative">
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold text-center mb-2">Reason</h2>
            <p className="text-purple-400 text-sm text-center mb-6">
              Tell us why you're declining this return request
            </p>

            

            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Write your reason"
              className="w-full min-h-[120px] bg-[#1e1e32]/50 border border-purple-500/30 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-y mb-5"
            />

            <button
              onClick={submitDecline}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)]"
            >
              Send
            </button>
          </div>
        </Modal>
      )}

      {/* Accept Confirmation Modal */}
      {showAcceptModal && (
        <Modal onClose={closeModal}>
          <div className="relative text-center max-w-sm">
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              ×
            </button>

            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✓
            </div>

            <h2 className="text-2xl font-semibold mb-2">Confirm Accept</h2>
            <p className="text-purple-400 text-sm mb-6">
              Are you sure you want to accept this order?
            </p>

            <div className="flex gap-4">
              <button
                onClick={closeModal}
                className="flex-1 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 rounded-lg font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmAccept}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,92,246,0.4)]"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Detail Row Component
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="text-white text-sm font-medium text-right">{value}</span>
  </div>
);

// Modal Component
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({
  children,
  onClose,
}) => (
  <div
    className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
    onClick={onClose}
  >
    <div
      className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] border-2 border-purple-500/50 rounded-2xl p-8 w-full max-w-md animate-slideIn"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

export default CustomRequestDetails;