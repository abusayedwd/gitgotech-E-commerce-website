// 'use client';

// import { useState } from 'react';
// import { Heart, ShoppingCart, MessageCircle, Ruler, Star, Info, Minus, Plus, X, Calendar, MapPin } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function ProductDetails() {
//   const router = useRouter();
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState('M');
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const events = [
//     {
//       id: 1,
//       title: 'Birthday Family Outfit',
//       date: '19 Nov, 25',
//       time: '02:00PM',
//       location: 'Mohakhali 240,Dhaka'
//     },
//     {
//       id: 2,
//       title: 'Birthday Family Outfit',
//       date: '19 Nov, 25',
//       time: '02:00PM',
//       location: 'Mohakhali 240,Dhaka'
//     },
//     {
//       id: 3,
//       title: 'Wedding Anniversary',
//       date: '25 Nov, 25',
//       time: '06:00PM',
//       location: 'Gulshan 2, Dhaka'
//     }
//   ];

//   const handleApply = () => {
//     if (selectedEvent) {
//       console.log('Selected Event:', events.find(e => e.id === selectedEvent));
//       setShowEventModal(false);
//       setSelectedEvent(null);
//     }
//   };

//   const product = {
//     name: "Jacket",
//     price: 28.00,
//     originalPrice: 32.00,
//     rating: 4.5,
//     reviews: 20,
//     seller: "William Alex",
//     inStock: false,
//     image: "/images/jacket.png",
//     description: "This design supports custom mix-mixing! You can combine elements from different products to create your unique style.",
//     sizes: ["XS", "S", "M", "L", "XL", "XXL"],
//     weight: "100 gram"
//   };

//   const handleAddToCart = () => {
//     alert(`Added ${quantity} ${product.name}(s) to cart!`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white mt-20">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="container mx-auto mb-4 flex items-center gap-4">
//           <button onClick={() => router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
//             <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </div>
//           </button>
//           <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Product Details</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Product Image Section */}
//           <div className="space-y-4">
//             <div className="relative bg-white rounded-lg p-8">
//               <img 
//                 src={product.image} 
//                 alt={product.name} 
//                 className="w-full rounded-lg"
//               />
//               <button className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
//                 Mix Design
//               </button>
//             </div>
            
//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <button className="w-full bg-[#6100FF] hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
//                 <Heart className="w-5 h-5" />
//                 Add to Wishlist
//               </button>
//               <button
//                 onClick={() => setShowEventModal(true)}
//                 className="w-full border border-[#6100FF] hover:bg-purple-900/30 text-[#6100FF] cursor-pointer py-3 px-4 rounded-lg font-medium transition-colors">
//                 Add to Event
//               </button>
//             </div>
//           </div>

//           {/* Product Details Section */}
//           <div className="space-y-4">
//             {/* Product Title & Rating */}
//             <div>
//               <h1 className="text-3xl font-bold font-cormorant mb-2">{product.name}</h1>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star 
//                       key={i} 
//                       className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-600 text-gray-600'}`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-purple-400">({product.reviews} Reviews)</span>
//               </div>
//             </div>

//             {/* Seller Info */}
//             <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
//                   <span className="text-sm font-medium">{product.seller.charAt(0)}</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium">{product.seller}</p>
//                   <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur. Lacus at venenatis gravida vivamus.</p>
//                 </div>
//               </div>
//             </div>

//             {/* Price & Stock Status */}
//             <div className="bg-gray-800/50 rounded-lg p-4">
//               <div className="flex items-center space-x-3 mb-2">
//                 <span className="text-l line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
//                 <span className="text-4xl font-semibold text-[#6100FF]">${product.price.toFixed(2)}</span>
//               </div>
//               <div className="">
//                 <span className="text-sm text-gray-400">Valid till December 30,2025</span>
//                 <br />
//                 <span className="text-sm text-gray-400">Weight: 100 gram</span>
//               </div>
//             </div>

//             {/* Mix Design Available */}
//             <div className="bg-purple-900/20 border border-[#6100FF] rounded-lg p-4">
//               <div className="flex items-center space-x-2 mb-2">
//                 <Info className="w-5 h-5 text-purple-400" />
//                 <h3 className="font-medium font-cormorant text-2xl text-purple-300">Mix Design Available</h3>
//               </div>
//               <p className="text-sm text-gray-300 mb-4">This product supports custom mix-design. You can combine elements from different products to create your unique style.</p>
//               <button className="w-full bg-[#912DAD] hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
//                 Start Mix Design
//               </button>
//             </div>

//             {/* Description */}
//             <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
//               <h3 className="font-medium font-cormorant text-2xl mb-2">Description</h3>
//               <p className="text-sm text-gray-400">{product.description}</p>
//             </div>

//             {/* Size Selection */}
//             <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
//               <h3 className="font-medium mb-3 font-cormorant text-2xl">Select Size</h3>
//               <div className="flex flex-wrap gap-2">
//                 {product.sizes.map(size => (
//                   <button
//                     key={size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
//                       selectedSize === size 
//                         ? 'bg-purple-600 border-purple-600 text-white' 
//                         : 'bg-gray-800 border-[#6100FF] hover:bg-gray-700 text-gray-300'
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity Selection */}
//             <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
//               <h3 className="font-medium mb-3 font-cormorant text-2xl">Quantity</h3>
//               <div className="flex items-center space-x-4">
//                 <button 
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
//                 >
//                   <Minus className="w-4 h-4" />
//                 </button>
//                 <span className="text-lg font-medium w-8 text-center">{quantity}</span>
//                 <button 
//                   onClick={() => setQuantity(quantity + 1)}
//                   className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Add to Cart Button */}
//             <button 
//               onClick={handleAddToCart}
//               className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium transition-all"
//             >
//               <div className="flex items-center justify-center space-x-2">
//                 <ShoppingCart className="w-5 h-5" />
//                 <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
//               </div>
//             </button>

//             {/* Additional Actions */}
//             <div className="grid grid-cols-2 gap-3">
//               <button className="bg-gray-800/50 border border-[#6100FF] hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
//                 <MessageCircle className="w-4 h-4" />
//                 <span>Chat</span>
//               </button>
//               <button className="bg-gray-800/50 border border-[#6100FF] hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
//                 <Ruler className="w-4 h-4" />
//                 <span>Size Guide</span>
//               </button>
//             </div>

//             {/* Custom Design Feature */}
//             <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
//               <h3 className="font-medium mb-2 text-purple-300">Custom Design Feature</h3>
//               <p className="text-sm text-gray-300 mb-4">This design supports custom mix-mixing! You can combine elements from different products to create your unique style.</p>
//               <button className="w-full bg-[#912DAD] hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
//                 Custom Design
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Event Selection Modal */}
//       {showEventModal && (
//         <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-black border border-gray-800 rounded-3xl max-w-lg w-full relative animate-fadeIn">
            
//             {/* Close Button */}
//             <button 
//               onClick={() => setShowEventModal(false)}
//               className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             {/* Modal Header */}
//             <div className="text-center pt-8 pb-6 border-b border-gray-800">
//               <h2 className="text-2xl font-semibold">Choose an Event</h2>
//             </div>

//             {/* Event List */}
//             <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
//               {events.map((event) => (
//                 <div
//                   key={event.id}
//                   onClick={() => setSelectedEvent(event.id)}
//                   className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
//                     selectedEvent === event.id
//                       ? 'border-purple-500 bg-purple-900/20'
//                       : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
//                   }`}
//                 >
//                   {/* Selection Indicator */}
//                   <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
//                     selectedEvent === event.id
//                       ? 'border-purple-500 bg-purple-500'
//                       : 'border-gray-600'
//                   }`}>
//                     {selectedEvent === event.id && (
//                       <div className="w-3 h-3 bg-white rounded-full"></div>
//                     )}
//                   </div>

//                   {/* Event Info */}
//                   <h3 className="text-lg font-semibold mb-3 pr-8">{event.title}</h3>
                  
//                   <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
//                     <Calendar className="w-4 h-4" />
//                     <span>{event.date} {event.time}</span>
//                   </div>
                  
//                   <div className="flex items-center gap-2 text-sm text-gray-400">
//                     <MapPin className="w-4 h-4" />
//                     <span>{event.location}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Apply Button */}
//             <div className="p-6 border-t border-gray-800">
//               <button 
//                 onClick={handleApply}
//                 disabled={!selectedEvent}
//                 className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
//                   <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold">
//                     ✓
//                   </div>
//                 </div>
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }

//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(75, 85, 99, 0.2);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(147, 51, 234, 0.5);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(147, 51, 234, 0.7);
//         }
//       `}</style>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, MessageCircle, Ruler, Star, Info, Minus, Plus, X, Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetails() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Birthday Family Outfit',
      date: '19 Nov, 25',
      time: '02:00PM',
      location: 'Mohakhali 240,Dhaka'
    },
    {
      id: 2,
      title: 'Birthday Family Outfit',
      date: '19 Nov, 25',
      time: '02:00PM',
      location: 'Mohakhali 240,Dhaka'
    },
    {
      id: 3,
      title: 'Wedding Anniversary',
      date: '25 Nov, 25',
      time: '06:00PM',
      location: 'Gulshan 2, Dhaka'
    }
  ];

  const handleApply = () => {
    if (selectedEvent) {
      console.log('Selected Event:', events.find(e => e.id === selectedEvent));
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const product = {
    name: "Jacket",
    price: 28.00,
    originalPrice: 32.00,
    rating: 4.5,
    reviews: 20,
    seller: "William Alex",
    inStock: false,
    category: "shoe", // "clothing" or "shoe"
    image: "/images/jacket.png",
    description: "This design supports custom mix-mixing! You can combine elements from different products to create your unique style.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    weight: "100 gram"
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  // Shoe Size Guide Component
  const ShoeSizeGuide = () => {
    const usaSizes = ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'];
    const europeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-gray-950 via-purple-900/15 to-black border-1 border-blue-500/50 rounded-3xl max-w-2xl w-full relative animate-fadeIn">
          
          <button 
            onClick={() => setShowSizeGuide(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-cormorant font-semibold">USA Shoe Sizes</h2>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
              <h3 className="text-lg font-semibold mb-4 font-cormorant flex items-center gap-2">
                <Ruler className="w-4 h-4 font-cormorant text-purple-400" />
                USA Shoe Sizes
              </h3>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                {usaSizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-3 bg-purple-900/30 border border-purple-500/10 rounded-lg hover:bg-purple-600 hover:border-purple-600 transition-colors text-center font-medium"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 font-cormorant flex items-center gap-2">
                <Ruler className="w-4 h-4 text-purple-400" />
                Europe Shoe Sizes
              </h3>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
                {europeSizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg hover:bg-purple-600 hover:border-purple-600 transition-colors text-center font-medium"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Clothing Size Guide Component
  const ClothingSizeGuide = () => {
    const sizeData = [
      { size: 'XS', chest: '30-32', waist: '24-26', hips: '32-34', inseam: '28-30', sleeve: '30-32' },
      { size: 'S', chest: '32-34', waist: '26-28', hips: '34-36', inseam: '30-31', sleeve: '31-32' },
      { size: 'M', chest: '36-38', waist: '28-30', hips: '36-38', inseam: '31-32', sleeve: '32-33' },
      { size: 'L', chest: '40-42', waist: '32-34', hips: '40-42', inseam: '32-33', sleeve: '33-34' },
      { size: 'XL', chest: '44-46', waist: '36-38', hips: '44-46', inseam: '33-34', sleeve: '34-35' },
      { size: '2XL', chest: '48-50', waist: '40-42', hips: '48-50', inseam: '34-35', sleeve: '35-36' },
      { size: '3XL', chest: '52-54', waist: '44-46', hips: '52-54', inseam: '35-36', sleeve: '36-37' }
    ];

    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-gray-950 via-purple-900/15 to-black rounded-3xl max-w-3xl w-full relative animate-fadeIn">
          
          <button 
            onClick={() => setShowSizeGuide(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-semibold">Size Guide</h2>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div>
              <button className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium">
                USA (Measurement)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-3 px-4 font-semibold">Size</th>
                    <th className="text-left py-3 px-4 font-semibold">Chest(Inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Waist(Inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Hips(Inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Inseam(Inches)</th>
                    <th className="text-left py-3 px-4 font-semibold">Sleeve(Inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row, index) => (
                    <tr key={index} className="border-b border-purple-500/20 hover:bg-purple-900/20">
                      <td className="py-3 px-4">{row.size}</td>
                      <td className="py-3 px-4">{row.chest}</td>
                      <td className="py-3 px-4">{row.waist}</td>
                      <td className="py-3 px-4">{row.hips}</td>
                      <td className="py-3 px-4">{row.inseam}</td>
                      <td className="py-3 px-4">{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">How to Measure</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Chest/Bust:</h4>
                  <p className="text-gray-400">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Waist:</h4>
                  <p className="text-gray-400">Measure around the narrowest part of your waist, usually just above the button.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Hips:</h4>
                  <p className="text-gray-400">Measure around the fullest part of your hips, usually just above the button.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Sleeve:</h4>
                  <p className="text-gray-400">Measure from center back of neck, across shoulder down to bottomhole.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Inseam:</h4>
                  <p className="text-gray-400">Measure from center back of waist, across shoulder down to bottomhole.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white mt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="container mx-auto mb-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Product Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg p-8">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full rounded-lg"
              />
              <button className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Mix Design
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-[#6100FF] hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button>
              <button
                onClick={() => setShowEventModal(true)}
                className="w-full border border-[#6100FF] hover:bg-purple-900/30 text-[#6100FF] cursor-pointer py-3 px-4 rounded-lg font-medium transition-colors">
                Add to Event
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold font-cormorant mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-600 text-gray-600'}`}
                    />
                  ))}
                </div>
                <span onClick={() => router.push("/product/review")} className="text-sm cursor-pointer text-purple-400">({product.reviews} Reviews)</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">{product.seller.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.seller}</p>
                  <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur. Lacus at venenatis gravida vivamus.</p>
                </div>
              </div>
            </div>

            {/* Price & Stock Status */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-l line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
                <span className="text-4xl font-semibold text-[#6100FF]">${product.price.toFixed(2)}</span>
              </div>
              <div className="">
                <span className="text-sm text-gray-400">Valid till December 30,2025</span>
                <br />
                <span className="text-sm text-gray-400">Weight: 100 gram</span>
              </div>
            </div>

            {/* Mix Design Available */}
            <div className="bg-purple-900/20 border border-[#6100FF] rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium font-cormorant text-2xl text-purple-300">Mix Design Available</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">This product supports custom mix-design. You can combine elements from different products to create your unique style.</p>
              <button className="w-full bg-[#912DAD] hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                Start Mix Design
              </button>
            </div>

            {/* Description */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <h3 className="font-medium font-cormorant text-2xl mb-2">Description</h3>
              <p className="text-sm text-gray-400">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <h3 className="font-medium mb-3 font-cormorant text-2xl">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                      selectedSize === size 
                        ? 'bg-purple-600 border-purple-600 text-white' 
                        : 'bg-gray-800 border-[#6100FF] hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="bg-gray-800/50 border border-[#6100FF] rounded-lg p-4">
              <h3 className="font-medium mb-3 font-cormorant text-2xl">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 px-4 rounded-lg font-medium transition-all"
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
              </div>
            </button>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-3">
            
            <Link href={"/messaging"}>
                  <button className="bg-gray-800/50 cursor-pointer border w-full border-[#6100FF] hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </Link> 
            
                
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="bg-gray-800/50 border border-[#6100FF] hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Ruler className="w-4 h-4" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Custom Design Feature */}
            <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-purple-300">Custom Design Feature</h3>
              <p className="text-sm text-gray-300 mb-4">This design supports custom mix-mixing! You can combine elements from different products to create your unique style.</p>
              <Link href={"/design-request"}>
              <button className="w-full cursor-pointer bg-[#912DAD] hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors">
                Custom Design
              </button>
              </Link> 
            </div>
          </div>
        </div>
      </div>

      {/* Event Selection Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-black border border-gray-800 rounded-3xl max-w-lg w-full relative animate-fadeIn">
            
            <button 
              onClick={() => setShowEventModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800/50 hover:bg-gray-700 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-8 pb-6 border-b border-gray-800">
              <h2 className="text-2xl font-semibold">Choose an Event</h2>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedEvent === event.id
                      ? 'border-purple-500 bg-purple-900/20'
                      : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                  }`}
                >
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedEvent === event.id
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-600'
                  }`}>
                    {selectedEvent === event.id && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-3 pr-8">{event.title}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date} {event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-800">
              <button 
                onClick={handleApply}
                disabled={!selectedEvent}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                </div>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modals */}
      {showSizeGuide && (
        product.category === 'shoe' ? <ShoeSizeGuide /> : <ClothingSizeGuide />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
}