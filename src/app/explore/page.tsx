export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Explore Our <span className="text-purple-500">Services</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover innovative solutions that can transform your business and digital presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
              <span className="text-purple-500 text-2xl">💻</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Web Development</h3>
            <p className="text-gray-400 mb-6">
              Cutting-edge websites designed to attract, engage, and convert your audience with 
              exceptional performance and user experience.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {/* Service Card 2 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
              <span className="text-blue-500 text-2xl">📱</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">App Development</h3>
            <p className="text-gray-400 mb-6">
              Native and cross-platform mobile applications that deliver exceptional user experiences 
              and drive business growth.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {/* Service Card 3 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <span className="text-green-500 text-2xl">🎨</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">UI/UX Design</h3>
            <p className="text-gray-400 mb-6">
              Intuitive and engaging designs that create meaningful connections with your users 
              and elevate your brand identity.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {/* Service Card 4 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
              <span className="text-yellow-500 text-2xl">☁️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Cloud Solutions</h3>
            <p className="text-gray-400 mb-6">
              Scalable cloud infrastructure and services to power your digital transformation 
              and ensure reliability and security.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {/* Service Card 5 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-6">
              <span className="text-pink-500 text-2xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Security</h3>
            <p className="text-gray-400 mb-6">
              Comprehensive security solutions to protect your digital assets and ensure 
              compliance with industry standards.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {/* Service Card 6 */}
          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-purple-500 transition-all">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
              <span className="text-indigo-500 text-2xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Integration</h3>
            <p className="text-gray-400 mb-6">
              Intelligent solutions powered by artificial intelligence to automate processes, 
              gain insights, and enhance user experiences.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}