import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"; // Import Socket type

const SOCKET_SERVER_URL = "http://localhost:4000";

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null); // Explicitly type socket as Socket or null

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array, so effect runs only once when the component mounts

  return socket;
};
