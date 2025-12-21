"use client"

import { Calendar, LocationEdit, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Event() {
  const [activeTab, setActiveTab] = useState('created');
  const router = useRouter();
  
  const events = [
    {
      id: 1,
      title: "Birthday Family Outfit",
      description: "Lorem ipsum dolor sit amet consectetur. Integer a eros vitae arcu. Egestas dui id felis sed nunc congue scelerisque.",
      date: "18 Nov, 25 02:00PM",
      location: "Mohakhali 240, Dhaka",
      totalInvite: 24,
      status: "created"
    },
    {
      id: 2,
      title: "Birthday Family Outfit",
      description: "Lorem ipsum dolor sit amet consectetur. Integer a eros vitae arcu. Egestas dui id felis sed nunc congue scelerisque.",
      date: "18 Nov, 25 02:00PM",
      location: "Mohakhali 240, Dhaka",
      totalInvite: 24,
      status: "created"
    }
  ];

  return (
    <div className="min-h-screen md:mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black">
      {/* Header */}
      <div className="flex py-6 container mx-auto justify-between items-center mb-4">
        <div className=" flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Event</h1>
        </div>
        
        <button 
         onClick={() => router.push("/profile/event/create-event")}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Event
        </button>
      </div>

      {/* Subheader */}
      <div className="text-center mb-8">
        <p className="text-gray-400 max-w-2xl mx-auto">
          Plan matching outfits for your event with your selected tailor. Invite your friends, share the design, and let everyone order easily from the same vendor.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex mb-8 justify-center">
        <button 
          onClick={() => setActiveTab('created')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'created' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Created
        </button>
        <button 
          onClick={() => setActiveTab('invitations')}
          className={`px-6 py-2 rounded-r font-medium transition-all duration-200 ${
            activeTab === 'invitations' 
              ? 'bg-purple-600 text-white' 
              : 'bg-[#4C455A] text-gray-300 hover:bg-gray-700'
          }`}
        >
          Invitations
        </button>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        {events.map((event) => (
          <div key={event.id} className="bg-[#2C233E] border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold font-cormorant text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 mb-4 font-poppins">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-poppins text-gray-300">
                     <Calendar/>
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <LocationEdit></LocationEdit>
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-400">
                   
                    <span>Total Invite: {event.totalInvite}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <button className="px-4 py-2 bg-[#912DAD] text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 text-sm">
                  View Design
                </button>
                
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-sm flex items-center gap-2">
                  <Share2></Share2>
                  Send Invitation
                </button>
              </div>
            </div>
            
            {/* Edit Icon */}
            <div className="absolute top-4 right-4">
              <svg className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-6 6a2 2 0 01-2.828 0l-6-6a2 2 0 012.828-2.828l6 6a2 2 0 012.828 0l6-6z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
