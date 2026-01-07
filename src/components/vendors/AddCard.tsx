"use client";
import { useState } from 'react';
import { Wallet, CreditCard, Check } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AddCardPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [country, setCountry] = useState('');
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!cardNumber || !expiryDate || !cvc || !country) {
      alert('Please fill all fields');
      return;
    }

    console.log('New Card Added:', {
      cardNumber,
      expiryDate,
      cvc,
      country,
    });

    // In real app, you'd call an API here
    alert('Card added successfully!');
  };

  // Auto-format card number as user types (spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    if (value.length > 0) {
      const matches = value.match(/.{1,4}/g);
      value = matches ? matches.join(' ') : value;
    }
    setCardNumber(value);
  };

  // Auto-format expiry date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiryDate(value);
  };

  return (
    <div className="min-h-screen mt-24 bg-gradient-to-r  from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Header */}
       <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Add Card</h1>
        </div> 

      <div className="max-w-4xl mx-auto ">
        {/* Card Form Container */}
        <div className="bg-gradient-to-r  from-[#161420] via-[#2f2b41] to-[#161420] border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#67469c] rounded-2xl p-6 md:p-8  backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="Enter card number"
                  className="w-full bg-[#242428] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:right-1"
                  maxLength={19}
                />
                {/* Card Type Icons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-white font-bold">V</span>
                  </div>
                  <div className="w-6 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-white font-bold">M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry Date & CVC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expire Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full bg-[#242428] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:right-1"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="CVC"
                  className="w-full bg-[#242428] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:right-1"
                  maxLength={3}
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#242428] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:right-1"
              >
                <option value="">Select One</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                <option value="BD">Bangladesh</option>
              </select>
            </div>

            {/* Add Card Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r bg-[#6100FF] cursor-pointer rounded-xl transition transform hover:scale-[1.02]"
            >
              <Check className="w-5 h-5" />
              <span>Add Card</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}