"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, DollarSign, Briefcase, ArrowLeft, ChevronRight } from 'lucide-react';
import { RiTimeZoneLine } from 'react-icons/ri';
import { useGetCareerDetailsQuery, useGetCareersQuery, useApplyCareerMutation } from '@/redux/features/career/careerSlice';
import toast from 'react-hot-toast';

export default function JobDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');

  const { data: jobDetailsData, isLoading } = useGetCareerDetailsQuery(jobId || '', {
    skip: !jobId,
  });

  const { data: allJobsData } = useGetCareersQuery({ page: 1, limit: 10 });
  const similarJobs = (allJobsData?.data || []).filter((j: any) => j._id !== jobId).slice(0, 3);

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
    if (formData.resume) applyData.append('resume', formData.resume);
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
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-400">Loading job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Job not found</p>
          <button onClick={() => router.push('/careers')} className="mt-4 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Hero Banner ── */}
      <div className="relative w-full h-52 md:h-64 overflow-hidden">
        {/* Blue-toned background image overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900" />
        {/* Decorative overlay pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 60%),
                              radial-gradient(circle at 80% 30%, rgba(59,130,246,0.3) 0%, transparent 50%)`
          }}
        />
        {/* Job title overlay at bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 py-5 flex items-end justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-white" />
                {job.country}{job.address ? ` ${job.address}` : ''}
              </span>
              <span className="flex items-center gap-1.5 bg-blue-700/60 px-2 py-0.5 rounded text-xs">
                <RiTimeZoneLine size={14} />
                {job.jobType}
              </span>
            </div>
          </div>
          {/* Apply Now button — top right in hero */}
          {!showApplyForm && (
            <button
              onClick={() => setShowApplyForm(true)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </button>

        <div className="flex flex-col md:flex-row gap-8">

          {/* ── Left: Job Description ── */}
          <div className="flex-1 min-w-0">

            {!showApplyForm ? (
              <>
                {/* Position Overview */}
                <Section title="Position Overview">
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </Section>

                {/* Key Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <Section title="Key Responsibilities">
                    <ul className="space-y-1.5">
                      {job.responsibilities.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {/* Qualifications */}
                {job.qualifications && job.qualifications.length > 0 && (
                  <Section title="Qualifications & Requirements">
                    <ul className="space-y-1.5">
                      {job.qualifications.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {/* Salary */}
                <Section title="Salary">
                  <p className="text-gray-400 text-sm">{job.salary}</p>
                </Section>

                {/* Application Deadline */}
                {job.deadline && (
                  <Section title="Application Deadline">
                    <p className="text-gray-400 text-sm">
                      {new Date(job.deadline).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </Section>
                )}
              </>
            ) : (
              /* ── Application Form ── */
              <div>
                <h2 className="text-xl font-semibold mb-6 text-white">Application Form</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full Name *">
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                        placeholder="John Doe" required className={inputCls} />
                    </Field>
                    <Field label="Email Address *">
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        placeholder="john@example.com" required className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Phone Number *">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      placeholder="+1 234 567 8900" required className={inputCls} />
                  </Field>
                  <Field label="Resume/CV *">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange}
                      required className={inputCls} />
                    <p className="text-xs text-gray-500 mt-1">Accepted: PDF, DOC, DOCX</p>
                  </Field>
                  <Field label="Cover Letter">
                    <textarea name="coverLetter" value={formData.coverLetter} onChange={handleInputChange}
                      placeholder="Tell us why you're a great fit..." rows={4}
                      className={`${inputCls} resize-none`} />
                  </Field>
                  <div className="flex gap-4 pt-2">
                    <button type="submit" disabled={isApplying}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {isApplying
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
                        : 'Submit Application'}
                    </button>
                    <button type="button" onClick={() => setShowApplyForm(false)}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── Right: See Similar Jobs ── */}
          <aside className="w-full md:w-72 shrink-0">
            <h2 className="text-base font-semibold text-white mb-4">See Similar Jobs</h2>
            <div className="space-y-4">
              {similarJobs.length === 0 ? (
                <p className="text-gray-500 text-sm">No similar jobs found.</p>
              ) : (
                similarJobs.map((sj: any) => (
                  <div key={sj._id}
                    className="bg-[#111111] border border-gray-800 rounded-xl p-4 hover:border-purple-500/40 transition-all duration-300">
                    <h3 className="text-sm font-semibold text-white mb-2 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                      {sj.title}
                    </h3>
                    <div className="space-y-1 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-white" />
                        {sj.country}{sj.address ? ` ${sj.address}` : ''}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={12} className="text-white" />
                        {sj.salary}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RiTimeZoneLine size={12} className="text-white" />
                        {sj.jobType}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{sj.description}</p>
                    <button
                      onClick={() => router.push(`/careers/job-details?id=${sj._id}`)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
                      View Details
                      <ChevronRight size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */
const inputCls =
  "w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-7">
    <h2 className="text-base font-semibold text-black dark:text-white mb-3"
      style={{ color: '#fff' }}>{title}</h2>
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
    {children}
  </div>
);