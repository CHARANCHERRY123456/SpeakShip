import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../../contexts/SocketContext';
import axios from '../../../api/axios';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ChatBox = ({ deliveryId, driverId }) => {
  const { currentUser } = useAuth();
  const socket = useSocket();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
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
      socket.emit('hello', { from: 'ChatBox' });
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
      return currentUser.role === 'driver' ? 'Driver' : 'Customer';
    }

    return msg.senderName || (currentUser.role === 'driver' ? 'Customer' : 'Driver');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[400px] md:h-[500px]">
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
          <h3 className="font-semibold text-sm">
            {/* {currentUser.role === 'driver' ? 'Customer Chat' : 'Driver Chat'} */}
            Chat
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start the conversation!</p>
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
                    className={`relative max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-md ${
                      isSelf
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-300 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div className={`text-xs mt-1 ${isSelf ? 'text-blue-100' : 'text-gray-500'}`}>
                      {getSenderName(msg)} •{' '}
                      {msg.createdAt &&
                        new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                    </div>
                    <div
                      className={`absolute w-3 h-3 -bottom-1 ${
                        isSelf
                          ? 'right-0 bg-blue-500 transform -translate-x-1/2 rotate-45'
                          : 'left-0 bg-gray-300 transform translate-x-1/2 rotate-45'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className={`ml-2 p-2 rounded-full ${
                newMessage.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-110'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
