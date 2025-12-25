import { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://placehold.co/1200x400/2563eb/ffffff?text=Career+Banner" 
          alt="Professional team handshake" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Build Your Future With Us
        </h1>
        <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">
          Discover new opportunities and apply for roles that match your talent
        </p>
        
        {/* Search Bar */}
        <div className="flex w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center pl-3">
            <Search size={20} className="text-white/70" />
          </div>
          <input
            type="text"
            placeholder="Find your perfect job"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white px-3 py-2 focus:outline-none"
          />
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md font-medium transition-colors">
            Search
          </button>
        </div>
      </div>
      
      {/* Decorative Element */}
      <div className="absolute top-4 right-4">
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
          <UserCheck size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default App;
