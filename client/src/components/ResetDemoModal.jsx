import React, { useEffect, useRef } from "react";
import { AlertTriangle, RefreshCcw, X, ShieldAlert } from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function ResetDemoModal({
  isOpen,
  onClose,
  onConfirmReset,
  isResetting,
  currentLanguage = "en"
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (cancelButtonRef.current) {
        cancelButtonRef.current.focus();
      }

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="gov-card max-w-md w-full p-5 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#D9E0EA] pb-2">
          <span className="font-bold text-sm text-[#C62828] flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{t.resetModal.title}</span>
          </span>
          <button onClick={onClose} className="text-[#4C5768] font-bold cursor-pointer">✕</button>
        </div>

        <p className="text-xs text-[#1A2233] leading-relaxed">
          {t.resetModal.desc}
        </p>

        <div className="status-box-warn text-xs space-y-1">
          <strong className="block">Notice for Evaluators:</strong>
          <span>{t.resetModal.warning}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={isResetting}
            className="btn-outline-navy text-xs h-9 min-h-0 py-1"
          >
            {t.resetModal.cancel}
          </button>
          
          <button
            type="button"
            onClick={onConfirmReset}
            disabled={isResetting}
            className="btn-danger text-xs h-9 min-h-0 py-1"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? t.resetModal.resetting : t.resetModal.confirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
