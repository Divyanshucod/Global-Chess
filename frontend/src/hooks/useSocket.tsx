import { useState, useEffect, useRef } from "react";

const ws_url = `ws://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;
const polling = 5000;

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkServerStatus = () => {
    try {
      const ws = new WebSocket(ws_url);
      ws.onopen = () => {
        setSocket(ws);
        // Clear the interval once the connection is established
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      };
      ws.onclose = () => {
        setSocket(null);
        // Reconnect with a delay
        if (!intervalIdRef.current) {
          intervalIdRef.current = setInterval(checkServerStatus, polling);
        }
      };
    } catch (err) {
      // Retry connection if an error occurs
      if (!intervalIdRef.current) {
        intervalIdRef.current = setInterval(checkServerStatus, polling);
      }
    }
  };

  useEffect(() => {
    checkServerStatus();

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return socket;
};
