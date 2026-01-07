
 
// "use client"

// import { Calendar, X, MapPin } from 'lucide-react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { CiEdit } from 'react-icons/ci';
// import { FaArrowLeft } from 'react-icons/fa';
// import { IoIosShareAlt } from 'react-icons/io';

// export default function Event() {
//   const [activeTab, setActiveTab] = useState('created');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [emailFields, setEmailFields] = useState(['']);
//   const router = useRouter();
  
//   const events = [
//     {
//       id: 1,
//       title: "Birthday Family Outfit",
//       description: "Lorem ipsum dolor sit amet consectetur. Integer a eros vitae arcu. Egestas dui id felis sed nunc congue scelerisque.",
//       date: "18 Nov, 25 02:00PM",
//       location: "Mohakhali 240, Dhaka",
//       totalInvite: 24,
//       status: "Buy Creator"
//     },
//     {
//       id: 2,
//       title: "Birthday Family Outfit",
//       description: "Lorem ipsum dolor sit amet consectetur. Integer a eros vitae arcu. Egestas dui id felis sed nunc congue scelerisque.",
//       date: "18 Nov, 25 02:00PM",
//       location: "Mohakhali 240, Dhaka",
//       totalInvite: 24,
//       status: "By Participants"
//     }
//   ];

//   const handleAddEmailField = () => {
//     setEmailFields([...emailFields, '']);
//   };

//   const handleEmailChange = (index, value) => {
//     const newEmailFields = [...emailFields];
//     newEmailFields[index] = value;
//     setEmailFields(newEmailFields);
//   };

//   const handleRemoveEmailField = (index) => {
//     if (emailFields.length > 1) {
//       const newEmailFields = emailFields.filter((_, i) => i !== index);
//       setEmailFields(newEmailFields);
//     }
//   };

//   const handleSendInvitations = () => {
//     // Handle sending invitations logic here
//     console.log('Sending invitations to:', emailFields.filter(email => email));
//     setIsModalOpen(false);
//     setEmailFields(['']); // Reset to single empty field
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//     setEmailFields(['']); // Reset fields when opening
//   };

//   return (
//     <div className="min-h-screen md:mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black">
//       {/* Header */}
//       <div className="flex py-6 container mx-auto justify-between items-center mb-4">
//         <div className="container mx-auto flex items-center gap-4">
//              <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
//             <FaArrowLeft className='text-black' />
//           </div>
//         </button>
//           <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Event</h1>
//         </div>
        
//         <button 
//           onClick={() => router.push("/profile/event/create-event")}
//           className="px-4 py-2 bg-[#6100FF] text-white rounded transition-all duration-200 flex items-center gap-2">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//           </svg>
//           Create Event
//         </button>
//       </div>

//       {/* Subheader */}
//       <div className="text-center mb-8">
//         <p className="text-gray-400 max-w-2xl mx-auto">
//           Plan matching outfits for your event with your selected tailor. Invite your friends, share the design, and let everyone order easily from the same vendor.
//         </p>
//       </div>

//       {/* Tabs */}
//       <div className="flex mb-8 justify-center">
//         <button 
//           onClick={() => setActiveTab('created')}
//           className={`px-6 py-2 rounded-l-lg font-medium transition-all duration-200 ${
//             activeTab === 'created' 
//               ? 'bg-[#6100FF] text-white' 
//               : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//           }`}
//         >
//           Created
//         </button>
//         <button 
//           onClick={() => setActiveTab('invitations')}
//           className={`px-6 py-2 rounded-r-lg font-medium transition-all duration-200 ${
//             activeTab === 'invitations' 
//               ? 'bg-[#6100FF] text-white' 
//               : 'bg-[#4C455A] text-gray-300 hover:bg-gray-700'
//           }`}
//         >
//           Invitations
//         </button>
//       </div>

//       {/* Events List */}
//       <div className="max-w-4xl mx-auto space-y-6 pb-6 px-4">
//         {events.map((event) => (
//           <div key={event.id} className="bg-[#2C233E] border border-[#67676D] rounded-lg p-6 hover:border-purple-500 transition-all duration-200">
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <h3 className="text-2xl font-semibold font-cormorant text-white mb-2">{event.title}</h3>
//                 <p className="text-gray-400 mb-4 font-poppins">{event.description}</p>
                
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 font-poppins text-gray-300">
//                     <Calendar size={20} />
//                     <span>{event.date}</span>
//                   </div>
                  
//                   <div className="flex items-center gap-2 text-gray-300">
//                     <MapPin size={20} />
//                     <span>{event.location}</span>
//                   </div>
                  
//                   <div className="flex items-center gap-2 text-[16px] text-[#912DAD]">
//                     <span>Total Invite: {event.totalInvite}</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex flex-col gap-2 ml-4">
//                 <div className="flex gap-3.5 items-center">
//                   <p className='bg-[#3D3648] px-4 py-1 rounded-full text-[#912DAD]'>{event?.status}</p>
//                   <CiEdit className='text-[#1E5EFF] text-2xl cursor-pointer hover:text-[#3D7FFF]' />
//                 </div>
                
//                 <Link href={"/profile/event/view-deaign"}>
//                   <button className="px-4 py-2 cursor-pointer w-full mt-16 bg-[#912DAD] text-white rounded-lg hover:bg-[#7A2491] transition-all duration-200 text-sm">
//                     View Design
//                   </button>
//                 </Link>
                
//                 <button 
//                   onClick={openModal}
//                   className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-sm flex items-center justify-center gap-2">
//                   <IoIosShareAlt size={24} />
//                   Send Invitation
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Invitation Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-black border-2 border-[#6100FF] rounded-2xl p-6 w-full max-w-md relative">
//             {/* Close Button */}
//             <button 
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
//               <X size={24} />
//             </button>

//             {/* Modal Header */}
//             <h2 className="text-xl font-semibold text-white text-center mb-6">
//               Add the Email of the Person<br />You're Inviting
//             </h2>

//             {/* Email Fields */}
//             <div className="space-y-4 mb-4">
//               {emailFields.map((email, index) => (
//                 <div key={index} className="relative">
//                   <label className="block text-sm text-gray-400 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => handleEmailChange(index, e.target.value)}
//                       placeholder="Ex: Enter here email"
//                       className="w-full bg-[#242428] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500   focus:border-purple-500 transition-colors"
//                     />
//                     {emailFields.length > 1 && (
//                       <button
//                         onClick={() => handleRemoveEmailField(index)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300">
//                         <X size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Add Email Button */}
//             <button
//               onClick={handleAddEmailField}
//               className="bg-gradient-to-l from-blue-600 to-cyan-600 text-white rounded py-1 px-2 mb-2 cursor-pointer">
//               <span className="text-lg">+</span> Add email
//             </button>

//             {/* Send Button */}
//             <button
//               onClick={handleSendInvitations}
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client"

import { Calendar, X, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FaArrowLeft } from 'react-icons/fa';
import { IoIosShareAlt } from 'react-icons/io';

// Define the event type
type EventType = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  totalInvite: number;
  status: string;
  rawDate: string;
  rawTime: string;
};

export default function Event() {
  const [activeTab, setActiveTab] = useState('created');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [emailFields, setEmailFields] = useState(['']);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    date: '',
    time: '',
    address: '',
    purchaseOption: 'creator',
    description: ''
  });
  const router = useRouter();
  
  const events = [
    {
      id: 1,
      title: "Birthday Family Outfit",
      description: "Lorem ipsum dolor sit amet consectetur. Integer a eros vitae arcu. Egestas dui id felis sed nunc congue scelerisque.",
      date: "18 Nov, 25 02:00PM",
      location: "Mohakhali 240, Dhaka",
      totalInvite: 24,
      status: "Buy Creator",
      rawDate: "2025-11-18",
      rawTime: "14:00"
    },
    {
      id: 2,
      title: "Birthday Family Outfit",
      description: "Lorem ipsum dolor sit amet consectetur. Integer a eros vitae arcu. Egestas dui id felis sed nunc congue scelerisque.",
      date: "18 Nov, 25 02:00PM",
      location: "Mohakhali 240, Dhaka",
      totalInvite: 24,
      status: "By Participants",
      rawDate: "2025-11-18",
      rawTime: "14:00"
    }
  ];

  const handleAddEmailField = () => {
    setEmailFields([...emailFields, '']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmailFields = [...emailFields];
    newEmailFields[index] = value;
    setEmailFields(newEmailFields);
  };

  const handleRemoveEmailField = (index: number) => {
    if (emailFields.length > 1) {
      const newEmailFields = emailFields.filter((_, i) => i !== index);
      setEmailFields(newEmailFields);
    }
  };

  const handleSendInvitations = () => {
    console.log('Sending invitations to:', emailFields.filter(email => email));
    setIsInviteModalOpen(false);
    setEmailFields(['']);
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
    setEmailFields(['']);
  };

  const openEditModal = (event: any) => {
    setSelectedEvent(event);
    setEditFormData({
      title: event.title,
      date: event.rawDate,
      time: event.rawTime,
      address: event.location,
      purchaseOption: event.status === "Buy Creator" ? 'creator' : 'invitees',
      description: event.description
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    console.log('Updating event:', selectedEvent.id, editFormData);
    alert('Event updated successfully!');
    setIsEditModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && window.confirm('Are you sure you want to delete this event?')) {
      console.log('Deleting event:', selectedEvent.id);
      alert('Event deleted successfully!');
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen md:mt-24 bg-gradient-to-r from-black via-[#0f0924] to-black">
      {/* Header */}
      <div className="flex py-6 container mx-auto justify-between items-center mb-4">
        <div className="container mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B630F4] to-[#2ACCED] cursor-pointer flex items-center justify-center">
              <FaArrowLeft className='text-black' />
            </div>
          </button>
          <h1 className="text-[32px] font-semibold text-gray-300 font-cormorant">Event</h1>
        </div>
        
        <button 
          onClick={() => router.push("/profile/event/create-event")}
          className="px-4 py-2 w-48 cursor-pointer bg-[#6100FF] text-white rounded transition-all duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Event
        </button>
      </div>

      {/* Subheader */}
      <div className="text-center mb-8">
        <p className="text-gray-400 max-w-2xl mx-auto">
          Plan matching outfits for your event with your selected tailor. Invite your friends, share the design, and let everyone order easily from the same vendor.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex mb-8 justify-center">
        <button 
          onClick={() => setActiveTab('created')}
          className={`px-6 py-2 rounded-l-lg font-medium transition-all duration-200 ${
            activeTab === 'created' 
              ? 'bg-[#6100FF] text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Created
        </button>
        <button 
          onClick={() => setActiveTab('invitations')}
          className={`px-6 py-2 rounded-r-lg font-medium transition-all duration-200 ${
            activeTab === 'invitations' 
              ? 'bg-[#6100FF] text-white' 
              : 'bg-[#4C455A] text-gray-300 hover:bg-gray-700'
          }`}
        >
          Invitations
        </button>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto space-y-6 pb-6 px-4">
        {events.map((event) => (
          <div key={event.id} className="bg-[#2C233E] border border-[#67676D] rounded-lg p-6 hover:border-purple-500 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold font-cormorant text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 mb-4 font-poppins">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-poppins text-gray-300">
                    <Calendar size={20} />
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={20} />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[16px] text-[#912DAD]">
                    <span>Total Invite: {event.totalInvite}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <div className="flex gap-3.5 items-center">
                  <p className='bg-[#3D3648] px-4 py-1 rounded-full text-[#912DAD]'>{event?.status}</p>
                  <CiEdit 
                    onClick={() => openEditModal(event)}
                    className='text-[#1E5EFF] text-2xl cursor-pointer hover:text-[#3D7FFF]' 
                  />
                </div>
                
                <Link href={"/profile/event/view-deaign"}>
                  <button className="px-4 py-2 cursor-pointer w-full mt-16 bg-[#912DAD] text-white rounded-lg hover:bg-[#7A2491] transition-all duration-200 text-sm">
                    View Design
                  </button>
                </Link>
                
                <button 
                  onClick={openInviteModal}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-sm flex items-center justify-center gap-2">
                  <IoIosShareAlt size={24} />
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invitation Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-[#6100FF] rounded-2xl p-6 w-full max-w-md relative">
            <button 
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h2 className="text-xl font-semibold text-white text-center mb-6">
              Add the Email of the Person<br />You're Inviting
            </h2>

            <div className="space-y-4 mb-4">
              {emailFields.map((email, index) => (
                <div key={index} className="relative">
                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="Ex: Enter here email"
                      className="w-full bg-[#242428] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 transition-colors"
                    />
                    {emailFields.length > 1 && (
                      <button
                        onClick={() => handleRemoveEmailField(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddEmailField}
              className="bg-gradient-to-l from-blue-600 to-cyan-600 text-white rounded py-1 px-2 mb-2 cursor-pointer">
              <span className="text-lg">+</span> Add email
            </button>

            <button
              onClick={handleSendInvitations}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Send
            </button>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && (
        <div className="fixed md:mt-12 mt-28 inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-[#0a2930] to-[#1d0d24] border-2 border-purple-400 rounded-2xl p-6 w-full max-w-lg relative my-8">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-semibold text-white mb-6 font-cormorant">Edit Event</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  placeholder="Type Here"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Event Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editFormData.time}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  placeholder="Type Here"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Purchase Options */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Who will purchase?</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="purchaseOption"
                      value="creator"
                      checked={editFormData.purchaseOption === 'creator'}
                      onChange={handleEditChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-white">I will purchase for everyone</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="purchaseOption"
                      value="invitees"
                      checked={editFormData.purchaseOption === 'invitees'}
                      onChange={handleEditChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-white">Everyone will purchase for themselves</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  placeholder="Type Here"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">
                  Delete
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium">
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEvent}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}