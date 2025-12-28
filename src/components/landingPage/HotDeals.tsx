'use client';
import { SectionHeader } from '@/customComponent/Header';
import { Header } from 'antd/es/layout/layout';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HotDealsSection() {
 
    const router = useRouter();

  const products = [
    {
      id: 1,
      name: "Men's Bomber Jacket",
      price: 28.00,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER"
    },
    {
      id: 2,
      name: "Men's Bomber Jacket",
      price: 28.00,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER"
    },
    {
      id: 3,
      name: "Men's Bomber Jacket",
      price: 28.00,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER"
    },
    {
      id: 4,
      name: "Men's Bomber Jacket",
      price: 28.00,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER"
    }
  ];

  return (
    <div className="bg-black py-4 sm:py-8 px-2 sm:px-4">
      <div 
      // onClick={() => router.push("/hotdeals")}
      className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <SectionHeader title='Hot Deals'></SectionHeader>
          <Link href="/hotdeals">
          <button className="flex items-center cursor-pointer text-purple-500 hover:text-purple-400 transition-colors text-xs sm:text-sm font-medium">
            View All
            <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1" />
          </button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <div
             onClick={() => router.push('/product/details')}
              key={product.id}
              className="bg-[#1B1B1F] rounded-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
             <div className="relative aspect-square overflow-hidden">
  <img
    src="/images/jacket.png"
    alt={product.name}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
  />

  {/* Discount Badge - Top Left */}
  <div className="absolute top-2 left-0 z-10">
    <div className="relative bg-purple-600 text-white px-4 py-2 font-bold text-sm uppercase tracking-wider whitespace-nowrap flex items-center">
      <span>10% off</span>
      {/* Right-pointing arrow/chevron */}
      <div className="ml-2 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-purple-600"></div>
    </div>
    {/* 3D Shadow Effect - Left Edge */}
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-700 rounded-l-md"></div>
  </div>

  {/* Best Seller Badge - Top Right */}
  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-blue-500 text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-semibold">
    {product.tag}
  </div>
</div>

              {/* Product Info */}
              <div className="p-3 sm:p-4">
                {/* Price */}
                <div className='flex items-center justify-between'>

                <div className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2">
                  ${product.price.toFixed(2)}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-1 sm:mb-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 sm:w-4 h-3 sm:h-4 ${
                        index < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-600 text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-[10px] sm:text-xs ml-1 sm:ml-2">
                    {product.reviews} Reviews
                  </span>
                </div>
                </div>

                {/* Product Name */}
                <h3 className="text-white font-medium text-sm sm:text-base mb-1 line-clamp-1">
                  {product.name}
                </h3>

                {/* Brand */}
                <p className="text-gray-400 text-xs sm:text-sm">
                  By {product.brand}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}