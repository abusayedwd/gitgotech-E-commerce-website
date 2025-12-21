"use client"
import React, { useState } from 'react';
import { LayoutDashboard, Clock, Package, BarChart3 } from 'lucide-react';
 
import MyProducts from './Myproduct';
import OrderHistory from './OrderHistory';

export default function VendorDashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const stats = [
    { title: 'Total Products', value: '4', icon: '📦', color: 'from-orange-500 to-orange-600' },
    { title: 'Total Orders', value: '4', icon: '📊', color: 'from-purple-500 to-purple-600' },
    { title: 'Total Revenue', value: '$40', icon: '📈', color: 'from-blue-500 to-blue-600' },
    { title: 'Total Pending', value: '4', icon: '⏳', color: 'from-pink-500 to-pink-600' }
  ];

  const orders = [
    { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed', action: 'View Details' },
    { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed', action: 'View Details' },
    { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed', action: 'View Details' },
    { id: '#125126', date: 'May 6, 4:20 PM', customer: 'Tom Anderson', status: 'Order Placed', action: 'View Details' }
  ];

  const products = [
    { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock', action: 'View Details' },
    { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock', action: 'View Details' },
    { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock', action: 'View Details' },
    { name: 'Bomber Jacket', price: '$24.00', status: 'In Stock', action: 'View Details' }
  ];

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Order History', icon: Clock },
    { name: 'My Product', icon: Package },
    { name: 'Analytics', icon: BarChart3 }
  ];

  const renderDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <button className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center gap-2">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Order ID</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Date & Time</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Order Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4 text-sm">{order.id}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{order.date}</td>
                  <td className="py-4 px-4 text-sm">{order.customer}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-yellow-900/30 text-yellow-500 rounded-full text-xs font-medium">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                      {order.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Uploaded Products */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Uploaded Products</h2>
          <button className="text-purple-500 hover:text-purple-400 text-sm font-medium flex items-center gap-2">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Product</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Price</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg"></div>
                      <span className="text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">{product.price}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs font-medium">
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                      {product.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

 



  const renderAnalytics = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Analytics</h2>
        <p className="text-gray-400">Track your performance and growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.title}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-green-500">↑ 12%</span>
              <span className="text-gray-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Sales Overview</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p>Sales chart would appear here</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Revenue Breakdown</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📈</div>
              <p>Revenue chart would appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeMenu) {
      case 'Dashboard':
        return renderDashboard();
      case 'Order History':
        return <OrderHistory />;
      case 'My Product':
        return  <MyProducts />;
      case 'Analytics':
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen mt-24  bg-gray-950 text-white overflow-hidden">
      {/* Sidebar - Fixed */}
      <div className="w-64 bg-[#2E2E34] mt-24 h-96 p-6 border-r rounded border-gray-800 flex flex-col  fixed  ">
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-4">Navigation</h2>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeMenu === item.name
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile - Fixed at bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              G
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Guest User</div>
              <div className="text-xs text-gray-400">Vendor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - With left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64  overflow-y-auto py-8 px-4 h-screen">
        {renderContent()}
      </div>
    </div>
  );
}