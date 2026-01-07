// "use client";

// import { useState } from 'react';
// import Link from 'next/link';
// import BackButton from '@/customComponent/BackButton';
// import { useRouter } from 'next/navigation';

// export default function CheckoutPage() {
//     const router = useRouter();
//   const [deliveryMethod, setDeliveryMethod] = useState('delivery');
//   const [paymentMethod, setPaymentMethod] = useState('credit-card');
//   const [formData, setFormData] = useState({
//     fullName: 'Dianne',
//     getLocation: '4440 Poin',
//     country: 'United States',
//     state: 'Washington DC',
//     zipCode: '20013',
//     email: 'dianne.russell@gmail.com',
//     phone: ''
//   });

//   const orderItems = [
//     { id: 1, name: 'Lemon body serv', variant: 'X2', price: 1100.00, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop' },
//     { id: 2, name: 'Jo Mker Pline', variant: 'X2', price: 1100.00, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=100&fit=crop' }
//   ];

//   const subtotal = 1900.00;
//   const deliveryCharge = 20.00;
//   const tax = 10.00;
//   const discount = 40.00;
//   const total = subtotal + deliveryCharge + tax - discount;

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="min-h-screen md:mt-20 mt-16 bg-black text-white p-4 md:p-8">
//       {/* Back Button */}
//       <div className="container mx-auto">
//        <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
//           <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </div>
//         </button>
//       </div>

//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-6 md:mb-8 text-center">
//         <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
//         <p className="text-gray-400 text-sm">One step away from your dream purchase.</p>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Forms */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Delivery Method */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <input
//                 type="radio"
//                 id="delivery"
//                 name="deliveryMethod"
//                 checked={deliveryMethod === 'delivery'}
//                 onChange={() => setDeliveryMethod('delivery')}
//                 className="w-4 h-4 text-purple-600"
//               />
//               <label htmlFor="delivery" className="text-sm font-medium">Delivery</label>
//             </div>
//             <div className="flex items-center gap-3">
//               <input
//                 type="radio"
//                 id="pickup"
//                 name="deliveryMethod"
//                 checked={deliveryMethod === 'pickup'}
//                 onChange={() => setDeliveryMethod('pickup')}
//                 className="w-4 h-4 text-purple-600"
//               />
//               <label htmlFor="pickup" className="text-sm font-medium">Pick up</label>
//             </div>
//           </div>

//           {/* Delivery Address */}
//           <div className=" rounded-2xl p- md:p-2 border border-[#b88ccc]  relative">
//             <div className=" top-6 right-6 bg-gradient-to-r from-[#2ACCED] to-[#B630F4] p-4 flex rounded-t">
              
//             <h2 className="text-xl font-bold">Delivery Address</h2>
//             </div>


//             <div className="space-y-4">
//               {/* Full Name */}
//               <div>
//                 <label className="block text-sm mb-2">Full name</label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                 />
//               </div>

//               {/* Get Location */}
//               <div>
//                 <label className="block text-sm mb-2">Get Location</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     name="getLocation"
//                     value={formData.getLocation}
//                     onChange={handleInputChange}
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                   <button className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Country, State, Zip */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm mb-2">Country / Region</label>
//                   <select
//                     name="country"
//                     value={formData.country}
//                     onChange={handleInputChange}
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
//                   >
//                     <option>United States</option>
//                     <option>Canada</option>
//                     <option>UK</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-2">States</label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-2">Zip Code</label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleInputChange}
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                 </div>
//               </div>

//               {/* Email & Phone */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm mb-2">Email</label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                     />
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold">
//                         G
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-2">Phone</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     placeholder="Enter phone number"
//                     className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-8">
//             <h2 className="text-xl font-bold mb-6">Order Summary</h2>

//             {/* Order Items */}
//             <div className="space-y-4 mb-6">
//               {orderItems.map((item) => (
//                 <div key={item.id} className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
//                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">{item.name}</p>
//                     <p className="text-xs text-gray-400">{item.variant}</p>
//                   </div>
//                   <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Price Breakdown */}
//             <div className="space-y-3 border-t border-gray-800 pt-4 mb-6">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Subtotal:</span>
//                 <span>${subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Delivery Charge:</span>
//                 <span>${deliveryCharge.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Tip:</span>
//                 <span>${tax.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-400">Discount:</span>
//                 <span className="text-green-400">-${discount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-lg font-bold border-t border-gray-800 pt-3">
//                 <span>Total:</span>
//                 <span className="text-purple-400">${total.toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="mb-6">
//               <h3 className="text-lg font-bold mb-4">Payment Method</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="radio"
//                     id="credit-card"
//                     name="paymentMethod"
//                     checked={paymentMethod === 'credit-card'}
//                     onChange={() => setPaymentMethod('credit-card')}
//                     className="w-4 h-4 text-purple-600"
//                   />
//                   <label htmlFor="credit-card" className="text-sm">Credit Card</label>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="radio"
//                     id="debit-card"
//                     name="paymentMethod"
//                     checked={paymentMethod === 'debit-card'}
//                     onChange={() => setPaymentMethod('debit-card')}
//                     className="w-4 h-4 text-purple-600"
//                   />
//                   <label htmlFor="debit-card" className="text-sm">Debit Card</label>
//                 </div>
//               </div>
              
//               {/* Profile Icon */}
//               <div className="flex justify-end mt-4">
                
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="">
//                <button className='text-[#6100FF] flex items-center justify-center w-full font-semibold py-1 cursor-pointer '>Apply Coupon</button>
//               <Link href="/order-confirmation">
//                 <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
//                   Place to Order
//                 </button>
//               </Link>
//               <button className="w-full mt-2 py-3 border border-purple-500/30 hover:bg-purple-500/10 rounded-full font-semibold transition-all duration-300">
//                Trip your driver
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    fullName: 'Dianne',
    getLocation: '4440 Poin',
    country: 'United States',
    state: 'Washington DC',
    zipCode: '20013',
    email: 'dianne.russell@gmail.com',
    phone: ''
  });

  const orderItems = [
    { id: 1, name: 'Lemon body serv', variant: 'X2', price: 1100.00, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop' },
    { id: 2, name: 'Jo Mker Pline', variant: 'X2', price: 1100.00, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&h=100&fit=crop' }
  ];

  const subtotal = 1900.00;
  const deliveryCharge = 20.00;
  const tax = 10.00;
  const discount = 40.00;
  const total = subtotal + deliveryCharge + tax - discount;

  interface FormData {
    fullName: string;
    getLocation: string;
    country: string;
    state: string;
    zipCode: string;
    email: string;
    phone: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCouponSubmit = () => {
    console.log('Coupon Code:', couponCode);
    setShowCouponModal(false);
    setCouponCode('');
  };

  const handleTipSubmit = () => {
    console.log('Tip Amount:', tipAmount);
    setShowTipModal(false);
    setTipAmount('');
  };

  return (
    <div className="min-h-screen mt-24 bg-linear-to-r from-gray-950 via-purple-900/15 to-black text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Check Out</h1>
        </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-cormorant mb-2">Checkout</h1>
        <p className="text-gray-400 font-poppins text-sm">One step away from your dream purchase.</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Method */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="delivery"
                name="deliveryMethod"
                checked={deliveryMethod === 'delivery'}
                onChange={() => setDeliveryMethod('delivery')}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="delivery" className="text-sm font-medium">Delivery</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="pickup"
                name="deliveryMethod"
                checked={deliveryMethod === 'pickup'}
                onChange={() => setDeliveryMethod('pickup')}
                className="w-4 h-4 text-purple-600"
              />
              <label htmlFor="pickup" className="text-sm font-medium">Pick up</label>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-[#b88ccc] relative overflow-hidden">
            <div className="bg-gradient-to-r from-[#2ACCED] to-[#B630F4] p-4">
              <h2 className="text-xl font-bold">Delivery Address</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm mb-2">Full name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Get Location */}
              <div>
                <label className="block text-sm mb-2">Get Location</label>
                <div className="relative">
                  <input
                    type="text"
                    name="getLocation"
                    value={formData.getLocation}
                    onChange={handleInputChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Country, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Country / Region</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>UK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">States</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold">
                        G
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xs font-bold">
                        M
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full bg-purple-950/40 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-900/20 to-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.variant}</p>
                  </div>
                  <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Delivery Charge:</span>
                <span>${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tip:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Discount:</span>
                <span className="text-green-400">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-800 pt-3">
                <span>Total:</span>
                <span className="text-purple-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    checked={paymentMethod === 'credit-card'}
                    onChange={() => setPaymentMethod('credit-card')}
                    className="w-4 h-4 text-purple-600"
                  />
                  <label htmlFor="credit-card" className="text-sm">Credit Card</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="debit-card"
                    name="paymentMethod"
                    checked={paymentMethod === 'debit-card'}
                    onChange={() => setPaymentMethod('debit-card')}
                    className="w-4 h-4 text-purple-600"
                  />
                  <label htmlFor="debit-card" className="text-sm">Debit Card</label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowCouponModal(true)}
                className='text-[#6100FF] flex items-center justify-center w-full font-semibold py-1 cursor-pointer hover:text-purple-400 transition-colors'
              >
                Apply Coupon
              </button>
            <Link href="/success-order">
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                Place to Order
              </button>
            </Link>
              <button 
                onClick={() => setShowTipModal(true)}
                className="w-full py-3 border border-purple-500/30 hover:bg-purple-500/10 rounded-full font-semibold transition-all duration-300"
              >
                Tip your driver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-purple-500 rounded-2xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowCouponModal(false)}
              className="absolute top-4 right-4 text-white hover:text-purple-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-center mb-6">Apply Coupon</h2>
            
            <div className="flex justify-center mb-6">
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold">
                  G
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-xs font-bold">
                  M
                </div>
              </div>
            </div>

            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter your discount code"
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-6"
            />

            <button 
              onClick={handleCouponSubmit}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-purple-500 rounded-2xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowTipModal(false)}
              className="absolute top-4 right-4 text-white hover:text-purple-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-center mb-4">Tips</h2>
            
            <p className="text-purple-400 text-center mb-6">Support your driver with a tip</p>

            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="Enter Amount"
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-6"
            />

            <button 
              onClick={handleTipSubmit}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}