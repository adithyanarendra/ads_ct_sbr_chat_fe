import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, closeDisabled = false }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !closeDisabled) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, closeDisabled]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !closeDisabled) {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-slate-900/40
        px-4
        backdrop-blur-sm
      "
      onMouseDown={handleBackdropClick}
    >
      <div
        className="
          relative
          w-full max-w-md
          rounded-3xl
          border border-slate-200
          bg-white
          p-6
          shadow-[0_25px_80px_rgba(15,23,42,0.20)]
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-600
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
