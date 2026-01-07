"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, Trash2, Plus, Mail, Phone, Globe } from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function JobApplicationForm() {
  // State management
  const router = useRouter()
  const [openSections, setOpenSections] = useState({
    personal: true,
    work: false,
    education: false,
    certifications: false,
    skills: false,
    language: false,
    references: false
  });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    cvFile: null as File | null,
    tellUs: ''
  });

  const [workExperiences, setWorkExperiences] = useState([{
    id: 1, jobTitle: '', company: '', companyPhone: '', location: '',
    currentlyWorking: false, startDate: '', endDate: '', roleDescription: ''
  }]);

  const [educations, setEducations] = useState([{
    id: 1, degree: '', institution: '', graduationYear: '', gpa: ''
  }]);

  const [certifications, setCertifications] = useState([{
    id: 1, certName: '', issuingOrg: '', certDate: ''
  }]);

  const [skills, setSkills] = useState([{
    id: 1, skill: '', proficiency: ''
  }]);

  const [languages, setLanguages] = useState([{
    id: 1, language: '', proficiency: ''
  }]);

  const [references, setReferences] = useState([{
    id: 1, refName: '', refRelation: '', refEmail: '', refPhone: ''
  }]);

  // Handler functions
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) setFormData(prev => ({ ...prev, cvFile: file }));
    }
  };

  // Work Experience handlers
  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      id: Date.now(), jobTitle: '', company: '', companyPhone: '', location: '',
      currentlyWorking: false, startDate: '', endDate: '', roleDescription: ''
    }]);
  };

  const removeWorkExperience = (id: number) => {
    if (workExperiences.length > 1) {
      setWorkExperiences(workExperiences.filter(exp => exp.id !== id));
    }
  };

  const updateWorkExperience = (id: number, field: string, value: string | boolean) => {
    setWorkExperiences(workExperiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Education handlers
  const addEducation = () => {
    setEducations([...educations, {
      id: Date.now(), degree: '', institution: '', graduationYear: '', gpa: ''
    }]);
  };

  const removeEducation = (id: number) => {
    if (educations.length > 1) {
      setEducations(educations.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: number, field: string, value: string) => {
    setEducations(educations.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  // Certification handlers
  const addCertification = () => {
    setCertifications([...certifications, {
      id: Date.now(), certName: '', issuingOrg: '', certDate: ''
    }]);
  };

  const removeCertification = (id: number) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter(cert => cert.id !== id));
    }
  };

  const updateCertification = (id: number, field: string, value: string) => {
    setCertifications(certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  // Skill handlers
  const addSkill = () => {
    setSkills([...skills, { id: Date.now(), skill: '', proficiency: '' }]);
  };

  const removeSkill = (id: number) => {
    if (skills.length > 1) {
      setSkills(skills.filter(skill => skill.id !== id));
    }
  };

  const updateSkill = (id: number, field: string, value: string) => {
    setSkills(skills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  // Language handlers
  const addLanguage = () => {
    setLanguages([...languages, { id: Date.now(), language: '', proficiency: '' }]);
  };

  const removeLanguage = (id: number) => {
    if (languages.length > 1) {
      setLanguages(languages.filter(lang => lang.id !== id));
    }
  };

  const updateLanguage = (id: number, field: string, value: string) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  // Reference handlers
  const addReference = () => {
    setReferences([...references, {
      id: Date.now(), refName: '', refRelation: '', refEmail: '', refPhone: ''
    }]);
  };

  const removeReference = (id: number) => {
    if (references.length > 1) {
      setReferences(references.filter(ref => ref.id !== id));
    }
  };

  const updateReference = (id: number, field: string, value: string) => {
    setReferences(references.map(ref =>
      ref.id === id ? { ...ref, [field]: value } : ref
    ));
  };

  const handleSubmit = () => {
    const applicationData = {
      personal: formData,
      workExperiences,
      educations,
      certifications,
      skills,
      languages,
      references
    };
    console.log('Application submitted:', applicationData);
    alert('Application submitted successfully!');
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-r from-black via-[#050218] to-black p-4 md:p-8">
      <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black'/>
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Application Form</h1>
        </div>
      <div className="max-w-3xl mx-auto">
        {/* Header */}

   
        <div className="text-center mb-2">
            <div className='flex justify-center'> 
            <img 
             className='h-44 w-44'
            src="/images/logo.png" alt="" />
            </div>
          <h1 className="text-4xl font-bold font-cormorant text-white mb-2">Submit Your Application</h1>
          <p className="text-gray-400">Provide your important details to complete your job application.</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className=" rounded-xl p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('personal')}
            >
              <h2 className="text-xl font-semibold text-white">Personal Info</h2>
              {openSections.personal ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            
            {openSections.personal && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#242428] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type here"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-[#242428] border border-gray-600 rounded-l-lg px-3">
                      <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-5 h-5" />
                      <span className="text-gray-300">+1</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 bg-[#242428] border border-gray-600 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter Your Phone No."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#242428] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type here"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload Your CV/Resume *</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Drag & drop your file or click to browse</p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm font-medium cursor-pointer transition-colors"
                    >
                      Browse File
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tell us why you want to join our team *</label>
                  <textarea
                    name="tellUs"
                    value={formData.tellUs}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#242428] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type here"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className=" border-2 rounded-xl p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('work')}
            >
              <h2 className="text-xl font-semibold text-white">Work Experience</h2>
              {openSections.work ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            
            {openSections.work && (
              <div className="mt-6 space-y-6">
                {workExperiences.map((exp, index) => (
                  <div key={exp.id} className=" rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">Work Experience {index + 1}</h3>
                      {workExperiences.length > 1 && (
                        <button
                          onClick={() => removeWorkExperience(exp.id)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateWorkExperience(exp.id, 'jobTitle', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company's Phone</label>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 bg-gray-600 border border-gray-500 rounded-l-lg px-3">
                            <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-5 h-5" />
                            <span className="text-gray-300">+1</span>
                          </div>
                          <input
                            type="tel"
                            value={exp.companyPhone}
                            onChange={(e) => updateWorkExperience(exp.id, 'companyPhone', e.target.value)}
                            className="flex-1 px-4 py-3 bg-[#242428] border border-gray-500 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter Your Phone No."
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateWorkExperience(exp.id, 'location', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.currentlyWorking}
                            onChange={(e) => updateWorkExperience(exp.id, 'currentlyWorking', e.target.checked)}
                            className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-2 focus:ring-purple-500"
                          />
                          <span className="text-gray-300">I am Currently Working here</span>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                            className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                            className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={exp.currentlyWorking}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Role Description</label>
                        <textarea
                          value={exp.roleDescription}
                          onChange={(e) => updateWorkExperience(exp.id, 'roleDescription', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addWorkExperience}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Add another
                </button>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className=" border rounded-xl p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('education')}
            >
              <h2 className="text-xl font-semibold text-white">Education</h2>
              {openSections.education ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            
            {openSections.education && (
              <div className="mt-6 space-y-6">
                {educations.map((edu, index) => (
                  <div key={edu.id} className=" rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">Education {index + 1}</h3>
                      {educations.length > 1 && (
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Degree *</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Institution *</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Year *</label>
                          <input
                            type="text"
                            value={edu.graduationYear}
                            onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                            className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="YYYY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">GPA</label>
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="e.g. 3.5/4.0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Add another
                </button>
              </div>
            )}
          </div>

          {/* Certifications Section */}
          <div className=" border rounded-xl p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('certifications')}
            >
              <h2 className="text-xl font-semibold text-white">Certifications</h2>
              {openSections.certifications ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            
            {openSections.certifications && (
              <div className="mt-6 space-y-6">
                {certifications.map((cert, index) => (
                  <div key={cert.id} className=" rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">Certification {index + 1}</h3>
                      {certifications.length > 1 && (
                        <button
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Certification Name *</label>
                        <input
                          type="text"
                          value={cert.certName}
                          onChange={(e) => updateCertification(cert.id, 'certName', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Issuing Organization *</label>
                        <input
                          type="text"
                          value={cert.issuingOrg}
                          onChange={(e) => updateCertification(cert.id, 'issuingOrg', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Certification Date *</label>
                        <input
                          type="date"
                          value={cert.certDate}
                          onChange={(e) => updateCertification(cert.id, 'certDate', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addCertification}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Add another
                </button>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className=" border rounded-xl p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('skills')}
            >
              <h2 className="text-xl font-semibold text-white">Skills</h2>
              {openSections.skills ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            
            {openSections.skills && (
              <div className="mt-6 space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.id} className=" rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">Skill {index + 1}</h3>
                      {skills.length > 1 && (
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Skill *</label>
                        <input
                          type="text"
                          value={skill.skill}
                          onChange={(e) => updateSkill(skill.id, 'skill', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Proficiency *</label>
                        <select
                          value={skill.proficiency}
                          onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select proficiency</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addSkill}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Add another
                </button>
              </div>
            )}
          </div>

          {/* Languages Section */}
          <div className="border rounded-xl p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('language')}
            >
              <h2 className="text-xl font-semibold text-white">Languages</h2>
              {openSections.language ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            
            {openSections.language && (
              <div className="mt-6 space-y-6">
                {languages.map((lang, index) => (
                  <div key={lang.id} className=" rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">Language {index + 1}</h3>
                      {languages.length > 1 && (
                        <button
                          onClick={() => removeLanguage(lang.id)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Language *</label>
                        <input
                          type="text"
                          value={lang.language}
                          onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Proficiency *</label>
                        <select
                          value={lang.proficiency}
                          onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select proficiency</option>
                          <option value="Basic">Basic</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native">Native</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addLanguage}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Add another
                </button>
              </div>
            )}
          </div>

          {/* References Section */}
          <div className=" border rounded-xl p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('references')}
            >
              <h2 className="text-xl font-semibold text-white">References</h2>
              {openSections.references ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
            
            {openSections.references && (
              <div className="mt-6 space-y-6">
                {references.map((ref, index) => (
                  <div key={ref.id} className=" rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-white">Reference {index + 1}</h3>
                      {references.length > 1 && (
                        <button
                          onClick={() => removeReference(ref.id)}
                          className="text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Reference Name *</label>
                        <input
                          type="text"
                          value={ref.refName}
                          onChange={(e) => updateReference(ref.id, 'refName', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type here"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Relationship to You *</label>
                        <input
                          type="text"
                          value={ref.refRelation}
                          onChange={(e) => updateReference(ref.id, 'refRelation', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g. Manager, Colleague"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={ref.refEmail}
                          onChange={(e) => updateReference(ref.id, 'refEmail', e.target.value)}
                          className="w-full px-4 py-3 bg-[#242428] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter email address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 bg-[#242428] border border-gray-500 rounded-l-lg px-3">
                            <img src="https://flagcdn.com/w20/us.png" alt="US Flag" className="w-5 h-5" />
                            <span className="text-gray-300">+1</span>
                          </div>
                          <input
                            type="tel"
                            value={ref.refPhone}
                            onChange={(e) => updateReference(ref.id, 'refPhone', e.target.value)}
                            className="flex-1 px-4 py-3 bg-[#242428] border border-gray-500 rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter Your Phone No."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addReference}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Add another
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 cursor-pointer bg-[#6100FF] rounded-lg text-white font-medium text-lg transition-colors"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
