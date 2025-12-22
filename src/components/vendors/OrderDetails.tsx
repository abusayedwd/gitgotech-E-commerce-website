
'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderDetailsPage() {
  const router = useRouter();

  const orderDetails = {
    productName: 'Bomber Jacket',
    sku: 'M-0.1-DL-01(3)',
    quantity: 31,
    price: '$30',
    oldTotal: '$33'
  };

  const customerDetails = {
    fullName: 'Dianna',
    country: 'United States',
    state: 'Washington DC',
    zipCode: '20033',
    streetAddress: 'drbl hgd',
    email: 'diannnarussel@gmail.com',
    phone: '(202) 555-0123',
    paymentMethod: 'Debit Card'
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="container mx-auto mt-4 flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">View Details</h1>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="  rounded-2xl p-6">
          <div className="bg-white rounded-xl overflow-hidden aspect-square flex items-center justify-center">
             <img
                  src="/images/jacket.png"
                  alt={"h"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6 ">
          {/* Order Details */}
          <div className="bg-gradient-to-tr from-[#05011a] via-[#090322] to-[#05011a] border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-700/50 pb-3">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Product Name:</span>
                <span className="text-white font-medium">{orderDetails.productName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Sku:</span>
                <span className="text-white font-medium">{orderDetails.sku}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Quantity:</span>
                <span className="text-white font-medium">{orderDetails.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Price:</span>
                <span className="text-white font-medium">{orderDetails.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Old Total:</span>
                <span className="text-white font-medium">{orderDetails.oldTotal}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gradient-to-tr from-[#05011a] via-[#090322] to-[#05011a] border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-700/50 pb-3">Customer Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Full Name:</span>
                <span className="text-white font-medium">{customerDetails.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Country:</span>
                <span className="text-white font-medium">{customerDetails.country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">State:</span>
                <span className="text-white font-medium">{customerDetails.state}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Zip Code:</span>
                <span className="text-white font-medium">{customerDetails.zipCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Street Address:</span>
                <span className="text-white font-medium">{customerDetails.streetAddress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Email:</span>
                <span className="text-white font-medium text-sm">{customerDetails.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Phone:</span>
                <span className="text-white font-medium">{customerDetails.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Payment Method:</span>
                <span className="text-white font-medium">{customerDetails.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}