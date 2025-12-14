
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
    <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-white text-4xl md:text-5xl font-serif mb-4">
            Meet our Vendors
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Discover Talented Designers creating worldwide Fashions
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Find your perfect tailor, design, or outfit"
                  className="w-full bg-gray-800 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* All Vendors Section */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-semibold mb-6">All Vendors</h2>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden group hover:bg-gray-800 transition-all"
              >
                {/* Vendor Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Vendor Info */}
                <div className="p-5">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {vendor.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {vendor.description}
                  </p>

                  {/* View Showroom Button */}
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Store className="w-4 h-4" />
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