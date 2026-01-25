import React from 'react';
import { Star, User, Shield, MessageCircle } from 'lucide-react';

const OrderDetails = () => {
  const product = {
    name: "Jacket",
    price: 28.00,
    originalPrice: 32.00,
    discount: "10% OFF",
    size: "M",
    quantity: 1,
    rating: 4.5,
    reviews: 20,
    image: "https://placehold.co/400x500/9B6C3D/FFFFFF?text=Jacket",
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
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <button className="bg-purple-600 rounded-full p-2">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0L0 8l8 8 8-8z"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold">View Details</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">G</div>
            <div className="bg-purple-600 px-4 py-2 rounded-lg text-sm font-medium">Return</div>
            <div className="bg-green-600 px-4 py-2 rounded-lg text-sm font-medium">Completed</div>
          </div>
          
          <button className="bg-purple-600 rounded-full p-2">
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-auto object-contain rounded-lg shadow-lg"
          />
          <button className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
            Mix Design
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center space-x-1">
                {stars}
              </div>
              <span className="ml-2 text-sm text-gray-400">{product.reviews} Reviews</span>
            </div>
            
            {/* Reviewer Avatars */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">G</div>
            </div>
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
