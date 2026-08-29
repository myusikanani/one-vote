import React, { useState } from "react";
import { CheckCircle2, QrCode, ShieldCheck, Vote, X, ArrowRight, ArrowLeft } from "lucide-react";

export default function GuidedTourModal({ isOpen, onClose, onStartTourWorkflow }) {
  const [tourStep, setTourStep] = useState(1);

  if (!isOpen) return null;

  const tourContent = [
    {
      step: 1,
      title: "1. Staff Terminal Verification & QR Scan",
      guTitle: "૧. સ્ટાફ ટર્મિનલ ચકાસણી અને QR સ્કેન",
      icon: QrCode,
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950",
      description:
        "Polling staff scan the voter's synthetic QR code badge or type their Voter ID. The terminal communicates in real-time with the Central Voter Ledger across all Gujarat districts.",
      tip: "Tip: Use preset badge buttons (e.g. DEMO-V101 Ramesh Patel) for 1-click instant filling during presentations."
    },
    {
      step: 2,
      title: "2. Cryptographic 5-Minute Token Issuance",
      guTitle: "૨. ૫-મિનિટ ક્રિપ્ટોગ્રાફિક ટોકન ઇશ્યુઅન્સ",
      icon: ShieldCheck,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950",
      description:
        "If the citizen is eligible and has NOT voted, a short-lived authorization token (AUTH-XXXXXX) is generated with a live 5-minute countdown. If they have ALREADY voted in another city (e.g. Surat), duplicate voting is blocked instantly with photographic and cryptographic proof.",
      tip: "Security Guarantee: Tokens expire automatically after 04:59 to prevent credential misuse."
    },
    {
      step: 3,
      title: "3. Citizen Touch Ballot & VVPAT Paper Audit",
      guTitle: "૩. નાગરિક ટચ બેલેટ અને VVPAT ઓડિટ સ્લિપ",
      icon: Vote,
      color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950",
      description:
        "The citizen enters the private booth, reviews bilingual candidate cards with multilingual voice guidance, and touches their choice. A 7-second VVPAT paper slip simulation confirms their choice before the vote is anonymously sealed into the decoupled vote vault.",
      tip: "Privacy Standard: Zero link between voter identity and candidate ballot is ever stored."
    }
  ];

  const current = tourContent[tourStep - 1];
  const Icon = current.icon;

  const handleNext = () => {
    if (tourStep < 3) {
      setTourStep(tourStep + 1);
    } else {
      onClose();
      if (onStartTourWorkflow) onStartTourWorkflow();
    }
  };

  const handlePrev = () => {
    if (tourStep > 1) {
      setTourStep(tourStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close Guided Tour"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s === tourStep
                  ? "bg-blue-600 dark:bg-blue-500"
                  : s < tourStep
                  ? "bg-emerald-500"
                  : "bg-slate-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Step Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-4 rounded-2xl ${current.color}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Staff Training Tour • Step {tourStep} of 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              {current.guTitle}
            </p>
          </div>
        </div>

        {/* Step Body */}
        <div className="my-6 space-y-4">
          <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
            {current.description}
          </p>

          <div className="p-3.5 bg-blue-50 dark:bg-zinc-800/80 border-l-4 border-blue-600 rounded-r-xl text-xs sm:text-sm text-blue-900 dark:text-blue-200 font-medium">
            💡 {current.tip}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="touch-target px-4 py-2.5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-bold text-sm sm:text-base transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {tourStep > 1 && (
              <button
                onClick={handlePrev}
                className="touch-target px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-sm sm:text-base rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="touch-target px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base rounded-xl shadow-md active:scale-95 flex items-center gap-2 transition-all"
            >
              {tourStep === 3 ? "Start Exploring Terminal" : "Next Step"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
