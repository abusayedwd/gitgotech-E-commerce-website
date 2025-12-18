"use client";
import React, { useState } from 'react';
import { Edit2, Calendar, Settings, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="  mt-16 md:mt-20 bg-gradient-to-r from-gray-950 via-purple-900/15 to-black text-white p-6">
        <div className="container mx-auto mt-4">
          <h1 className="text-2xl font-semibold text-gray-300">Profile info</h1>
        </div>
      <div className="max-w-3xl mx-auto">
        {/* Header */}

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button className="bg-[#29223A] bg-opacity-50 border border-gray-700 rounded-xl p-4 hover:bg-opacity-70 transition-all flex flex-col items-center gap-2">
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Event</span>
          </button>
          <button className="bg-[#29223A] bg-opacity-50 border border-gray-700 rounded-xl p-4 hover:bg-opacity-70 transition-all flex flex-col items-center gap-2">
            <Settings className="w-6 h-6" />
            <span className="text-sm">Settings</span>
          </button>
          <button className="bg-[#261224] bg-opacity-50 border border-gray-700 rounded-xl p-4 hover:bg-opacity-70 transition-all flex flex-col items-center gap-2">
            <LogOut className="w-6 h-6" />
            <span className="text-sm">Leave</span>
          </button>
        </div>

        {/* Profile Information Card */}
        <div className="bg-gray-800 bg-opacity-50 border-2 border-blue-500 rounded-3xl p-6 backdrop-blur-sm">
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