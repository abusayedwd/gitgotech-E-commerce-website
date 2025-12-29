'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Clock, Package, BarChart3, Menu, X } from 'lucide-react';

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/vendor-dashboard' },
    { name: 'Order History', icon: Clock, path: '/vendor-dashboard/orders' },
    { name: 'My Product', icon: Package, path: '/vendor-dashboard/products' },
    { name: 'Analytics', icon: BarChart3, path: '/vendor-dashboard/analytics' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden fixed top-28 left-4 z-50 p-3 bg-[#2E2E34] rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 bg-[#2E2E34] rounded-lg p-6 border border-gray-800">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all ${
                      pathname === item.path
                        ? 'bg-gradient-to-l from-[#B630F4] to-[#2ACCED] text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Mobile (Overlay) */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-40 top-24"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Mobile Menu */}
              <div className="lg:hidden fixed top-24 left-0 right-0 z-40 mx-4 mt-20 bg-[#2E2E34] rounded-lg p-6 border border-gray-800 shadow-2xl">
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        pathname === item.path
                          ? 'bg-gradient-to-l from-[#B630F4] to-[#2ACCED] text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1 pb-8 mt-4 w-full lg:w-auto">
            {children}
          </div>
           
        </div>
      </div>
    </div>
  );
}