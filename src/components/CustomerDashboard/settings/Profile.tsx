"use client";
import React, { useState } from 'react';
import { Edit2, Calendar, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="  mt-16 md:mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
        
      <div className="max-w-3xl mx-auto">
        {/* Header */}

  <div className="container mx-auto mt-4 flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Profile info</h1>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
            />
          </div>
          <Link href="/profile/edit-profile">
          <button 
          className="bg-[#6100FF] cursor-pointer text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </Link>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
           
          <button 
           onClick={() => router.push("/profile/event")}
          className="bg-[#29223A] bg-opacity-50 border border-gray-700 rounded-xl p-4 hover:bg-opacity-70 transition-all flex flex-col items-center gap-2">
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Event</span>
          </button>

            <button 
             onClick={() => router.push("/profile/settings")}
            className="bg-[#29223A] bg-opacity-50 border border-gray-700 rounded-xl p-4 hover:bg-opacity-70 transition-all flex flex-col items-center gap-2">
            <Settings className="w-6 h-6" />
            <span className="text-sm">Settings</span>
          </button>
          
          <button className="bg-[#261224] bg-opacity-50 border border-gray-700 rounded-xl p-4 hover:bg-opacity-70 transition-all flex flex-col items-center gap-2">
            <LogOut className="w-6 h-6" />
            <span className="text-sm">Leave</span>
          </button>
        </div>

        {/* Profile Information Card */}
        <div className="bg-gradient-to-b from-[#0a2930] to-[#0c0111] bg-opacity-50 border-2 border-blue-500 rounded-3xl p-6 backdrop-blur-sm">
          <div className="space-y-6">
            {/* User Name */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">User Name</label>
              <div className="text-gray-400">AlexDennis1512</div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Name</label>
              <div className="text-gray-400">Alex dennis</div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email Address</label>
              <div className="text-gray-400">alexdennis@gmail.com</div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Phone Number</label>
              <div className="text-gray-400">2334567</div>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Address</label>
              <div className="text-gray-400">London, UK</div>
            </div>

            {/* Communication */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Communication</label>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">Email</span>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm">
                    G
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    M
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}