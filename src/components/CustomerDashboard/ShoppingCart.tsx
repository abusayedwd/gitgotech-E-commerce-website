"use client";

import { SectionHeader } from '@/customComponent/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useGetWishlistAndCartQuery, useAddToCartWishListMutation, useDeleteSaveListMutation } from '@/redux/features/home/homeSlice';
import { IMAGE_BASE_URL } from '@/lib/imageBaseUrl';
import toast from 'react-hot-toast';

export default function ShoppingCart() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data: cartData, isLoading, refetch } = useGetWishlistAndCartQuery({
        type: "cart",
        page: page,
    });

    console.log(cartData)

    const [addToCartWishList] = useAddToCartWishListMutation();
    const [deleteSaveItem] = useDeleteSaveListMutation();

    const cartItems = cartData?.data || [];
    const pagination = cartData?.pagination || {};

    const handleRemoveFromCart = async (id: string) => {
      console.log(id)
        try {
            const res = await deleteSaveItem(id).unwrap();
            console.log(res)
            if (res?.success) {
                toast.success('Removed from cart');
                refetch();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to remove item');
            console.log(error.data)
        }
    };

    const handleUpdateQuantity = async (item: any, newQuantity: number) => {
        // TODO: Add API call to update quantity if supported
        // For now, just refetch
        refetch();
    };

    const getProductImage = (product: any) => {
        if (product.product_images && product.product_images.length > 0) {
            return `${IMAGE_BASE_URL}/${product.product_images[0]}`;
        }
        return '/images/jacket.png';
    };

    const getTotalStock = (stocks: any[]) => {
        if (!stocks || stocks.length === 0) return 0;
        return stocks.reduce((acc, stock) => acc + stock.stock, 0);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product.product_price || 0);
        }, 0).toFixed(2);
    };

  return (
    <div className="mt-16 md:mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant hidden md:block">My Cart</h1>
        </div>

      {/* Header */}
      <div className=" mb-6 md:mb-8 text-center">
        <h1 className="flex items-center justify-center text-3xl md:text-4xl font-bold mb-3">
                 <SectionHeader title='My Shopping Cart'></SectionHeader>
               </h1>
        <p className="text-gray-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
          Review your selected items before completing your order. You can update quantities, remove products, or continue shopping to add more. When you're ready, proceed to checkout for secure payment and delivery.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-purple-900/10 to-gray-900/50 border-[#B8B8B8] border  rounded-2xl p-4 md:p-6">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-4 border-b text-sm text-gray-400">
              <div className="col-span-5">PRODUCT</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-3 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">SUBTOTAL</div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item: any) => {
                  const product = item.product;
                  const imageUrl = getProductImage(product);
                  const totalStock = getTotalStock(product.product_stocks);
                  const isInStock = totalStock > 0;

                  return (
                    <div
                      key={item._id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-purple-900/10 p-4 border-[#B8B8B8] border-b rounded-lg"
                    >
                      {/* Product */}
                      <div className="md:col-span-5 flex items-center gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm md:text-base">{product.product_name}</h3>
                          <p className="text-xs text-gray-400 md:hidden mt-1">${product.product_price?.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 hidden md:block">{product.product_category}</p>
                          {!isInStock && (
                            <p className="text-xs text-red-400 mt-1">Out of Stock</p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 text-left md:text-center">
                        <span className="text-sm md:text-base hidden md:inline">${product.product_price?.toFixed(2)}</span>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-3 flex justify-start md:justify-center">
                        <div className="flex items-center gap-3 bg-[#2E2E34] rounded-3xl px-3 py-2">
                          <button
                            disabled={!isInStock}
                            className="w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold min-w-[20px] text-center">1</span>
                          <button
                            disabled={!isInStock}
                            className="w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal & Remove */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                        <span className="font-semibold text-sm md:text-base">${product.product_price?.toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveFromCart(product._id)}
                          className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                !isLoading && (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-400 text-sm mb-4">Start adding products to your cart!</p>
                    <button
                      onClick={() => router.push('/')}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Cart Total */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Cart Total</h2>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total:</span>
                <span className="text-2xl font-bold">${calculateTotal()}</span>
              </div>
            </div>

           <Link href="/checkout">
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700   rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              Proceed to Checkout
            </button>
          </Link>
          
          </div>
        </div>
      </div>
    </div>
  );
}