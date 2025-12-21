// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Search } from 'lucide-react';

// const FashionSearchNav = () => {
//   const [activeTab, setActiveTab] = useState('Women');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isVisible, setIsVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       // Always show at top of page
//       if (currentScrollY < 10) {
//         setIsVisible(true);
//       }
//       // Hide when scrolling down past 100px
//       else if (currentScrollY > lastScrollY && currentScrollY > 100) {
//         setIsVisible(false);
//       }
//       // Show when scrolling up
//       else if (currentScrollY < lastScrollY) {
//         setIsVisible(true);
//       }

//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY]);

//   const tabs = [
//     { name: 'Women', color: 'bg-blue-500' },
//     { name: 'Men', color: 'bg-gray-700' },
//     { name: 'Shoes', color: 'bg-gray-700' },
//     { name: 'Kids', color: 'bg-gray-700' },
//     { name: 'Seasonal Wear', color: 'bg-gray-700' },
//     { name: 'Jewelry & Accessories', color: 'bg-gray-700' },
//     { name: 'Home & Living', color: 'bg-gray-700' },
//     { name: 'Beauty & Health', color: 'bg-gray-700' },
//     { name: 'Curve', color: 'bg-gray-700' }
//   ];

//   return (
//     <div
//       className={`fixed top-0 left-0 mt-20 right-0 z-50 w-full bg-black text-white transition-transform duration-300 ease-in-out shadow-lg ${
//         isVisible ? 'translate-y-0' : '-translate-y-full'
//       }`}
//     >
//       <div className="container mx-auto">
//         {/* Search Bar Section */}
//         <div className="flex items-center justify-center gap-4 px-6 py-6">
//           <div className="flex-1 max-w-4xl flex items-center gap-4">
//             {/* Search Input */}
//             <div className="flex-1 relative">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
//                 <Search size={20} />
//               </div>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Find your perfect tailor, design, or outfit."
//                 className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
//               />
//             </div>

//             {/* Search Button */}
//             <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
//               Search
//             </button>
//           </div> 
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex items-center gap-3 px-6 pb-4 overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => (
//             <button
//               key={tab.name}
//               onClick={() => setActiveTab(tab.name)}
//               className={`${
//                 activeTab === tab.name ? tab.color : 'bg-gray-800'
//               } px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:opacity-90 transition-all flex-shrink-0`}
//             >
//               {tab.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Demo Content for Testing Scroll */}
//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FashionSearchNav;



'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const FashionSearchNav = () => {
  const [activeTab, setActiveTab] = useState('Women');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down past 100px
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Check scroll position to show/hide arrows
  useEffect(() => {
    const checkScroll = () => {
      const container = tabContainerRef.current;
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const container = tabContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    const container = tabContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      const targetScroll = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const tabs = [
    { name: 'Women', color: 'bg-blue-500' },
    { name: 'Men',  },
    { name: 'Shoes', color: 'bg-gray-700' },
    { name: 'Kids', color: 'bg-gray-700' },
    { name: 'Seasonal Wear', color: 'bg-gray-700' },
    { name: 'Jewelry & Accessories', color: 'bg-gray-700' },
    { name: 'Home & Living', color: 'bg-gray-700' },
    { name: 'Beauty & Health', color: 'bg-gray-700' },
    { name: 'Curve', color: 'bg-gray-700' }
  ];

  return (
    <div
      className={`fixed top-0 left-0 mt-20 sm:mt-20 md:mt-24 right-0 z-50 w-full bg-gradient-to-r from-black via-[#0f0924] to-black bg-black text-white transition-transform duration-300 ease-in-out shadow-lg ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto">
        {/* Search Bar Section */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 px-3 sm:px-6 py-2 sm:py-6">
          <div className="flex-1 max-w-4xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} className="sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find your perfect tailor, design, or outfit."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Search Button */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-colors text-sm">
              Search
            </button>
          </div> 
        </div>

        {/* Tab Navigation */}
        <div className="relative">
          {/* Left Arrow Button - Mobile Only */}
          {showLeftArrow && (
            <button
              onClick={() => scrollTabs('left')}
              className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Right Arrow Button - Mobile Only */}
          {showRightArrow && (
            <button
              onClick={() => scrollTabs('right')}
              className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Fade indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none lg:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none lg:hidden" />
          
          <div 
            ref={tabContainerRef}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide"
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`${
                  activeTab === tab.name ? tab.color : 'border border-gray-700 bg-[#080715]'
                } px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap hover:opacity-90 transition-all flex-shrink-0`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FashionSearchNav;