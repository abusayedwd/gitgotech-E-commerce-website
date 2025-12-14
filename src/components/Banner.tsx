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
    <div className="bg-black py-4 px-4 h-44 lg:h-52">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Top Vendors & Top Products */}
          <div className="lg:col-span-3 h-48 lg:h-64">
            {/* Top Vendors */}
            <div className="relative overflow-hidden rounded-lg group cursor-pointer h-24 lg:h-32">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: "url('/images/vendor.png')"
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#6100FF] w-full to-[#01010100] px-4 py-2 rounded">
                <h3 className="text-white text-lg font-semibold">Top Vendors</h3>
              </div>
            </div>

            {/* Top Products */}
            <div className="relative overflow-hidden rounded-lg group cursor-pointer h-24 lg:h-32 mt-4">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80')"
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#6100FF] w-full px-4 py-2 rounded">
                <h3 className="text-white text-lg font-semibold">Top Products</h3>
              </div>
            </div>
          </div>

          {/* Center Slider */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden  rounded-lg h-48 lg:h-68">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage: "url('/images/bgbanner.png')",
                  
                   
                }}
              />
              <div className="absolute inset-0" />
              
              {/* Slider Content */}
              <div className="relative h-full flex flex-col items-center justify-center px-8 lg:px-12 text-center">
                <h4 className="text-purple-300 text-[22px] font-medium mb-3 tracking-wide">
                  {slides[currentSlide].title}
                </h4>
                <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-serif font-normal mb-4 max-w-2xl leading-tight">
                  {slides[currentSlide].heading}
                </h2>
                <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed">
                  {slides[currentSlide].description}
                </p>

                {/* Navigation Arrows */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all ${
                        index === currentSlide 
                          ? 'w-6 h-1.5 bg-white rounded-full' 
                          : 'w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hot Deals & New Arrivals */}
          <div className="lg:col-span-3 space-y-4">
            {/* Hot Deals */}
            <div className="relative overflow-hidden rounded-lg group cursor-pointer h-24 lg:h-32">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80')"
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#6100FF] w-full px-4 py-2 rounded">
                <h3 className="text-white text-lg font-semibold">Hot Deals</h3>
              </div>
            </div>

            {/* New Arrivals */}
            <div className="relative overflow-hidden rounded-lg group cursor-pointer h-24 lg:h-32">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80')"
                }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#6100FF] w-full px-4 py-2 rounded">
                <h3 className="text-white text-lg font-semibold">New Arrivals</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}