"use client"
import React from 'react';
import { Star, User, Shield, MessageCircle } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const OrderDetails = () => {
    const router = useRouter()
  const product = {
    name: "Jacket",
    price: 28.00,
    originalPrice: 32.00,
    discount: "10% OFF",
    size: "M",
    quantity: 1,
    rating: 4.5,
    reviews: 20,
    image: "/images/jacket.png",
    description: "Lorem ipsum dolor sit amet consectetur. Lacus et venenatis gravida vivamus mauris."
  };

  const reviews = [
    { id: 1, name: "William Alex", avatar: "https://placehold.co/40x40/6C757D/FFFFFF?text=WA", comment: "Lorem ipsum dolor sit amet consectetur. Lacus et venenatis gravida vivamus mauris." },
    { id: 2, name: "Sarah Johnson", avatar: "https://placehold.co/40x40/6C757D/FFFFFF?text=SJ", comment: "Excellent quality and fit! Very happy with my purchase." },
    { id: 3, name: "Mike Chen", avatar: "https://placehold.co/40x40/6C757D/FFFFFF?text=MC", comment: "Great jacket for the price. Shipping was fast too!" }
  ];

  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star 
      key={i} 
      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
    />
  ));

  return (
    <div className="min-h-screen mt-20 container mx-auto bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
       <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">
            View Details</h1>
        </div>
        
      
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full object-contain rounded-lg shadow-lg"
          />
          <button className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
            Mix Design
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className='flex justify-between'>
            <div><h2 className="text-3xl font-bold">{product.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center space-x-1">
                {stars}
              </div>
              <span className="ml-2 text-sm text-gray-400">{product.reviews} Reviews</span>
            </div>
            </div>
            <div>
                  <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
        
            <div className="bg-[#6100FF] px-4 py-2 rounded-lg text-sm font-medium">Return</div>
            <div className="bg-[#0070254D] text-[#00DD00] px-4 py-1 rounded-lg text-sm font-medium">Completed</div>
          </div>
          
          {/* <button className="bg-purple-600 rounded-full p-2">
            <MessageCircle className="w-6 h-6" />
          </button> */}
        </div>
            </div>
            
            
            {/* Reviewer Avatars */}
            
          </div>

          {/* Reviews Section */}
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-500">
            <div className="flex items-start space-x-3">
              <img 
                src={reviews[0].avatar} 
                alt={reviews[0].name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{reviews[0].name}</h3>
                <p className="text-sm text-gray-400 mt-1">{reviews[0].comment}</p>
              </div>
            </div>
          </div>

          {/* Price & Discount */}
          <div className="space-y-3">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-full w-fit text-sm font-medium">
              {product.discount}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl line-through text-gray-400">${product.originalPrice}</span>
              <span className="text-2xl font-bold text-purple-400">${product.price}</span>
            </div>
            <div className="text-sm text-gray-400">
              Size: {product.size}
            </div>
            <div className="text-sm text-gray-400">
              Qty: {product.quantity}
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-900 rounded-lg p-4 border border-purple-500">
            <div className="text-center text-lg font-medium">
              Total Price: ${product.price * product.quantity}
            </div>
          </div>

          {/* Buy Again Button */}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
            Buy Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
