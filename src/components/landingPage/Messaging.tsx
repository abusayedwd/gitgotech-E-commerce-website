// "use client";

// import { useState } from 'react';
// import { Send, Image, Paperclip, Smile } from 'lucide-react';

// export default function MessagingPage() {
//   const [selectedChat, setSelectedChat] = useState(1);
//   const [message, setMessage] = useState('');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const contacts = [
//     { id: 0, name: 'RAbb', avatar: '👤', status: 'Thanks you for reaching', time: '' },
//     { id: 1, name: 'Habib', avatar: '👤', status: 'Thanks you for reaching', time: '' },
//     { id: 2, name: 'Arif', avatar: '👤', status: 'Thanks you for reaching', time: '' },
//     { id: 3, name: 'Jamiylo', avatar: '👤', status: 'Thanks you for reaching', time: '' },
//     { id: 4, name: 'Taknol', avatar: '👤', status: 'Thanks you for reaching', time: '' },
//     { id: 5, name: 'Hasif', avatar: '👤', status: 'Thanks you for reaching', time: '' },
//   ];

//   const messages = [
//     {
//       id: 1,
//       sender: 'Rakibul',
//       time: '10:45 AM',
//       text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit vitae ut velit quis ornat nisl. Faucibus erat sit. Eget facilisi scelerisque. Euismod velit ut quis orci orci est arcu. Vitae odio libero mauris quam nulla.',
//       isOwn: false
//     },
//     {
//       id: 2,
//       sender: 'You',
//       time: '10:48 AM',
//       text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit quis ut rullacor urna mi. Volutpat lectus erat. Eget facilisi scelerisque. Euismod.',
//       isOwn: true
//     },
//     {
//       id: 3,
//       sender: 'Rakibul',
//       time: '10:50 AM',
//       text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit vitae ut velit quis ornat nisl. Faucibus erat sit. Eget facilisi scelerisque. Euismod velit ut quis orci orci est arcu. Vitae odio libero mauris quam nulla.',
//       isOwn: false
//     },
//     {
//       id: 4,
//       sender: 'You',
//       time: '10:53 AM',
//       text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit quis ut rullacor urna mi. Volutpat lectus erat. Eget facilisi scelerisque. Euismod.',
//       isOwn: true
//     },
//   ];

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleSend = () => {
//     if (message.trim() || selectedFile) {
//       console.log('Sending:', { message, file: selectedFile });
//       setMessage('');
//       setSelectedFile(null);
//     }
//   };

//   return (
//     <div className="min-h-screen mt-28 bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex">
//       {/* Sidebar - Contacts List */}
//       <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-purple-500/20 flex flex-col">
//         <div className="p-6 border-b border-purple-500/20">
//           <h2 className="text-xl font-bold text-white">Messages</h2>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           {contacts.map((contact) => (
//             <button
//               key={contact.id}
//               onClick={() => setSelectedChat(contact.id)}
//               className={`w-full p-4 flex items-center gap-4 transition-all border-b border-gray-800/50 ${
//                 selectedChat === contact.id
//                   ? 'bg-purple-900/30 border-l-4 border-l-purple-500'
//                   : 'hover:bg-gray-800/30'
//               }`}
//             >
//               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl flex-shrink-0">
//                 {contact.avatar}
//               </div>
//               <div className="flex-1 text-left">
//                 <h3 className="text-white font-medium">{contact.name}</h3>
//                 <p className="text-gray-400 text-sm truncate">{contact.status}</p>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Chat Header */}
//         <div className="p-6 bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/20 flex items-center gap-4">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl">
//             👤
//           </div>
//           <div>
//             <h2 className="text-white font-semibold text-lg">Rakibul</h2>
//             <p className="text-gray-400 text-sm">Last seen 5 hours ago</p>
//           </div>
//         </div>

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
//             >
//               {!msg.isOwn && (
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-xl flex-shrink-0">
//                   👤
//                 </div>
//               )}
              
//               <div className={`max-w-md ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
//                 <div
//                   className={`px-5 py-3 rounded-2xl ${
//                     msg.isOwn
//                       ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-none'
//                       : 'bg-gray-800/80 text-gray-100 rounded-bl-none'
//                   }`}
//                 >
//                   <p className="text-sm leading-relaxed">{msg.text}</p>
//                 </div>
//                 <span className="text-xs text-gray-500 px-2">{msg.time}</span>
//               </div>

//               {msg.isOwn && (
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center text-xl flex-shrink-0">
//                   👤
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Input Area */}
//         <div className="p-6 bg-gray-900/50 backdrop-blur-sm border-t border-purple-500/20">
//           {selectedFile && (
//             <div className="mb-3 p-3 bg-purple-900/30 rounded-lg flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Image className="w-5 h-5 text-purple-400" />
//                 <span className="text-sm text-gray-300">{selectedFile.name}</span>
//               </div>
//               <button
//                 onClick={() => setSelectedFile(null)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 ✕
//               </button>
//             </div>
//           )}
          
//           <div className="flex items-center gap-3">
//             <div className="flex-1 relative">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//                 placeholder="Type a message..."
//                 className="w-full bg-gray-800/50 border border-gray-700 rounded-full px-6 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all pr-32"
//               />
              
//               <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
//                 <label className="cursor-pointer p-2 hover:bg-gray-700 rounded-full transition-colors">
//                   <Image className="w-5 h-5 text-gray-400 hover:text-purple-400" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileSelect}
//                     className="hidden"
//                   />
//                 </label>
                
//                 <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
//                   <Paperclip className="w-5 h-5 text-gray-400 hover:text-purple-400" />
//                 </button>
                
//                 <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
//                   <Smile className="w-5 h-5 text-gray-400 hover:text-purple-400" />
//                 </button>
//               </div>
//             </div>

//             <button
//               onClick={handleSend}
//               className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3.5 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30 flex items-center gap-2"
//             >
//               <span>Upload Design</span>
//               <Send className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [messages, setMessages] = useState<Record<string, any[]>>({
    RAkib: [
      { id: 1, text: "Thank you for reaching out. I'll get back to you shortly.", sender: 'me', time: '10:45 AM' },
      { id: 2, text: "I appreciate your message and will respond as soon as possible.", sender: 'other', time: '10:47 AM' },
      { id: 3, text: "Looking forward to our conversation!", sender: 'me', time: '10:50 AM' }
    ],
    Hasib: [
      { id: 1, text: "Hello! How can I help you today?", sender: 'me', time: '9:30 AM' },
      { id: 2, text: "Thanks for your message. I'm available to chat now.", sender: 'other', time: '9:32 AM' },
      { id: 3, text: "Let me know if you have any questions.", sender: 'me', time: '9:35 AM' }
    ],
    Arif: [
      { id: 1, text: "Good morning! I saw your message and wanted to reply.", sender: 'me', time: '8:15 AM' },
      { id: 2, text: "Thank you for reaching out. I'll get back to you shortly.", sender: 'other', time: '8:18 AM' }
    ],
    Jamylo: [
      { id: 1, text: "Hi there! I'm glad you contacted me.", sender: 'me', time: '11:20 AM' },
      { id: 2, text: "Thanks for your message. I'm available to chat now.", sender: 'other', time: '11:22 AM' },
      { id: 3, text: "Looking forward to our conversation!", sender: 'me', time: '11:25 AM' }
    ],
    Tokniol: [
      { id: 1, text: "Hello! How can I assist you today?", sender: 'me', time: '2:30 PM' },
      { id: 2, text: "Thanks for your message. I'll get back to you shortly.", sender: 'other', time: '2:32 PM' }
    ],
    Hasif: [
      { id: 1, text: "Good afternoon! I saw your message and wanted to reply.", sender: 'me', time: '3:15 PM' },
      { id: 2, text: "Thank you for reaching out. I'll get back to you shortly.", sender: 'other', time: '3:18 PM' }
    ]
  });
  
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock user data
  const users = [
    { id: 'RAkib', name: 'RAkib', avatar: 'https://i.pravatar.cc/150?img=1', lastSeen: 'Just now' },
    { id: 'Hasib', name: 'Hasib', avatar: 'https://i.pravatar.cc/150?img=2', lastSeen: 'Just now' },
    { id: 'Arif', name: 'Arif', avatar: 'https://i.pravatar.cc/150?img=3', lastSeen: 'Just now' },
    { id: 'Jamylo', name: 'Jamylo', avatar: 'https://i.pravatar.cc/150?img=4', lastSeen: 'Just now' },
    { id: 'Tokniol', name: 'Tokniol', avatar: 'https://i.pravatar.cc/150?img=5', lastSeen: 'Just now' },
    { id: 'Hasif', name: 'Hasif', avatar: 'https://i.pravatar.cc/150?img=6', lastSeen: 'Just now' }
  ];
  
  // Set default selected user
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0].id);
    }
  }, [users, selectedUser]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle mobile view - hide sidebar when user is selected
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else if (selectedUser) {
        setShowSidebar(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedUser]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    
    if (selectedUser) {
      const newMsg = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: selectedFile ? { name: selectedFile.name, type: selectedFile.type } : null
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedUser]: [...(prev[selectedUser] || []), newMsg]
      }));
      
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUploadDesign = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            
            if (selectedUser) {
              const uploadMsg = {
                id: Date.now(),
                text: `Uploaded: ${selectedFile.name}`,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                file: { name: selectedFile.name, type: selectedFile.type }
              };
              
              setMessages(prev => ({
                ...prev,
                [selectedUser]: [...(prev[selectedUser] || []), uploadMsg]
              }));
            }
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleBackToUsers = () => {
    setShowSidebar(true);
    if (window.innerWidth < 768) {
      setSelectedUser(null);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };
  
  const renderMessageBubble = (msg: any, index: number) => {
    const isMe = msg.sender === 'me';
    const isFile = msg.file;
    
    return (
      <div 
        key={msg.id} 
        className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isMe && (
          <img 
            src={users.find(u => u.id === selectedUser)?.avatar || 'https://i.pravatar.cc/150?img=1'} 
            alt="User" 
            className="w-8 h-8 rounded-full mr-2 self-end"
          />
        )}
        
        <div 
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isMe 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-white'
          }`}
        >
          {isFile ? (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm">{msg.file.name}</span>
            </div>
          ) : (
            <p className="text-sm">{msg.text}</p>
          )}
          
          <div className={`text-xs mt-1 ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
            {msg.time}
          </div>
        </div>
        
        {isMe && (
          <img 
            src={users.find(u => u.id === selectedUser)?.avatar || 'https://i.pravatar.cc/150?img=1'} 
            alt="User" 
            className="w-8 h-8 rounded-full ml-2 self-end"
          />
        )}
      </div>
    );
  };

  const currentUser = users.find(u => u.id === selectedUser);

  return (
    <div className="min-h-screen md:min-h-[800px] md:mt-28 mt-20 bg-black flex p-2 md:p-4">
      {/* Sidebar - User List */}
      <div className={`${showSidebar ? 'block' : 'hidden'} ${selectedUser && window.innerWidth < 768 ? 'w-full' : 'w-full md:w-80'} bg-gray-900 rounded-xl p-3 md:p-4 md:mr-4 overflow-y-auto`}>
        <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
        
        <div className="space-y-3">
          {users.map(user => (
            <div 
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser === user.id 
                  ? 'bg-purple-600/20 border border-purple-500/30' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-400">{user.lastSeen}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className={`${!showSidebar || window.innerWidth >= 768 ? 'flex' : 'hidden'} flex-1 bg-gray-900 rounded-xl p-3 md:p-4 flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
          <div className="flex items-center">
            <button
              onClick={handleBackToUsers}
              className="md:hidden mr-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img 
              src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=1'} 
              alt={currentUser?.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium text-white">{currentUser?.name}</div>
              <div className="text-xs text-gray-400">Last seen: {currentUser?.lastSeen}</div>
            </div>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 px-1">
          {messages[selectedUser]?.map((msg, index) => renderMessageBubble(msg, index))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="border-t border-gray-700 pt-4">
          {selectedFile && (
            <div className="mb-2 flex items-center bg-gray-800 rounded-lg p-2 text-sm text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate flex-1">{selectedFile.name}</span>
              {isUploading && (
                <span className="ml-2 text-purple-400">({uploadProgress}%)</span>
              )}
              {!isUploading && (
                <button 
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors flex-shrink-0"
              aria-label="Attach file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
            
            {selectedFile && !isUploading && (
              <button
                type="button"
                onClick={handleUploadDesign}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors flex-shrink-0"
                aria-label="Upload file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            
            {!selectedFile && (
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  !newMessage.trim()
                    ? 'bg-purple-600/30 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.894 2.553c-.808-.843-2.097-.774-3.189.177.177.843.526 1.748 1.155 2.633 1.117 1.513 2.567 2.978 4.015 4.015 1.513 1.117 2.978 2.567 4.015 4.015 1.047 1.047 1.846 2.39 1.846 3.953 0 1.211-.478 2.377-1.307 3.206-1.307 1.307-2.615 1.846-3.953 1.846-1.563 0-2.909-.798-3.953-1.846-1.047-1.047-1.846-2.39-1.846-3.953 0-1.563.798-2.909 1.846-3.953 1.047-1.047 2.39-1.846 3.953-1.846 1.563 0 2.909.798 3.953 1.846 1.047 1.047 1.846 2.39 1.846 3.953 0 1.563-.798 2.909-1.846 3.953-1.047 1.047-2.39 1.846-3.953 1.846-1.563 0-2.909-.798-3.953-1.846-1.047-1.047-1.846-2.39-1.846-3.953 0-1.563.798-2.909 1.846-3.953 1.047-1.047 2.39-1.846 3.953-1.846 1.563 0 2.909.798 3.953 1.846 1.047 1.047 1.846 2.39 1.846 3.953 0 1.563-.798 2.909-1.846 3.953-1.047 1.047-2.39 1.846-3.953 1.846-1.563 0-2.909-.798-3.953-1.846-1.047-1.047-1.846-2.39-1.846-3.953 0-1.563.798-2.909 1.846-3.953 1.047-1.047 2.39-1.846 3.953-1.846 1.563 0 2.909.798 3.953 1.846 1.047 1.047 1.846 2.39 1.846 3.953 0 1.563-.798 2.909-1.846 3.953-1.047 1.047-2.39 1.846-3.953 1.846-1.563 0-2.909-.798-3.953-1.846-1.047-1.047-1.846-2.39-1.846-3.953 0-1.563.798-2.909 1.846-3.953z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}