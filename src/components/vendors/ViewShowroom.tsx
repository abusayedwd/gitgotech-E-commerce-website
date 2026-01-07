// "use client"
// import { useState } from 'react';
// import { Edit, Upload, ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function ViewShowroomPage() {
//     const router = useRouter();
//   const [showroomData, setShowroomData] = useState({
//     logo: 'https://images.unsplash.com/photo-1558403194-611308249627?w=200&h=200&fit=crop',
//     information: {
//       name: 'zAlexJames512',
//       category: 'Cloth Shop',
//       country: 'USA',
//       city: 'Los Angeles',
//       location: 'Los Angeles'
//     },
//     hours: {
//       Friday: '9:00AM - 6:00PM',
//       Saturday: '9:00AM - 6:00PM',
//       Sunday: 'Closed',
//       Monday: '9:00AM - 6:00PM',
//       Tuesday: '9:00AM - 6:00PM',
//       Wednesday: '9:00AM - 6:00PM',
//       Thursday: '9:00AM - 6:00PM'
//     }
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
//       {/* Back Button */}
  

//       {/* Header */}
//       <div className="max-w-4xl mx-auto mt-16 md:mt-24 mb-2.5 md:mb-8">
//        <div className="container mx-auto mt-4 flex items-center gap-4">
//              <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
//           <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </div>
//         </button>
//           <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Showroom Details</h1>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Business Logo Section */}
//         <div className=" text-center">
//           <h2 className="text-lg font-semibold mb-4 text-gray-300">Business Logo</h2>
          
//           {/* Logo Display */}
//           <div className="flex justify-center mb-4">
//             <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-2 border-purple-500/30">
//               <img 
//                 src={showroomData.logo}
//                 alt="Business Logo"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* Upload Button */}
//           <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105">
//             <Upload className="w-4 h-4" />
//             Upload
//           </button>
//         </div>

//         {/* Showroom's Information Section */}
//         <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-300">Showroom's Information</h2>
//             <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-all duration-300">
//               <Edit className="w-4 h-4" />
//               Edit
//             </button>
//           </div>

//           {/* Information Grid */}
//           <div className="space-y-4">
//             <InfoRow label="Showroom name" value={showroomData.information.name} />
//             <InfoRow label="Category" value={showroomData.information.category} />
//             <InfoRow label="Country" value={showroomData.information.country} />
//             <InfoRow label="City" value={showroomData.information.city} />
//             <InfoRow label="Location" value={showroomData.information.location} />
//           </div>
//         </div>

//         {/* Showroom Hour Section */}
//         <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-300">Showroom Hour</h2>
//             <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-all duration-300">
//               <Edit className="w-4 h-4" />
//               Edit
//             </button>
//           </div>

//           {/* Hours Grid */}
//           <div className="space-y-4">
//             {Object.entries(showroomData.hours).map(([day, hours]) => (
//               <div key={day} className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
//                 <span className="text-white font-medium">{day}</span>
//                 <span className={`text-sm ${hours === 'Closed' ? 'text-red-400' : 'text-gray-400'}`}>
//                   {hours}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex justify-between items-center py-3 border-b border-gray-800/50 last:border-0">
//       <span className="text-white font-medium">{label}</span>
//       <span className="text-gray-400 text-sm">{value}</span>
//     </div>
//   );
// }



"use client";
import { useState } from 'react';
import { Edit, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ViewShowroomPage() {
  const router = useRouter();
  type ShowroomData = {
    logo: string;
    information: {
      name: string;
      category: string;
      country: string;
      city: string;
      location: string;
    };
    hours: {
      [key: string]: string;
    };
  };

  const [showroomData, setShowroomData] = useState<ShowroomData>({
    logo: 'https://images.unsplash.com/photo-1558403194-611308249627?w=200&h=200&fit=crop',
    information: {
      name: 'zAlexJames512',
      category: 'Cloth Shop',
      country: 'USA',
      city: 'Los Angeles',
      location: 'Los Angeles',
    },
    hours: {
      Friday: '9:00AM - 6:00PM',
      Saturday: '9:00AM - 6:00PM',
      Sunday: 'Closed',
      Monday: '9:00AM - 6:00PM',
      Tuesday: '9:00AM - 6:00PM',
      Wednesday: '9:00AM - 6:00PM',
      Thursday: '9:00AM - 6:00PM',
    },
  });

  const [editModal, setEditModal] = useState<{ open: boolean; type: 'logo' | 'information' | 'hours' | null }>({ open: false, type: null }); // 'information' or 'hours'
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Open modal and load current data
  const openEditModal = (type: 'logo' | 'information' | 'hours') => {
    if (type === 'logo') {
      setFormData({ logo: showroomData.logo });
    } else {
      setFormData({ ...showroomData[type] });
    }
    setEditModal({ open: true, type });
  };

  // Handle input changes
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Save changes and log to console
  const handleSave = () => {
    if (editModal.type) {
      console.log('Updated data:', { [editModal.type]: formData });
      setShowroomData((prev) => {
        const updatedData = { ...prev };
        (updatedData as any)[editModal.type!] = formData;
        return updatedData;
      });
    }
    setEditModal({ open: false, type: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#0f0924] to-black text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mt-16 md:mt-24 mb-2.5 md:mb-8">
        <div className="container mx-auto mt-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Showroom Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Business Logo Section */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Business Logo</h2>
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-2 border-purple-500/30">
              <img
                src={showroomData.logo}
                alt="Business Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        {/* Showroom's Information Section */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-300">Showroom's Information</h2>
            <button
              onClick={() => openEditModal('information')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-all duration-300"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-4">
            <InfoRow label="Showroom name" value={showroomData.information.name} />
            <InfoRow label="Category" value={showroomData.information.category} />
            <InfoRow label="Country" value={showroomData.information.country} />
            <InfoRow label="City" value={showroomData.information.city} />
            <InfoRow label="Location" value={showroomData.information.location} />
          </div>
        </div>

        {/* Showroom Hour Section */}
        <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/80 to-purple-900/20 border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-300">Showroom Hour</h2>
            <button
              onClick={() => openEditModal('hours')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-medium transition-all duration-300"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
          <div className="space-y-4">
            {Object.entries(showroomData.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between items-center py-2 border-b border-gray-800/50 last:border-0">
                <span className="text-white font-medium">{day}</span>
                <span className={`text-sm ${hours === 'Closed' ? 'text-red-400' : 'text-gray-400'}`}>
                  {hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setEditModal({ open: false, type: null })}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">
              Edit {editModal.type === 'information' ? "Information" : "Hours"}
            </h3>

            {editModal.type === 'information' ? (
              <>
                <InputField label="Showroom name" value={formData.name} onChange={(v: string) => handleChange('name', v)} />
                <InputField label="Category" value={formData.category} onChange={(v: string) => handleChange('category', v)} />
                <InputField label="Country" value={formData.country} onChange={(v: string) => handleChange('country', v)} />
                <InputField label="City" value={formData.city} onChange={(v: string) => handleChange('city', v)} />
                <InputField label="Location" value={formData.location} onChange={(v: string) => handleChange('location', v)} />
              </>
            ) : (
              <>
                {Object.keys(formData).map((day) => (
                  <div key={day} className="mb-3">
                    <label className="block text-gray-300 text-sm mb-1">{day}</label>
                    <input
                      type="text"
                      value={formData[day]}
                      onChange={(e) => handleChange(day, e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 9:00AM - 6:00PM or Closed"
                    />
                  </div>
                ))}
              </>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditModal({ open: false, type: null })}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable input field
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}

// Your existing InfoRow
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-800/50 last:border-0">
      <span className="text-white font-medium">{label}</span>
      <span className="text-gray-400 text-sm">{value}</span>
    </div>
  );
}