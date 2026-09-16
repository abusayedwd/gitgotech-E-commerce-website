'use client';
import { SectionHeader } from '@/customComponent/Header';
import { useGetHotDealsQuery } from '@/redux/features/home/homeSlice';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductImageSlider from '@/components/shared/ProductImageSlider';
import styles from './../../customComponent/Discount.module.css';
import { getActiveDiscountPercentage } from '@/lib/productDiscount';

export default function HotDealsSection() {

  const { data: hotDealsData, isLoading } = useGetHotDealsQuery({
    searchTerm: '',
    product_category: '',
  });

  const products = hotDealsData?.data?.data || [];

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <SectionHeader title="Hot Deals" />
          <Link href="/hotdeals">
            <button className="flex items-center cursor-pointer text-purple-500 hover:text-purple-400 transition-colors text-xs sm:text-sm font-medium">
              View All
              <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1" />
            </button>
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400">Loading hot deals...</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product: any) => {
              const discount = getActiveDiscountPercentage(product.discount);

              return (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="bg-[#1B1B1F] rounded-lg overflow-hidden group hover:shadow-xl transition-shadow block"
                >
                  <ProductImageSlider
                    images={product.product_images}
                    alt={product.product_name}
                  >
                    {discount > 0 && (
                      <div className="absolute top-2 left-0 inline-flex items-center z-10">
                        <div className={styles.card}>
                          <div className={styles.discountBadge}>{discount}% off</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#2388FF] text-white px-2 sm:px-3 py-1 md:py-2 rounded text-[10px] sm:text-xs font-semibold z-10">
                      HOT DEAL
                    </div>
                  </ProductImageSlider>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2">
                        ₵{product.product_price?.toFixed(2)}
                      </div>
                      <div className="flex items-center mb-1 sm:mb-2">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-3 sm:w-4 h-3 sm:h-4 ${
                              index < Math.floor(product.review_rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-600 text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-gray-400 text-[10px] sm:text-xs ml-1 sm:ml-2">
                          {product.review_count || 0} Reviews
                        </span>
                      </div>
                    </div>

                    <h3 className="text-white font-medium text-sm sm:text-base mb-1 line-clamp-1">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm capitalize">
                      {product.product_category}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400">No hot deals available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
