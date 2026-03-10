import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, Pencil, Star, ShoppingCart, Shuffle, Palette } from 'lucide-react';

// ── Mock data — replace with your API data ─────────────────────────────────
const PRODUCT = {
  name: 'Jacket',
  price: 28.0,
  reviews: 20,
  rating: 4.5,
  isMixDesign: true,
  hasCustomDesign: true,
  description:
    "This design supports custom mixing! You can combine elements from different products to create your unique style.",
  images: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=400&h=400&fit=crop',
  ],
  sizes: ['XS(20)', 'S(20)', 'M(20)', 'L(20)', 'XL(20)', 'XXL(20)'],
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M(20)');
  const [quantity, setQuantity] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const inc = () => setQuantity(q => q + 1);
  const dec = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1040] to-[#0d0d2b] text-white font-sans relative overflow-hidden">

      {/* Background orbs */}
      <div className="fixed top-[-120px] right-[-80px] w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-60px] w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-7 py-4 border-b border-white/5 relative z-10">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/12 transition-colors"
        >
          <ArrowLeft size={15} />
          View Details
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg px-5 py-2 text-sm font-semibold shadow-lg shadow-purple-700/40 hover:from-purple-500 hover:to-purple-600 transition-all">
            <Pencil size={13} />
            Edit
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex flex-wrap gap-10 px-7 py-8 max-w-5xl mx-auto relative z-10">

        {/* ── Left: Images ── */}
        <div className="flex flex-col gap-3 w-48 flex-shrink-0">
          {/* Main image */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/4 w-48 h-52">
            {PRODUCT.isMixDesign && (
              <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                <Shuffle size={9} />
                Mix Design
              </span>
            )}
            <img
              src={PRODUCT.images[selectedImage]}
              alt={PRODUCT.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29]/50 to-transparent pointer-events-none" />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 flex-wrap">
            {PRODUCT.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === i
                    ? 'border-purple-500 shadow-md shadow-purple-500/40'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div className="flex-1 min-w-72 relative">

          {/* Seller avatar */}
          <img
            src={PRODUCT.avatar}
            alt="seller"
            className="absolute top-0 right-0 w-11 h-11 rounded-full border-2 border-purple-500 shadow-lg shadow-purple-500/40 object-cover"
          />

          {/* Name */}
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-purple-300 bg-clip-text text-transparent">
            {PRODUCT.name}
          </h1>

          {/* Price + Rating */}
          <div className="flex items-center gap-4 mt-2 mb-5">
            <span className="text-2xl font-bold text-purple-400">
              ${PRODUCT.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={13}
                  fill={s <= Math.floor(PRODUCT.rating) ? '#f59e0b' : 'none'}
                  color={s <= Math.floor(PRODUCT.rating) ? '#f59e0b' : '#6b7280'}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">({PRODUCT.reviews})</span>
            </div>
          </div>

          {/* Description card */}
          <div className="bg-white/4 border border-purple-500/20 rounded-2xl p-5 mb-4 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-purple-200 mb-2">Description</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{PRODUCT.description}</p>
          </div>

          {/* Mix Design tag */}
          {PRODUCT.isMixDesign && (
            <div className="flex items-center gap-2 mb-4">
              <Shuffle size={15} className="text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">Mix Design Available</span>
            </div>
          )}

          {/* Size + Quantity card */}
          <div className="bg-white/4 border border-purple-500/20 rounded-2xl p-5 mb-4 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-purple-200 mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-2 mb-5">
              {PRODUCT.sizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedSize === sz
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-500 shadow-md shadow-purple-600/40'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:border-white/25'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-purple-200 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={dec}
                className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="text-lg font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={inc}
                className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* Custom Design tag */}
          {PRODUCT.hasCustomDesign && (
            <div className="flex items-center gap-2 mb-5">
              <Palette size={14} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Custom Design Feature Available</span>
            </div>
          )}

          {/* Add to cart */}
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-700/40 hover:from-purple-500 hover:to-indigo-500 transition-all hover:scale-[1.01] active:scale-[0.99]">
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </main>

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-gradient-to-br from-[#1e1b4b] to-[#1a1040] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/7 border border-white/10 text-sm font-semibold hover:bg-white/12 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-sm font-semibold shadow-lg shadow-red-600/40 hover:from-red-400 hover:to-red-500 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}