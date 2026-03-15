 
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useGetChatListQuery, useGetChatMessagesQuery, useSendMessageMutation } from '@/redux/features/messages/messageSlice';
import { initializeSocket, getSocket, disconnectSocket, onEvent, offEvent } from '@/lib/socket';
import { IMAGE_BASE_URL } from '@/lib/imageBaseUrl';

interface Message {
  _id?: string;
  text?: string;
  content?: string;
  sender: 'me' | 'other';
  time: string;
  file?: { name: string; type: string; url?: string } | null;
  receiverId?: string;
  createdAt?: string;
}

interface ChatUser {
  _id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastSeen?: string;
  online?: boolean;
}

const MessagesPage = () => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
  const { data: chatListData, isLoading: chatListLoading } = useGetChatListQuery(undefined, {
    skip: typeof window === 'undefined',
  });
  
  const { data: messagesData, isLoading: messagesLoading } = useGetChatMessagesQuery(selectedUser, {
    skip: !selectedUser,
  });
  
  const [sendMessage] = useSendMessageMutation();

  // Get chat list from API
  const chatUsers: ChatUser[] = chatListData?.data || [];

  // Get messages for selected chat
  const messages: Message[] = messagesData?.data || [];

  // Initialize socket connection on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token) {
        const socket = initializeSocket(token);
        setIsSocketConnected(socket.connected);

        socket.on('connect', () => {
          setIsSocketConnected(true);
          console.log('✅ Socket connected, ID:', socket.id);
        });

        socket.on('disconnect', () => {
          setIsSocketConnected(false);
          console.log('❌ Socket disconnected');
        });

        // Listen for incoming messages
        socket.on('receiveMessage', (newMessage: Message) => {
          console.log('📩 New message received:', newMessage);
          // The RTK Query cache will automatically refetch due to providesTags
        });

        return () => {
          socket.off('receiveMessage');
        };
      }
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle mobile view
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, [selectedUser]);

  const handleSendMessage = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e) {
      if ('preventDefault' in e) e.preventDefault();
    }
    if (!newMessage.trim() && !selectedFile) return;

    if (selectedUser) {
      try {
        const socket = getSocket();
        
        // Send via socket if connected
        if (socket?.connected) {
          socket.emit('sendMessage', {
            receiverId: selectedUser,
            content: newMessage,
          });
        }
        
        // Also send via API for persistence
        await sendMessage({
          receiverId: selectedUser,
          content: newMessage,
        }).unwrap();

        setNewMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadDesign = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
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
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSelectedUser('');
    }
  };

  const handleSelectUser = (userId: string): void => {
    setSelectedUser(userId);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const renderMessageBubble = (msg: Message, index: number) => {
    const isMe = msg.sender === 'me';
    const isFile = msg.file;
    const messageText = msg.text || msg.content || '';

    return (
      <div
        key={msg._id || index}
        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
      >
        {!isMe && (
          <img
            src={chatUsers.find(u => u._id === selectedUser)?.avatar || 'https://i.pravatar.cc/150?img=1'}
            alt="User"
            className="w-8 h-8 rounded-full mr-2 self-end flex-shrink-0"
          />
        )}

        <div
          className={`max-w-[75%] lg:max-w-md px-4 py-2 rounded-lg break-words ${
            isMe
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-white'
          }`}
        >
          {isFile ? (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm truncate">{msg.file?.name}</span>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{messageText}</p>
          )}

          <div className={`text-xs mt-1 ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
            {msg.time || new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {isMe && (
          <img
            src="https://i.pravatar.cc/150?img=1"
            alt="User"
            className="w-8 h-8 rounded-full ml-2 self-end flex-shrink-0"
          />
        )}
      </div>
    );
  };

  const currentUser = chatUsers.find(u => u._id === selectedUser);

  return (
    <div className="mt-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex p-2 md:p-4">
      {/* Connection Status */}
      <div className="fixed top-20 right-4 z-50">
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${
          isSocketConnected 
            ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
            : 'bg-red-600/20 text-red-400 border border-red-500/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          {isSocketConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Sidebar - User List */}
      <div className={`${showSidebar ? 'block' : 'hidden'} ${selectedUser ? 'w-full md:w-80' : 'w-full md:w-80'} h-[550px] md:h-[750px] bg-gray-900/80 backdrop-blur-sm rounded-xl p-3 md:p-4 md:mr-4 border border-gray-700/50 flex flex-col`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <div className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {chatUsers.length}
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-1">
          {chatListLoading ? (
            <div className="text-center text-gray-400 py-8">Loading chats...</div>
          ) : chatUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No conversations yet</div>
          ) : (
            chatUsers.map(user => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user._id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedUser === user._id
                    ? 'bg-purple-600/20 border border-purple-500/50 shadow-lg shadow-purple-500/10'
                    : 'hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-gray-700"
                  />
                  <div className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-gray-900 ${user.online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-gray-400 flex items-center">
                    {user.lastMessage && (
                      <>
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                        {user.lastMessage.substring(0, 30)}...
                      </>
                    )}
                  </div>
                </div>
                {selectedUser === user._id && (
                  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${!showSidebar || showSidebar ? 'flex' : 'hidden'} flex-1 bg-gray-900/80 backdrop-blur-sm rounded-xl h-[550px] md:h-[750px] p-3 md:p-4 flex-col border border-gray-700/50 overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700/50">
          <div className="flex items-center">
            <button
              onClick={handleBackToUsers}
              className="md:hidden mr-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=1'}
                alt={currentUser?.name}
                className="w-10 h-10 rounded-full mr-3 border-2 border-purple-500"
              />
              <div className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-gray-900 ${currentUser?.online ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            </div>
            <div>
              <div className="font-semibold text-white">{currentUser?.name}</div>
              <div className="text-xs text-green-400 flex items-center">
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${currentUser?.online ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                {currentUser?.online ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 px-1 custom-scrollbar">
          {messagesLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No messages yet. Start a conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => renderMessageBubble(msg, index))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700/50 pt-4">
          {selectedFile && (
            <div className="mb-3 flex items-center bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-white">
              <div className="flex-1 flex items-center">
                <div className="bg-purple-600/20 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium truncate">{selectedFile.name}</div>
                  {isUploading && (
                    <div className="mt-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              {isUploading && (
                <span className="ml-3 text-purple-400 font-semibold">{uploadProgress}%</span>
              )}
              {!isUploading && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="ml-3 text-red-400 hover:text-red-300 text-xl font-bold transition-colors"
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
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-purple-400 transition-all duration-200 border border-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {selectedFile && !isUploading && (
              <button
                type="button"
                onClick={handleUploadDesign}
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-all duration-200 shadow-lg shadow-purple-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            )}

            {!selectedFile && (
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  !newMessage.trim()
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;