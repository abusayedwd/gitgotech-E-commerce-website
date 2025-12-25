"use client"

import { useState } from 'react';
import { Filter, MapPin, DollarSign, Briefcase, ChevronRight } from 'lucide-react';

const Joblist = () => {
  const [selectedLocation, setSelectedLocation] = useState('Bangladesh');
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const locations = ['Brazil', 'Bangladesh', 'Cooking', 'India', 'Pakistan', 'Qatar', 'USA'];

  const jobListings = [
    {
      id: 1,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.',
      company: 'Fashion Trends Ltd.'
    },
    {
      id: 2,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.',
      company: 'Fashion Trends Ltd.'
    },
    {
      id: 3,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.',
      company: 'Fashion Trends Ltd.'
    },
    {
      id: 4,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.',
      company: 'Fashion Trends Ltd.'
    },
    {
      id: 5,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.',
      company: 'Fashion Trends Ltd.'
    },
    {
      id: 6,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.',
      company: 'Fashion Trends Ltd.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
          >
            <Filter size={20} />
            Filter
          </button>
        </div>
        
        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-gray-900 w-[20%] p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Location</h2>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={location} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`location-${location}`}
                    name="location"
                    value={location}
                    checked={selectedLocation === location}
                    onChange={() => setSelectedLocation(location)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                  <label htmlFor={`location-${location}`} className="cursor-pointer">
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {jobListings.map((job) => (
          <div 
            key={job.id} 
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-purple-500 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={16} />
                    {job.salary}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Briefcase size={16} />
                  {job.type}
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">{job.description}</p>
            
            <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group">
              View Details
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Joblist;
