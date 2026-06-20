'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Paperclip, Send, User, X } from 'lucide-react';
import Image from 'next/image';
import {
  useGetSupportListQuery,
  useGetSupportMessagesQuery,
  useInitSupportMutation,
  useSendSupportMessageMutation,
} from '@/redux/features/support/supportMessageSlice';
import { useSupportModal } from '@/context/SupportModalContext';
import { IMAGE_BASE_URL } from '@/lib/imageBaseUrl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SUPPORT_SIDE_ROLES = ['customer', 'vendor'];
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|bmp|svg|avif)(\?|$)/i;

const isImageAttachment = (path: string) => IMAGE_EXT_RE.test(path || '');

const attachmentUrl = (path: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${IMAGE_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

const fileNameFromPath = (path: string) =>
  (path || '').split(/[\\/]/).pop() || path;

export default function SupportMessage() {
  const { isOpen, setIsOpen, closeSupport } = useSupportModal();
  const router = useRouter();

  // Support is only for logged-in customers/vendors. Read the token after mount
  // (localStorage is client-only) to avoid an SSR/hydration mismatch, and keep
  // it in sync across tabs via the `storage` event.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const sync = () => setIsLoggedIn(!!localStorage.getItem('token'));
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Compose-message state
  const [newMessage, setNewMessage] = useState('');
  const [messageFiles, setMessageFiles] = useState<File[]>([]);
  const messageFileInputRef = useRef<HTMLInputElement>(null);

  // Create-ticket form state
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketFiles, setTicketFiles] = useState<File[]>([]);
  const ticketFileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 1. Get active ticket (single)
  const { data: supportList, refetch: refetchSupportList } = useGetSupportListQuery(
    {},
    { skip: !isLoggedIn },
  );
  const activeTicket: any = supportList?.data?.ticket || null;
  const hasTicket: boolean = !!supportList?.data?.isTicket && !!activeTicket;
  const ticketId: string | undefined = activeTicket?._id;

  // 2. Messages pagination — page 1 is oldest, last page is newest.
  // We bootstrap with page 1 (just to learn totalPage), immediately jump to the
  // last page so the latest messages render, then load older pages on scroll-up.
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number | null>(null);
  const [didJumpToLast, setDidJumpToLast] = useState(false);
  const [messageMap, setMessageMap] = useState<Record<string, any>>({});

  // Reset when ticket changes
  useEffect(() => {
    setPage(1);
    setTotalPage(null);
    setDidJumpToLast(false);
    setMessageMap({});
  }, [ticketId]);

  const onLatestPage = totalPage !== null && page === totalPage;

  const {
    data: chatMessages,
    refetch: refetchMessages,
    isFetching: isFetchingMessages,
  } = useGetSupportMessagesQuery(
    { ticketId: ticketId || '', page, limit: PAGE_SIZE },
    {
      skip: !ticketId,
      // Only poll on the latest page — older pages are immutable history.
      pollingInterval: onLatestPage ? 5000 : 0,
    },
  );

  useEffect(() => {
    if (!chatMessages) return;
    const respTotalPage: number | null =
      chatMessages?.pagination?.totalPage ?? null;
    const respMessages: any[] = Array.isArray(chatMessages?.data)
      ? chatMessages.data
      : chatMessages?.data?.data || [];

    if (respTotalPage !== null && respTotalPage !== totalPage) {
      setTotalPage(respTotalPage);
    }

    // First response: if there are more pages, jump to last to show newest first
    if (!didJumpToLast && respTotalPage && respTotalPage > page) {
      setDidJumpToLast(true);
      setPage(respTotalPage);
      return;
    }
    if (!didJumpToLast) setDidJumpToLast(true);

    // Accumulate (dedup by _id)
    setMessageMap((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const m of respMessages) {
        if (m?._id && next[m._id] !== m) {
          next[m._id] = m;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [chatMessages, page, totalPage, didJumpToLast]);

  // Follow latest: if we were on the latest page and the server advanced totalPage,
  // jump forward so polling keeps showing new messages.
  useEffect(() => {
    if (totalPage === null) return;
    if (onLatestPage) return; // already there
    if (didJumpToLast && page < totalPage && !isFetchingMessages) {
      // Only auto-follow when user is at/near the bottom of the chat
      const el = messagesContainerRef.current;
      const nearBottom =
        !el || el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      if (nearBottom) setPage(totalPage);
    }
  }, [totalPage, page, didJumpToLast, isFetchingMessages, onLatestPage]);

  const messages = useMemo(() => {
    return Object.values(messageMap).sort((a: any, b: any) => {
      const ta = new Date(a?.createdAt || 0).getTime();
      const tb = new Date(b?.createdAt || 0).getTime();
      return ta - tb;
    });
  }, [messageMap]);

  // 3. Mutations
  const [sendSupportMessage, { isLoading: isSending }] = useSendSupportMessageMutation();
  const [initSupport, { isLoading: isIniting }] = useInitSupportMutation();

  // Load older: capture scrollHeight before prepending so we can restore position
  const preLoadScrollHeightRef = useRef<number | null>(null);
  const loadOlder = () => {
    if (page <= 1 || isFetchingMessages) return;
    const el = messagesContainerRef.current;
    if (el) preLoadScrollHeightRef.current = el.scrollHeight;
    setPage((p) => p - 1);
  };

  // Auto-trigger load-older when user scrolls near the top
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop < 60 && !isFetchingMessages && page > 1) {
        loadOlder();
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isFetchingMessages]);

  // Preserve scroll position after older messages prepend
  useEffect(() => {
    if (preLoadScrollHeightRef.current === null) return;
    const el = messagesContainerRef.current;
    if (!el) return;
    const delta = el.scrollHeight - preLoadScrollHeightRef.current;
    if (delta > 0) el.scrollTop = el.scrollTop + delta;
    preLoadScrollHeightRef.current = null;
  }, [messages.length]);

  // Scroll to bottom — only on modal open or when a new LAST message arrives
  // (not when older messages are prepended).
  const justOpenedRef = useRef(false);
  const lastMessageIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isOpen) {
      justOpenedRef.current = true;
      lastMessageIdRef.current = null;
      return;
    }
    const wasJustOpened = justOpenedRef.current;
    justOpenedRef.current = false;

    const lastId = messages[messages.length - 1]?._id ?? null;
    const lastChanged = lastId !== lastMessageIdRef.current;
    lastMessageIdRef.current = lastId;

    if (!wasJustOpened && !lastChanged) return;

    const id = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: wasJustOpened ? 'auto' : 'smooth',
        block: 'end',
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, messages]);

  // Customer + vendor are always the support-seeker side → right
  const isMyMessage = (senderRole: string) => SUPPORT_SIDE_ROLES.includes(senderRole);

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const createTicket = async () => {
    if (!ticketTitle.trim() || !ticketDescription.trim()) return;
    try {
      await initSupport({
        title: ticketTitle.trim(),
        description: ticketDescription.trim(),
        attachments: ticketFiles,
      }).unwrap();
      setTicketTitle('');
      setTicketDescription('');
      setTicketFiles([]);
      await refetchSupportList();
    } catch (err) {
      console.error('Ticket create failed:', err);
    }
  };

  const sendMessage = async () => {
    if (!ticketId) return;
    if (!newMessage.trim() && messageFiles.length === 0) return;
    const content = newMessage.trim();
    const files = messageFiles;
    setNewMessage('');
    setMessageFiles([]);
    try {
      await sendSupportMessage({
        ticketId,
        content,
        attachments: files,
      }).unwrap();
      refetchMessages();
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const onPickTicketFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    setTicketFiles(Array.from(list).slice(0, 5));
  };

  const onPickMessageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    setMessageFiles(Array.from(list).slice(0, 5));
  };

  const unreadCount = activeTicket?.customerUnreadCount ?? 0;

  const handleFloatingClick = () => {
    if (!isLoggedIn) {
      // toast.error('Please sign in to use support chat');
      router.push('/auth/login');
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button — always visible; guests get redirected to login on click */}
      <button
        onClick={handleFloatingClick}
        className="fixed bottom-20 right-6 text-white p-0 rounded-full shadow-2xl z-50 cursor-pointer transition-all duration-300 transform hover:scale-110"
        aria-label={isLoggedIn ? 'Open support chat' : 'Sign in to use support chat'}
      >
        <div className="relative">
          <Image
            src="/images/messageicon.png"
            alt="Support"
            width={50}
            height={50}
            className="transition-transform duration-300"
          />
          {isLoggedIn && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Chat Modal — only for logged-in users */}
      {isLoggedIn && isOpen && (
        <div className="fixed bottom-20 inset-x-4 z-50 sm:inset-x-auto sm:right-6 sm:left-auto">
          <div className="bg-gray-900 rounded-2xl w-full max-w-[calc(100vw-2rem)] sm:w-96 sm:max-w-none h-[min(560px,calc(100vh-8rem))] flex flex-col shadow-2xl border border-gray-700 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 rounded-t-2xl bg-gray-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {hasTicket ? activeTicket.title || 'Support Chat' : 'Support Chat'}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <p className="text-xs text-green-400">
                      {hasTicket
                        ? activeTicket.ticketNumber || 'Active'
                        : 'Online'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={closeSupport}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            {hasTicket ? (
              <>
                {/* Ticket meta strip */}
                <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                  <p className="text-[11px] uppercase tracking-wide text-purple-300 font-medium mb-0.5">
                    {activeTicket.status || 'OPEN'} • {activeTicket.priority || 'MEDIUM'}
                  </p>
                  {activeTicket.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {activeTicket.description}
                    </p>
                  )}
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
                >
                  {/* Older-history loader */}
                  {page > 1 && (
                    <div className="flex justify-center py-1">
                      {isFetchingMessages ? (
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-purple-400 rounded-full animate-spin" />
                      ) : (
                        <button
                          type="button"
                          onClick={loadOlder}
                          className="text-[11px] text-purple-300 hover:text-purple-200 underline"
                        >
                          Load older messages
                        </button>
                      )}
                    </div>
                  )}

                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-gray-400 text-sm font-medium">No messages yet</p>
                      <p className="text-gray-600 text-xs text-center">
                        Send a message to start the conversation.
                      </p>
                    </div>
                  )}

                  {messages.map((message: any) => {
                    const mine = isMyMessage(message.senderRole);
                    return (
                      <div
                        key={message._id}
                        className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}
                      >
                        {!mine && (
                          <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className={`flex flex-col gap-1 max-w-[75%] ${mine ? 'items-end' : 'items-start'}`}>
                          <span className="text-xs text-gray-500 px-1">
                            {mine ? 'You' : message.senderId?.name || 'Support'}
                          </span>

                          {message.attachments?.length > 0 && (
                            <div className={`flex flex-wrap gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                              {message.attachments.map((att: string, i: number) => {
                                const url = attachmentUrl(att);
                                if (isImageAttachment(att)) {
                                  return (
                                    <a
                                      key={i}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
                                    >
                                      <img
                                        src={url}
                                        alt={fileNameFromPath(att)}
                                        className="max-w-[180px] max-h-[180px] object-cover"
                                      />
                                    </a>
                                  );
                                }
                                return (
                                  <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-lg flex items-center gap-1 max-w-[180px] truncate"
                                    title={fileNameFromPath(att)}
                                  >
                                    📎 {fileNameFromPath(att)}
                                  </a>
                                );
                              })}
                            </div>
                          )}

                          {message.content && (
                            <div className={`px-3 py-2 rounded-2xl text-sm ${
                              mine
                                ? 'bg-purple-600 text-white rounded-br-sm'
                                : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                            }`}>
                              <p>{message.content}</p>
                              <div className={`flex items-center gap-1 mt-1 ${mine ? 'justify-end' : 'justify-start'}`}>
                                <p className={`text-xs ${mine ? 'text-purple-300' : 'text-gray-400'}`}>
                                  {formatTime(message.createdAt)}
                                </p>
                                {mine && (
                                  <span className={`text-xs ${message.isRead ? 'text-blue-400' : 'text-gray-500'}`}>
                                    {message.isRead ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {mine && (
                          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>

                {/* Send-message input */}
                <div className="px-4 py-3 border-t border-gray-700">
                  {messageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {messageFiles.map((f, i) => (
                        <span
                          key={i}
                          className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          📎 {f.name}
                          <button
                            type="button"
                            onClick={() =>
                              setMessageFiles((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <button
                      type="button"
                      onClick={() => messageFileInputRef.current?.click()}
                      className="p-2.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex-shrink-0"
                      aria-label="Attach files"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      ref={messageFileInputRef}
                      type="file"
                      multiple
                      hidden
                      onChange={onPickMessageFiles}
                    />
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none border border-gray-700"
                      rows={2}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={(!newMessage.trim() && messageFiles.length === 0) || isSending}
                      className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${
                        (newMessage.trim() || messageFiles.length > 0) && !isSending
                          ? 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // No active ticket → show create-ticket form
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1">
                    Create a Support Ticket
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Tell us what you need help with. Our team will get back to you here.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value.slice(0, 200))}
                    placeholder="e.g. Payment Issue"
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Description</label>
                  <textarea
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value.slice(0, 5000))}
                    placeholder="Describe your issue..."
                    rows={4}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Attachments (optional, max 5)
                  </label>
                  <button
                    type="button"
                    onClick={() => ticketFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs"
                  >
                    <Paperclip className="w-4 h-4" />
                    {ticketFiles.length > 0
                      ? `${ticketFiles.length} file(s) selected`
                      : 'Add files'}
                  </button>
                  <input
                    ref={ticketFileInputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={onPickTicketFiles}
                  />
                  {ticketFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ticketFiles.map((f, i) => (
                        <span
                          key={i}
                          className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          📎 {f.name}
                          <button
                            type="button"
                            onClick={() =>
                              setTicketFiles((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={createTicket}
                  disabled={!ticketTitle.trim() || !ticketDescription.trim() || isIniting}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    ticketTitle.trim() && ticketDescription.trim() && !isIniting
                      ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isIniting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
