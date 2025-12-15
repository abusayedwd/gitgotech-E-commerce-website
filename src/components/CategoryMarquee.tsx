export default function CategoryMarquee() {
  const categories = [
    {
      name: 'Women',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80'
    },
    {
      name: 'Men',
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&q=80'
    },
    {
      name: 'Shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'
    },
    {
      name: 'Kids',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&q=80'
    },
    {
      name: 'Fall & Winter',
      image: 'https://images.unsplash.com/photo-1544957992-20514f595d6f?w=400&q=80'
    },
    {
      name: 'Ceremony Formal',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80'
    },
    {
      name: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=80'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=80'
    }
  ];

  // Duplicate categories for seamless loop
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="py-8 sm:py-10 md:py-12 mt-4 sm:mt-6 md:mt-8 overflow-hidden">
      <div className="container mx-auto w-full sm:w-[90%] md:w-[80%] px-4">
        {/* Marquee Container */}
        <div className="flex container mx-auto animate-marquee hover:pause">
          {duplicatedCategories.map((category, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-2 sm:mx-3 md:mx-4 group cursor-pointer"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
              <p className="text-white text-center mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-medium">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}