/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import socketio from "socket.io-client";
import { TG_SOCKET_URI } from "../../constant";


const getSocket = () => {
  
  return socketio(TG_SOCKET_URI, {
    withCredentials: true,
  });
};

const SocketContext = createContext({
  socket: null,
});

// Custom hook to access the socket instance from the context
const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // console.log(socket)
  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
