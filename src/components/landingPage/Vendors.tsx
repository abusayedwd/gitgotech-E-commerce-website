
import { Search, Store } from 'lucide-react';

export default function VendorsPage() {

  const vendors = [
    {
      id: 1,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      description: "Passionate about creating stunning designs and transforming ideas into reality. Specializing in modern fashion with a touch of elegance."
    },
    {
      id: 2,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
      description: "Expert tailor with years of experience in crafting bespoke clothing. Dedicated to delivering quality and style in every piece."
    },
    {
      id: 3,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      description: "Innovative designer focusing on contemporary fashion trends. Creating unique pieces that blend tradition with modernity."
    },
    {
      id: 4,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
      description: "Master craftsman specializing in premium menswear and custom tailoring. Attention to detail in every stitch."
    },
    {
      id: 5,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
      description: "Creative designer with a passion for sustainable fashion. Bringing eco-friendly designs to life with style."
    },
    {
      id: 6,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&q=80",
      description: "Fashion innovator creating cutting-edge designs for the modern wardrobe. Excellence in every creation."
    },
    {
      id: 7,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&q=80",
      description: "Experienced tailor specializing in luxury garments and personalized service. Making dreams into reality."
    },
    {
      id: 8,
      name: "William Alex",
      image: "https://images.unsplash.com/photo-1504199367641-aba8151af406?w=400&q=80",
      description: "Designer focused on contemporary streetwear and urban fashion. Fresh perspectives on modern style."
    }
  ];

  return (
    <div className=" mt-16 md:mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black min-h-screen py-8 sm:py-10 md:py-12 px-2 sm:px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-2 sm:mb-3 md:mb-4">
            Meet our Vendors
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8">
            Discover Talented Designers creating worldwide Fashions
          </p>

          {/* Search Bar */}
          <div className="max-w-full sm:max-w-2xl mx-auto px-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Find your perfect tailor, design, or outfit"
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* All Vendors Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-white text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 px-2">All Vendors</h2>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden group hover:bg-gray-800 transition-all"
              >
                {/* Vendor Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Vendor Info */}
                <div className="p-3 sm:p-4 md:p-5">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                    {vendor.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-3 leading-relaxed">
                    {vendor.description}
                  </p>

                  {/* View Showroom Button */}
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm">
                    <Store className="w-3 sm:w-4 h-3 sm:h-4" />
                    View Showroom
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}