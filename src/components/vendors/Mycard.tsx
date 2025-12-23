"use client";
import { useState } from 'react';
import { Wallet, CreditCard, Plus, Trash2 } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function MyCardPage() {
    const router = useRouter()
  const [cards, setCards] = useState([
    { id: 1, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
    { id: 2, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
    { id: 3, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
    { id: 4, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
  ]);

  const handleDeleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleAddCard = () => {
    // In real app, this would open a modal or navigate to add card form
    alert('Add Card functionality - would open form here');
    console.log('Add Card clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Header */}
       <div className="container mx-auto mt-20 flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">My Card</h1>
        </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Add Card Button */}
        
          <button
    onClick={() => router.push("/v-profile/wallet/payment-method/add-card")}
          className="flex-1 w-full flex items-center cursor-pointer justify-center border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#5b2fa3] text-[#6100FF]  gap-2 px-4 py-3 bg-[#2F2643] rounded-xl transition">
              <img src="/images/card.png" alt="" />
            <span>Add Card</span>
          </button>

        {/* Your Cards Section */}
        <div className="space-y-3">
          <h2 className="text-[16px] font-medium font-poppins text-gray-300">Your Cards</h2>
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between p-4 bg-[#1B1B1F] border border-[#242428] rounded-xl hover:border-gray-600 transition"
            >
              <div className="flex items-center gap-3">
                 <img src="/images/Visa.png" alt="" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">**** **** **** {card.last4}</span>
                  </div>
                  <div className="text-xs text-gray-400">{card.bank}</div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded flex items-center justify-center transition"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}