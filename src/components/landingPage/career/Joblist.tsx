"use client"

import { useState } from 'react';
import { Filter, MapPin, DollarSign, Briefcase, ChevronRight,ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RiTimeZoneLine } from 'react-icons/ri';

const Joblist = () => {
  const [selectedLocation, setSelectedLocation] = useState('Bangladesh');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
   const router = useRouter() 
  const [isLocationOpen, setIsLocationOpen] = useState(false);
 
  
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
    <div className="min-h-screen md:flex  container mx-auto bg-black text-white p-6">
      {/* Header Section */}
      <div className='md:w-[25%] w-full'>

     <header className="">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 rounded-full hover:bg-purple-700 transition-all duration-300 text-white font-medium shadow-lg hover:shadow-purple-500/50"
          >
            <Filter size={20} />
            Filter
          </button>
        </div>
        
        {/* Filter Panel */}
     
          <div className="md:w-full rounded-2xl shadow-2xl animate-slide-down">
            {/* Location Dropdown */}
            <div>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full flex items-center gap-4 text-white text-lg font-semibold mb-4 hover:text-purple-400 transition-colors"
              >
                <span>Select Location</span>
                {isLocationOpen ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              {/* Location List */}
              {isLocationOpen && (
                <div className="space-y-3 animate-fade-in">
                  {locations.map((location) => (
                    <label
                      key={location}
                      htmlFor={`location-${location}`}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      {/* Custom Radio Button */}
                      <div className="relative">
                        <input
                          type="radio"
                          id={`location-${location}`}
                          name="location"
                          value={location}
                          checked={selectedLocation === location}
                          onChange={() => setSelectedLocation(location)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                          selectedLocation === location 
                            ? 'border-purple-600 bg-purple-600' 
                            : 'border-gray-600 bg-transparent group-hover:border-purple-400'
                        }`}>
                          {selectedLocation === location && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Location Name */}
                      <span className={`transition-colors duration-300 ${
                        selectedLocation === location 
                          ? 'text-white font-medium' 
                          : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {location}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
      
      </header>
      </div>
 

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobListings.map((job) => (
          // border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-[#6100FF]
          <div 
            key={job.id}  
            className="bg-gray-900 rounded-xl p-6 border border-gray-700
            hover:shadow-[0_0_12px_rgba(34,211,238,0.35)] hover:border-blue-500/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[24px] font-bold mb-2 font-cormorant">{job.title}</h3>
                <div className="  text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1 mb-3">
                    <MapPin className='text-white' size={26} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className='text-white' size={26} />
                    {job.salary}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <RiTimeZoneLine className='text-white' size={26} />
                  {job.type}
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">{job.description}</p>
            
            <button 
            onClick={() => router.push("/careers/job-details")}
            className="w-full py-3 px-4 cursor-pointer font-poppins bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group">
              View Details
              {/* <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /> */}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Joblist;
