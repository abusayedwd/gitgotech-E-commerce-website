'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface EventData {
  eventName: string;
  date: string;
  time: string;
  location: string;
  hostName: string;
}

export default function InvitationCard() {
  const [eventData, setEventData] = useState<EventData>({
    eventName: 'Wedding Celebration',
    date: 'Saturday, March 15th, 2025',
    time: '6:00 PM',
    location: 'The Grand Ballroom, New York',
    hostName: 'John & Jane',
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleInputChange = (field: keyof EventData, value: string) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const downloadAsPDF = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#fef3e2',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`invitation-${eventData.eventName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Add Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-8 px-4">
        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
              Customize Your Invitation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventData.eventName}
                  onChange={(e) => handleInputChange('eventName', e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Wedding Celebration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Host Name
                </label>
                <input
                  type="text"
                  value={eventData.hostName}
                  onChange={(e) => handleInputChange('hostName', e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="John & Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={eventData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Saturday, March 15th, 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={eventData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="6:00 PM"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="The Grand Ballroom, New York"
                />
              </div>
            </div>
            <button
              onClick={downloadAsPDF}
              disabled={isDownloading}
              className="mt-6 w-full bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
            </button>
          </div>
        </div>

        {/* Invitation Card Preview */}
        <div className="flex items-center justify-center">
          <div
            ref={cardRef}
            className="relative w-full max-w-2xl aspect-[3/4] bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Ornamental Border Frame - Top Left */}
            <div className="absolute top-0 left-0 w-40 sm:w-48 h-40 sm:h-48 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full text-orange-300 opacity-90">
                <path
                  d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0"
                  fill="currentColor"
                />
                <circle cx="60" cy="60" r="15" fill="currentColor" opacity="0.8" />
                <circle cx="75" cy="45" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="45" cy="75" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="80" cy="65" r="6" fill="currentColor" opacity="0.5" />
                <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            {/* Top Right Corner */}
            <div className="absolute top-0 right-0 w-40 sm:w-48 h-40 sm:h-48 transform scale-x-[-1] pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full text-orange-300 opacity-90">
                <path
                  d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0"
                  fill="currentColor"
                />
                <circle cx="60" cy="60" r="15" fill="currentColor" opacity="0.8" />
                <circle cx="75" cy="45" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="45" cy="75" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="80" cy="65" r="6" fill="currentColor" opacity="0.5" />
                <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute bottom-0 left-0 w-40 sm:w-48 h-40 sm:h-48 transform scale-y-[-1] pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full text-orange-300 opacity-90">
                <path
                  d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0"
                  fill="currentColor"
                />
                <circle cx="60" cy="60" r="15" fill="currentColor" opacity="0.8" />
                <circle cx="75" cy="45" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="45" cy="75" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="80" cy="65" r="6" fill="currentColor" opacity="0.5" />
                <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-0 right-0 w-40 sm:w-48 h-40 sm:h-48 transform scale-[-1] pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full text-orange-300 opacity-90">
                <path
                  d="M 0,0 Q 50,0 75,25 Q 100,50 125,25 Q 150,0 200,0 L 200,25 Q 175,25 150,50 Q 125,75 100,50 Q 75,25 50,25 L 50,75 Q 50,100 25,125 Q 0,150 0,200 L 0,0"
                  fill="currentColor"
                />
                <circle cx="60" cy="60" r="15" fill="currentColor" opacity="0.8" />
                <circle cx="75" cy="45" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="45" cy="75" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="80" cy="65" r="6" fill="currentColor" opacity="0.5" />
                <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            {/* Center Bottom Ornament */}
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 w-28 sm:w-32 h-16 sm:h-20 pointer-events-none">
              <svg viewBox="0 0 100 60" className="w-full h-full text-amber-400 opacity-80">
                <path
                  d="M 50,0 L 45,10 Q 40,15 35,15 Q 30,15 25,20 L 20,30 Q 15,35 10,35 L 0,40 L 10,45 Q 15,45 20,50 L 25,60 Q 30,55 35,55 Q 40,55 45,50 L 50,60 L 55,50 Q 60,55 65,55 Q 70,55 75,60 L 80,50 Q 85,45 90,45 L 100,40 L 90,35 Q 85,35 80,30 L 75,20 Q 70,15 65,15 Q 60,15 55,10 Z"
                  fill="currentColor"
                />
                <circle cx="50" cy="40" r="8" fill="currentColor" opacity="0.9" />
                <circle cx="30" cy="42" r="4" fill="currentColor" opacity="0.7" />
                <circle cx="70" cy="42" r="4" fill="currentColor" opacity="0.7" />
              </svg>
            </div>

            {/* Sparkle Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-300 rounded-full opacity-60 animate-pulse"></div>
              <div
                className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-50 animate-pulse"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div
                className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-rose-300 rounded-full opacity-40 animate-pulse"
                style={{ animationDelay: '1s' }}
              ></div>
              <div
                className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-400 rounded-full opacity-70 animate-pulse"
                style={{ animationDelay: '1.5s' }}
              ></div>
              <div
                className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-orange-200 rounded-full opacity-50 animate-pulse"
                style={{ animationDelay: '2s' }}
              ></div>
              <div
                className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-rose-200 rounded-full opacity-60 animate-pulse"
                style={{ animationDelay: '2.5s' }}
              ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-8 py-12 text-center">
              {/* Main Title */}
              <div className="mb-6 sm:mb-8">
                <h1
                  className="text-5xl sm:text-6xl md:text-7xl italic text-amber-800 mb-4 tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Invitation
                </h1>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
                  </svg>
                  <div className="w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                </div>
              </div>

              {/* Host Name */}
              {eventData.hostName && (
                <div className="mb-4">
                  <p
                    className="text-2xl sm:text-3xl text-amber-800 font-medium"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {eventData.hostName}
                  </p>
                </div>
              )}

              {/* Invitation Text */}
              <div className="mb-8 sm:mb-10">
                <p
                  className="text-base sm:text-lg md:text-xl text-amber-900 tracking-widest uppercase font-light mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  You're Cordially Invited to
                </p>
                <p
                  className="text-lg sm:text-xl md:text-2xl text-amber-800 font-medium mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {eventData.eventName}
                </p>
                <p
                  className="text-base sm:text-lg md:text-xl text-amber-900 tracking-widest uppercase font-light"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Celebrate With Us
                </p>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
                <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 sm:space-y-5 text-amber-900">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="text-center">
                    <p
                      className="text-base sm:text-lg font-light tracking-wider"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {eventData.date}
                    </p>
                  </div>
                  <div className="w-px h-5 sm:h-6 bg-amber-400"></div>
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
                <div className="flex items-center justify-center gap-2 my-3 sm:my-4">
                  <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                  <svg className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
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
            <div className="absolute inset-3 sm:inset-4 border border-amber-300/30 rounded-lg pointer-events-none"></div>
          </div>
        </div>
      </div>
    </>
  );
}