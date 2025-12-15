'use client';

import { useState } from 'react';

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
    <div className="min-h-screen mt-20 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v6a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-medium">View Details</span>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full rounded-lg shadow-2xl"
              />
              <button className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors">
                Mix Design
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Add to Wishlist
              </button>
              <button className="w-full border border-purple-500 hover:bg-purple-900 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Add to Event
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-400'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.917c1.927-2.746 5.174-2.746 7.098 0l2.568 3.67c1.222 1.752 1.222 4.148 0 5.902l-2.568 3.67c-1.927 2.746-5.174 2.746-7.098 0l-2.568-3.67c-1.222-1.752-1.222-4.148 0-5.902l2.568-3.67z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">{product.seller.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{product.seller}</p>
                  <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur. Lacus at venenatis gravida vivamus maxim.</p>
                </div>
              </div>
            </div>

            {/* Price & Stock Status */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl line-through text-gray-400">${product.originalPrice.toFixed(2)}</span>
                  <span className="text-3xl font-bold text-blue-400">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-400">Out of stock</span>
                </div>
              </div>
            </div>

            {/* Mix Design Available */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 001 1h1a1 1 0 100-2H9a1 1 0 00-1 1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-medium">Mix Design Available</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">This product supports custom mix-design. You can combine elements from different products to create your unique style.</p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors">
                Start Mix Design
              </button>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-400">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1h-6a1 1 0 00-1 1v6z" />
                </svg>
                <span>Add to Cart - ${((product.price * quantity).toFixed(2))}</span>
              </div>
            </button>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                  <path d="M6 10a4 4 0 018 0v.5a3 3 0 015.356 2.678C16.668 15.776 14.708 17 12.5 17h-1a2 2 0 002-2V9.5a4 4 0 00-4-4z" />
                </svg>
                <span>Chat</span>
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-1 1v3a1 1 0 001 1h1v6a4 4 0 108 0V8h1a1 1 0 001-1V4a1 1 0 00-1-1h-1V2a4 4 0 00-4-4zm2 4a2 2 0 10-4 0v6a2 2 0 104 0V6zm-2 10a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Size Guide</span>
              </button>
            </div>

            {/* Custom Design Feature */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-2">Custom Design Feature</h3>
              <p className="text-sm text-gray-400 mb-4">This design supports custom mix-mixing! You can combine elements from different products to create your unique style.</p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors">
                Custom Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
