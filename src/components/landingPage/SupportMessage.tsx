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

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
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

  // Load conversation from localStorage (simulating real data)
  useEffect(() => {
    const savedMessages = localStorage.getItem('supportMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      }));
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('supportMessages', JSON.stringify(messages));
  }, [messages]);

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

    // Simulate admin typing and response
    setIsTyping(true);
    setTimeout(() => {
      const adminMessage: Message = {
        id: Date.now() + 1,
        text: "Thank you for your message. Our support team will get back to you shortly.",
        sender: 'admin',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, adminMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <> 
   <button
  onClick={() => setIsOpen(!isOpen)}
  className="fixed bottom-4 right-6 text-white p-0 rounded-full shadow-2xl z-50 cursor-pointer transition-all duration-300 transform hover:scale-110 hover:shadow-blue-500/50 animate-bounce-slow group"
  style={{
    animation: 'bounce-slow 3s infinite, pulse-ring 2s infinite'
  }}
  aria-label="Open support chat"
>
  {/* Pulsing Ring Effect */}
  {/* <span className="absolute inset-1 rounded-full bg-blue-400 opacity-75 animate-ping"></span> */}
  
  {/* Your Image Icon */}
  <div className="relative">
    <Image 
      src="/images/messageicon.png"
      alt="Support"
      width={50}
      height={50}
      className="group-hover:rotate-12 transition-transform duration-300"
    />
    
    {/* Notification Badge */}
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
      2
    </span>
  </div>
</button>

 <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes breath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-breath {
          animation: breath 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      {/* Support modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <div className="bg-gray-900 rounded-xl w-96 h-[500px] flex flex-col shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Support Chat</h3>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6 cursor-pointer" />
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-200 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={2}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-full ${
                    newMessage.trim()
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}