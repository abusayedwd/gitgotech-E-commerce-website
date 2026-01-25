"use client"

import React from 'react';
import { Package, MapPin, Clock, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import BackButton from '@/customComponent/BackButton';
import { useRouter } from 'next/navigation';
const DeliveryRequest = () => {

const router = useRouter()

  const deliveries = [
    {
      id: 1,
      customer: "Rachel",
      location: "Downtown",
      price: 14.99,
      quantity: 3,
      status: "Completed",
      orderId: "56789025",
      date: "2024-01-15"
    },
    {
      id: 2,
      customer: "Rachel",
      location: "Downtown",
      price: 14.99,
      quantity: 3,
      status: "Accepted",
      orderId: "56789056",
      date: "2024-01-14"
    },
    {
      id: 3,
      customer: "Rachel",
      location: "Downtown",
      price: 14.99,
      quantity: 3,
      status: "Pending",
      orderId: "56789056",
      date: "2024-01-13"
    },
    {
      id: 4,
      customer: "Rachel",
      location: "Downtown",
      price: 14.99,
      quantity: 3,
      status: "In Progress",
      orderId: "56789056",
      date: "2024-01-12"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-600";
      case "Accepted": return "bg-blue-600";
      case "Pending": return "bg-yellow-600";
      case "In Progress": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Completed": return <CheckCircle className="w-4 h-4" />;
      case "Accepted": return <CheckCircle className="w-4 h-4" />;
      case "Pending": return <AlertTriangle className="w-4 h-4" />;
      case "In Progress": return <Loader className="w-4 h-4 animate-spin" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className=" container mx-auto mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
      {/* Header */}
      <BackButton title='Request Delivery' className='text-[24px]' /> 
       <div className='text-center mt-12'>
          <h1 className="text-3xl font-bold font-cormorant">Request A Delivery</h1>
          <p className="text-gray-400 mt-1">View the history of the requested delivery</p>
        </div>
      <div className="flex items-center justify-between mb-8">
       <div> </div>
        
        <button onClick={() => router.push("/customer-dashboard/newdelivery-request")}
         className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          New Request
        </button>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <div 
            key={delivery.id} 
            className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-purple-500 transition-colors"
          >
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/jacket.png" 
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Delivery Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{delivery.customer}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{delivery.location}</span>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)} flex items-center space-x-1`}>
                      {getStatusIcon(delivery.status)}
                      <span>{delivery.status}</span>
                    </div>
                  </div>
                </div>
                
                {/* Price and Quantity */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">${delivery.price}</span>
                    <span className="text-sm text-gray-400">Qty: {delivery.quantity}</span>
                  </div>
                  
                  {/* Order ID and Total */}
                  <div className="text-right">
                    <div className="text-xs text-gray-400">OID: {delivery.orderId}</div>
                    <div className="text-sm font-medium">Total: ${delivery.price * delivery.quantity}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryRequest;
