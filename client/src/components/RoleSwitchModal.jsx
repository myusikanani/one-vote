import React, { useEffect, useRef } from "react";
import { UserCheck, ShieldAlert, Settings, X, AlertTriangle } from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function RoleSwitchModal({
  isOpen,
  onClose,
  targetRole,
  onConfirmSwitch,
  isVotingSessionActive,
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

  const roleNames = {
    POLLING_OFFICER: currentLanguage === "gu" ? "પોલિંગ ઓફિસર" : currentLanguage === "hi" ? "पोलिंग ऑफिसर" : "Polling Officer",
    SUPERVISOR: currentLanguage === "gu" ? "સુપરવાઇઝર" : currentLanguage === "hi" ? "पर्यवेक्षक (Supervisor)" : "Supervisor",
    DEMO_ADMIN: currentLanguage === "gu" ? "ડેમો એડમિન" : currentLanguage === "hi" ? "डेमो एडमिनिस्ट्रेटर" : "Demo Admin"
  };

  const targetName = roleNames[targetRole] || roleNames.POLLING_OFFICER;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="gov-card max-w-md w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D9E0EA] pb-2">
          <span className="font-bold text-sm text-[#0B3B6F]">Switch Demo Role</span>
          <button onClick={onClose} className="text-[#4C5768] font-bold cursor-pointer">✕</button>
        </div>

        {isVotingSessionActive ? (
          <div className="space-y-3">
            <div className="status-box-danger text-xs space-y-1">
              <strong className="block font-bold">Active Voting Session in Progress</strong>
              <span>Complete or cancel the active 5-minute voter authorization before switching roles.</span>
            </div>
            <button
              ref={cancelButtonRef}
              onClick={onClose}
              className="btn-outline-navy w-full text-xs"
            >
              Understood
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-[#1A2233]">
              Switching active session role to <strong>{targetName}</strong>.
            </p>
            <div className="p-3 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px] text-[#4C5768]">
              Role permissions and telemetry controls will adjust dynamically.
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                className="btn-outline-navy text-xs h-9 min-h-0 py-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onConfirmSwitch(targetRole)}
                className="btn-saffron text-xs h-9 min-h-0 py-1"
              >
                Confirm Switch
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
