'use client';

import React, { useState } from 'react';
import { Camera, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
  const [formData, setFormData] = useState({
    username: 'Alexdennis12',
    email: '',
    phone: '',
    address: '',
    communication: 'Email'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
  };

  return (
     
    <div className="min-h-screen mt-16 bg-gradient-to-r from-gray-950 via-purple-900/20 to-black text-white flex items-center justify-center">
    
      
      <div className="max-w-2xl w-full">
        
         <div className=" mt-4 flex items-center gap-4 mb-6">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Edit Profile</h1>
        </div>
        {/* Header */}
              

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          {/* Username */}
          <p className="text-sm text-gray-400">{formData.username}</p>
          
          {/* Communication Icons */}
      
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-b from-[#0a2930] to-[#0c0111] bg-opacity-50 border-2 border-blue-50 rounded-3xl p-8 backdrop-blur-sm">
          <div className="space-y-6">
            
            {/* Email Address */}
            <div>
              <label className="block text-sm mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Gmail"
                  className="w-full bg-transparent border border-gray-600 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm mb-3">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Your Gmail"
                  className="w-full bg-transparent border border-gray-600 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm mb-3">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter Your Location"
                  className="w-full bg-transparent border border-gray-600 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Communication Preference */}
            <div>
              <label className="block text-sm mb-3">Communication Preference</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="communication"
                    value="Email"
                    checked={formData.communication === 'Email'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 accent-purple-600"
                  />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="communication"
                    value="Phone"
                    checked={formData.communication === 'Phone'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 accent-purple-600"
                  />
                  <span className="text-sm">Phone</span>
                </label>
              </div>
            </div>

            {/* Update Button */}
            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 mt-4"
            >
              Update
            </button>
          </div>
        </div>
      </div>
     
    </div>
 
  );
}