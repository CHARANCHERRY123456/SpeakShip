import React, { useState, useEffect } from 'react';
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
        // joinChat will be emitted by the connect effect above
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
      console.log('Received newMessage:', msg); // Debug: log every incoming message
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  const handleSend = () => {
    if (!newMessage.trim() || !chatId || !currentUser?._id) return;
    console.log('Sending message:', {
      chatId,
      senderId: currentUser._id,
      senderRole: currentUser.role,
      content: newMessage.trim(),
    });
    socket.emit('sendMessage', {
      chatId,
      senderId: currentUser._id,
      senderRole: currentUser.role,
      content: newMessage.trim(),
    });
    setNewMessage('');
  };

  if (loading) return <div className="text-gray-500 text-sm">Loading chat...</div>;

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm mt-4">
      <div className="h-64 overflow-y-auto space-y-2 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">No messages yet.</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg._id || msg.createdAt || index}
              className={`p-2 rounded-md max-w-[75%] text-sm ${
                msg.sender?._id === currentUser._id
                  ? 'bg-blue-100 ml-auto text-right'
                  : 'bg-gray-100 text-left'
              }`}
            >
              <div className="text-gray-800">{msg.content}</div>
              <div className="text-gray-500 text-xs">
                {msg.sender?.name || 'User'} • {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
