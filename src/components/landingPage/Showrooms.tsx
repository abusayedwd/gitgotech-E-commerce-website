"use client";
import { Search, Store, Grid3x3 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaLocationDot } from 'react-icons/fa6';

export default function ShowroomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const showrooms = [
    {
      id: 1,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    },
    {
      id: 2,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    },
    {
      id: 3,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    },
    {
      id: 4,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    },
    {
      id: 5,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    },
    {
      id: 6,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    },
    {
      id: 7,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    },
    {
      id: 8,
      name: "Luxuries Showroom",
      branch: "Gulshan Branch",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&q=80",
      logo: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80"
    }
  ];

  return (
    <div className=" mt-20 md:mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-cormorant mb-3">
            Discover Our Showrooms
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-poppins max-w-3xl mx-auto mb-8">
            Explore our curated showrooms across the city. Each venue showcases the finest designs and craftsmanship, 
            giving you a world of luxurious choices all within arm's reach.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find your perfect tailor, design, or outfit"
                  className="w-full backdrop-blur-sm border border-gray-700 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500 text-sm"
                />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* All Showroom Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-cormorant text-xl md:text-2xl font-semibold">All Showroom</h2>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Grid3x3 className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Showrooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showrooms.map((showroom) => (
              <div
                key={showroom.id}
                className="bg-[#1B1B1F] backdrop-blur-sm h-[380px] rounded-xl overflow-hidden group hover:bg-gray-800/50 transition-all border border-gray-700/50"
              >
                {/* Showroom Image with Logo Overlay */}
                <div className="relative h-[210px] overflow-hidden">
                  <img
                    src={showroom.image}
                    alt={showroom.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  
                </div>

                {/* Showroom Info */}
                <div className="p-4 flex flex-col h-[170px]">
                  <h3 className="text-white font-semibold text-base mb-1">
                    {showroom.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">
                    • {showroom.branch}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    <FaLocationDot className="inline-block w-4 h-4 mr-1 mb-0.5 text-gray-400" />
                    1.2 km away
                  </p>

                  {/* View Showroom Button */}
                  <Link href={"/showroom/view-showroom"}>
                  <button className="w-full bg-[#6100FF] text-[16px] cursor-pointer text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2  mt-auto">
                   <AiOutlineShoppingCart className="w-3 sm:w-4 h-3 md:h-5 md:w-5 sm:h-4" />
                    View Showroom
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}