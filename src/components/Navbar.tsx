"use client";

import { useState } from 'react';
import { Heart, ShoppingCart, MessageSquare, Bell, User, Search, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import FashionSearchNav from './FilterProduct';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Function to determine if link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 px-4 sm:px-6 py-4">
      <div className="container mx-auto border py-2 px-4 rounded-4xl border-gray-700 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative">
          <div className="relative w-20 h-20 sm:w-12 sm:h-12">
            <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={20}
              height={20}

              className=" h-24 w-24 sm:h-10 sm:w-10 object-contain"
              priority
            />
            </Link>
          </div>
          </div>
        </div>

      

        {/* Desktop Right Section - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-6">
  {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-6 md:mr-10">
          <Link
            href="/explore"
            className={`${
              isActive('/explore')
                ? 'text-purple-500 font-medium'
                : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            explore
          </Link>
          <Link
            href="/showroom"
            className={`${
              isActive('/showroom')
                ? 'text-purple-500 font-medium'
                : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            showroom
          </Link>
        </div>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Heart className="w-5 h-5 text-gray-400" />
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <User className="w-5 h-5 text-gray-400" />
          </button>

          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-3xl font-medium transition-colors">
            Dashboard
          </button>
        </div>

        {/* Mobile Icons - Visible on mobile/tablet */}
        <div className="flex lg:hidden items-center space-x-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              2
            </span>
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-400" />
            ) : (
              <Menu className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slides down when open */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 pb-2 space-y-3 border-t border-gray-800 mt-4">
          {/* Mobile Navigation Links */}
          <Link
            href="/explore"
            className={`block ${
              isActive('/explore')
                ? 'text-purple-500 font-medium'
                : 'text-gray-400 hover:text-white'
            } transition-colors py-2`}
          >
            explore
          </Link>
          <Link
            href="/showroom"
            className={`block ${
              isActive('/showroom')
                ? 'text-purple-500 font-medium'
                : 'text-gray-400 hover:text-white'
            } transition-colors py-2`}
          >
            showroom
          </Link>

          {/* Mobile Icon Buttons */}
          <div className="flex items-center space-x-3 pt-3 pb-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Heart className="w-5 h-5 text-gray-400" />
            </button>

            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </button>

            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <User className="w-5 h-5 text-gray-400" />
            </button>

            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Mobile Dashboard Button */}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-colors">
            Dashboard
          </button>
        </div>
      </div>
      <FashionSearchNav />
    </nav>
  );
}