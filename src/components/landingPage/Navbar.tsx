 

// "use client";

// import { useState } from 'react';
// import { Heart, ShoppingCart, MessageSquare, Bell, User, Search, Menu, X } from 'lucide-react';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import Link from 'next/link';

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const pathname = usePathname();

//   // Function to determine if link is active
//   const isActive = (path: string) => {
//     if (path === '/') {
//       return pathname === '/';
//     }
//     return pathname.startsWith(path);
//   };

//   // Simple role check - Replace this with your actual auth logic
//   // const userRole = 'customer'; // Change to 'vendor' to test vendor menu
//   const userRole = 'vendor'; // Uncomment to test vendor view

//   return (
//     <nav className="bg-black text-white fixed top-0 left-0 right-0 z-[100] px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-lg">
//       <div className="container mx-auto border py-1 sm:py-1 md:py-1 px-3 sm:px-4 rounded-4xl border-gray-700 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex items-center flex-shrink-0">
//           <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
//             <Image
//               src="/images/logo.png"
//               alt="Logo"
//               fill
//               className="object-contain"
//               priority
//             />
//           </div>
//         </Link>

//         {/* Desktop Navigation & Icons - Hidden on mobile */}
//         <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
//           {/* Desktop Navigation Links - Only show for customers */}
//           {userRole === 'customer' && (
//             <div className="flex items-center space-x-6 mr-4">
//               <Link
//                 href="/vendors"
//                 className={`${
//                   isActive('/vendors')
//                     ? 'text-purple-500 font-medium'
//                     : 'text-gray-400 hover:text-white'
//                 } transition-colors text-sm xl:text-base`}
//               >
//                 vendors
//               </Link>
//               <Link
//                 href="/showroom"
//                 className={`${
//                   isActive('/showroom')
//                     ? 'text-purple-500 font-medium'
//                     : 'text-gray-400 hover:text-white'
//                 } transition-colors text-sm xl:text-base`}
//               >
//                 showroom
//               </Link>
//             </div>
//           )}

//           {/* Desktop Icon Buttons - Customer only icons */}
//           {userRole === 'customer' && (
//             <>
//               <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//                 <Heart className="w-5 h-5 text-gray-400" />
//               </button>

//               <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
//                 <ShoppingCart className="w-5 h-5 text-gray-400" />
//                 <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   2
//                 </span>
//               </button>
//             </>
//           )}

//           {/* Common icons for both customer and vendor */}
//           <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//             <MessageSquare className="w-5 h-5 text-gray-400" />
//           </button>

//           <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//             <User className="w-5 h-5 text-gray-400" />
//           </button>

//           <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//             <Bell className="w-5 h-5 text-gray-400" />
//           </button>

//           <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 xl:px-6 py-2 rounded-3xl font-medium transition-colors text-sm xl:text-base">
//             Dashboard
//           </button>
//         </div>

//         {/* Mobile Icons - Visible on mobile/tablet */}
//         <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
//           {/* Cart Icon - Only show for customers */}
//           {userRole === 'customer' && (
//             <button className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
//               <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-purple-600 text-white text-[10px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
//                 2
//               </span>
//             </button>
//           )}

//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
//           >
//             {isMenuOpen ? (
//               <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
//             ) : (
//               <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu - Slides down when open */}
//       <div
//         className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
//           isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//         }`}
//       >
//         <div className="container mx-auto pt-3 sm:pt-4 pb-2 space-y-2 sm:space-y-3 border-t border-gray-800 mt-3 sm:mt-4 px-3 sm:px-4">
//           {/* Mobile Navigation Links - Only show for customers */}
//           {userRole === 'customer' && (
//             <>
//               <Link
//                 href="/vendors"
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`block ${
//                   isActive('/vendors')
//                     ? 'text-purple-500 font-medium'
//                     : 'text-gray-400 hover:text-white'
//                 } transition-colors py-2 text-sm sm:text-base`}
//               >
//                 vendors
//               </Link>
//               <Link
//                 href="/showroom"
//                 onClick={() => setIsMenuOpen(false)}
//                 className={`block ${
//                   isActive('/showroom')
//                     ? 'text-purple-500 font-medium'
//                     : 'text-gray-400 hover:text-white'
//                 } transition-colors py-2 text-sm sm:text-base`}
//               >
//                 showroom
//               </Link>
//             </>
//           )}

//           {/* Mobile Icon Buttons */}
//           <div className="flex items-center space-x-2 sm:space-x-3 pt-2 sm:pt-3 pb-2">
//             {/* Heart icon - Only for customers */}
//             {userRole === 'customer' && (
//               <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//                 <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               </button>
//             )}

//             {/* Common icons for both */}
//             <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//               <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//             </button>

//             <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//               <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//             </button>

//             <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//               <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//             </button>

//             {/* Search icon - Only for customers */}
//             {userRole === 'customer' && (
//               <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
//                 <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
//               </button>
//             )}
//           </div>

//           {/* Mobile Dashboard Button */}
//           <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-medium transition-colors text-sm sm:text-base">
//             Dashboard
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }



"use client";

import { useState } from 'react';
import { Heart, ShoppingCart, MessageSquare, Bell, User, Search, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Function to determine if link is active
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Auth logic - Replace with your actual authentication
  const isLoggedIn = true; // Set to false to see login button
  const userRole = 'customer'; // Can be 'customer' or 'vendor'

  return (
    <nav className="bg-black text-white fixed top-0 left-0 right-0 z-[100] px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-lg">
      <div className="container mx-auto border py-1 sm:py-1 md:py-1 px-3 sm:px-4 rounded-4xl border-gray-700 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation & Icons - Hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {/* Desktop Navigation Links - Only show for logged in customers */}
          {isLoggedIn && userRole === 'customer' && (
            <div className="flex items-center space-x-6 mr-4">
              <Link
                href="/vendors"
                className={`${
                  isActive('/vendors')
                    ? 'text-purple-500 font-medium'
                    : 'text-gray-400 hover:text-white'
                } transition-colors text-sm xl:text-base`}
              >
                vendors
              </Link>
              <Link
                href="/showroom"
                className={`${
                  isActive('/showroom')
                    ? 'text-purple-500 font-medium'
                    : 'text-gray-400 hover:text-white'
                } transition-colors text-sm xl:text-base`}
              >
                showroom
              </Link>
            </div>
          )}

          {/* Show icons only when logged in */}
          {isLoggedIn ? (
            <>
              {/* Desktop Icon Buttons - Customer only icons */}
              {userRole === 'customer' && (
                <>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                   
                   <Link href="/shopping-cart">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
                    <ShoppingCart className="w-5 h-5 text-gray-400" />
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      2
                    </span>
                  </button>
                  </Link>
                </>
              )}

              {/* Common icons for both customer and vendor */}
              <Link href="/messaging">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </button>
              </Link>
              <Link href="/profile">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <User className="w-5 h-5 text-gray-400" />
              </button>
              </Link>

              <Link href="/notification">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              </Link>

              <Link href="/customer-dashboard">
              <button className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-5 xl:px-6 py-2 rounded-3xl font-medium transition-colors text-sm xl:text-base">
                Dashboard
              </button>
              </Link>
            </>
          ) : (
            /* Show Login button when not logged in */
            <Link href="/auth/login">
            <button 
          
            className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-6 xl:px-8 py-2 rounded-3xl font-medium transition-colors text-sm xl:text-base">
              Login
            </button>
            </Link>
          )}
        </div>

        {/* Mobile Icons - Visible on mobile/tablet */}
        <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
          {/* Cart Icon - Only show for logged in customers */}
          {isLoggedIn && userRole === 'customer' && (
            <button className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-purple-600 text-white text-[10px] rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                2
              </span>
            </button>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
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
        <div className="container mx-auto pt-3 sm:pt-4 pb-2 space-y-2 sm:space-y-3 border-t border-gray-800 mt-3 sm:mt-4 px-3 sm:px-4">
          {/* Mobile Navigation Links - Only show for logged in customers */}
          {isLoggedIn && userRole === 'customer' && (
            <>
              <Link
                href="/vendors"
                onClick={() => setIsMenuOpen(false)}
                className={`block ${
                  isActive('/vendors')
                    ? 'text-purple-500 font-medium'
                    : 'text-gray-400 hover:text-white'
                } transition-colors py-2 text-sm sm:text-base`}
              >
                vendors
              </Link>
              <Link
                href="/showroom"
                onClick={() => setIsMenuOpen(false)}
                className={`block ${
                  isActive('/showroom')
                    ? 'text-purple-500 font-medium'
                    : 'text-gray-400 hover:text-white'
                } transition-colors py-2 text-sm sm:text-base`}
              >
                showroom
              </Link>
            </>
          )}

          {/* Mobile content based on login status */}
          {isLoggedIn ? (
            <>
              {/* Mobile Icon Buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3 pt-2 sm:pt-3 pb-2">
                {/* Heart icon - Only for customers */}
                {userRole === 'customer' && (
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                )}

                {/* Common icons for both */}
                <Link href="/messaging">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
                </Link>

                <Link href="/profile">

                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
                </Link>

                <Link href="/notification">

                <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
                </Link>

                {/* Search icon - Only for customers */}
                {userRole === 'customer' && (
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Mobile Dashboard Button */}
              <Link href="/customer-dashboard">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-medium transition-colors text-sm sm:text-base">
                Dashboard
              </button>
              </Link>
            </>
          ) : (
            /* Mobile Login Button */
            <Link href="/auth/login">
            <button 
         
            className="w-full  bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-medium transition-colors text-sm sm:text-base">
              Login
            </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}