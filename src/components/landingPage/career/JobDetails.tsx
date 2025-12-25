import { useState } from 'react';
import { MapPin, DollarSign, Briefcase, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';

const JobDetails = () => {
  const [isApplying, setIsApplying] = useState(false);

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
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            Back to Jobs
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{jobDetails.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {jobDetails.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={16} />
                {jobDetails.salary}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={16} />
                {jobDetails.type}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsApplying(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Apply Now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Position Overview</h2>
            <p className="text-gray-300 leading-relaxed">{jobDetails.overview}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Key Responsibilities</h2>
            <ul className="space-y-2">
              {jobDetails.responsibilities.map((responsibility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Qualifications & Requirements</h2>
            <ul className="space-y-2">
              {jobDetails.qualifications.map((qualification, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  <span>{qualification}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Salary</h2>
              <span className="text-lg font-semibold">{jobDetails.salary}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Application Deadline: {jobDetails.deadline}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar - Similar Jobs */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">See Similar Jobs</h2>
            <div className="space-y-4">
              {similarJobs.map((job) => (
                <div key={job.id} className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} />
                      {job.salary}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{job.description}</p>
                  <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition-colors flex items-center justify-center gap-2">
                    View Details
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {isApplying && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Apply for {jobDetails.title}</h2>
            <p className="text-gray-300 mb-6">Please fill out the application form below to apply for this position.</p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Resume/CV</label>
                <input 
                  type="file" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-medium transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
