"use client";
import { useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddShowroom() {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [hours, setHours] = useState({
    Monday: '',
    Tuesday: '',
    Wednesday: '',
    Thursday: '',
    Friday: '',
    Saturday: '',
    Sunday: '',
  });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    country: '',
    city: '',
    location: '',
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        setLogoPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHourChange = (day: string, value: string) => {
    setHours((prev) => ({ ...prev, [day]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      logo: logoPreview,
      information: formData,
      hours,
    };
    console.log('New Showroom Data:', payload);
    // Here you'd normally call your API
    alert('Showroom created! (Check console)');
    router.push('/showrooms'); // or wherever you list showrooms
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl flex items-center gap-2 mx-auto mt-8 md:mt-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer text-purple-400 hover:text-purple-300"
        >
          <div className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
         
        </button>

        <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Add New Showroom</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-6 space-y-8">
        {/* Logo Upload */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Business Logo</h2>
          <div className="flex flex-col items-center">
            {logoPreview ? (
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-2 border-purple-500/50">
                  <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setLogoPreview(null)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-purple-500/50 rounded-full cursor-pointer bg-gray-900/50 hover:bg-gray-800/50 transition">
                <Upload className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-xs text-gray-400">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Showroom Information */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-300 mb-6">Showroom Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Showroom Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Luxurias Showroom"
              required
            />
            <InputField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Cloth Shop"
              required
            />
            <InputField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="e.g., USA"
              required
            />
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g., Los Angeles"
              required
            />
            <div className="md:col-span-2">
              <InputField
                label="Location (Address)"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., 123 Fashion St, Gulshan 2"
                required
              />
            </div>
          </div>
        </div>

        {/* Showroom Hours */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-300">Operating Hours</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(hours).map(([day, value]) => (
              <div key={day} className="flex items-center justify-between gap-4">
                <span className="text-white font-medium w-24">{day}</span>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleHourChange(day, e.target.value)}
                    placeholder="e.g., 9:00AM - 6:00PM or Closed"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" />
            Create Showroom
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, name, value, onChange, placeholder, required = false }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}