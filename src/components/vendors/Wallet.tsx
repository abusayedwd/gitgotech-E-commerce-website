"use client";
import { useState } from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-r mt-20 from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Header */}
     <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black'/>
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">My Wallet</h1>
        </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Balance Card */}
        <div className='w-full'>

        <img src="/images/wallett.png" className='w-full h-[254]' alt="/images/wallett.png" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
        {/* <Link className='w-full' href={"/v-profile/payment-method"}> */}

  <button
    onClick={() => router.push("/v-profile/wallet/payment-method")}
          className="flex-1 flex items-center cursor-pointer justify-center border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#6100FF] text-[#6100FF]  gap-2 px-4 py-3 bg-[#2F2643] rounded-xl transition">
            <img src="/images/method.png" alt=""/>
            <span>Payment Method</span>
          </button>
        {/* </Link> */}
         

          {/* <Link className='w-full' href={"/v-profile/wallet/withdraw-request"}>   */}
          <button
            onClick={() => router.push("/v-profile/wallet/withdraw-request")}
           className="flex-1 flex items-center cursor-pointer justify-center border-2  border-[#42276e] gap-2 px-4 py-3 bg-[#6100FF] hover:bg-purple-700 rounded-xl transition">
              <img src="/images/withdraw.png" alt="" />
            <span>Withdraw</span>
          </button>
          {/* </Link> */}

        </div>

        {/* Recent History */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#6100FF] rounded-2xl p-6">
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