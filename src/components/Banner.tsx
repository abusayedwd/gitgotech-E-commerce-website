"useq client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "SleekKnit",
      heading: "Where Global Fashion Meets Modern Luxury.",
      description: "Shop premium designs or create your own — connect directly with expert tailors from around the world, all in one elegant platform."
    },
    {
      title: "TechStyle",
      heading: "Innovation Meets Fashion Excellence.",
      description: "Discover cutting-edge designs and premium craftsmanship from world-class designers."
    },
    {
      title: "ElegantWear",
      heading: "Timeless Style, Modern Approach.",
      description: "Experience luxury fashion with personalized service and unmatched quality."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Top Vendors - Left */}
          <div className="lg:col-span-3 relative overflow-hidden rounded-xl group cursor-pointer h-64 lg:h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white text-2xl font-bold">Top Vendors</h3>
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Slider */}
            <div className="relative overflow-hidden rounded-xl h-80 lg:h-96">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-pink-900/90" />
              
              {/* Slider Content */}
              <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
                <h4 className="text-purple-300 text-sm font-semibold mb-2 tracking-wider">
                  {slides[currentSlide].title}
                </h4>
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl leading-tight">
                  {slides[currentSlide].heading}
                </h2>
                <p className="text-gray-200 text-sm md:text-base max-w-xl mb-6">
                  {slides[currentSlide].description}
                </p>

                {/* Navigation Arrows */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <button 
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <button 
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex space-x-2 mt-4">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-white w-8' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Two Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Products */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer h-40">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80')"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-pink-800/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">Top Products</h3>
                </div>
              </div>

              {/* New Arrivals */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer h-40">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80')"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-800/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">New Arrivals</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Hot Deals - Right */}
          <div className="lg:col-span-3 relative overflow-hidden rounded-xl group cursor-pointer h-64 lg:h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white text-2xl font-bold">Hot Deals</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}