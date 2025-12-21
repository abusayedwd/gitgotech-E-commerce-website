'use client';

import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: string;
  reviews: number;
  rating: number;
  seller: string;
  image: string;
  stockStatus: string;
}

export default function MyProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Filter');

  const products: Product[] = [
    {
      id: '1',
      name: "Men's Bomber Jacket",
      price: '$28.00',
      reviews: 20,
      rating: 5,
      seller: 'PRINCE OF DARKZ',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
      stockStatus: 'Out of stock'
    },
    {
      id: '2',
      name: "Men's Bomber Jacket",
      price: '$28.00',
      reviews: 20,
      rating: 5,
      seller: 'PRINCE OF DARKZ',
      image: '',
      stockStatus: 'Out of stock'
    },
    {
      id: '3',
      name: "Men's Bomber Jacket",
      price: '$28.00',
      reviews: 20,
      rating: 5,
      seller: 'PRINCE OF DARKZ',
      image: '',
      stockStatus: 'Out of stock'
    },
    {
      id: '4',
      name: "Men's Bomber Jacket",
      price: '$28.00',
      reviews: 20,
      rating: 5,
      seller: 'PRINCE OF DARKZ',
      image: '',
      stockStatus: 'Edit Details'
    },
    {
      id: '5',
      name: "Men's Bomber Jacket",
      price: '$28.00',
      reviews: 20,
      rating: 5,
      seller: 'PRINCE OF DARKZ',
      image: '',
      stockStatus: 'Edit Details'
    },
    {
      id: '6',
      name: "Men's Bomber Jacket",
      price: '$28.00',
      reviews: 20,
      rating: 5,
      seller: 'PRINCE OF DARKZ',
      image: '',
      stockStatus: 'Edit Details'
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xs">★</span>
        ))}
      </div>
    );
  };

  const handleAddProduct = () => {
    console.log('Add new product');
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 rounded-2xl p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <button 
            onClick={handleAddProduct}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add Product
          </button>
        </div>
        
        {/* Filter and Search */}
        <div className="flex gap-4 mb-6">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-cyan-500/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-sm text-white backdrop-blur-sm"
          >
            <option>Filter</option>
            <option>All Products</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-cyan-500/50 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors text-sm text-white placeholder-gray-400 backdrop-blur-sm"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
          >
            {/* Product Image */}
            <div className="relative bg-gray-800 aspect-square flex items-center justify-center overflow-hidden">
              <img
                  src="/images/jacket.png"
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
 
              
              {/* Stock Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.stockStatus === 'Out of stock' 
                    ? 'bg-red-900/80 text-red-300 border border-red-500/50' 
                    : 'bg-blue-900/80 text-blue-300 border border-blue-500/50'
                }`}>
                  {product.stockStatus}
                </span>
              </div>
              
              {/* Out of Stock Overlay */}
              {product.stockStatus === 'Out of stock' && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <div className="text-white text-lg font-bold bg-red-600/90 px-6 py-2 rounded-lg">
                    Out of stock
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-lg font-bold text-white mb-1">{product.price}</div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-400">{product.reviews} Reviews</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-base font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span className="text-red-500">👤</span> {product.seller}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}