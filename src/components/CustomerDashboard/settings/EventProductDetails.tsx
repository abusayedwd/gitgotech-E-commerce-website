"use client"

import { useState } from 'react';
import { Eye, MessageCircle, Ruler, Calendar, ArrowLeft } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function EventProductDetails() {
  const [activeTab, setActiveTab] = useState('description');
  const router = useRouter()
  const product = {
    name: "Jacket",
    price: 28.00,
    originalPrice: 32.00,
    discount: "50% Off",
    rating: 5,
    reviews: 20,
    image: "/api/placeholder/400/500",
    seller: {
      name: "William Alen",
      avatar: "/api/placeholder/48/48",
      description: "Lorem ipsum dolor sit amet consectetur. Libero et venenatis gravida vivamus mauris."
    },
    validUntil: "December 30, 2025",
    description: "The design supports custom styling! You can combine elements from different products to create your unique style."
  };

  return (
    <div className="min-h-screen mt-24 bg-gradient-to-r from-black via-[#130a36] to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">

            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">view details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden relative">
              <img 
                src={"/images/jacket.png"} 
                alt={product.name}
                className="w-full   object-cover"
              />
              <button className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                No Design
              </button>
            </div>

            {/* Add to Event Button */}
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
              Add to Event
            </button>
          </div>

          {/* Right Side - Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-4xl font-bold font-cormorant text-white">{product.name}</h2>
                <button className="bg-[#BDDABC33]  text-[#00AA33] px-4 py-2 rounded-lg text-sm font-medium   transition-colors">
                  In Stock
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{product.reviews} Reviews</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="  border border-[#6100FF] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <img 
                  src={"/images/person.png"} 
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{product.seller.name}</h3>
                  <p className="text-gray-400 text-sm">{product.seller.description}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="  rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#912DAD] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.discount}
                </span>
                <span className="text-gray-500 line-through text-lg">${product.originalPrice.toFixed(2)}</span>
              </div>
              
              <div className="text-4xl font-bold text-[#6100FF] mb-2">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="flex items-center gap-2 text-[#767676] text-sm">
                <Calendar size={16} />
                <span>Valid till December 30, 2025</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border border-[#6100FF] p-2 rounded-xl overflow-hidden">
          
            <h1 className='text-2xl ml-5 text-white font-medium font-cormorant'>Description</h1>
              
              <div className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
              onClick={() => router.push("/messaging")}
               className="flex items-center justify-center gap-2 bg-[#272238] cursor-pointer border border-[#3d3648] text-white py-4 rounded-xl hover:border-purple-500 transition-all duration-200">
                <MessageCircle size={20} />
                <span className="font-medium">Chat</span>
              </button>
              
              <button className="flex items-center justify-center gap-2 bg-[#272238] cursor-pointer border border-[#3d3648] text-white py-4 rounded-xl hover:border-purple-500 transition-all duration-200">
                <Ruler size={20} />
                <span className="font-medium">Size Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}