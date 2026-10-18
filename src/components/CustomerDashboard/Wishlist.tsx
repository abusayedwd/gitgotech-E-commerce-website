
"use client";
import { useState } from 'react';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useDeleteSaveListMutation, useGetWishlistAndCartQuery, useAddToCartWishListMutation } from '@/redux/features/home/homeSlice';
import { IMAGE_BASE_URL } from '@/lib/imageBaseUrl';
import toast from 'react-hot-toast';

export default function WishlistPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data: wishlistData, isLoading, refetch } = useGetWishlistAndCartQuery({
        type: "wishlist",
        page: page,
    });

    const [deleteSaveItem] = useDeleteSaveListMutation();
    const [addToCartWishList] = useAddToCartWishListMutation();

    const wishlistItems = (wishlistData?.data || []).flatMap((group: any) =>
        (group?.products || []).map((p: any) => ({
            ...p,
            showroom: group?.showroom,
        })),
    );
    const pagination = wishlistData?.pagination || {};

    const removeFromWishlist = async (id: string) => {
      
        try {
            await deleteSaveItem(id).unwrap();

            toast.success('Removed from wishlist');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to remove item');
            // console.log(error.data)
        }
    };

    const handleAddToCart = async (item: any) => {
        try {
            const firstSize =
                item?.size?.[0]?.type ??
                item?.product?.product_stocks?.[0]?.size ??
                "M";
            const qty = item?.size?.[0]?.quantity ?? 1;
            const data = {
                product: item.product._id,
                saveType: "cart",
                size: [
                    {
                        type: firstSize,
                        quantity: qty,
                    },
                ],
            };
            await addToCartWishList(data).unwrap();
            toast.success('Added to cart!');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to add to cart');
        }
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

    return (
        <div className="min-h-screen mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black light:from-white light:via-purple-50 light:to-white text-white light:text-gray-900 p-4 md:p-8">
            {/* Back Button */}
            <div className="container mx-auto flex items-center gap-4">
                <button onClick={() => router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
                        <FaArrowLeft className='text-black' />
                    </div>
                </button>
                <h1 className="text-[32px] font-semibold text-gray-300 light:text-gray-700 font-cormorant hidden md:block">Wish list</h1>
            </div>

            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-cormorant font-semibold mb-3">My Wishlist</h1>
                <p className="text-gray-400 light:text-gray-500 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                    Save the products you love and revisit them anytime. Your wishlist helps you keep track of outfits, fabrics, and custom designs you may want to order later. Add them to your cart whenever you're ready.
                </p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="max-w-6xl mx-auto flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            )}

            {/* Wishlist Table */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 light:from-purple-50 light:to-white border border-gray-800 light:border-gray-200 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {/* Table Header - Desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800 light:border-gray-200">
                        <div className="col-span-5 text-sm font-medium text-gray-400 light:text-gray-500">PRODUCT</div>
                        <div className="col-span-2 text-sm font-medium text-gray-400 light:text-gray-500 text-center">PRICE</div>
                        <div className="col-span-3 text-sm font-medium text-gray-400 light:text-gray-500 text-center">STOCK STATUS</div>
                        <div className="col-span-2 text-sm font-medium text-gray-400 text-center"></div>
                    </div>

                    {/* Wishlist Items */}
                    <div className="divide-y divide-gray-800 light:divide-gray-200">
                        {wishlistItems.length > 0 ? (
                            wishlistItems.map((item: any) => {
                                const product = item.product;
                                const totalStock = getTotalStock(product.product_stocks);
                                const isInStock = totalStock > 0;
                                const imageUrl = getProductImage(product);

                                return (
                                    <div
                                        key={item._id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center hover:bg-purple-900/10 transition-colors"
                                    >
                                        {/* Product */}
                                        <div className="md:col-span-5 flex items-center gap-4">
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-800 light:bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.product_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base md:text-lg">{product.product_name}</h3>
                                                <p className="text-sm text-gray-400 light:text-gray-500 md:hidden mt-1">₵{product.product_price?.toFixed(2)}</p>
                                                <p className="text-xs text-gray-500 light:text-gray-400 hidden md:block">{product.product_category}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="md:col-span-2 hidden md:block text-center">
                                            <span className="text-base font-semibold light:text-gray-900">₵{product.product_price?.toFixed(2)}</span>
                                        </div>

                                        {/* Stock Status */}
                                        <div className="md:col-span-3 flex md:justify-center">
                                            {isInStock ? (
                                                <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium light:bg-purple-100 light:text-purple-700">
                                                    In Stock ({totalStock})
                                                </span>
                                            ) : (
                                                <span className="px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-medium light:bg-red-100 light:text-red-700">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={!isInStock}
                                                className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                                    isInStock
                                                        ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
                                                        : 'bg-gray-700 light:bg-gray-200 text-gray-400 light:text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => removeFromWishlist(item._id)}
                                                className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors flex-shrink-0"
                                                aria-label="Remove from wishlist"
                                            >
                                                <X className="w-5 h-5 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            !isLoading && (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <Heart className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                                    <p className="text-gray-400 light:text-gray-500 text-sm mb-4">Start adding products you love!</p>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {wishlistItems.length > 0 && pagination.totalPage > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            onClick={() => setPage(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/30 transition-colors light:bg-purple-100 light:text-purple-700"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-400 light:text-gray-500">
                            Page {pagination.currentPage} of {pagination.totalPage}
                        </span>
                        <button
                            onClick={() => setPage(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPage}
                            className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600/30 transition-colors light:bg-purple-100 light:text-purple-700"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}