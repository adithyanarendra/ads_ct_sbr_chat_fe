import { useMemo, useState } from "react";
import useCtSbrWebSocket from "../hooks/useCtSbrWebSocket";

const CtSbrChat = () => {
  const { connected, completed, messages, currentQuestion, sendAnswer } =
    useCtSbrWebSocket();

  const [input, setInput] = useState("");

  const isBoolean = useMemo(
    () => currentQuestion?.question_type === "boolean",
    [currentQuestion],
  );

  const submitText = () => {
    if (!input.trim()) return;

    sendAnswer(input);

    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow h-[80vh] flex flex-col">
      <div className="border-b p-4 flex justify-between">
        <h2 className="font-bold text-xl">CT SBR Phase 1</h2>

        <span
          className={`text-sm ${connected ? "text-green-600" : "text-red-600"}`}
        >
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl px-4 py-3 max-w-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {completed && (
          <div className="text-center text-green-700 font-semibold py-4">
            Questionnaire Completed
          </div>
        )}
      </div>

      {!completed && currentQuestion && (
        <div className="border-t p-4">
          {isBoolean ? (
            <div className="flex gap-4">
              <button
                onClick={() => sendAnswer(true)}
                className="flex-1 rounded-lg bg-green-600 text-white py-3"
              >
                Yes
              </button>

              <button
                onClick={() => sendAnswer(false)}
                className="flex-1 rounded-lg bg-red-600 text-white py-3"
              >
                No
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                className="flex-1 border rounded-lg px-4 py-3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitText();
                  }
                }}
              />

              <button
                onClick={submitText}
                className="bg-blue-600 text-white rounded-lg px-6"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CtSbrChat;
