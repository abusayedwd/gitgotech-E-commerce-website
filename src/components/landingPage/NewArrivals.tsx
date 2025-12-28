import BackButton from "@/customComponent/BackButton";
import { Star } from "lucide-react";
import styles from "./../../customComponent/Discount.module.css"
export default function NewArrivals() {
  const products = [
    {
      id: 1,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
    {
      id: 2,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
    {
      id: 3,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
    {
      id: 4,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
    {
      id: 3,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
    {
      id: 4,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
    {
      id: 3,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
    {
      id: 4,
      name: "Men's Bomber Jacket",
      price: 28.0,
      rating: 4.5,
      reviews: 23,
      brand: "PRINCE OF JAIPUR",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
      discount: 40,
      tag: "BEST SELLER",
    },
  ];

  return (
    <div className="bg-black py-6 mt-44 sm:py-8 md:py-10 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row mt-6 sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h2 className="text-white text-xl flex gap-1.5 sm:text-2xl font-semibold mb-2 sm:mb-0">
            <BackButton /> New Arrivals
          </h2>
        </div>

        {/* <OfferBanner /> */}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#1B1B1F] rounded-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src="/images/jacket.png"
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Discount Badge */}
                            <div className="absolute top-2 left-0 inline-flex items-center">  
     <div className={styles.card}>
      <div className={styles.discountBadge}>10% off</div>
    </div> 
   </div> 
                {/* Best Seller Badge */}
               <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#2388FF] text-white px-2 sm:px-3 py-1 md:py-2 rounded text-[10px] sm:text-xs font-semibold">
                  {product.tag}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4">
                {/* Price */}
                <div className='flex items-center justify-between'>

                <div className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2">
                  ${product.price.toFixed(2)}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-1 sm:mb-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 sm:w-4 h-3 sm:h-4 ${
                        index < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-600 text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-[10px] sm:text-xs ml-1 sm:ml-2">
                    {product.reviews} Reviews
                  </span>
                </div>
                </div>

                {/* Product Name */}
                <h3 className="text-white font-medium text-sm sm:text-base mb-1 line-clamp-1">
                  {product.name}
                </h3>

                {/* Brand */}
                <p className="text-gray-400 text-xs sm:text-sm">
                  By {product.brand}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
