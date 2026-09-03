'use client';

import { SectionHeader } from '@/customComponent/Header';
import { useState } from 'react';

const faqData = [
  {
    question: "How long will my order take to arrive?",
    answer:
      "Deliveries are completed within 3–4 days after your order is placed. You cannot choose a specific delivery date at checkout — we schedule the drop-off for you within that window.",
  },
  {
    question: "Can I pick up my order instead of having it delivered?",
    answer:
      "Yes. At checkout you can choose Delivery or Pickup. Pickup is collected from the vendor’s showroom, so no delivery fee or tip is charged. Home delivery includes a fee based on distance and item weight, shown before you pay.",
  },
  {
    question: "How is the delivery fee calculated?",
    answer:
      "The delivery fee is calculated from the distance between the vendor’s showroom and your address, plus the weight of your items. You can add an optional tip. Tax is applied at checkout and shown in your order summary before payment.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Sign in and open your customer dashboard, then view the order for live status and tracking. If something looks wrong, use Support in the site or email us with your order number so we can help.",
  },
  {
    question: "How do I return an item or get a refund?",
    answer:
      "Once an order is marked Delivered, you can request a return from that order’s details page, as long as you are still inside the return window. You choose the items, reason, and refund method, and can arrange return pickup. Refunds follow our Refund Policy, and any processing deduction is shown before you submit.",
  },
  {
    question: "Can I request a custom design?",
    answer:
      "Yes. Sleeknit lets you shop ready-made pieces or request a custom design from a vendor. Share your measurements and notes on the custom request form, and the vendor will tailor the piece for you.",
  },
  {
    question: "How do I become a vendor on Sleeknit?",
    answer:
      "Create an account and choose Vendor at sign-up. You can then set up your showroom, list products, manage orders, and sell directly to customers on the platform.",
  },
  {
    question: "How can I contact Sleeknit support?",
    answer:
      "Open Support from the site after you sign in to chat with our team. You can also reach us by email or phone from the footer. Have your order number ready if your question is about a purchase.",
  },
];

export default function SimpleFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className='flex items-center justify-center'> 
          <SectionHeader title='Frequently Asked Questions'></SectionHeader>
          </h1>
          <p className="text-xl text-gray-400">Shopping, delivery, returns, and selling on Sleeknit</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="  rounded-lg shadow-md overflow-hidden bg-gradient-to-l from-[#231c2e] to-[#22121e] text-white"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                <span className=" font-bold text-xl ml-4">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 pt-2 border-t border-gray-700">
                  <p className="text-white leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}