import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/api";
import { API_BASE_URL } from "../api/config";

const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

const useCtSbrWebSocket = () => {
  const socketRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reason, setReason] = useState(null);
  const [phase, setPhase] = useState("phase_1");
  const [sessionId, setSessionId] = useState(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [expertMessage, setExpertMessage] = useState(null);
  const [showExpertButton, setShowExpertButton] = useState(false);

  const connect = useCallback(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(`${WS_BASE_URL}/agent/ct-sbr`);

    socket.onopen = () => setConnected(true);
    socket.onclose = () => {
      setConnected(false);
      socketRef.current = null;
    };
    socket.onerror = () => setConnected(false);

    socket.onmessage = (event) => {
      setWaitingForResponse(false);

      const data = JSON.parse(event.data);

      if (data.session_id) setSessionId(data.session_id);
      if (data.phase) setPhase(data.phase);

      if (data.completed) {
        setCompleted(true);
        setCurrentQuestion(null);
        if (data.failed) {
          setFailed(true);
          setReason(data.reason);
          setExpertMessage(data.expert_message);
          setShowExpertButton(data.show_expert_button);
        }
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
    return () => socketRef.current?.close();
  }, [connect]);

  const sendAnswer = (answer, displayText) => {
    if (!socketRef.current) return;

    setWaitingForResponse(true);

    socketRef.current.send(JSON.stringify({ answer }));

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text:
          displayText ||
          (answer === "__skip__"
            ? "Skipped - talk to an expert"
            : String(answer)),
      },
    ]);
  };

  const uploadDocument = async (file, questionId) => {
    const formData = new FormData();
    formData.append("session_id", sessionId || "");
    formData.append("question_id", questionId);
    formData.append("phase", phase);
    formData.append("file", file);

    const { data } = await api.post("/agent/ct-sbr/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  };

  return {
    connected,
    completed,
    failed,
    reason,
    phase,
    messages,
    currentQuestion,
    waitingForResponse,
    sendAnswer,
    uploadDocument,
    expertMessage,
    showExpertButton,
  };
};

export default useCtSbrWebSocket;
