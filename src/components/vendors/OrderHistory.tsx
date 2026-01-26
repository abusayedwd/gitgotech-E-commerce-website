'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Order {
  id: string;
  date: string;
  customer: string;
  status: string;
}

interface Return {
  id: string;
  date: string;
  customer: string;
  status: string;
  reason?: string;
}

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Filter');
  const [currentPage, setCurrentPage] = useState(2);
  const [activeTab, setActiveTab] = useState<'orders' | 'returns'>('orders');
  const router = useRouter();

  const allOrders: Order[] = [
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Processing' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Shipped' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Order Accepted' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refund Init' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refund Init' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Delivered' },
  ];

  const allReturns: Return[] = [
    { id: '#12512B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Return Accepted' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Return Declined' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Return Declined' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Return Accepted' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Return Accepted' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Pending' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Pending' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
    { id: '#72517B', date: 'May 5, 4:20 PM', customer: 'Tom Anderson', status: 'Refunded' },
  ];

  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: string } = {
      'Order Placed': 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/30',
      'Processing': 'bg-purple-900/30 text-purple-400 border border-purple-500/30',
      'Shipped': 'bg-blue-900/30 text-blue-400 border border-blue-500/30',
      'Order Accepted': 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30',
      'Refund Init': 'bg-teal-900/30 text-teal-400 border border-teal-500/30',
      'Delivered': 'bg-green-900/30 text-green-400 border border-green-500/30',
      'Return Accepted': 'bg-orange-900/30 text-orange-400 border border-orange-500/30',
      'Return Declined': 'bg-red-900/30 text-red-400 border border-red-500/30',
      'Pending': 'bg-gray-900/30 text-gray-400 border border-gray-500/30',
      'Refunded': 'bg-green-900/30 text-green-400 border border-green-500/30'
    };
    return styles[status] || 'bg-gray-900/30 text-gray-400 border border-gray-500/30';
  };

  const handleViewDetails = (item: Order | Return) => {
    console.log('View details:', item);
    router.push("/vendor-dashboard/orders/details");
  };

  return (
    <div className="bg-gradient-to-tr from-[#05011a] via-[#0f0536] to-[#07021d] border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/40 rounded-xl md:rounded-2xl p-4 md:p-8">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-[#6100FF] to-pink-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'returns'
              ? 'bg-gradient-to-r from-[#6100FF] to-pink-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          Returns
        </button>
      </div>

      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold font-cormorant mb-4 md:mb-6 text-white">
          {activeTab === 'orders' ? 'Orders' : 'Returns'}
        </h2>
        
        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-800/50 border border-cyan-500/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-sm text-white backdrop-blur-sm"
          >
            <option>Filter</option>
            {activeTab === 'orders' ? (
              <>
                <option>All Orders</option>
                <option>Order Placed</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </>
            ) : (
              <>
                <option>All Returns</option>
                <option>Pending</option>
                <option>Return Accepted</option>
                <option>Return Declined</option>
                <option>Refunded</option>
              </>
            )}
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-cyan-500/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-sm text-white placeholder-gray-400 backdrop-blur-sm"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3 mb-4">
        {(activeTab === 'orders' ? allOrders : allReturns).map((item, index) => (
          <div
            key={index}
            className="bg-gray-800/20 border border-gray-700/30 rounded-lg p-4 hover:bg-gray-800/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-white mb-1">{item.id}</div>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                {item.status}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/30">
              <span className="text-sm text-white">{item.customer}</span>
              <button 
                onClick={() => handleViewDetails(item)}
                className="px-3 py-1.5 bg-gradient-to-r cursor-pointer from-[#6100FF] to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-xs font-medium transition-all shadow-lg shadow-purple-500/20"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {activeTab === 'orders' ? 'Order ID' : 'Order ID'}
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {activeTab === 'orders' ? 'Order Status' : 'Order Status'}
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'orders' ? allOrders : allReturns).map((item, index) => (
              <tr key={index} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                <td className="py-3 px-4 text-sm text-white">{item.id}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{item.date}</td>
                <td className="py-3 px-4 text-sm text-white">{item.customer}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleViewDetails(item)}
                    className="px-4 py-1.5 bg-gradient-to-r cursor-pointer from-[#6100FF] to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-xs font-medium transition-all shadow-lg shadow-purple-500/20"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-4 md:mt-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm md:text-base"
        >
          ←
        </button>
        
        <button className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs md:text-sm">
          1
        </button>
        <button className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-purple-600 rounded-lg text-xs md:text-sm">
          2
        </button>
        <button className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs md:text-sm">
          3
        </button>
        <button className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs md:text-sm">
          4
        </button>
        <button className="hidden sm:flex w-7 h-7 md:w-8 md:h-8 shrink-0 items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs md:text-sm">
          5
        </button>
        <button className="hidden sm:flex w-7 h-7 md:w-8 md:h-8 shrink-0 items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs md:text-sm">
          6
        </button>
        <span className="text-gray-400 text-xs md:text-sm px-1">...</span>
        <button className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-xs md:text-sm">
          24
        </button>
        
        <button 
          onClick={() => setCurrentPage(currentPage + 1)}
          className="w-7 h-7 md:w-8 md:h-8 shrink-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm md:text-base"
        >
          →
        </button>
      </div>
    </div>
  );
}