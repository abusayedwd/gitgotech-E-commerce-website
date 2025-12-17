"use client";

import { useState } from 'react';
import { Send, Image, Paperclip, Smile } from 'lucide-react';

export default function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const contacts = [
    { id: 0, name: 'RAbb', avatar: '👤', status: 'Thanks you for reaching', time: '' },
    { id: 1, name: 'Habib', avatar: '👤', status: 'Thanks you for reaching', time: '' },
    { id: 2, name: 'Arif', avatar: '👤', status: 'Thanks you for reaching', time: '' },
    { id: 3, name: 'Jamiylo', avatar: '👤', status: 'Thanks you for reaching', time: '' },
    { id: 4, name: 'Taknol', avatar: '👤', status: 'Thanks you for reaching', time: '' },
    { id: 5, name: 'Hasif', avatar: '👤', status: 'Thanks you for reaching', time: '' },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Rakibul',
      time: '10:45 AM',
      text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit vitae ut velit quis ornat nisl. Faucibus erat sit. Eget facilisi scelerisque. Euismod velit ut quis orci orci est arcu. Vitae odio libero mauris quam nulla.',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      time: '10:48 AM',
      text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit quis ut rullacor urna mi. Volutpat lectus erat. Eget facilisi scelerisque. Euismod.',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Rakibul',
      time: '10:50 AM',
      text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit vitae ut velit quis ornat nisl. Faucibus erat sit. Eget facilisi scelerisque. Euismod velit ut quis orci orci est arcu. Vitae odio libero mauris quam nulla.',
      isOwn: false
    },
    {
      id: 4,
      sender: 'You',
      time: '10:53 AM',
      text: 'Lorem ipsum dolor sit amet consectetur. Etiam non sit quis ut rullacor urna mi. Volutpat lectus erat. Eget facilisi scelerisque. Euismod.',
      isOwn: true
    },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (message.trim() || selectedFile) {
      console.log('Sending:', { message, file: selectedFile });
      setMessage('');
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen mt-28 bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 flex">
      {/* Sidebar - Contacts List */}
      <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-purple-500/20 flex flex-col">
        <div className="p-6 border-b border-purple-500/20">
          <h2 className="text-xl font-bold text-white">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedChat(contact.id)}
              className={`w-full p-4 flex items-center gap-4 transition-all border-b border-gray-800/50 ${
                selectedChat === contact.id
                  ? 'bg-purple-900/30 border-l-4 border-l-purple-500'
                  : 'hover:bg-gray-800/30'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl flex-shrink-0">
                {contact.avatar}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-medium">{contact.name}</h3>
                <p className="text-gray-400 text-sm truncate">{contact.status}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-6 bg-gray-900/50 backdrop-blur-sm border-b border-purple-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">Rakibul</h2>
            <p className="text-gray-400 text-sm">Last seen 5 hours ago</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isOwn && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-xl flex-shrink-0">
                  👤
                </div>
              )}
              
              <div className={`max-w-md ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-5 py-3 rounded-2xl ${
                    msg.isOwn
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-none'
                      : 'bg-gray-800/80 text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-500 px-2">{msg.time}</span>
              </div>

              {msg.isOwn && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center text-xl flex-shrink-0">
                  👤
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-900/50 backdrop-blur-sm border-t border-purple-500/20">
          {selectedFile && (
            <div className="mb-3 p-3 bg-purple-900/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-gray-300">{selectedFile.name}</span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full px-6 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all pr-32"
              />
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <label className="cursor-pointer p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <Image className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                
                <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </button>
                
                <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                  <Smile className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3.5 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30 flex items-center gap-2"
            >
              <span>Upload Design</span>
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}