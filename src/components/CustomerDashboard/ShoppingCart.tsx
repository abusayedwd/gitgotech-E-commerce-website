"use client";

 
import { SectionHeader } from '@/customComponent/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
 
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

export default function ShoppingCart() {

    const router = useRouter();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Flowy Skirt',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=150&h=150&fit=crop',
      price: 14.00,
      quantity: 5
    },
    {
      id: 2,
      name: 'Brown Shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop',
      price: 14.00,
      quantity: 8
    },
    {
      id: 2,
      name: 'Brown Shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=150&fit=crop',
      price: 14.00,
      quantity: 8
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = (item: typeof cartItems[0]) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
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
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-4 border-b  text-sm text-gray-400">
              <div className="col-span-5">PRODUCT</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-3 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">SUBTOTAL</div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 ">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-purple-900/10 p-4 border-[#B8B8B8] border-b"
                >
                  {/* Product */}
                  <div className="md:col-span-5 flex items-center gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                      <p className="text-xs text-gray-400 md:hidden mt-1">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-left md:text-center">
                    <span className="text-sm md:text-base hidden md:inline">${item.price.toFixed(2)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-3 flex justify-start md:justify-center">
                    <div className="flex items-center gap-3 bg-[#2E2E34] rounded-3xl px-3 py-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                      >
                        
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm font-semibold min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                    <span className="font-semibold text-sm md:text-base">${calculateSubtotal(item)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
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