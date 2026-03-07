// 'use client';

// import React, { useState } from 'react';
// import { Upload, Edit, MapPin } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function VendorProfilePage() {
//   const [isEditing, setIsEditing] = useState(false);
//   const router = useRouter();
  
//   const profileData = {
//     userName: 'AlexJames512',
//     name: 'Alex James',
//     email: 'alexjames@gmail.com',
//     professionalEmail: 'alexjames@gmail.com',
//     phoneNumber: '2334567',
//     communicationPreference: 'Phone',
//     bio: "I'm a creative tailor with a love for fashion and fine craftsmanship. From traditional African attire to modern custom fits, I design and stitch clothing that reflects your personality and confidence."
//   };

//   const showrooms = [
//     {
//       id: 1,
//       name: 'Luxurias Showroom',
//       branch: 'Gulshan Branch',
//       location: 'Gulshan, Dhaka'
//     },
//     {
//       id: 2,
//       name: 'Luxurias Showroom',
//       branch: 'Gulshan Branch',
//       location: 'Gulshan, Dhaka'
//     }
//   ];

//   const handleImageUpload = () => {
//     console.log('Upload profile picture');
//   };

//   const handleEditProfile = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleAddShowroom = () => {
//     console.log('Add showroom');
//   };

//   const handleViewInfo = (showroomId: number) => {
//     console.log('View showroom info:', showroomId);
//   };

//   return (
//     <div className="space-y-6 pb-5 mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black">
//       {/* Profile Picture Section */}
//   <div className='flex items-center container mx-auto justify-between pt-4'>

//       <div className=" flex items-center gap-4">
//              <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
//           <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </div>
//         </button>
//           <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Profile info</h1>
//         </div>
//         <div className='md:mr-24 mr-2 flex items-center  gap-2'>
//           <img
//            onClick={() => router.push("/wallet")}
//           className='cursor-pointer' src="/images/wallet.png" alt="" />
//           <img
//            onClick={() => router.push("/settings")}
//           className='cursor-pointer' src="/images/settinsg.png" alt="" />
//           <img
          
//           className='cursor-pointer' src="/images/log.png" alt="" />
//         </div>
//   </div>
       

//       <div className="flex flex-col items-center">
//         <h3 className="text-sm text-gray-400 mb-4">Profile Picture</h3>
//         <div className="relative">
//           <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center overflow-hidden border-4 border-purple-500/30">
//             <span className="text-5xl">👤</span>
//           </div>
//         </div>
//         <button 
//           onClick={handleImageUpload}
//           className="mt-4 px-6 py-2 bg-[#6100FF] cursor-pointer text-white hover:to-pink-700 rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
//         >
//           <Upload size={16} />
//           Upload
//         </button>
//       </div>

//       {/* Personal Information */}
//       <div 
//       className="bg-gradient-to-b from-[#2C223C] to-[#18161C] max-w-6xl mx-auto border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold font-cormorant text-white">Personal Information</h2>
//           <button 
//             onClick={handleEditProfile}
//             className="px-4 py-2 bg-[#6100FF] cursor-pointer text-white rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
//           >
//             <Edit size={16} />
//             Edit
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
//             <span className="text-sm text-gray-400">User Name</span>
//             <span className="text-white">{profileData.userName}</span>
//           </div>
//           <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
//             <span className="text-sm text-gray-400">Name</span>
//             <span className="text-white">{profileData.name}</span>
//           </div>
//           <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
//             <span className="text-sm text-gray-400">Email</span>
//             <span className="text-white">{profileData.email}</span>
//           </div>
//           <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
//             <span className="text-sm text-gray-400">Professional email</span>
//             <span className="text-white">{profileData.professionalEmail}</span>
//           </div>
//           <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
//             <span className="text-sm text-gray-400">Phone Number</span>
//             <span className="text-white">{profileData.phoneNumber}</span>
//           </div>
//           <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
//             <span className="text-sm text-gray-400">Communication Preference</span>
//             <span className="text-white">{profileData.communicationPreference}</span>
//           </div>
//           <div className="py-3">
//             <span className="text-sm text-gray-400 block mb-2">Bio</span>
//             <p className="text-white text-sm leading-relaxed">{profileData.bio}</p>
//           </div>
//         </div>
//       </div>

//       {/* My Showrooms */}
//       <div className="bg-gradient-to-b from-[#2C223C] to-[#18161C] max-w-6xl mx-auto border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-white font-cormorant">My Showrooms</h2>
//           <button 
//             onClick={handleAddShowroom}
//             className="px-4 py-2 bg-[#6100FF] cursor-pointer text-white rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
//           >
//             + Add Showroom
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {showrooms.map((showroom) => (
//             <div 
//               key={showroom.id}
//               className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all"
//             >
//               {/* Showroom Logo */}
//               <div className="bg-white p-8 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="text-6xl mb-2">✂️</div>
//                   <div className="text-black font-bold text-xl">TAILOR</div>
//                   <div className="text-black text-xs tracking-widest">COMPANY</div>
//                 </div>
//               </div>

//               {/* Showroom Info */}
//               <div className="p-4">
//                 <h3 className="text-white font-semibold mb-1">{showroom.name}</h3>
//                 <p className="text-gray-400 text-sm mb-2">— {showroom.branch}</p>
//                 <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
//                   <MapPin size={14} />
//                   <span>{showroom.location}</span>
//                 </div>
//                 <button 
//                   onClick={() => handleViewInfo(showroom.id)}
//                   className="w-full py-2 bg-[#6100FF] text-white cursor-pointer rounded-lg transition-all text-sm font-medium"
//                 >
//                   View Info
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { Upload, Edit, MapPin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function VendorProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    userName: 'AlexJames512',
    name: 'Alex James',
    email: 'alexjames@gmail.com',
    professionalEmail: 'alexjames@gmail.com',
    phoneNumber: '2334567',
    communicationPreference: 'Phone',
    bio: "I'm a creative tailor with a love for fashion and fine craftsmanship. From traditional African attire to modern custom fits, I design and stitch clothing that reflects your personality and confidence."
  });

  const [editFormData, setEditFormData] = useState(profileData);

  const showrooms = [
    {
      id: 1,
      name: 'Luxurias Showroom',
      branch: 'Gulshan Branch',
      location: 'Gulshan, Dhaka'
    },
    {
      id: 2,
      name: 'Luxurias Showroom',
      branch: 'Gulshan Branch',
      location: 'Gulshan, Dhaka'
    }
  ];

  const handleImageUpload = () => {
    console.log('Upload profile picture');
  };

  const handleEditProfile = () => {
    setEditFormData(profileData);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    console.log('Updated Profile Data:', editFormData);
    setProfileData(editFormData);
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditFormData(profileData);
    setIsEditModalOpen(false);
  };

  const handleLogout = () => {
    console.log('User logged out');
    setIsLogoutModalOpen(false);
    // Add your logout logic here
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
    router.push('/');
  };

  const handleAddShowroom = () => {
    console.log('Add showroom');
  };

  const handleViewInfo = (showroomId: number) => {
    console.log('View showroom info:', showroomId);
  };

  return (
    <div className="space-y-6 pb-5 md:mt-24 mt-20 bg-gradient-to-r from-black via-[#0f0924] to-black min-h-screen">
      {/* Header */}
      <div className='flex items-center container mx-auto justify-between pt-0 md:pt-4'>
          <div className="container mx-auto flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
            <FaArrowLeft className='text-black' />
          </div>
        </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Profile Info</h1>
        </div>
        <div className='md:mr-24 mr-14 flex items-center gap-2'>
          <img onClick={() => router.push("/v-profile/wallet")} className='cursor-pointer' src="/images/wallet.png" alt="" />
          <img onClick={() => router.push("/settings")} className='cursor-pointer' src="/images/settinsg.png" alt="" />
          <img onClick={() => setIsLogoutModalOpen(true)} className='cursor-pointer' src="/images/log.png" alt="" />
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center">
        <h3 className="text-sm text-gray-400 mb-4">Profile Picture</h3>
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center overflow-hidden border-4 border-purple-500/30">
            <span className="text-5xl">👤</span>
          </div>
        </div>
        <button 
          onClick={handleImageUpload}
          className="mt-4 px-6 py-2 bg-[#6100FF] cursor-pointer text-white hover:bg-[#5000dd] rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <Upload size={16} />
          Upload
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-gradient-to-b from-[#2C223C] to-[#18161C] max-w-6xl mx-auto border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold font-cormorant text-white">Personal Information</h2>
          <button 
            onClick={handleEditProfile}
            className="px-4 py-2 bg-[#6100FF] cursor-pointer text-white hover:bg-[#5000dd] rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
            <span className="text-sm text-gray-400">User Name</span>
            <span className="text-white">{profileData.userName}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
            <span className="text-sm text-gray-400">Name</span>
            <span className="text-white">{profileData.name}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-white">{profileData.email}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
            <span className="text-sm text-gray-400">Professional email</span>
            <span className="text-white">{profileData.professionalEmail}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
            <span className="text-sm text-gray-400">Phone Number</span>
            <span className="text-white">{profileData.phoneNumber}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-700/30">
            <span className="text-sm text-gray-400">Communication Preference</span>
            <span className="text-white">{profileData.communicationPreference}</span>
          </div>
          <div className="py-3">
            <span className="text-sm text-gray-400 block mb-2">Bio</span>
            <p className="text-white text-sm leading-relaxed">{profileData.bio}</p>
          </div>
        </div>
      </div>

      {/* My Showrooms */}
      <div className="bg-gradient-to-b from-[#2C223C] to-[#18161C] max-w-6xl mx-auto border shadow-[0_0_12px_rgba(34,211,238,0.35)] border-purple-500/30 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white font-cormorant">My Showrooms</h2>
          <Link href={"/v-profile/add-showroom"}>
            <button 
            onClick={handleAddShowroom}
            className="px-4 py-2 bg-[#6100FF] cursor-pointer text-white hover:bg-[#5000dd] rounded-lg transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            + Add Showroom
          </button>
          </Link>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showrooms.map((showroom) => (
            <div 
              key={showroom.id}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all"
            >
               <img src="/images/tailor.png" className='w-full h-fit' alt="" />

              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{showroom.name}</h3>
                <p className="text-gray-400 text-sm mb-2">— {showroom.branch}</p>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
                  <MapPin size={14} />
                  <span>{showroom.location}</span>
                </div>
                <Link href={"/v-profile/view-showroom"}> 
                <button 
                  onClick={() => handleViewInfo(showroom.id)}
                  className="w-full py-2 bg-[#6100FF] text-white cursor-pointer hover:bg-[#5000dd] rounded-lg transition-all text-sm font-medium"
                >
                  View Info
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 mt-16">
          <div className="bg-gradient-to-b from-[#2C223C] to-[#18161C] border border-purple-500/30 rounded-2xl p-12 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white font-cormorant">Edit Profile</h2>
              <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">User Name</label>
                <input
                  type="text"
                  value={editFormData.userName}
                  onChange={(e) => setEditFormData({...editFormData, userName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
                />
              </div>
 

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Professional Email</label>
                <input
                  type="email"
                  value={editFormData.professionalEmail}
                  onChange={(e) => setEditFormData({...editFormData, professionalEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editFormData.phoneNumber}
                  onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Communication Preference</label>
                <select
                  value={editFormData.communicationPreference}
                  onChange={(e) => setEditFormData({...editFormData, communicationPreference: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white"
                >
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Bio</label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-6 py-3 bg-[#6100FF] hover:bg-[#5000dd] text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#2C223C] to-[#18161C] border border-purple-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2 font-cormorant">Logout</h2>
              <p className="text-gray-400 mb-6">Do you want to logout?</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}