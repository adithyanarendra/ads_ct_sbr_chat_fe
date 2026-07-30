// src/hooks/useCtSbrWebSocket.js

import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../api/config";

const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

const useCtSbrWebSocket = () => {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [completed, setCompleted] = useState(false);

  const connect = useCallback(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(`${WS_BASE_URL}/agent/ct-sbr`);

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onclose = () => {
      setConnected(false);
      socketRef.current = null;
    };

    socket.onerror = () => {
      setConnected(false);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.completed) {
        setCompleted(true);
        setCurrentQuestion(null);
        return;
      }

      setCurrentQuestion(data);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.question,
          questionId: data.question_id,
          questionType: data.question_type,
        },
      ]);
    };

    socketRef.current = socket;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      socketRef.current?.close();
    };
  }, [connect]);

  const sendAnswer = (answer) => {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        answer,
      }),
    );

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: String(answer),
      },
    ]);
  };

  return {
    connected,
    completed,
    messages,
    currentQuestion,
    sendAnswer,
  };
};

export default useCtSbrWebSocket;
