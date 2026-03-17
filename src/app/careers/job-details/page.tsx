"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, DollarSign, Briefcase, ArrowLeft } from 'lucide-react';
import { RiTimeZoneLine } from 'react-icons/ri';
import { useGetCareerDetailsQuery, useApplyCareerMutation } from '@/redux/features/career/careerSlice';
import toast from 'react-hot-toast';

export default function JobDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');

  const { data: jobDetailsData, isLoading } = useGetCareerDetailsQuery(jobId || '', {
    skip: !jobId,
  });

  const [applyCareer, { isLoading: isApplying }] = useApplyCareerMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null as File | null,
  });

  const [showApplyForm, setShowApplyForm] = useState(false);

  const job = jobDetailsData?.data;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.resume) {
      toast.error('Please fill in all required fields');
      return;
    }

    const applyData = new FormData();
    applyData.append('name', formData.name);
    applyData.append('email', formData.email);
    applyData.append('phone', formData.phone);
    applyData.append('coverLetter', formData.coverLetter);
    if (formData.resume) {
      applyData.append('resume', formData.resume);
    }

    try {
      await applyCareer({ id: jobId, formData: applyData }).unwrap();
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
      setFormData({ name: '', email: '', phone: '', coverLetter: '', resume: null });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit application');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Job not found</p>
          <button
            onClick={() => router.push('/careers')}
            className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Jobs
        </button>

        {/* Job Details Card */}
        <div className="bg-gradient-to-br from-gray-800/40 to-purple-900/20 border-2 border-blue-500/50 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-cormorant">{job.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <MapPin className="text-purple-400" size={20} />
                {job.country} {job.address && `- ${job.address}`}
              </span>
              <span className="flex items-center gap-2">
                <DollarSign className="text-purple-400" size={20} />
                {job.salary}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase className="text-purple-400" size={20} />
                {job.jobType}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Job Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Location</h3>
              <p className="text-white">{job.country}</p>
              {job.address && <p className="text-gray-400 text-sm">{job.address}</p>}
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Salary Range</h3>
              <p className="text-white">{job.salary}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Job Type</h3>
              <p className="text-white capitalize">{job.jobType}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Posted</h3>
              <p className="text-white">
                {new Date(job.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Apply Button */}
          {!showApplyForm ? (
            <button
              onClick={() => setShowApplyForm(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Apply Now
            </button>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Application Form</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Resume/CV *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Cover Letter</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Tell us why you're a great fit for this position..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-gray-500 resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isApplying}
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
