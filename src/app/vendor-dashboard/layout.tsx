'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Clock, Package, BarChart3 } from 'lucide-react';

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/vendor-dashboard' },
    { name: 'Order History', icon: Clock, path: '/vendor-dashboard/orders' },
    { name: 'My Product', icon: Package, path: '/vendor-dashboard/products' },
    { name: 'Analytics', icon: BarChart3, path: '/vendor-dashboard/analytics' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen mt-24 bg-gray-950 text-white overflow-hidden">
      {/* Sidebar - Fixed */}
      <div className="w-64 mt-24 bg-gray-900 p-6 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0">
        <div className="mb-8">
        
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  pathname === item.path
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
      <div className="flex-1 ml-64 overflow-y-auto p-8 h-screen">
        {children}
      </div>
    </div>
  );
}