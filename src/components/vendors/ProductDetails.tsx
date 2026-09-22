'use client';

import React, { useState } from 'react';
import { ArrowLeft, Trash2, Pencil, Shuffle, Palette, Loader2, Weight, Calendar, Tag, Lock, TrendingUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectShowroomId } from '@/redux/features/vendor/showroomSlice/selectedShowroomSlice';
import { useGetProductDetailsQuery, useDeleteProductMutation } from '@/redux/features/vendor/product/productSlice';
import toast from 'react-hot-toast';
import baseUrl from '@/redux/api/baseUrl';
import DeleteModal from '@/components/shared/DeleteModal';

export default function ProductDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const showroomId = useSelector(selectShowroomId);

  const { data: productDetailsData, isLoading } = useGetProductDetailsQuery(
    { id: productId, showroomId },
    { skip: !productId || !showroomId }
  );
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const product = productDetailsData?.data;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteProduct({ id: productId, showroomId }).unwrap();
      toast.success(res?.message || 'Product deleted successfully');
      setShowDeleteModal(false);
      router.push('/vendor-dashboard/products');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1040] to-[#0d0d2b] light:from-white light:via-purple-50 light:to-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-purple-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1040] to-[#0d0d2b] light:from-white light:via-purple-50 light:to-white flex items-center justify-center text-gray-400 light:text-gray-500">
        Product not found.
      </div>
    );
  }

  const images = product.product_images || [];
  const stocks = product.product_stocks || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 light:from-white light:via-purple-50 light:to-white border-purple-600/30 shadow-[0_0_12px_rgba(34,211,238,0.35)] text-white light:text-gray-900 font-sans relative overflow-hidden">

      {/* Background orbs */}
      <div className="fixed top-[-120px] right-[-80px] w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-60px] w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-7 py-4 border-b border-white/5 relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white/8 light:bg-gray-100 border border-white/10 light:border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/12 light:hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-500/20 transition-colors light:bg-red-50 light:text-red-700 light:border-red-300"
          >
            <Trash2 size={13} />
            Delete
          </button>
          <button
            onClick={() => router.push(`/vendor-dashboard/products/edit-product?id=${productId}`)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg px-5 py-2 text-sm font-semibold shadow-lg shadow-purple-700/40 hover:from-purple-500 hover:to-purple-600 transition-all"
          >
            <Pencil size={13} />
            Edit
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-wrap gap-10 px-7 py-8 max-w-5xl mx-auto relative z-10">

        {/* Left: Images */}
        <div className="flex flex-col gap-3 w-48 flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 light:border-gray-200 bg-white/4 light:bg-gray-100 w-48 h-52">
            {product.isMixable && (
              <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                <Shuffle size={9} />
                Mix Design
              </span>
            )}
            {images.length > 0 ? (
              <img
                src={`${baseUrl}/${images[selectedImage]}`}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 light:text-gray-400">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29]/50 to-transparent pointer-events-none" />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-purple-500 shadow-md shadow-purple-500/40'
                      : 'border-white/10 light:border-gray-300 hover:border-white/30 light:hover:border-gray-400'
                  }`}
                >
                  <img src={`${baseUrl}/${src}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-72 relative">
          {/* Name */}
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-purple-300 light:from-gray-900 light:via-gray-900 light:to-purple-600 bg-clip-text text-transparent">
            {product.product_name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mt-2 mb-5">
            <span className="text-2xl font-bold text-purple-400">
              ₵{product.product_price?.toFixed(2)}
            </span>
            {product.discount?.isValid && (
              <span className="text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full light:bg-green-100 light:text-green-700">
                {product.discount.percentage}% OFF
              </span>
            )}
          </div>

          {/* Category, Sales, Privacy */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {product.product_category && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-gray-400 light:text-gray-500" />
                <span className="text-sm text-gray-400 light:text-gray-500">Category: <span className="text-white light:text-gray-900 capitalize">{product.product_category}</span></span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-gray-400 light:text-gray-500" />
              <span className="text-sm text-gray-400 light:text-gray-500">Sold: <span className="text-white light:text-gray-900">{product.sale_count ?? 0}</span></span>
            </div>
            {product.isPrivate && (
              <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium px-2.5 py-1 rounded-full light:bg-amber-50 light:text-amber-700 light:border-amber-300">
                <Lock size={11} />
                Private{product.privateReason ? `: ${product.privateReason}` : ''}
              </span>
            )}
          </div>

          {/* Description card */}
          <div className="bg-white/4 light:bg-purple-50/40 border border-purple-500/20 light:border-purple-200 rounded-2xl p-5 mb-4 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-purple-200 light:text-purple-700 mb-2">Description</h3>
            <p className="text-sm text-gray-400 light:text-gray-500 leading-relaxed">{product.product_description}</p>
          </div>

          {/* Weight & Created Date */}
          <div className="flex flex-wrap gap-4 mb-4">
            {product.product_weight && (
              <div className="flex items-center gap-2 text-sm text-gray-400 light:text-gray-500">
                <Weight size={14} />
                <span>Weight: <span className="text-white light:text-gray-900">{product.product_weight.amount} {product.product_weight.unit}</span></span>
              </div>
            )}
            {product.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-400 light:text-gray-500">
                <Calendar size={14} />
                <span>Added: <span className="text-white light:text-gray-900">{new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></span>
              </div>
            )}
          </div>

          {/* Discount Details */}
          {product.discount?.isValid && (
            <div className="bg-green-500/5 light:bg-green-50 border border-green-500/20 light:border-green-300 rounded-2xl p-4 mb-4 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-green-300 light:text-green-700 mb-2">Discount Active</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 light:text-gray-600">
                <span>Percentage: <span className="text-green-400 light:text-green-700 font-semibold">{product.discount.percentage}%</span></span>
                {product.discount.startDate && (
                  <span>From: <span className="text-white light:text-gray-900">{new Date(product.discount.startDate).toLocaleDateString()}</span></span>
                )}
                {product.discount.endDate && (
                  <span>To: <span className="text-white light:text-gray-900">{new Date(product.discount.endDate).toLocaleDateString()}</span></span>
                )}
              </div>
            </div>
          )}

          {/* Mix Design tag */}
          {product.isMixable && (
            <div className="flex items-center gap-2 mb-4">
              <Shuffle size={15} className="text-purple-400 light:text-purple-600" />
              <span className="text-sm font-semibold text-purple-400 light:text-purple-700">Mix Design Available</span>
            </div>
          )}

          {/* Sizes & Stock card — informational only, no quantity/purchase for vendors */}
          {stocks.length > 0 && (
            <div className="bg-white/4 light:bg-purple-50/40 border border-purple-500/20 light:border-purple-200 rounded-2xl p-5 mb-4 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-purple-200 light:text-purple-700 mb-3">Sizes & Stock</h3>
              <div className="flex flex-wrap gap-2">
                {stocks.map((s: any) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedSize === s.size
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-500 shadow-md shadow-purple-600/40'
                        : 'bg-white/5 light:bg-gray-100 border border-white/10 light:border-gray-300 text-gray-300 light:text-gray-700 hover:border-white/25 light:hover:border-gray-400'
                    }`}
                  >
                    {s.size} ({s.stock} in stock)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Design tag */}
          {product.isCustom && (
            <div className="flex items-center gap-2 mb-5">
              <Palette size={14} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Custom Design Feature Available</span>
            </div>
          )}

          {/* Add to cart */}
          {/* <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-700/40 hover:from-purple-500 hover:to-indigo-500 transition-all hover:scale-[1.01] active:scale-[0.99]">
            <ShoppingCart size={16} />
            Add to Cart
          </button> */}
        </div>
      </main>

      <DeleteModal
        show={showDeleteModal}
        title="Delete Product"
        itemName={product.product_name}
        deleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
