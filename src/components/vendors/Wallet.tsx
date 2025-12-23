"use client";
import { useState } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Wallett() {
 const router = useRouter()
  const [balance] = useState(12670.90);
  const [transactions] = useState([
    { id: 1, type: 'credit', amount: 100, description: 'Amina S. provide you a order', date: '18 Feb 2025, 10:00 AM' },
    { id: 2, type: 'debit', amount: 100, description: 'Withdraw', date: '18 Feb 2025, 10:00 AM' },
    { id: 3, type: 'debit', amount: 100, description: 'Withdraw', date: '18 Feb 2025, 10:00 AM' },
    { id: 4, type: 'credit', amount: 100, description: 'Amina S. provide you a order', date: '18 Feb 2025, 10:00 AM' },
    { id: 5, type: 'credit', amount: 100, description: 'Amina S. provide you a order', date: '18 Feb 2025, 10:00 AM' },
    { id: 6, type: 'credit', amount: 100, description: 'Amina S. provide you a order', date: '18 Feb 2025, 10:00 AM' },
    { id: 7, type: 'debit', amount: 100, description: 'Withdraw', date: '18 Feb 2025, 10:00 AM' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br mt-24 from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Header */}
     <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Wallet</h1>
        </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Balance Card */}
        <div className='w-full'>

        <img src="/images/wallett.png" className='w-full h-[254]' alt="/images/wallett.png" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
        <Link href={"/v-profile/payment-method"}>
        
         <button className="flex-1 flex items-center justify-center border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30  gap-2 px-4 py-3 bg-[#2F2643] hover:bg-gray-700 rounded-xl transition">
            <img src="/images/method.png" alt="" />
            <span>Payment Method</span>
          </button>
        </Link>
         

          <Link href={"/v-profile/wallet/withdraw-request"}>  
          <button className="flex-1 flex items-center justify-center border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition">
              <img src="/images/withdraw.png" alt="" />
            <span>Withdraw</span>
          </button>
          </Link>

        </div>

        {/* Recent History */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-blue-500/30 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Recent History</h3>
          
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
                <div>
                  <p className="font-medium text-white">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
                <div className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'credit' ? '+' : '-'}${tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}