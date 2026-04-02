"use client";

import {
  useGetAllCardInfoQuery,
  useGetWalletTransactionsQuery,
  useWithdrawRequestMutation,
} from "@/redux/features/paymentTransaction/paymentTransactionSlice";
import { ArrowDownRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

interface Card {
  _id: string;
  cardType: string;
  last4: string;
  bankName: string;
  cardHolderName: string;
}

export default function WithdrawRequest() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const { data: walletData } = useGetWalletTransactionsQuery({});
  const { data: cardsData, refetch: refetchCards } =
    useGetAllCardInfoQuery(undefined);
  const [withdrawRequest, { isLoading }] = useWithdrawRequestMutation();

  const balance = walletData?.data?.balance || 0;
  const cards: Card[] = cardsData?.data || [];

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0]._id);
    }
  }, [cards, selectedCardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!selectedCardId) {
      toast.error("Please select a card");
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      await withdrawRequest({
        amount: parseFloat(amount),
        cardId: selectedCardId,
      }).unwrap();

      toast.success("Withdrawal request submitted successfully!");
      setAmount("");
      router.push("/v-profile/wallet");
    } catch (error: any) {
      console.error("Withdraw error:", error);
      toast.error(
        error?.data?.message || "Failed to submit withdrawal request",
      );
    }
  };

  const handleDeleteCard = async (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // You can add delete card functionality here if needed
    console.log("Delete card:", cardId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r md:mt-20 mt-12 from-black via-[#110a2b] to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="container mx-auto flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className="text-black" />
          </div>
        </button>
        <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">
          Withdraw Request
        </h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Balance Display */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Available Balance</span>
            <span className="text-xl font-bold text-white">
              $
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Enter Amount
          </label>
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
          <label className="block text-sm font-medium text-gray-300">
            Select Card
          </label>
          <div className="space-y-3">
            {cards.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No cards added yet. Please add a card first.
              </div>
            ) : (
              cards.map((card) => (
                <div
                  key={card._id}
                  onClick={() => setSelectedCardId(card._id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                    selectedCardId === card._id
                      ? "bg-[#09090B] border-purple-500/50 ring-1 ring-purple-500/40 rounded-2xl shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                      : "border-gray-700 bg-[#1B1B1F] hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/Visa.png"
                      alt={card.cardType}
                      className="h-8"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          **** **** **** {card.last4}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                          {card.cardType}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {card.bankName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {card.cardHolderName}
                      </div>
                    </div>
                    {selectedCardId === card._id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Card Button */}
        <button
          onClick={() => router.push("/v-profile/wallet/payment-method")}
          className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-3 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl bg-gray-800 hover:bg-gray-700 rounded-xl transition"
        >
          <Plus className="w-5 h-5 text-purple-400" />
          <span>Add Card</span>
        </button>

        {/* Withdraw Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !amount || !selectedCardId}
          className="w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <ArrowDownRight className="w-5 h-5" />
          <span>{isLoading ? "Processing..." : "Withdraw"}</span>
        </button>

        {/* Info Box */}
        <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-4 text-sm text-gray-300">
          Our payment cycle runs every Friday. If you need your payment earlier,
          our support team is here to help—just reach out!
        </div>
      </div>
    </div>
  );
}
