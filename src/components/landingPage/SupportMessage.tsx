// 'use client';

// import { useState, useEffect } from 'react';
// import { MessageCircle, X, Send, User } from 'lucide-react';
// import Image from 'next/image';

// interface Message {
//   id: number;
//   text: string;
//   sender: 'user' | 'admin';
//   timestamp: Date;
// }

// export default function SupportMessage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   // Load conversation from localStorage (simulating real data)
//   useEffect(() => {
//     const savedMessages = localStorage.getItem('supportMessages');
//     if (savedMessages) {
//       setMessages(JSON.parse(savedMessages, (key, value) => {
//         if (key === 'timestamp') return new Date(value);
//         return value;
//       }));
//     }
//   }, []);

//   // Save messages to localStorage when they change
//   useEffect(() => {
//     localStorage.setItem('supportMessages', JSON.stringify(messages));
//   }, [messages]);

//   const sendMessage = () => {
//     if (newMessage.trim() === '') return;

//     const userMessage: Message = {
//       id: Date.now(),
//       text: newMessage,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setNewMessage('');

//     // Simulate admin typing and response
//     setIsTyping(true);
//     setTimeout(() => {
//       const adminMessage: Message = {
//         id: Date.now() + 1,
//         text: "Thank you for your message. Our support team will get back to you shortly.",
//         sender: 'admin',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, adminMessage]);
//       setIsTyping(false);
//     }, 2000);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <> 
//    <button
//   onClick={() => setIsOpen(!isOpen)}
//   className="fixed bottom-4 right-6 text-white p-0 rounded-full shadow-2xl z-50 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:shadow-blue-500/50 animate-bounce-slow group"
//   style={{
//     animation: 'bounce-slow 3s infinite, pulse-ring 2s infinite'
//   }}
//   aria-label="Open support chat"
// >
//   {/* Pulsing Ring Effect */}
//   {/* <span className="absolute inset-1 rounded-full bg-blue-400 opacity-75 animate-ping"></span> */}
  
//   {/* Your Image Icon */}
//   <div className="relative">
//     <Image 
//       src="/images/messageicon.png"
//       alt="Support"
//       width={50}
//       height={50}
//       className="group-hover:rotate-12 transition-transform duration-300"
//     />
    
//     {/* Notification Badge */}
//     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
//       2
//     </span>
//   </div>
// </button>

//  <style jsx>{`
//         @keyframes bounce-slow {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }

//         @keyframes wiggle {
//           0%, 100% {
//             transform: rotate(0deg);
//           }
//           25% {
//             transform: rotate(-5deg);
//           }
//           75% {
//             transform: rotate(5deg);
//           }
//         }

//         @keyframes float {
//           0%, 100% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-15px);
//           }
//         }

//         @keyframes breath {
//           0%, 100% {
//             transform: scale(1);
//             opacity: 0.3;
//           }
//           50% {
//             transform: scale(1.1);
//             opacity: 0.6;
//           }
//         }

//         @keyframes spin-slow {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         .animate-bounce-slow {
//           animation: bounce-slow 2s infinite;
//         }

//         .animate-wiggle {
//           animation: wiggle 2s ease-in-out infinite;
//         }

//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }

//         .animate-breath {
//           animation: breath 2s ease-in-out infinite;
//         }

//         .animate-spin-slow {
//           animation: spin-slow 3s linear infinite;
//         }
//       `}</style>

//       {/* Support modal */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-900 rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
//             {/* Modal header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-700">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white">Support Chat</h3>
//                   <p className="text-xs text-green-500">Online</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <X className="w-6 h-6 cursor-pointer" />
//               </button>
//             </div>

//             {/* Messages container */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-xs p-3 rounded-lg ${
//                       message.sender === 'user'
//                         ? 'bg-purple-600 text-white rounded-br-none'
//                         : 'bg-gray-800 text-gray-200 rounded-bl-none'
//                     }`}
//                   >
//                     <p>{message.text}</p>
//                     <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
//                       {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-gray-800 text-gray-200 p-3 rounded-lg rounded-bl-none">
//                     <div className="flex space-x-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Message input */}
//             <div className="p-4 border-t border-gray-700">
//               <div className="flex items-center space-x-2">
//                 <textarea
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type your message..."
//                   className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//                   rows={2}
//                 />
//                 <button
//                   onClick={sendMessage}
//                   disabled={!newMessage.trim()}
//                   className={`p-2 rounded-full ${
//                     newMessage.trim()
//                       ? 'bg-purple-600 text-white hover:bg-purple-700'
//                       : 'bg-gray-700 text-gray-500'
//                   }`}
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Loader } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
}

export default function SupportMessage() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('supportMessages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages, (key, value) => 
        key === 'timestamp' ? new Date(value) : value
      );
      setMessages(parsed);
      
      // Calculate unread messages (admin messages since last user interaction)
      const lastUserMsg = parsed.filter((m: Message) => m.sender === 'user').pop();
      if (lastUserMsg) {
        const unread = parsed.filter((m: Message) => 
          m.sender === 'admin' && new Date(m.timestamp) > new Date(lastUserMsg.timestamp)
        ).length;
        setUnreadCount(unread);
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('supportMessages', JSON.stringify(messages));
    
    // Reset unread count when chat is open
    if (isOpen) setUnreadCount(0);
  }, [messages, isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus textarea when chat opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setUnreadCount(0);

    // Simulate admin response
    setIsTyping(true);
    setTimeout(() => {
      const adminMessage: Message = {
        id: Date.now() + 1,
        text: "Thank you for your message! Our support team will respond shortly. For urgent issues, please email support@example.com.",
        sender: 'admin',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, adminMessage]);
      setIsTyping(false);
      
      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) setUnreadCount(0); // Clear badge when opening
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          isOpen ? 'hidden' : 'block'
        }`}
        aria-label={unreadCount > 0 ? `You have ${unreadCount} new messages` : "Open support chat"}
      >
        <div className="relative">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-3 rounded-full shadow-xl">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          
          {/* Smart notification badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          
          {/* Subtle pulse animation */}
          <span className="absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping"></span>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 w-96 bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-800 overflow-hidden"
          role="dialog"
          aria-label="Support chat window"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/30 p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center">
                  Support Team
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                    Online
                  </span>
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">Typically responds in under 2 minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-800 p-1.5 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50 max-h-[400px] custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 opacity-80 flex items-center justify-end ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-300 p-3 rounded-2xl rounded-bl-none border border-gray-700 flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-xs ml-1.5">Support is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-3 bg-gray-900/70 border-t border-gray-800">
            <div className="flex items-end space-x-2">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[44px] max-h-32 transition-all"
                rows={1}
                aria-label="Message input"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isTyping}
                className={`p-2.5 rounded-xl transition-all ${
                  newMessage.trim() && !isTyping
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-800 transform hover:scale-105'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 text-center">
              Responses may be delayed outside business hours (9AM-6PM EST)
            </p>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4c1d95;
          border-radius: 10px;
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
    </>
  );
}