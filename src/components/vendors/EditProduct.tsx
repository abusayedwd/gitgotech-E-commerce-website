'use client';

import React, { useState } from 'react';
import { Upload, ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  
  // Pre-filled with existing product data
  const [productName, setProductName] = useState('Bomber Jacket');
  const [description, setDescription] = useState('Premium quality bomber jacket with comfortable fit and stylish design');
  const [price, setPrice] = useState('24.00');
  const [category, setCategory] = useState('clothing');
  const [quantity, setQuantity] = useState('45');
  const [weight, setWeight] = useState('500g');
  const [hasDiscount, setHasDiscount] = useState(true);
  const [discountPercent, setDiscountPercent] = useState('15');
  const [discountDate, setDiscountDate] = useState('2025-12-31');
  const [mixDesign, setMixDesign] = useState(true);
  const [customDesign, setCustomDesign] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [existingImages, setExistingImages] = useState<string[]>(['image1.jpg', 'image2.jpg']);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3X', '4X'];

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log('Files uploaded:', files);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    router.back();
  };

  const handleUpdate = () => {
    console.log('Update product', {
      productName,
      description,
      price,
      category,
      quantity,
      weight,
      hasDiscount,
      discountPercent,
      discountDate,
      selectedSizes,
      mixDesign,
      customDesign,
      existingImages
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product');
      router.push('/vendor-dashboard/products');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Edit Product</h1>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 border border-red-500 rounded-lg transition-colors"
          >
            Delete
          </button>
          <button 
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all shadow-lg shadow-purple-500/20"
          >
            Update
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gradient-to-tr from-[#040113] via-[#0b0329] to-[#050116] border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/40 rounded-2xl p-8">
        <h2 className="text-lg font-semibold mb-6">Information</h2>

        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Type here"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
          />
        </div>

        {/* Product Description */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type here"
            rows={4}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500 resize-none"
          />
        </div>

        {/* Price and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Type here"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
            >
              <option value="">Choose Category</option>
              <option value="clothing">Clothing</option>
              <option value="accessories">Accessories</option>
              <option value="footwear">Footwear</option>
            </select>
          </div>
        </div>

        {/* Quantity and Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Type here"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Weight</label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Type here"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Current Images</label>
            <div className="flex gap-4 flex-wrap">
              {existingImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">🧥</span>
                  </div>
                  <button
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Add More Images</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="mx-auto mb-3 text-gray-400" size={40} />
              <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
        </div>

        {/* Available Sizes */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Available Sizes</label>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedSizes.includes(size)
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-purple-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Value (Colors) */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Value</label>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-[#4A5D4A] border-2 border-gray-700 hover:border-purple-500 transition-colors flex items-center justify-center">
              <span className="text-xs font-bold text-white">G</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-purple-600 border-2 border-gray-700 hover:border-purple-500 transition-colors flex items-center justify-center">
              <span className="text-xs font-bold text-white">M</span>
            </button>
          </div>
        </div>

        {/* Product Discount */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <label className="block text-sm text-gray-400">Product Discount (optional)</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={(e) => setHasDiscount(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
            {hasDiscount && <span className="text-xs text-purple-400">This product has a discount</span>}
          </div>

          {hasDiscount && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Discount (%)</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="Enter discount percentage"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Discount expired date</label>
                <input
                  type="date"
                  value={discountDate}
                  onChange={(e) => setDiscountDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Different Options */}
        <div>
          <label className="block text-sm text-gray-400 mb-3">Different Options</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mixDesign}
                onChange={(e) => setMixDesign(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 relative"></div>
              <span className="text-sm text-gray-300">Mix Design Available</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customDesign}
                onChange={(e) => setCustomDesign(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 relative"></div>
              <span className="text-sm text-gray-300">Custom Design Available</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}