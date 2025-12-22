// 'use client';

// import React from 'react';

// export default function DashboardPage() {
//   const stats = [
//     { title: 'Total Products', value: '4', icon: '📦' },
//     { title: 'Total Orders', value: '4', icon: '📊', color: 'from-purple-500 to-purple-600' },
//     { title: 'Total Revenue', value: '$40', icon: '📈', color: 'from-blue-500 to-blue-600' },
//     { title: 'Total Pending', value: '4', icon: '⏳', color: 'from-pink-500 to-pink-600' }
//   ];

//   const orders = [
//     { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed' },
//     { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed' },
//     { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed' },
//     { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed' }
//   ];

//   const products = [
//     { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock' },
//     { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock' },
//     { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock' },
//     { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock' }
//   ];

//   return (
//     <>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
//           >
//             <div className="flex items-center gap-4">
//               <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
//                 {stat.icon}
//               </div>
//               <div>
//                 <div className="text-3xl font-bold">{stat.value}</div>
//                 <div className="text-sm text-gray-400 mt-1">{stat.title}</div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold">Recent Orders</h2>
//           <button className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center gap-2">
//             View All →
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-800">
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Order ID</th>
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Date & Time</th>
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Customer</th>
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Order Status</th>
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order, index) => (
//                 <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
//                   <td className="py-4 px-4 text-sm">{order.id}</td>
//                   <td className="py-4 px-4 text-sm text-gray-400">{order.date}</td>
//                   <td className="py-4 px-4 text-sm">{order.customer}</td>
//                   <td className="py-4 px-4">
//                     <span className="px-3 py-1 bg-yellow-900/30 text-yellow-500 rounded-full text-xs font-medium">
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Recent Uploaded Products */}
//       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold">Recent Uploaded Products</h2>
//           <button className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center gap-2">
//             View All →
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-800">
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Product</th>
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Price</th>
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
//                 <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product, index) => (
//                 <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gray-800 rounded-lg"></div>
//                       <span className="text-sm">{product.name}</span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-sm">{product.price}</td>
//                   <td className="py-4 px-4">
//                     <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs font-medium">
//                       {product.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

import Image from "next/image";
import React from "react";
import productIcon from "./../../../public/images/product.png";

export default function DashboardHome() {
  const stats = [
    {
      title: "Total Products",
      value: "4",
      icon: "/images/product.png",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Total Orders",
      value: "4",
      icon: "/images/order.png",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Total Revenue",
      value: "$40",
      icon: "/images/earn.png",
      borderColor: "border-cyan-500/30",
    },
    {
      title: "Total Pending",
      value: "4",
      icon: "/images/pending.png",
      borderColor: "border-purple-500/30",
    },
  ];

  const recentOrders = [
    {
      id: "#12512B",
      date: "May 5, 4:20 PM",
      customer: "Tom Anderson",
      status: "Order Placed",
    },
    {
      id: "#12512B",
      date: "May 5, 4:20 PM",
      customer: "Tom Anderson",
      status: "Order Placed",
    },
    {
      id: "#12512B",
      date: "May 5, 4:20 PM",
      customer: "Tom Anderson",
      status: "Order Placed",
    },
    {
      id: "#12512B",
      date: "May 5, 4:20 PM",
      customer: "Tom Anderson",
      status: "Order Placed",
    },
  ];

  const recentProducts = [
    { name: "Bomber Jacket", price: "$24.00", status: "In Stock" },
    { name: "Bomber Jacket", price: "$24.00", status: "In Stock" },
    { name: "Bomber Jacket", price: "$24.00", status: "In Stock" },
    { name: "Bomber Jacket", price: "$24.00", status: "In Stock" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-tl from-[#100b1f] via-[#170f2e] to-black 
 border border-l-[#912DAD] border-l-6 

  ${stat.borderColor} rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-500/10 h-36 transition-all`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}
              >
                <img
                  src={stat.icon}
                  alt={stat.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl font-normal text-[#6100FF]">
                  {stat.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-l from-[#070722] to-[#0a183f] border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold font-cormorant">Recent Orders</h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-2 transition-colors">
            View All <span>→</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800/30 hover:bg-purple-900/10 transition-colors"
                >
                  <td className="py-3 px-4 text-sm">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {order.date}
                  </td>
                  <td className="py-3 px-4 text-sm">{order.customer}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-500/30 rounded-full text-xs font-medium">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-xs font-medium transition-all shadow-lg shadow-purple-500/20">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Uploaded Products */}
      <div className="bg-gradient-to-l from-[#070722] to-[#0a183f] shadow-[0_0_12px_rgba(34,211,238,0.35)] border border-purple-500/30 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold font-cormorant">Recent Uploaded Products</h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-2 transition-colors">
            View All <span>→</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800/30 hover:bg-purple-900/10 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
                        🧥
                      </div>
                      <span className="text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{product.price}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-xs font-medium transition-all shadow-lg shadow-purple-500/20">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
