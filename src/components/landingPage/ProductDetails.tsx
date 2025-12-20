'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, MessageCircle, Ruler, Star, Info, Minus, Plus } from 'lucide-react';
import BackButton from '@/customComponent/BackButton';
import { CustomButton } from '@/customComponent/CustomButton';

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  
  const product = {
    name: "Jacket",
    price: 28.00,
    originalPrice: 32.00,
    rating: 4.5,
    reviews: 20,
    seller: "William Alex",
    inStock: false,
    image: "/images/jacket.png",
    description: "This design supports custom mix-mixing! You can combine elements from different products to create your unique style.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    weight: "100 gram"
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white mt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <BackButton />
        <div className="flex items-center space-x-2 mb-6">
          <Info className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-medium">View Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg p-8">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full rounded-lg"
              />
              <button className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Mix Design
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {/* <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button> */}
                <CustomButton variant="glow" fullWidth="true" icon={Heart} iconPosition="left">
                Add to Wishlist
              </CustomButton>
              <button className="w-full border border-purple-600 hover:bg-purple-900/30 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Add to Event
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-600 text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-purple-400">({product.reviews} Reviews)</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">{product.seller.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.seller}</p>
                  <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur. Lacus at venenatis gravida vivamus.</p>
                </div>
              </div>
            </div>

            {/* Price & Stock Status */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
                <span className="text-3xl font-bold text-purple-400">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-400">Out of Stock</span>
              </div>
            </div>

            {/* Mix Design Available */}
            <div className="bg-purple-900/20 border border-[#6100FF] rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-purple-300">Mix Design Available</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">This product supports custom mix-design. You can combine elements from different products to create your unique style.</p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                Start Mix Design
              </button>
            </div>

            {/* Description */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-400">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                      selectedSize === size 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium transition-all"
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
              </div>
            </button>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-800/50 border border-gray-700 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button className="bg-gray-800/50 border border-gray-700 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Ruler className="w-4 h-4" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Custom Design Feature */}
            <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-purple-300">Custom Design Feature</h3>
              <p className="text-sm text-gray-300 mb-4">This design supports custom mix-mixing! You can combine elements from different products to create your unique style.</p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                Custom Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}