// "use client"

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// export default function CustomDesignReauest() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [notes, setNotes] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const router = useRouter()

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsUploading(true);
    
//     // Simulate upload process
//     setTimeout(() => {
//       setIsUploading(false);
//       alert('Design request submitted successfully!');
//     }, 2000);
//   };
// // bg-gradient-to-r from-black via-[#120a2a] to-black flex
//   return (
//     <div className="md:min-h-[600px] mt-12 md:mt-24 bg-gradient-to-r from-black via-[#140c2e] to-black p-6">
//       {/* Header */}
//     <div className="container mx-auto mt-4 mb-2 flex items-center gap-4">
//              <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
//           <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </div>
//         </button>
//           <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Custom design Request</h1>
//         </div>

//       {/* Main Form */}
//       <div className="max-w-md mx-auto">
//         {/* Upload Section */}
//         <div className="mb-8">
//           <div className="relative w-full h-32 border-2 border-dashed border-purple-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-purple-900/20 transition-colors"
//                onClick={() => document.getElementById('fileInput').click()}>
//             {isUploading ? (
//               <div className="flex flex-col items-center">
//                 <svg className="animate-spin w-8 h-8 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.644z"></path>
//                 </svg>
//                 <p className="text-sm text-gray-300">Uploading...</p>
//               </div>
//             ) : selectedFile ? (
//               <div className="text-center">
//                 <svg className="w-8 h-8 text-green-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414l3.293 3.293a1 1 0 011.414 0l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-sm text-white">{selectedFile.name}</p>
//               </div>
//             ) : (
//               <div className="text-center">
//                 <svg className="w-8 h-8 text-purple-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zM5 7a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1V7zm1 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-sm text-gray-300">Upload</p>
//               </div>
//             )}
//           </div>
//           <input
//             id="fileInput"
//             type="file"
//             className="hidden"
//             onChange={handleFileChange}
//             accept=".jpg,.jpeg,.png,.gif,.pdf,.zip,.ai,.psd"
//           />
//         </div>

//         {/* Notes Section */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-white mb-2">Notes to Vendor</label>
//           <textarea
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             placeholder="Any specific requirements or preferences..."
//             className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
//             rows={4}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center justify-between gap-4 mb-6">
//           <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 001 1h6a1 1 0 100-2H8a1 1 0 00-1 1z" clipRule="evenodd" />
//             </svg>
//             Send Measurements
//           </button>
          
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
//               <img src="https://placehold.co/40x40/3b82f6/ffffff?text=AV" alt="Vendor" className="rounded-full" />
//             </div>
//             <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
//               <img src="https://placehold.co/40x40/10b981/ffffff?text=CU" alt="Customer" className="rounded-full" />
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           onClick={handleSubmit}
//           disabled={isUploading}
//           className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
//             isUploading 
//               ? 'bg-purple-600 cursor-not-allowed' 
//               : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
//           }`}
//         >
//           {isUploading ? 'Submitting...' : 'Submit'}
//         </button>
//       </div>
//     </div>
//   );
// }



"use client"

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomDesignRequest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMeasurementType, setSelectedMeasurementType] = useState('');
  const [measurements, setMeasurements] = useState({
    chest: '', shoulderWidth: '', armLength: '', inseam: '', neck: '', length: '',
    waist: '', hips: '', inseamTrouser: '', outseam: '', thigh: '', knee: '', ankle: '',
    waistShorts: '', hipsShorts: '', inseamShorts: '', outseamShorts: '', thighShorts: '',
    additionalNotes: ''
  });

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) setSelectedFile(file);
    }
  };

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('=== FORM SUBMISSION ===');
    console.log('Selected File:', selectedFile);
    console.log('Notes to Vendor:', notes);
    console.log('Measurement Type:', selectedMeasurementType);
    console.log('Measurements:', measurements);
    console.log('======================');
    alert('Form submitted! Check console for values.');
  };

  return (
    <div className="md:min-h-[600px] mt-12 md:mt-24 bg-gradient-to-r from-black via-[#140c2e] to-black p-6">
      <div className="container mx-auto mt-4 mb-2 flex items-center gap-4">
        <button onClick={() => router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
        <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Custom design Request</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Upload Section */}
        <div className="mb-6">
          <div className="relative w-full h-32 border-2 border-dashed border-purple-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-purple-900/20 transition-colors"
               onClick={() => {
                 const element = document.getElementById('fileInput');
                 if (element) element.click();
               }}>
            {isUploading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin w-8 h-8 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.644z"></path>
                </svg>
                <p className="text-sm text-gray-300">Uploading...</p>
              </div>
            ) : selectedFile ? (
              <div className="text-center">
                <svg className="w-8 h-8 text-green-400 mb-2 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414l3.293 3.293a1 1 0 011.414 0l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-white">{selectedFile.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 text-purple-400 mb-2 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
                <p className="text-sm text-gray-300">Upload</p>
              </div>
            )}
          </div>
          <input id="fileInput" type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.gif,.pdf,.zip,.ai,.psd" />
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">Notes to Vendor</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific requirements or preferences..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
          />
        </div>

        {/* Measurement Type Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">Select Measurement Type</label>
          <div className="relative">
            <select
              value={selectedMeasurementType}
              onChange={(e) => setSelectedMeasurementType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
              <option value="">Choose measurement type...</option>
              <option value="top">Top Measurements</option>
              <option value="trouser">Trouser Measurements</option>
              <option value="shorts">Shorts Measurements</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Top Measurements Form */}
        {selectedMeasurementType === 'top' && (
          <div className="bg-[#2a2438] border-2 border-blue-500 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <h2 className="text-xl font-semibold text-white">Top Measurements</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">Provide your measurements in inches. Fill in only the measurements you know.</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Chest (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 38"
                    value={measurements.chest}
                    onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Shoulder Width (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 18"
                    value={measurements.shoulderWidth}
                    onChange={(e) => handleMeasurementChange('shoulderWidth', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Arm Length (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 24"
                    value={measurements.armLength}
                    onChange={(e) => handleMeasurementChange('armLength', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Inseam (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 32"
                    value={measurements.inseam}
                    onChange={(e) => handleMeasurementChange('inseam', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Neck (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 15"
                    value={measurements.neck}
                    onChange={(e) => handleMeasurementChange('neck', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Length (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 28"
                    value={measurements.length}
                    onChange={(e) => handleMeasurementChange('length', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Additional Notes (Optional)</label>
                <textarea
                  placeholder="Any specific requirements or preferences..."
                  value={measurements.additionalNotes}
                  onChange={(e) => handleMeasurementChange('additionalNotes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Trouser Measurements Form */}
        {selectedMeasurementType === 'trouser' && (
          <div className="bg-[#2a2438] border-2 border-blue-500 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <h2 className="text-xl font-semibold text-white">Trouser Measurements</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Waist (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 32"
                    value={measurements.waist}
                    onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Hips (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 38"
                    value={measurements.hips}
                    onChange={(e) => handleMeasurementChange('hips', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Inseam (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 30"
                    value={measurements.inseamTrouser}
                    onChange={(e) => handleMeasurementChange('inseamTrouser', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Outseam (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 42"
                    value={measurements.outseam}
                    onChange={(e) => handleMeasurementChange('outseam', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Thigh (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 22"
                    value={measurements.thigh}
                    onChange={(e) => handleMeasurementChange('thigh', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Knee (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 16"
                    value={measurements.knee}
                    onChange={(e) => handleMeasurementChange('knee', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Ankle (Inches)</label>
                <input
                  type="text"
                  placeholder="eg. 8"
                  value={measurements.ankle}
                  onChange={(e) => handleMeasurementChange('ankle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Additional Notes (Optional)</label>
                <textarea
                  placeholder="Any specific requirements or preferences..."
                  value={measurements.additionalNotes}
                  onChange={(e) => handleMeasurementChange('additionalNotes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Shorts Measurements Form */}
        {selectedMeasurementType === 'shorts' && (
          <div className="bg-[#2a2438] border-2 border-blue-500 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <h2 className="text-xl font-semibold text-white">Shorts Measurements</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Waist (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 32"
                    value={measurements.waistShorts}
                    onChange={(e) => handleMeasurementChange('waistShorts', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Hips (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 38"
                    value={measurements.hipsShorts}
                    onChange={(e) => handleMeasurementChange('hipsShorts', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Inseam (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 10"
                    value={measurements.inseamShorts}
                    onChange={(e) => handleMeasurementChange('inseamShorts', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Outseam (Inches)</label>
                  <input
                    type="text"
                    placeholder="eg. 18"
                    value={measurements.outseamShorts}
                    onChange={(e) => handleMeasurementChange('outseamShorts', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Thigh (Inches)</label>
                <input
                  type="text"
                  placeholder="eg. 22"
                  value={measurements.thighShorts}
                  onChange={(e) => handleMeasurementChange('thighShorts', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Additional Notes (Optional)</label>
                <textarea
                  placeholder="Any specific requirements or preferences..."
                  value={measurements.additionalNotes}
                  onChange={(e) => handleMeasurementChange('additionalNotes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
          Submit Request
        </button>
      </div>
    </div>
  );
}