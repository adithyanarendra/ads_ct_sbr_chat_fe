import { MessageCircleMore } from "lucide-react";

const PHASES = [
  { id: "phase_1", label: "Eligibility Questionnaire" },
  { id: "phase_2", label: "Document Collection" },
];

const CtSbrProgress = ({ phase, completed, failed, onExpertClick, disabled }) => {
  const currentIndex = PHASES.findIndex((p) => p.id === phase);

  return (
    <div className="w-full lg:w-64 bg-white rounded-xl shadow p-4 lg:sticky lg:top-4 h-fit order-first lg:order-last">
      <h3 className="font-bold text-sm text-gray-500 uppercase mb-4">
        Progress
      </h3>
      <div className="flex lg:flex-col gap-4">
        {PHASES.map((p, idx) => {
          const isActive = p.id === phase && !completed;
          const isFailed = failed && p.id === phase;
          const isDone =
            idx < currentIndex || (completed && !failed && p.id === phase);

          return (
            <div
              key={p.id}
              className="flex items-center gap-3 flex-1 lg:flex-none"
            >
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                  isFailed
                    ? "bg-red-600 text-white"
                    : isDone
                      ? "bg-green-600 text-white"
                      : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span
                className={`text-xs sm:text-sm ${isActive ? "font-semibold text-gray-900" : "text-gray-500"}`}
              >
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onExpertClick}
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
        >
          <MessageCircleMore size={18} />
          {disabled ? "Requesting..." : "Talk to an Expert"}
        </button>
      </div>
    </div>
  );
};

export default CtSbrProgress;
