import { CalendarDays, Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

const pad = (value) => String(value).padStart(2, "0");

const getToday = () => {
  const now = new Date();

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}`;
};

const getCurrentTime = () => {
  const now = new Date();

  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const CallbackModal = ({ isOpen, onClose, onSubmit, submitting = false }) => {
  const [callbackDate, setCallbackDate] = useState("");
  const [callbackTime, setCallbackTime] = useState("");

  const today = useMemo(() => getToday(), []);

  useEffect(() => {
    if (!isOpen) {
      setCallbackDate("");
      setCallbackTime("");
    }
  }, [isOpen]);

  const minTime = useMemo(() => {
    if (callbackDate !== today) {
      return undefined;
    }

    return getCurrentTime();
  }, [callbackDate, today]);

  const isValid = useMemo(() => {
    if (!callbackDate || !callbackTime) {
      return false;
    }

    if (callbackDate < today) {
      return false;
    }

    if (callbackDate === today && callbackTime <= getCurrentTime()) {
      return false;
    }

    return true;
  }, [callbackDate, callbackTime, today]);

  const handleDateChange = (event) => {
    const value = event.target.value;

    setCallbackDate(value);

    // If switching to today and the existing time is already invalid,
    // clear it so the user explicitly chooses a future time.
    if (value === today && callbackTime <= getCurrentTime()) {
      setCallbackTime("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValid || submitting) {
      return;
    }

    await onSubmit(callbackDate, callbackTime);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request an expert callback"
      closeDisabled={submitting}
    >
      <form onSubmit={handleSubmit}>
        <p className="mb-6 text-sm leading-6 text-slate-500">
          Choose a date and time when you would like our tax expert to contact
          you.
        </p>

        <div className="space-y-5">
          {/* Date */}
          <div>
            <label
              htmlFor="callback-date"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Callback date
            </label>

            <div className="group relative">
              <CalendarDays
                size={18}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition-colors
                  group-focus-within:text-blue-500
                "
              />

              <input
                id="callback-date"
                type="date"
                value={callbackDate}
                min={today}
                onChange={handleDateChange}
                disabled={submitting}
                required
                className="
                  h-[52px] w-full
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  py-3 pl-11 pr-4
                  text-[15px] text-slate-900
                  outline-none
                  transition-all
                  hover:border-slate-300
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="callback-time"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Callback time
            </label>

            <div className="group relative">
              <Clock3
                size={18}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition-colors
                  group-focus-within:text-blue-500
                "
              />

              <input
                id="callback-time"
                type="time"
                value={callbackTime}
                min={minTime}
                onChange={(event) => setCallbackTime(event.target.value)}
                disabled={!callbackDate || submitting}
                required
                className="
                  h-[52px] w-full
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  py-3 pl-11 pr-4
                  text-[15px] text-slate-900
                  outline-none
                  transition-all
                  hover:border-slate-300
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {callbackDate === today
                ? "Please select a time later than now."
                : "Any time can be selected for a future date."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="
              flex-1
              rounded-2xl
              border border-slate-200
              bg-white
              px-5 py-3
              text-sm font-medium text-slate-700
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="
              flex-1
              rounded-2xl
              bg-slate-900
              px-5 py-3
              text-sm font-semibold text-white
              transition
              hover:bg-blue-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Requesting...
              </span>
            ) : (
              "Request callback"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CallbackModal;
