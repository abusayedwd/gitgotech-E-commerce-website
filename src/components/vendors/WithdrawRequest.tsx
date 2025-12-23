"use client";
import { useState } from 'react';
import { Wallet, CreditCard, Plus, ArrowDownRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WithdrawRequest() {
    const router = useRouter()
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState(0);
  const [cards] = useState([
    { id: 1, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
    { id: 2, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
    { id: 3, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
    { id: 4, type: 'VISA', last4: '8970', bank: 'Bank Meghna LTD.' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    console.log('Withdraw Request:', {
      amount: parseFloat(amount),
      card: cards[selectedCard],
    });
    // Here you'd normally call your API
    alert(`Withdrawal of $${parseFloat(amount).toFixed(2)} requested!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r mt-20 from-black via-[#110a2b] to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex mb-4 items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Profile info</h1>
        </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium ">Enter Amoundt</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            className="w-full bg-[#242428] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="0"
            step="0.01"
          />
        </div>

        {/* Card Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Select Card</label>
          <div className="space-y-3">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(index)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCard === index
                    ? ' bg-[#09090B] border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/50 ring-1 ring-purple-500/40 rounded-2xl'
                    : 'border-gray-700 bg-[#1B1B1F] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src="/images/Visa.png" alt="" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">**** **** **** {card.last4}</span>
                    </div>
                    <div className="text-xs text-gray-400">{card.bank}</div>
                  </div>
                  {selectedCard === index && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Card Button */}
        <button className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-3 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl
         bg-gray-800 hover:bg-gray-700 rounded-xl transition">
          <Plus className="w-5 h-5 text-purple-400" />
          <span>Add Card</span>
        </button>

        {/* Withdraw Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl transition transform hover:scale-[1.02]"
        >
          <ArrowDownRight className="w-5 h-5" />
          <span>Withdraw</span>
        </button>

        {/* Info Box */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-4 text-sm text-gray-300">
          Our payment cycle runs every Friday. If you need your payment earlier, our support team is here to help—just reach out!
        </div>
      </div>
    </div>
  );
}