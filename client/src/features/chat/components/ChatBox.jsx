import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import axios from '../../../api/axios';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  FiSend, 
  FiImage, 
  FiCamera, 
  FiMapPin, 
  FiDollarSign, 
  FiCalendar,
  FiPlus,
  FiX
} from 'react-icons/fi';

const ChatBox = ({ deliveryId, driverId }) => {
  const { currentUser } = useAuth();
  const socket = useSocket();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAttachments, setShowAttachments] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const attachmentsRef = useRef(null);
  const attachmentButtonRef = useRef(null);

  // Close attachments when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        attachmentsRef.current && 
        !attachmentsRef.current.contains(event.target) &&
        !attachmentButtonRef.current.contains(event.target)
      ) {
        setShowAttachments(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = messagesContainerRef.current;
      // Only auto-scroll if we're near the bottom
      if (scrollHeight - (clientHeight + scrollTop) < 100) {
        scrollToBottom();
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    if (chatId && socket && socket.connected) {
      socket.emit('joinChat', chatId);
    }
  }, [chatId, socket]);

  useEffect(() => {
    const onConnect = () => {
      if (chatId) socket.emit('joinChat', chatId);
    };
    socket.on('connect', onConnect);
    return () => socket.off('connect', onConnect);
  }, [chatId, socket]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const { data: chat } = await axios.post('/api/chat/access', {
          deliveryOrderId: deliveryId,
          customerId: currentUser._id,
          driverId,
        });
        setChatId(chat._id);

        const res = await axios.get(`/api/chat/${chat._id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    if (deliveryId && driverId && currentUser?._id) {
      initChat();
    }
  }, [deliveryId, driverId, currentUser]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket]);

  const handleSend = () => {
    if (!newMessage.trim() || !chatId || !currentUser?._id) return;

    socket.emit('sendMessage', {
      chatId,
      senderId: currentUser._id,
      senderRole: currentUser.role,
      senderName: currentUser.name || currentUser.email || 'Anonymous',
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  const isCurrentUser = (msg) => {
    const senderId = msg?.senderId || msg?.sender?._id || msg?.sender;
    return senderId?.toString() === currentUser._id?.toString();
  };

  const getSenderName = (msg) => {
    if (isCurrentUser(msg)) {
      return currentUser.role === 'driver' ? 'Me (Driver)' : 'Me (Customer)';
    }
    return msg.senderName || (currentUser.role === 'driver' ? 'Customer' : 'Driver');
  };

  const handleAttachmentClick = (type) => {
    toast.success(`${type} attachment clicked`);
    setShowAttachments(false);
    // Implement actual attachment functionality here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
          <h3 className="font-semibold text-sm">
            {currentUser.role === 'driver' ? 'Chat With Customer' : 'Chat With Driver'}
          </h3>
        </div>
        <div className="text-xs opacity-80">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Messages container with fixed height and proper scrolling */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{ height: 'calc(100vh - 200px)', maxHeight: '400px' }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSelf = isCurrentUser(msg);
            return (
              <div
                key={msg._id || index}
                className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-xs md:max-w-md rounded-lg px-4 py-2 shadow-md transition-all duration-200 ${
                    isSelf
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="text-l font-medium mb-1">
                    {getSenderName(msg)}
                  </div>
                  <div className="text-l">{msg.content}</div>
                  <div className={`text-sm mt-1 ${isSelf ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.createdAt &&
                    `${new Date(msg.createdAt).toLocaleDateString([], {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}, ${new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                  </div>
                  {/* Message triangle indicator */}
                  <div
                    className={`absolute w-3 h-3 -bottom-1 ${
                      isSelf
                        ? 'right-0 bg-blue-500 transform -translate-x-1/2 rotate-45'
                        : 'left-0 bg-gray-200 transform translate-x-1/2 rotate-45'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area with attachments */}
      <div className="border-t border-gray-200 bg-white p-3">
        {/* Attachments menu - appears below button when clicked */}
        {showAttachments && (
          <div
            ref={attachmentsRef}
            className="mb-3 bg-white rounded-lg shadow-lg p-3 animate-fade-in"
          >
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleAttachmentClick('Gallery')}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-1 group-hover:bg-blue-200 transition-all duration-200">
                  <FiImage className="text-blue-600 text-lg" />
                </div>
                <span className="text-xs text-gray-600">Gallery</span>
              </button>
              <button
                onClick={() => handleAttachmentClick('Camera')}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-1 group-hover:bg-blue-200 transition-all duration-200">
                  <FiCamera className="text-blue-600 text-lg" />
                </div>
                <span className="text-xs text-gray-600">Camera</span>
              </button>
              <button
                onClick={() => handleAttachmentClick('Location')}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-1 group-hover:bg-blue-200 transition-all duration-200">
                  <FiMapPin className="text-blue-600 text-lg" />
                </div>
                <span className="text-xs text-gray-600">Location</span>
              </button>
              <button
                onClick={() => handleAttachmentClick('Payment')}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-1 group-hover:bg-blue-200 transition-all duration-200">
                  <FiDollarSign className="text-blue-600 text-lg" />
                </div>
                <span className="text-xs text-gray-600">Payment</span>
              </button>
            </div>
            <button
              onClick={() => handleAttachmentClick('Event')}
              className="w-full mt-3 flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              <FiCalendar className="text-blue-600 text-lg mr-2" />
              <span className="text-xs text-gray-600">Schedule Event</span>
            </button>
          </div>
        )}

        <div className="flex items-center w-full gap-1 sm:gap-2">
        {/* Message Input */}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 min-w-[50px] border border-gray-300 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
        />
        
        {/* Attachments Button - Always visible now */}
        <button
          ref={attachmentButtonRef}
          onClick={() => setShowAttachments(!showAttachments)}
          className={`
            p-2 min-w-[40px] rounded-full transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-300
            ${showAttachments
              ? 'bg-blue-100 text-blue-600'
              : 'bg-blue-200 text-blue-600 hover:bg-blue-300'
            }
          `}
          aria-label={showAttachments ? "Close attachments" : "Add attachments"}
        >
          {showAttachments ? (
            <FiX className="text-lg sm:text-xl" />
          ) : (
            <FiPlus className="text-lg sm:text-xl" />
          )}
        </button>

        {/* Send Button - Always visible now */}
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={`
            p-2 min-w-[40px] rounded-full transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-300
            ${newMessage.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Send message"
        >
          <FiSend className="text-lg sm:text-xl" />
        </button>
      </div>
      </div>
    </div>
  );
};

export default ChatBox;