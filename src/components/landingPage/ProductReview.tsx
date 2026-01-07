"use client"
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ReviewsPage() {

    const router = useRouter()

  const reviews = [
    {
      id: 1,
      name: "Courtney Henry",
      rating: 5,
      time: "2 mins ago",
      text: "Consequat velit qui adipisicing sunt reprehenderit ad laborum tempor ullamco exercitation. Ultrco tempor adipisicing sit vulputate ullamco aliquiplt."
    },
    {
      id: 2,
      name: "Courtney Henry",
      rating: 5,
      time: "2 mins ago",
      text: "Consequat velit qui adipisicing sunt reprehenderit ad laborum tempor ullamco exercitation. Ultrco tempor adipisicing sit vulputate ullamco aliquiplt."
    },
    {
      id: 3,
      name: "Courtney Henry",
      rating: 5,
      time: "2 mins ago",
      text: "Consequat velit qui adipisicing sunt reprehenderit ad laborum tempor ullamco exercitation. Ultrco tempor adipisicing sit vulputate ullamco aliquiplt."
    },
    {
      id: 4,
      name: "Courtney Henry",
      rating: 5,
      time: "2 mins ago",
      text: "Consequat velit qui adipisicing sunt reprehenderit ad laborum tempor ullamco exercitation. Ultrco tempor adipisicing sit vulputate ullamco aliquiplt."
    }
  ];

  const StarIcon = ({ filled }: { filled: boolean }) => (

    <svg
      className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
       <div className="container mx-auto flex mb-2 items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Review</h1>
        </div> 

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-gray-900 rounded-lg p-6 border border-gray-800"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0"></div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{review.name}</h3>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} filled={i < review.rating} />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.time}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {review.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}