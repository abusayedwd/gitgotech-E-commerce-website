export default function ShowroomPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="text-purple-500">Showroom</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our portfolio of successful projects and innovative solutions tailored for businesses like yours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project Card 1 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all">
            <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-4xl">📱</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">E-Commerce Platform</h3>
              <p className="text-gray-400 mb-4">
                A complete e-commerce solution with modern UI/UX, payment integration, 
                and inventory management system.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                  React
                </span>
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  Node.js
                </span>
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  MongoDB
                </span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Project
              </button>
            </div>
          </div>

          {/* Project Card 2 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all">
            <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-4xl">🌐</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Corporate Website</h3>
              <p className="text-gray-400 mb-4">
                A responsive corporate website with CMS integration and SEO optimization 
                for improved online presence.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                  Next.js
                </span>
                <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  TypeScript
                </span>
                <span className="bg-pink-600/20 text-pink-400 px-3 py-1 rounded-full text-sm">
                  Tailwind
                </span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Project
              </button>
            </div>
          </div>

          {/* Project Card 3 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all">
            <div className="h-48 bg-gradient-to-r from-green-600 to-teal-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-4xl">💬</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Social Media App</h3>
              <p className="text-gray-400 mb-4">
                A real-time social media application with chat functionality, 
                user profiles, and content sharing.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                  React Native
                </span>
                <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                  Firebase
                </span>
                <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                  Redux
                </span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Project
              </button>
            </div>
          </div>

          {/* Project Card 4 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all">
            <div className="h-48 bg-gradient-to-r from-yellow-600 to-orange-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-4xl">📊</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-400 mb-4">
                A comprehensive analytics dashboard with real-time data visualization 
                and reporting capabilities.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                  React
                </span>
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  D3.js
                </span>
                <span className="bg-teal-600/20 text-teal-400 px-3 py-1 rounded-full text-sm">
                  Chart.js
                </span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Project
              </button>
            </div>
          </div>

          {/* Project Card 5 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all">
            <div className="h-48 bg-gradient-to-r from-pink-600 to-rose-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-4xl">💰</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Fintech Application</h3>
              <p className="text-gray-400 mb-4">
                A secure financial application with payment processing, 
                transaction tracking, and financial analytics.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                  Node.js
                </span>
                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  PostgreSQL
                </span>
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  Express
                </span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Project
              </button>
            </div>
          </div>

          {/* Project Card 6 */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all">
            <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-4xl">🎮</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Gaming Platform</h3>
              <p className="text-gray-400 mb-4">
                An interactive gaming platform with multiplayer capabilities, 
                user profiles, and in-game purchases.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                  Unity
                </span>
                <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                  C#
                </span>
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                  WebSockets
                </span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}