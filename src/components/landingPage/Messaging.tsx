

"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useGetChatListQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useGetBlockedListQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} from '@/redux/features/messages/messageSlice';
import { getSocket, initializeSocket, disconnectSocket } from '@/lib/socket';
import url from '@/redux/api/baseUrl';
import toast from 'react-hot-toast';
import ReportModal from '@/components/shared/ReportModal';

const getMyUserId = () => {
  if (typeof window === 'undefined') return '';
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user?._id || '';
    } catch {
      return '';
    }
  }
  return '';
};

interface Participant {
  _id: string;
  name: string;
  image?: string;
}

interface Message {
  _id: string;
  chatId: string;
  content: string;
  senderId: Participant;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatUser {
  _id: string;
  participants: Participant[];
  isActive: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlockedUserEntry {
  _id: string;
  reason: string;
  createdAt: string;
  blockedUser: {
    _id: string;
    name: string;
    email?: string;
    image?: string;
    role?: string;
  };
}

const getUserImage = (image?: string) => {
  if (!image) return 'https://i.pravatar.cc/150?img=2';
  if (image.startsWith('http')) return image;
  return `${url}/${image}`;
};

const MessagesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId');

  // ✅ FIX: isMounted prevents SSR/client HTML mismatch
  // All conditional UI that depends on client-only state (loading, localStorage, window)
  // is suppressed until after first client render.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const MY_USER_ID = getMyUserId();

  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [vendorInitDone, setVendorInitDone] = useState(false);
  const vendorInitInProgress = useRef(false);
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'blocked'>('chats');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockSearch, setBlockSearch] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── RTK Query ────────────────────────────────────────────────
  const {
    data: chatListData,
    isLoading: chatListLoading,
    refetch: refetchChatList,
  } = useGetChatListQuery(undefined, {
    // ✅ FIX: skip on server — only fetch after mount to avoid SSR mismatch
    skip: !isMounted,
  });

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery(selectedChatId, {
    skip: !selectedChatId || !isMounted,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  const {
    data: blockedListData,
    isLoading: blockedListLoading,
    refetch: refetchBlockedList,
  } = useGetBlockedListQuery(
    { page: 1, limit: 50, searchTerm: blockSearch },
    { skip: !isMounted },
  );

  // Safely extract array — API might return data, data.data, or data.chats
  const rawChatData = chatListData?.data;
  
  const chatUsers: ChatUser[] = Array.isArray(rawChatData)
    ? rawChatData
    : Array.isArray(rawChatData?.data)
    ? rawChatData.data
    : Array.isArray(rawChatData?.chats)
    ? rawChatData.chats
    : [];

  const messages: Message[] = messagesData?.data?.messages || [];

  const blockedUsers: BlockedUserEntry[] =
    blockedListData?.data?.data || [];

  const blockedUserIds = new Set(
    blockedUsers.map((entry) => entry.blockedUser?._id).filter(Boolean),
  );

  // ─── Helpers ──────────────────────────────────────────────────
  const getOtherParticipant = useCallback(
    (chat: ChatUser): Participant => {
      return (
        chat.participants.find((p) => p._id !== MY_USER_ID) ||
        chat.participants[0]
      );
    },
    [MY_USER_ID]
  );

  const currentChat = chatUsers.find((c) => c._id === selectedChatId);
  const currentOtherUser = currentChat ? getOtherParticipant(currentChat) : null;

  const isCurrentUserBlocked = currentOtherUser
    ? blockedUserIds.has(currentOtherUser._id)
    : false;

  // ─── Core send helper ─────────────────────────────────────────
  const sendTextMessage = useCallback(
    async (content: string, receiverId: string) => {
      const formData = new FormData();
      formData.append('content', JSON.stringify(content));
      const res = await sendMessage({ receiverId, formData }).unwrap();
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit('sendMessage', { receiverId, content });
      }
      return res;
    },
    [sendMessage]
  );

  // ─── Vendor init flow ─────────────────────────────────────────
  useEffect(() => {
    if (!isMounted || !vendorId || chatListLoading || vendorInitDone || vendorInitInProgress.current) return;

    vendorInitInProgress.current = true;

    const run = async () => {
      try {
        const existing = chatUsers.find((chat) => {
          const other = getOtherParticipant(chat);
          return other._id === vendorId;
        });

        if (existing) {
          setSelectedChatId(existing._id);
          setSelectedReceiverId(vendorId);
          if (window.innerWidth < 768) setShowSidebar(false);
        } else {
          setSelectedReceiverId(vendorId);
          await sendTextMessage('Hello', vendorId);
          const updated = await refetchChatList().unwrap();
          const freshChats: ChatUser[] = (updated as any)?.data || [];
          const newChat = freshChats.find((chat) => {
            const other = getOtherParticipant(chat);
            return other._id === vendorId;
          });
          if (newChat) {
            setSelectedChatId(newChat._id);
            if (window.innerWidth < 768) setShowSidebar(false);
          }
        }
      } catch (err) {
        console.error('Vendor init error:', err);
      } finally {
        setVendorInitDone(true);
        vendorInitInProgress.current = false;
      }
    };

    run();
  }, [isMounted, vendorId, chatListLoading, vendorInitDone, chatUsers, getOtherParticipant, sendTextMessage, refetchChatList]);

  useEffect(() => {
    setVendorInitDone(false);
    vendorInitInProgress.current = false;
  }, [vendorId]);

  // ─── Socket init ──────────────────────────────────────────────
  useEffect(() => {
    if (!isMounted) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = initializeSocket(token);
    setIsSocketConnected(socket.connected);
    socket.on('connect', () => setIsSocketConnected(true));
    socket.on('disconnect', () => setIsSocketConnected(false));
    socket.on('connect_error', (error: any) => console.error('❌ Socket error:', error.message));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      disconnectSocket();
    };
  }, [isMounted]);

  // ─── Socket receiveMessage ────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleReceiveMessage = (_incoming: any) => {
      if (selectedChatId) refetchMessages();
    };
    socket.off('receiveMessage');
    socket.on('receiveMessage', handleReceiveMessage);
    return () => { socket.off('receiveMessage', handleReceiveMessage); };
  }, [selectedChatId, refetchMessages]);

  // ─── Scroll to bottom ─────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Responsive sidebar ───────────────────────────────────────
  useEffect(() => {
    if (!isMounted) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowSidebar(true);
      else if (selectedChatId) setShowSidebar(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted, selectedChatId]);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleSelectChat = (chat: ChatUser) => {
    const otherUser = getOtherParticipant(chat);
    setSelectedChatId(chat._id);
    setSelectedReceiverId(otherUser._id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) setShowSidebar(false);
  };

  const handleSendMessage = async (
    e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent
  ) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    if (!newMessage.trim() || !selectedReceiverId) return;
    try {
      await sendTextMessage(newMessage, selectedReceiverId);
      setNewMessage('');
      refetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleUploadAndSend = async () => {
    if (!selectedFile || !selectedReceiverId) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', selectedFile);
      formData.append('content', JSON.stringify(newMessage.trim() || ''));
      await sendMessage({ receiverId: selectedReceiverId, formData }).unwrap();
      setSelectedFile(null);
      setNewMessage('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      refetchMessages();
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleBackToUsers = () => {
    setShowSidebar(true);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSelectedChatId('');
      setSelectedReceiverId('');
    }
  };

  const handleBlockUser = async () => {
    if (!selectedReceiverId) return;
    if (!blockReason.trim()) {
      toast.error('Please enter a reason for blocking');
      return;
    }
    try {
      await blockUser({
        userId: selectedReceiverId,
        reason: blockReason.trim(),
      }).unwrap();
      toast.success('User blocked successfully');
      setShowBlockModal(false);
      setBlockReason('');
      refetchBlockedList();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to block user');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser(userId).unwrap();
      toast.success('User unblocked successfully');
      refetchBlockedList();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to unblock user');
    }
  };

  // ─── Render message bubble ────────────────────────────────────
  const renderMessageBubble = (msg: Message, index: number) => {
    const isMe = msg.senderId?._id === MY_USER_ID;
    const myAvatar = msg.senderId?.image || 'https://i.pravatar.cc/150?img=1';
    const otherAvatar = currentOtherUser?.image || 'https://i.pravatar.cc/150?img=2';

    return (
      <div
        key={msg._id || index}
        className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
      >
        {!isMe && (
          <img
            src={url + otherAvatar}
            alt={currentOtherUser?.name}
            className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-gray-700"
          />
        )}

        <div className={`max-w-[70%] lg:max-w-md px-4 py-2 rounded-2xl break-words ${
          isMe ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-gray-700 text-white rounded-bl-sm'
        }`}>
          {msg.documents && msg.documents.length > 0 && (
            <div className="mb-2 space-y-2">
              {msg.documents.map((docUrl, i) => {
                const fullUrl = `${url}/${docUrl}`;
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(docUrl);
                return isImage ? (
                  <img key={i} src={fullUrl} alt={`Image ${i + 1}`}
                    className="w-60 h-60 rounded-lg cursor-pointer hover:opacity-90"
                    onClick={() => window.open(fullUrl, '_blank')} />
                ) : (
                  <a key={i} href={fullUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm underline">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    File {i + 1}
                  </a>
                );
              })}
            </div>
          )}
          {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
          <div className={`text-xs mt-1 ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {isMe && (
          <img src={myAvatar} alt="Me"
            className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-purple-500" />
        )}
      </div>
    );
  };

  // ✅ FIX: render nothing until mounted — prevents SSR/client HTML mismatch
  if (!isMounted) return null;

  // ─── JSX ──────────────────────────────────────────────────────
  return (
    <div className="mt-24 flex h-[calc(100dvh-6rem)] min-h-[calc(100dvh-6rem)] flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 md:p-4">

      {/* Socket status badge */}
      <div className="fixed top-24 right-4 z-50">
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${
          isSocketConnected
            ? 'bg-green-600/20 text-green-400 border border-green-500/30'
            : 'bg-red-600/20 text-red-400 border border-red-500/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          {isSocketConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className={`
        ${showSidebar ? 'flex' : 'hidden'}
        h-full min-h-0 w-full shrink-0 flex-col md:mr-4 md:w-80
        bg-gray-900/80 backdrop-blur-sm rounded-xl
        p-3 md:p-4
        border border-gray-700/50
      `}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <div className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {sidebarTab === 'chats' ? chatUsers.length : blockedUsers.length}
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setSidebarTab('chats')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              sidebarTab === 'chats'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Chats
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('blocked')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              sidebarTab === 'blocked'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Blocked
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar pr-1">
          {sidebarTab === 'chats' ? (
            <>
          {chatListLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              Loading chats...
            </div>
          ) : chatUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No conversations yet</div>
          ) : (
            chatUsers.map((chat) => {
              const otherUser = getOtherParticipant(chat);
              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedChatId === chat._id
                      ? 'bg-purple-600/20 border border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'hover:bg-gray-800/50 border border-transparent'
                  }`}
                >
                  <div className="relative mr-3">
                    <img
                      src={otherUser.image || 'https://i.pravatar.cc/150?img=2'}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-700"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 bg-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white">{otherUser.name}</div>
                    {chat.lastMessage && (
                      <div className="text-xs text-gray-400 truncate">
                        {chat.lastMessage.length > 35 ? chat.lastMessage.substring(0, 35) + '...' : chat.lastMessage}
                      </div>
                    )}
                  </div>
                  {selectedChatId === chat._id && (
                    <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })
          )}
            </>
          ) : (
            <>
              <input
                type="text"
                value={blockSearch}
                onChange={(e) => setBlockSearch(e.target.value)}
                placeholder="Search blocked users..."
                className="w-full px-3 py-2 mb-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {blockedListLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  Loading blocked list...
                </div>
              ) : blockedUsers.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No blocked users</div>
              ) : (
                blockedUsers.map((entry) => {
                  const user = entry.blockedUser;
                  if (!user) return null;
                  return (
                    <div
                      key={entry._id}
                      className="flex items-center p-3 rounded-lg bg-gray-800/40 border border-gray-700/50"
                    >
                      <img
                        src={getUserImage(user.image)}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-700 mr-3 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{user.name}</div>
                        {user.role && (
                          <div className="text-xs text-purple-300 capitalize">{user.role}</div>
                        )}
                        {entry.reason && (
                          <div className="text-xs text-gray-400 truncate">Reason: {entry.reason}</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnblockUser(user._id)}
                        disabled={isUnblocking}
                        className="ml-2 px-3 py-1.5 text-xs font-medium bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 disabled:opacity-50"
                      >
                        Unblock
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Main Chat ── */}
      <div className={`
        ${!showSidebar || selectedChatId ? 'flex' : 'hidden md:flex'}
        h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gray-900/80 backdrop-blur-sm rounded-xl
        border border-gray-700/50 p-3 md:p-4
      `}>
        {!selectedChatId ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-20 h-20 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm text-gray-500 mt-1">Choose from your existing conversations</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center mb-4 pb-3 border-b border-gray-700/50">
              <button onClick={handleBackToUsers} className="md:hidden mr-2 p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="relative mr-3">
                <img
                  src={getUserImage(currentOtherUser?.image)}
                  alt={currentOtherUser?.name}
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 bg-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{currentOtherUser?.name}</div>
                {isCurrentUserBlocked && (
                  <div className="text-xs text-red-400">Blocked</div>
                )}
              </div>
              {selectedReceiverId && (
                <div className="flex items-center gap-2 shrink-0">
                {isCurrentUserBlocked ? (
                  <button
                    type="button"
                    onClick={() => handleUnblockUser(selectedReceiverId)}
                    disabled={isUnblocking}
                    className="px-3 py-1.5 text-sm font-medium bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-600/30 disabled:opacity-50"
                  >
                    Unblock
                  </button>
                ) : (
                  <>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(true)}
                    className="px-3 py-1.5 text-sm font-medium bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-600/30"
                  >
                    Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBlockModal(true)}
                    className="px-3 py-1.5 text-sm font-medium bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30"
                  >
                    Block
                  </button>
                  </>
                )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 px-1 custom-scrollbar">
              {messagesLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, index) => renderMessageBubble(msg, index))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-gray-700/50 pt-4">
              {selectedFile && (
                <div className="mb-3 flex items-center bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-white">
                  <div className="bg-purple-600/20 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{selectedFile.name}</div>
                    <div className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="ml-3 text-red-400 hover:text-red-300 text-xl font-bold transition-colors"
                    >×</button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (selectedFile) handleUploadAndSend();
                      else handleSendMessage(e as any);
                    }
                  }}
                  placeholder="Type a message..."
                  disabled={isSending || isUploading}
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                />

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" className="hidden" />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending || isUploading}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-purple-400 transition-all border border-gray-700 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {selectedFile ? (
                  <button
                    type="button"
                    onClick={handleUploadAndSend}
                    disabled={isUploading || isSending}
                    className="p-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                  >
                    {isUploading || isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className={`p-3 rounded-xl transition-all ${
                      !newMessage.trim() || isSending
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30'
                    }`}
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Block user modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Block User</h3>
            <p className="text-sm text-gray-400 mb-4">
              Block {currentOtherUser?.name}? They will not be able to message you.
            </p>
            <label className="block text-sm text-gray-300 mb-2">Reason *</label>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Enter reason for blocking..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockReason('');
                }}
                className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockUser}
                disabled={isBlocking}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isBlocking ? 'Blocking...' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && selectedReceiverId && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          targetType="USER"
          targetId={selectedReceiverId}
          targetLabel={currentOtherUser?.name}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(31,41,55,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.7); }
      `}</style>
    </div>
  );
};

export default MessagesPage;