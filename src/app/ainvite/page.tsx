'use client';

import { useState, useRef } from 'react';

interface EventData {
  eventName: string;
  date: string;
  time: string;
  location: string;
  hostName: string;
}

export default function InvitationCard() {
  const [eventData, setEventData] = useState<EventData>({
    eventName: 'A Special Celebration',
    date: 'Saturday, March 15th, 2025',
    time: '6:00 PM',
    location: 'The Grand Ballroom, New York',
    hostName: '',
  });

  const handleInputChange = (field: keyof EventData, value: string) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Add Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
        
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          /* Hide everything except the card */
          body * {
            visibility: hidden;
          }
          
          /* Show only the card */
          #invitation-card,
          #invitation-card * {
            visibility: visible;
          }
          
          /* Position card to fill the page */
          #invitation-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 20mm;
            box-sizing: border-box;
          }
          
          /* Remove rounded corners for print */
          #invitation-card > div {
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 py-8 px-4">
        {/* Input Form - Will NOT print */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
              Customize Your Invitation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                  className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="A Special Celebration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={eventData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="Saturday, March 15th, 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={eventData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="6:00 PM"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="The Grand Ballroom, New York"
                />
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="mt-6 w-full bg-emerald-800 text-white py-3 rounded-lg hover:bg-emerald-900 transition-colors font-medium"
            >
              Download as PDF (1 Page Only)
            </button>
            <p className="mt-2 text-sm text-center text-emerald-700">
              Click above, then select "Save as PDF" - Only the card will be saved (1 page)
            </p>
          </div>
        </div>

        {/* Invitation Card - This WILL print as 1 page PDF */}
        <div className="flex items-center justify-center">
          <div id="invitation-card">
            <div
              className="relative w-full max-w-2xl aspect-[3/4] bg-gradient-to-b from-emerald-900 via-teal-800 to-emerald-900 rounded-xl shadow-2xl overflow-hidden mx-auto"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
              }}
            >
              {/* Ornamental Border Frame - Top */}
              <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none">
                <svg viewBox="0 0 800 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#B8860B', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Ornate top border */}
                  <path
                    d="M 0,80 Q 100,60 200,80 T 400,80 T 600,80 T 800,80 L 800,0 Q 700,20 600,0 T 400,0 T 200,0 T 0,0 Z"
                    fill="url(#goldGradient)"
                    opacity="0.9"
                  />
                  
                  {/* Decorative elements */}
                  <circle cx="400" cy="50" r="20" fill="#FFD700" opacity="0.8" />
                  <ellipse cx="400" cy="50" rx="35" ry="15" fill="none" stroke="#B8860B" strokeWidth="2" opacity="0.6" />
                  
                  {/* Side ornaments */}
                  <circle cx="200" cy="60" r="12" fill="#FFD700" opacity="0.7" />
                  <circle cx="600" cy="60" r="12" fill="#FFD700" opacity="0.7" />
                  <circle cx="100" cy="70" r="8" fill="#B8860B" opacity="0.6" />
                  <circle cx="700" cy="70" r="8" fill="#B8860B" opacity="0.6" />
                </svg>
              </div>

              {/* Ornamental Border Frame - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
                <svg viewBox="0 0 800 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <path
                    d="M 0,20 Q 100,40 200,20 T 400,20 T 600,20 T 800,20 L 800,100 Q 700,80 600,100 T 400,100 T 200,100 T 0,100 Z"
                    fill="url(#goldGradient)"
                    opacity="0.9"
                  />
                  
                  {/* Decorative elements */}
                  <circle cx="400" cy="50" r="20" fill="#FFD700" opacity="0.8" />
                  <ellipse cx="400" cy="50" rx="35" ry="15" fill="none" stroke="#B8860B" strokeWidth="2" opacity="0.6" />
                  
                  {/* Side ornaments */}
                  <circle cx="200" cy="40" r="12" fill="#FFD700" opacity="0.7" />
                  <circle cx="600" cy="40" r="12" fill="#FFD700" opacity="0.7" />
                  <circle cx="100" cy="30" r="8" fill="#B8860B" opacity="0.6" />
                  <circle cx="700" cy="30" r="8" fill="#B8860B" opacity="0.6" />
                </svg>
              </div>

              {/* Left Border */}
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-yellow-600 via-yellow-500 to-transparent opacity-80"></div>
              
              {/* Right Border */}
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-yellow-600 via-yellow-500 to-transparent opacity-80"></div>

              {/* Sparkle Effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
                <div
                  className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-50 animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                ></div>
                <div
                  className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-300 rounded-full opacity-40 animate-pulse"
                  style={{ animationDelay: '1s' }}
                ></div>
                <div
                  className="absolute top-1/2 right-1/4 w-1 h-1 bg-yellow-400 rounded-full opacity-70 animate-pulse"
                  style={{ animationDelay: '1.5s' }}
                ></div>
                <div
                  className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-50 animate-pulse"
                  style={{ animationDelay: '2s' }}
                ></div>
                <div
                  className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-emerald-200 rounded-full opacity-60 animate-pulse"
                  style={{ animationDelay: '2.5s' }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 sm:px-12 py-16 text-center">
                {/* Main Title */}
                <div className="mb-8">
                  <h1
                    className="text-5xl sm:text-6xl md:text-7xl italic text-yellow-400 mb-6 tracking-wide"
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    You're Invited
                  </h1>

                  {/* Decorative Divider */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                    <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
                    </svg>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                  </div>
                </div>

                {/* Invitation Text */}
                <div className="mb-10">
                  <p
                    className="text-lg sm:text-xl text-yellow-100 tracking-widest uppercase font-light mb-4"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Please Join Us For
                  </p>
                  <p
                    className="text-2xl sm:text-3xl md:text-4xl text-yellow-300 font-semibold mb-4"
                    style={{ 
                      fontFamily: "'Cinzel', serif",
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {eventData.eventName}
                  </p>
                </div>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                  <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                </div>

                {/* Event Details */}
                <div className="space-y-5 text-yellow-100">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p
                        className="text-base sm:text-lg font-light tracking-wider"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {eventData.date}
                      </p>
                    </div>
                    <div className="w-px h-6 bg-yellow-400"></div>
                    <div className="text-center">
                      <p
                        className="text-base sm:text-lg font-light tracking-wider"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {eventData.time}
                      </p>
                    </div>
                  </div>

                  {/* Decorative Divider */}
                  <div className="flex items-center justify-center gap-2 my-4">
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                    <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                  </div>

                  <div className="text-center">
                    <p
                      className="text-base sm:text-lg font-light tracking-wider"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {eventData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inner Border */}
              <div className="absolute inset-6 border-2 border-yellow-600/30 rounded-lg pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}