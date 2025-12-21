'use client';

import React, { useState } from 'react';

interface Order {
  id: string;
  date: string;
  customer: string;
  status: string;
}

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Filter');
  const [currentPage, setCurrentPage] = useState(2);

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

  const getStatusStyle = (status: string) => {
    const styles: { [key: string]: string } = {
      'Order Placed': 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/30',
      'Processing': 'bg-purple-900/30 text-purple-400 border border-purple-500/30',
      'Shipped': 'bg-blue-900/30 text-blue-400 border border-blue-500/30',
      'Order Accepted': 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30',
      'Refund Init': 'bg-teal-900/30 text-teal-400 border border-teal-500/30',
      'Delivered': 'bg-green-900/30 text-green-400 border border-green-500/30'
    };
    return styles[status] || 'bg-gray-900/30 text-gray-400 border border-gray-500/30';
  };

  const handleViewDetails = (order: Order) => {
    console.log('View details:', order);
  };

  return (
    <div className="bg-gradient-to-r from-black via-[#0f0924] to-black border border-cyan-500/30 rounded-2xl p-8 shadow-xl shadow-cyan-500/5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Orders</h2>
        
        {/* Filter and Search */}
        <div className="flex gap-4 mb-6">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-cyan-500/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-sm text-white backdrop-blur-sm"
          >
            <option>Filter</option>
            <option>All Orders</option>
            <option>Order Placed</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Order Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => (
              <tr key={index} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                <td className="py-3 px-4 text-sm text-white">{order.id}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{order.date}</td>
                <td className="py-3 px-4 text-sm text-white">{order.customer}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleViewDetails(order)}
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-xs font-medium transition-all shadow-lg shadow-purple-500/20"
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
      <div className="flex items-center justify-center gap-2 mt-6">
        <button 
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="w-8 h-8 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          ←
        </button>
        
        <button className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-lg text-sm">
          2
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
          3
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
          4
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
          5
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
          6
        </button>
        <span className="text-gray-400 text-sm">...</span>
        <button className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
          24
        </button>
        
        <button 
          onClick={() => setCurrentPage(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}