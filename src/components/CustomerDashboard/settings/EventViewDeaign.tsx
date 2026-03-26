"use client"

import React, { useState } from 'react';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGetProductByEventQuery } from '@/redux/features/event/eventSlice';
import { IMAGE_BASE_URL } from '@/lib/imageBaseUrl';

type Product = {
  _id: string;
  product: {
    _id: string;
    product_name: string;
    product_price: number;
    review_count?: number | null;
    review_rating?: number | null;
    product_images?: string[];
    vendor?: {
      name?: string;
    } | string;
  };
  event: string;
  isOrderd: boolean;
  createdAt: string;
  updatedAt: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const status = searchParams.get("status")
   const type = searchParams.get('type')
   console.log(type)
   console.log(status)
  


  const productData = product.product;
  const imageSrc = productData.product_images?.[0] 
    ? `${IMAGE_BASE_URL}/${productData.product_images[0]}` 
    : '/images/jacket.png';
  
  const vendorName = typeof productData.vendor === 'object' 
    ? productData.vendor?.name || 'Vendor' 
    : productData.vendor || 'Vendor';

  return (
    <div
    className=" text-white bg-[#1B1B1F] rounded-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
                <img
                  src={imageSrc}
                  alt={productData.product_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
        <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
          {product.isOrderd ? 'Ordered' : 'No Design'}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">${productData.product_price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < (productData.review_rating || 0) ? 'fill-yellow-400' : 'fill-gray-600'}`} viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="text-sm   ml-1">{productData.review_count || 0} Reviews</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold   mb-2">{productData.product_name}</h3>

        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-4 h-4 text-red-500" />
          <span className="text-[16px] text-[#B8B8B8]">{vendorName}</span>
        </div>

        {/* Action Buttons */}
        {status !== "invited" && (
          <div className="flex gap-3">
            <button onClick={() => router.push(`/profile/event/view-deaign/select-size?productId=${productData._id}&eventId=${product.event}`)} className="flex-1 border-2 border-purple-600 text-purple-600 py-2.5 rounded-lg font-medium transition-colors">
              View Size
            </button>

            <button  onClick={() => router.push("/checkout")} className="flex-1 w-full cursor-pointer bg-[#6100FF] text-white py-2.5 rounded-lg font-medium transition-colors">
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EventViewDeaign() {


 const searchParams = useSearchParams()
  const id = searchParams.get('id') 

  const {data: eventProduct, isLoading, error} = useGetProductByEventQuery(id)
  console.log(eventProduct)

  const router = useRouter()

  const products: Product[] = eventProduct?.data || [];

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black  text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="container mx-auto flex items-center gap-4">

             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant hidden md:block">View Design</h1>
        </div>
          <Link href={"/profile/event/add-design"}>
          <button className="flex items-center w-45 py-2 cursor-pointer px-4 gap-2 bg-gradient-to-l from-blue-600 to-cyan-600 text-white px-2  rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Add Design
          </button>
          </Link>

        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-purple-400 text-xl">Loading products...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-400 text-xl">Failed to load products</div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-gray-400">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl">No products in this event yet</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}