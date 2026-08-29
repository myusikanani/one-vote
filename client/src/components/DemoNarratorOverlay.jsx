import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Vote, 
  Award,
  Volume2
} from "lucide-react";

export default function DemoNarratorOverlay({
  isOpen,
  onClose,
  onRunStepAction,
  isDarkMode
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(8);

  const demoScript = [
    {
      title: "1. Cross-District Citizen Verification",
      subtitle: "Ahmedabad Central Polling Station",
      description: "Citizen Rameshbhai Patel from GJ-07 Ahmedabad East presents his ID at a remote polling station. Staff scans his badge.",
      actionLabel: "Verify Ramesh Patel (DEMO-V101)",
      actionKey: "VERIFY_RAMESH"
    },
    {
      title: "2. Cryptographic 5-Min Token Issuance",
      subtitle: "Statewide Central Ledger Cleared",
      description: "The central ledger validates Ramesh is NOT_VOTED. A temporary 5-minute authorization token (AUTH-250354) is generated.",
      actionLabel: "Proceed to Citizen Voting Booth",
      actionKey: "GO_TO_BOOTH"
    },
    {
      title: "3. EVM Touch Ballot & 7-Sec VVPAT Slip",
      subtitle: "Citizen Electronic Choice & Paper Audit",
      description: "Ramesh selects candidate Aarav Patel. The 7-second VVPAT transparent window shows the physical paper slip drop.",
      actionLabel: "Cast Ballot for Aarav Patel",
      actionKey: "CAST_VOTE"
    },
    {
      title: "4. Status Transitioned & Decoupled",
      subtitle: "Central Store: VOTED • Vault: Anonymous",
      description: "Ramesh's status is sealed as VOTED. The candidate ballot is placed into the decoupled anonymous vault with zero voter linkage.",
      actionLabel: "View Digital Receipt & Success Screen",
      actionKey: "VIEW_COMPLETION"
    },
    {
      title: "5. Duplicate Vote Block Showcase",
      subtitle: "Switching to Rajkot Polling Station",
      description: "Demonstrating fraud prevention: An attempt is made to verify Ramesh's ID in Rajkot. The system blocks it immediately with cryptographic audit proof!",
      actionLabel: "Simulate Duplicate Attempt in Rajkot",
      actionKey: "TEST_DUPLICATE"
    }
  ];

  const currentStep = demoScript[currentStepIndex];

  // Auto-advance timer when playing
  useEffect(() => {
    let timer;
    if (isOpen && isPlaying) {
      if (secondsRemaining > 0) {
        timer = setInterval(() => {
          setSecondsRemaining((prev) => prev - 1);
        }, 1000);
      } else {
        // Execute current step action and advance
        onRunStepAction(currentStep.actionKey);
        if (currentStepIndex < demoScript.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
          setSecondsRemaining(8);
        } else {
          setIsPlaying(false);
        }
      }
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, secondsRemaining, currentStepIndex, currentStep, onRunStepAction]);

  const handleNext = () => {
    onRunStepAction(currentStep.actionKey);
    if (currentStepIndex < demoScript.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSecondsRemaining(8);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setSecondsRemaining(8);
    }
  };

  const handleManualTrigger = () => {
    onRunStepAction(currentStep.actionKey);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-50 sm:max-w-md bg-slate-950 text-white border-2 border-blue-500 rounded-3xl shadow-2xl p-5 sm:p-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-600 rounded-lg text-white">
            <Sparkles className="w-4 h-4 animate-spin" />
          </span>
          <span className="font-black text-xs uppercase tracking-widest text-blue-400">
            AI Automated Guided Demo
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Script Step Body */}
      <div className="my-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-blue-300 font-mono">
          <span>Step {currentStepIndex + 1} of {demoScript.length}</span>
          <span>Auto-advance: {secondsRemaining}s</span>
        </div>

        <h4 className="text-lg font-black text-white leading-tight">
          {currentStep.title}
        </h4>
        <p className="text-xs font-bold text-blue-400">
          {currentStep.subtitle}
        </p>
        <p className="text-xs text-zinc-300 leading-relaxed pt-1">
          {currentStep.description}
        </p>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleManualTrigger}
        className="w-full py-2.5 px-4 mb-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
      >
        <span>Execute: {currentStep.actionLabel}</span>
      </button>

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1.5 text-xs font-bold"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === demoScript.length - 1}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-zinc-400 hover:text-zinc-200 font-bold"
        >
          Exit Demo
        </button>
      </div>
    </div>
  );
}
