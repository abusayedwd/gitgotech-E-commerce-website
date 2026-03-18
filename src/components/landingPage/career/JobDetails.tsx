"use client"

import { useState } from 'react';
import { MapPin, DollarSign, Briefcase, Calendar } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { TfiTimer } from 'react-icons/tfi';
import { RiTimeZoneLine } from 'react-icons/ri';

const App = () => {


    const searchParams = useSearchParams();
    const jobId = searchParams.get('id');
    console.log(jobId)
 
  const router = useRouter()

  const jobDetails = {
    id: 1,
    title: 'Store Manager – Fashion Outlet',
    location: 'Mohakhali 240, Dhaka',
    salary: '$500–$700 / month',
    type: 'On-Site',
    postedDate: 'Dec 15, 2025',
    deadline: 'Dec 20, 2025',
    company: 'Fashion Trends Ltd.',
    overview: 'We are seeking an experienced, motivated, and fashion-driven Store Manager to lead our retail team and oversee all daily store operations. The ideal candidate will be responsible for driving sales growth, maintaining high visual merchandising standards, ensuring exceptional customer service, and managing a dynamic team in a fast-paced fashion environment.',
    responsibilities: [
      'Store Operations & Management',
      'Sales & Customer Experience',
      'Team Leadership & Development',
      'Visual Merchandising',
      'Inventory & Loss Prevention'
    ],
    qualifications: [
      'Bachelor\'s degree in Business, Fashion Management, or related field (preferred)',
      'Minimum 2-4 years of retail management experience, ideally in fashion',
      'Strong leadership, communication, and organizational skills',
      'Passion for fashion trends, styling, and customer engagement',
      'Ability to work flexible hours, including weekends and holidays',
      'Proficiency in POS systems, inventory software, and basic MS Office tools'
    ]
  };

  const similarJobs = [
    {
      id: 2,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.'
    },
    {
      id: 3,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.'
    },
    {
      id: 4,
      title: 'Store Manager – Fashion Outlet',
      location: 'Mohakhali 240, Dhaka',
      salary: '$500–$700 / month',
      type: 'On-Site',
      description: 'Manage store operations, inventory, and staff. Experience in fashion retail is a plus.'
    }
  ];

  return (
    <div className="min-h-screen  bg-black text-white">
      {/* Job Banner */}
      <div className="relative mt-20 w-full h-[450px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/apply.png" 
            alt="Digital Marketing Ads" 
            className="w-full h-full object-cover"
          />
          
        </div>
        
        <div className="relative container mx-auto bottom-0 z-10 mt-28 flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{jobDetails.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {jobDetails.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={16} />
                  {jobDetails.salary}
                </span>
              </div>
              <h1 className='flex items-center gap-1'>
              <TfiTimer />  On-Site
              </h1>
            </div>
          </div>
          
          <button 
            onClick={() => router.push('/careers/apply-job')}
            className="px-12 py-3 bg-[#6100FF] cursor-pointer hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
       <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Back to job list</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 container mx-auto lg:grid-cols-3 gap-8">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-950 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 font-cormorant text-[32px]">Position Overview</h2>
              <p className="text-gray-300 leading-relaxed">{jobDetails.overview}</p>
            </div>

            <div className="bg-gray-950 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 font-cormorant text-[32px]">Key Responsibilities</h2>
              <ul className="space-y-2">
                {jobDetails.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-white rounded-full mt-2"></span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-950 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 font-cormorant text-[32px]">Qualifications & Requirements</h2>
              <ul className="space-y-2">
                {jobDetails.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-white rounded-full mt-2"></span>
                    <span>{qualification}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-950 rounded-xl p-6">
              <div className="  mb-4 font-cormorant ">
                <h2 className="text-xl font-bold text-[32px]">Salary</h2>
                <span className="text-lg font-semibold">{jobDetails.salary}</span>
              </div>
              <div className=" gap-4 text-sm font-cormorant">
                 <h2 className="text-xl font-bold text-[32px]">Application Deadline</h2>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Application Deadline: {jobDetails.deadline}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar - Similar Jobs */}
          <div className="space-y-6">
            <div className=" rounded-xl p-6">
              <h2 className="text-[32px] font-bold mb-4 font-cormorant">See Similar Jobs</h2>
              <div className="space-y-4">
                {similarJobs.map((job) => (
                  <div key={job.id} className="bg-[#17161A] border border-[#67676D] rounded-lg p-4">
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
                    <p className="text-sm text-gray-300 mb-3">{job.description}</p>
                    <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
 
    
    </div>
  );
};

export default App;
