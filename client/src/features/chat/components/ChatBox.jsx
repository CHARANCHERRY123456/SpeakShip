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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Ensure joinChat is emitted when chatId and socket are ready and connected
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
    return () => {
      socket.off('connect', onConnect);
    };
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
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  const handleSend = () => {
    if (!newMessage.trim() || !chatId || !currentUser?._id) return;
    socket.emit('sendMessage', {
      chatId,
      senderId: currentUser._id,
      senderRole: currentUser.role,
      content: newMessage.trim(),
    });
    setNewMessage('');
  };

  // Determine if the message is from the current user
  const isCurrentUser = (msg) => {

      console.log("currentUser id:",currentUser._id);
        console.log("currentUser id:",msg.sender?._id);
    return msg.sender?._id === currentUser._id;
  };

  // Get proper sender name display
  const getSenderName = (msg) => {
   
    if (isCurrentUser(msg)) {
       console.log("currentUser.role:",currentUser.role);
      return currentUser.role === 'driver' ? 'You (Driver)' : 'You (Customer)';
    }
    return currentUser.role === 'driver' ? 'Customer' : 'Driver';
  };

  if (loading) return (
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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[400px] md:h-[500px]">
        {/* Chat header */}
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
          <h3 className="font-semibold text-sm">
            {currentUser.role === 'driver' ? 'Customer Chat' : 'Driver Chat'}
          </h3>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg._id || msg.createdAt || index}
                className={`flex ${isCurrentUser(msg) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-md transition-all duration-200 ease-in-out ${
                    isCurrentUser(msg)
                      ? 'bg-blue-500 text-white rounded-br-none animate-slide-in-right'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none animate-slide-in-left'
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div className={`text-xs mt-1 ${
                    isCurrentUser(msg) ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {getSenderName(msg)} • {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                  {/* Message triangle */}
                  <div className={`absolute w-3 h-3 -bottom-1 ${
                    isCurrentUser(msg)
                      ? 'right-0 bg-blue-500 transform -translate-x-1/2 rotate-45' 
                      : 'left-0 bg-gray-200 transform translate-x-1/2 rotate-45'
                  }`}></div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className={`ml-2 p-2 rounded-full transition-all duration-200 ${
                newMessage.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-110'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;