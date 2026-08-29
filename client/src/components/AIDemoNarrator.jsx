import React, { useState, useEffect } from "react";
import { Play, Pause, SkipForward, X, Volume2, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function AIDemoNarrator({
  isActive,
  onClose,
  onTriggerAction,
  isDarkMode
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demoScript = [
    {
      title: "1. The Civic Challenge & One Voter ID Vision",
      subtitle: "Enabling 100% voter turnout for migrant citizens across Gujarat",
      narration:
        "Welcome to 'One Voter ID — Anywhere Voting'. Over 300 million citizens in India work outside their home district. Our prototype enables registered voters to cast ballots at any polling booth across Gujarat with real-time central synchronization.",
      actionText: "Simulate Ahmedabad Verification",
      action: () => onTriggerAction("VERIFY_RAMESH_AHMEDABAD")
    },
    {
      title: "2. Real-Time Central Verification & 5-Min Token",
      subtitle: "Central query validates status and generates short-lived authorization",
      narration:
        "At Ahmedabad Booth 104, polling staff scans Ramesh Patel's ID. The central ledger confirms he has NOT voted and generates a cryptographic 5-minute authorization token.",
      actionText: "Proceed to Citizen Ballot",
      action: () => onTriggerAction("GO_TO_BALLOT")
    },
    {
      title: "3. Simulated Citizen Ballot & VVPAT Audit Trail",
      subtitle: "Bilingual interface with 7-second VVPAT verification window",
      narration:
        "The citizen enters the private booth, reviews bilingual candidate cards with multilingual audio, and casts their vote. A 7-second VVPAT paper slip confirms the choice before anonymous commitment to the decoupled vault.",
      actionText: "Cast Vote for Aarav Patel",
      action: () => onTriggerAction("CAST_VOTE_DEMO")
    },
    {
      title: "4. Instant Cross-District Duplicate Blocking",
      subtitle: "Switching to Surat terminal to test duplicate prevention",
      narration:
        "Now, watch what happens when the same citizen attempts to vote at Surat Booth 212. The central ledger instantly halts the attempt, displaying cryptographic proof of the previous ballot.",
      actionText: "Trigger Surat Duplicate Test",
      action: () => onTriggerAction("TEST_SURAT_DUPLICATE")
    },
    {
      title: "5. Decoupled Privacy Vault & AI Anomaly Detection",
      subtitle: "Constitutional vote secrecy combined with real-time AI security",
      narration:
        "Our architecture strictly decouples voter identity from candidate choices. Meanwhile, the AI Anomaly Detector monitors multi-district velocity scans to prevent identity spoofing.",
      actionText: "Open Security & Privacy Vault",
      action: () => onTriggerAction("OPEN_SECURITY_VAULT")
    }
  ];

  const slide = demoScript[currentSlide];

  // Speak slide narration
  useEffect(() => {
    if (isActive && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(slide.narration);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [currentSlide, isActive]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentSlide < demoScript.length - 1) {
      const nextIndex = currentSlide + 1;
      setCurrentSlide(nextIndex);
      slide.action();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-2xl bg-zinc-950/95 text-white border-2 border-purple-500 rounded-3xl shadow-2xl p-5 backdrop-blur-md animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
          <span className="text-xs font-black uppercase tracking-widest text-purple-400">
            AI Guided Presentation Demo • Slide {currentSlide + 1} of {demoScript.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Exit Demo"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Body */}
      <div className="my-3 space-y-1.5">
        <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
          {slide.title}
        </h3>
        <p className="text-xs sm:text-sm text-purple-300 font-bold">
          {slide.subtitle}
        </p>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
          {slide.narration}
        </p>
      </div>

      {/* Progress Bars */}
      <div className="flex items-center gap-1.5 my-3">
        {demoScript.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              idx === currentSlide
                ? "bg-purple-500"
                : idx < currentSlide
                ? "bg-emerald-500"
                : "bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="touch-target px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-bold rounded-xl transition-all"
          >
            Previous
          </button>
        </div>

        <button
          onClick={handleNext}
          className="touch-target px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2"
        >
          <span>{slide.actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
