import { useEffect, useState, useCallback } from "react";
import type { SystemMetrics } from "@/lib/types";

interface WebSocketMessage {
  type: string;
  data?: any;
  executionId?: number;
  message?: string;
}

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'metrics-update':
            setSystemMetrics(message.data);
            break;
          case 'execution-started':
            console.log('Module execution started:', message);
            break;
          case 'output':
            console.log('Module output:', message.data);
            break;
          case 'execution-completed':
            console.log('Module execution completed:', message);
            break;
          case 'error':
            console.error('WebSocket error:', message.message);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const executeModule = useCallback((moduleId: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'execute-module',
        moduleId
      }));
    } else {
      console.error('WebSocket not connected');
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    systemMetrics,
    executeModule
  };
}
