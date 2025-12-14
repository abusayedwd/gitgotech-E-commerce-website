import React, { useState } from 'react';
import { Search } from 'lucide-react';

const FashionSearchNav = () => {
  const [activeTab, setActiveTab] = useState('Women');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { name: 'Women', color: 'bg-blue-500' },
    { name: 'Men', color: 'bg-gray-700' },
    { name: 'Shoes', color: 'bg-gray-700' },
    { name: 'Kids', color: 'bg-gray-700' },
    { name: 'Seasonal Wear', color: 'bg-gray-700' },
    { name: 'Jewelry & Accessories', color: 'bg-gray-700' },
    { name: 'Home & Living', color: 'bg-gray-700' },
    { name: 'Beauty & Health', color: 'bg-gray-700' },
    { name: 'Curve', color: 'bg-gray-700' }
  ];

  return (
    <div className="w-full bg-black flex items-center container mx-auto text-white">
      {/* Search Bar Section */}
      <div className="flex items-center  justify-center gap-4 px-6 py-6">
        <div className="flex-1 max-w-4xl flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find your perfect tailor, design, or outfit."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Search Button */}
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
            Search
          </button>
        </div>
 
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 px-6 pb-4  ">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`${
              activeTab === tab.name ? tab.color : 'bg-gray-800'
            } px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap hover:opacity-90 transition-all`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FashionSearchNav;