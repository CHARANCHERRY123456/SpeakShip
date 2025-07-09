// File: client/src/contexts/SocketContext.jsx
import React, { createContext, useContext } from 'react';
import { getSocket } from '../features/chat/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={{ getSocket }}>
    {children}
  </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext).getSocket();