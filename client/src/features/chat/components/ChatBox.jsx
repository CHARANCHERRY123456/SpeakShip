// File: client/src/features/chat/components/ChatBox.jsx
import React, { useState, useEffect } from 'react';
import socket from '../socket';
import axios from '../../../api/axios';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ChatBox = ({ deliveryId, driverId }) => {
  const { currentUser } = useAuth();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initChat = async () => {
      try {
        const { data: chat } = await axios.post('/api/chat/access', {
          deliveryOrderId: deliveryId,
          customerId: currentUser._id,
          driverId,
        });

        setChatId(chat._id);
        socket.emit('joinChat', chat._id);
        console.log('Joined chat room:', chat._id);


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
      console.log('📩 [client] Received newMessage event:', msg); // Debug log
      try {
        console.log('🔎 [client] Message structure:', JSON.stringify(msg, null, 2));
      } catch (e) {
        console.log('🔎 [client] Message structure (raw):', msg);
      }
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('newMessage', handleNewMessage);
    console.log('🟢 [client] Subscribed to newMessage event'); // Debug log

    return () => {
      socket.off('newMessage', handleNewMessage);
      console.log('🔴 [client] Unsubscribed from newMessage event'); // Debug log
    };
  }, []);

 const handleSend = () => {
  if (!newMessage.trim() || !chatId) return;

  console.log('📤 [client] Emitting sendMessage event:', {
    chatId,
    senderId: currentUser._id,
    senderRole: currentUser.role,
    content: newMessage.trim(),
  }); // Debug log

  socket.emit('sendMessage', {
    chatId,
    senderId: currentUser._id,
    senderRole: currentUser.role, // ✅ Add this line
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
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-md max-w-[75%] text-sm ${
                msg.sender._id === currentUser._id
                  ? 'bg-blue-100 ml-auto text-right'
                  : 'bg-gray-100 text-left'
              }`}
            >
              <div className="text-gray-800">{msg.content}</div>
              <div className="text-gray-500 text-xs">
                {msg.sender.name || 'User'} • {new Date(msg.createdAt).toLocaleTimeString()}
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
