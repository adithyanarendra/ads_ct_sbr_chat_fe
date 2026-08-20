import {
  Check,
  MessageCircleMore,
  SendHorizontal,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { makeLeadHot } from "../api/bitrixService";
import useCtSbrWebSocket from "../hooks/useCtSbrWebSocket";
import { validateWorkflowInput } from "../utils/workflowValidation";
import CallbackModal from "./CallbackModal";
import CtSbrProgress from "./CtSbrProgress";

const CtSbrChat = () => {
  const navigate = useNavigate();
  const {
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
    paymentRequired,
  } = useCtSbrWebSocket();

  const chatContainerRef = useRef(null);

  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [requestingCallback, setRequestingCallback] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);

  const questionType = currentQuestion?.question_type;

  const submitText = () => {
    const value = input.trim();

    if (!value) {
      toast.error("Please enter a value.");
      return;
    }

    if (currentQuestion?.question_id) {
      const error = validateWorkflowInput(currentQuestion.question_id, value);

      if (error) {
        toast.error(error);
        return;
      }
    }

    sendAnswer(value);
    setInput("");
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !currentQuestion) return;

    setUploading(true);

    try {
      const { url, file_name, report_url, report_summary } =
        await uploadDocument(file, currentQuestion.question_id);

      sendAnswer(url, file_name);

      if (report_url) {
        sessionStorage.setItem("ct_sbr_report_url", report_url);
        sessionStorage.setItem(
          "ct_sbr_report_summary",
          JSON.stringify(report_summary || {}),
        );

        toast.success(
          report_summary
            ? `P&L report generated. Net profit before tax: AED ${Number(
                report_summary.net_profit_before_tax || 0,
              ).toLocaleString()}`
            : "P&L report generated.",
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Upload failed. Please upload a valid Excel workbook.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleExpertCallback = () => {
    if (requestingCallback) return;

    const storedUser = localStorage.getItem("whatsapp_user");

    if (!storedUser) {
      toast.error("Unable to identify your account. Please log in again.");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch {
      toast.error(
        "Unable to read your account information. Please log in again.",
      );
      return;
    }

    const bitrixLeadId = user?.bitrix_lead_id;

    if (!bitrixLeadId) {
      toast.error(
        "We couldn't find your lead record. Please try logging in again.",
      );
      return;
    }

    setShowCallbackModal(true);
  };

  const handleCallbackSubmit = async (callbackDate, callbackTime) => {
    if (requestingCallback) return;

    const storedUser = localStorage.getItem("whatsapp_user");

    if (!storedUser) {
      toast.error("Unable to identify your account. Please log in again.");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch {
      toast.error(
        "Unable to read your account information. Please log in again.",
      );
      return;
    }

    const bitrixLeadId = user?.bitrix_lead_id;

    if (!bitrixLeadId) {
      toast.error(
        "We couldn't find your lead record. Please try logging in again.",
      );
      return;
    }

    setRequestingCallback(true);

    try {
      await makeLeadHot(bitrixLeadId, callbackDate, callbackTime);

      setShowCallbackModal(false);

      toast.success(
        "Your request has been sent. Our expert will contact you soon.",
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.detail ||
          "Failed to request an expert callback. Please try again.",
      );
    } finally {
      setRequestingCallback(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, waitingForResponse, completed, failed]);

  useEffect(() => {
    if (paymentRequired) {
      navigate("/payments", { replace: true });
    }
  }, [paymentRequired, navigate]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col lg:flex-row-reverse items-start gap-8">
        <div className="w-full lg:w-72 lg:sticky lg:top-1/2 lg:-translate-y-1/2 order-1">
          <CtSbrProgress
            phase={phase}
            completed={completed}
            failed={failed}
            onExpertClick={() => handleExpertCallback()}
            disabled={requestingCallback}
          />
        </div>

        <div className="flex-1 w-full order-2">
          <div className="flex flex-col h-[85vh] bg-white">
            <div className="px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  CT Small Business Relief
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {phase === "phase_2"
                    ? "Document Collection"
                    : "Eligibility Questionnaire"}
                </p>
              </div>

              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  connected
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    connected ? "bg-green-500" : "bg-red-500"
                  }`}
                />

                {connected ? "Connected" : "Disconnected"}
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto bg-[#fafafa]"
            >
              <div className="mx-auto max-w-3xl px-6 py-8">
                <div className="space-y-8">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" ? (
                        <div className="max-w-full">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            ADS Assistant
                          </div>

                          <div className="rounded-2xl rounded-tl-md border border-gray-200 bg-white px-5 py-4 text-[15px] leading-7 text-gray-800">
                            {message.text}
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-xl rounded-2xl rounded-br-md bg-[#202123] px-5 py-4 text-[15px] leading-7 text-white">
                          {message.text}
                        </div>
                      )}
                    </div>
                  ))}

                  {waitingForResponse && (
                    <div className="flex justify-start">
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          ADS Assistant
                        </div>

                        <div className="rounded-2xl rounded-tl-md border border-gray-200 bg-white px-5 py-4">
                          <p className="mb-3 text-xs text-gray-400">
                            Thinking...
                          </p>

                          <div className="flex gap-2">
                            <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></span>

                            <span
                              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                              style={{
                                animationDelay: "150ms",
                              }}
                            />

                            <span
                              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                              style={{
                                animationDelay: "300ms",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {completed && !failed && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center text-green-700 font-medium">
                      {phase === "phase_2"
                        ? "Document collection completed."
                        : "Questionnaire completed."}
                    </div>
                  )}

                  {failed && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                      <div className="text-center">
                        <div className="font-semibold text-red-700">
                          {reason || "You are not eligible to proceed."}
                        </div>

                        {expertMessage && (
                          <p className="mt-3 text-sm text-red-600">
                            {expertMessage}
                          </p>
                        )}

                        {showExpertButton && (
                          <button
                            type="button"
                            onClick={() => handleExpertCallback()}
                            disabled={requestingCallback}
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                          >
                            <MessageCircleMore size={18} />
                            {requestingCallback
                              ? "Requesting..."
                              : "Talk to an expert"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!completed && currentQuestion && (
              <div className="bg-white">
                <div className="mx-auto max-w-3xl px-2 py-5">
                  {questionType === "boolean" && (
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
                      <button
                        onClick={() => sendAnswer(true, "Yes")}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                      >
                        <Check size={18} className="text-green-600" />
                        Yes
                      </button>

                      <button
                        onClick={() => sendAnswer(false, "No")}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                      >
                        <X size={18} className="text-red-600" />
                        No
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExpertCallback()}
                        disabled={requestingCallback}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                      >
                        <MessageCircleMore size={18} />
                        {requestingCallback
                          ? "Requesting..."
                          : "Not sure? Talk to us"}
                      </button>
                    </div>
                  )}

                  {questionType === "select" && (
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        {(currentQuestion.options || []).map((option) => (
                          <button
                            key={option}
                            onClick={() => sendAnswer(option)}
                            className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                          >
                            {option}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <button
                          type="button"
                          onClick={() => handleExpertCallback()}
                          disabled={requestingCallback}
                          className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                        >
                          <MessageCircleMore size={18} />
                          {requestingCallback
                            ? "Requesting..."
                            : "Not sure? Talk to us"}
                        </button>
                      </div>
                    </div>
                  )}

                  {questionType === "upload" && (
                    <div className="space-y-5">
                      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition hover:border-gray-400 hover:bg-white">
                        <Upload size={22} className="text-gray-500" />

                        <div className="text-center">
                          <div className="font-medium text-gray-700">
                            Upload Excel file
                          </div>

                          <div className="mt-1 text-sm text-gray-500">
                            Excel workbook with Sales Register and Expense
                            Register sheets
                          </div>
                        </div>

                        <input
                          hidden
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFile}
                          disabled={uploading}
                        />
                      </label>

                      {uploading && (
                        <div className="text-sm text-gray-500">
                          Uploading...
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3">
                        {currentQuestion.allow_skip && (
                          <button
                            onClick={() => sendAnswer("__skip__")}
                            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            {currentQuestion.skip_label || "Skip"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleExpertCallback()}
                          disabled={requestingCallback}
                          className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                        >
                          <MessageCircleMore size={18} />
                          {requestingCallback
                            ? "Requesting..."
                            : "Not sure? Talk to us"}
                        </button>
                      </div>
                    </div>
                  )}

                  {(questionType === "text" || questionType === "number") && (
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                      <button
                        type="button"
                        onClick={() => handleExpertCallback()}
                        disabled={requestingCallback}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
                      >
                        <MessageCircleMore size={18} />
                        {requestingCallback ? "Requesting..." : "Not sure?"}
                      </button>

                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitText();
                          }
                        }}
                        className="flex-1 rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm outline-none transition focus:border-black"
                      />

                      <button
                        onClick={submitText}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-[#202123] px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
                      >
                        <SendHorizontal size={18} />
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CallbackModal
        isOpen={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
        onSubmit={handleCallbackSubmit}
        submitting={requestingCallback}
      />
    </div>
  );
};

export default CtSbrChat;
