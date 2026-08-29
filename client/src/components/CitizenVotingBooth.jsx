import React, { useState, useEffect } from "react";
import { 
  Volume2, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  ShieldCheck,
  Clock,
  Eye,
  AlertTriangle,
  Lock
} from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function CitizenVotingBooth({
  voter,
  token,
  currentCity,
  candidates,
  onCastVote,
  isSubmitting,
  onPlayCandidateAudio,
  onCancel,
  currentLanguage = "en"
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVvpatWindow, setShowVvpatWindow] = useState(false);
  const [vvpatTimer, setVvpatTimer] = useState(7);

  // 7-second VVPAT inspection sequence
  useEffect(() => {
    let interval;
    if (showVvpatWindow && vvpatTimer > 0) {
      interval = setInterval(() => {
        setVvpatTimer((prev) => prev - 1);
      }, 1000);
    } else if (showVvpatWindow && vvpatTimer === 0) {
      setShowVvpatWindow(false);
      if (selectedCandidate) {
        onCastVote(selectedCandidate.id);
      }
    }
    return () => clearInterval(interval);
  }, [showVvpatWindow, vvpatTimer, selectedCandidate]);

  const handleVoteButtonClick = (cand) => {
    setSelectedCandidate(cand);
    setShowConfirmModal(true);
  };

  const handleConfirmVote = () => {
    setShowConfirmModal(false);
    setShowVvpatWindow(true);
    setVvpatTimer(7);
  };

  return (
    <div className="w-full space-y-4">
      {/* EVM Ballot Unit Header Card */}
      <div className="gov-card">
        <div className="gov-card-header flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="gov-tag gov-tag-blue">BALLOT UNIT 01</span>
              <h2 className="text-base font-bold text-[#0B3B6F]">
                {currentLanguage === "gu" ? "ઇવીએમ બેલેટ યુનિટ" : currentLanguage === "hi" ? "ईवीएम मतपत्र इकाई" : "EVM Ballot Unit"}
              </h2>
            </div>
            <p className="text-xs text-[#4C5768] mt-0.5">
              Dynamic Cross-District Ballot · Native Constituency: <strong>{voter?.constituency || "Ahmedabad East"}</strong> ({voter?.registeredCity || "Ahmedabad"})
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono text-[#4C5768]">Auth Token: <strong className="text-[#0B3B6F]">{token || "AUTH-489210"}</strong></span>
            <button
              onClick={onCancel}
              className="text-[#C62828] hover:underline font-bold cursor-pointer"
            >
              Cancel Session
            </button>
          </div>
        </div>

        {/* Candidate List Rows */}
        <div className="divide-y divide-[#D9E0EA]">
          {candidates.map((candidate, idx) => (
            <div
              key={candidate.id}
              className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#F4F6F9] transition-colors"
            >
              {/* Left: Serial No + Photo/Symbol + Name */}
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="w-6 h-6 rounded-full bg-[#EAF1FB] text-[#0B3B6F] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div className="w-10 h-10 rounded-[4px] bg-[#FFFFFF] border border-[#D9E0EA] flex items-center justify-center text-xl shrink-0 shadow-xs">
                  {candidate.symbolEmoji || candidate.symbol || candidate.symbolIcon || "🗳️"}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#1A2233]">
                    {currentLanguage === "gu" ? candidate.nameGujarati : candidate.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#4C5768]">
                    <span>{currentLanguage === "gu" ? candidate.partyGujarati || candidate.party : candidate.party}</span>
                    <span>•</span>
                    <span className="font-medium text-[#0B3B6F]">Symbol: {candidate.symbolName}</span>
                  </div>
                </div>
              </div>

              {/* Right: Audio Listen Button + Vote Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPlayCandidateAudio(candidate)}
                  className="px-2.5 py-1.5 rounded-[3px] border border-[#D9E0EA] bg-[#FFFFFF] hover:bg-[#EAF1FB] text-[#0B3B6F] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Hear candidate details"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#0B3B6F]" />
                  <span className="hidden sm:inline">{currentLanguage === "gu" ? "સાંભળો" : currentLanguage === "hi" ? "सुनें" : "Hear"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleVoteButtonClick(candidate)}
                  className="btn-saffron text-xs h-9 min-h-0 py-1 px-4"
                >
                  <span>{currentLanguage === "gu" ? "મત આપો" : currentLanguage === "hi" ? "वोट दें" : "Vote"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal before VVPAT */}
      {showConfirmModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="gov-card max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E0EA] pb-2">
              <span className="font-bold text-sm text-[#0B3B6F] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#128807]" />
                <span>Confirm Candidate Selection</span>
              </span>
              <button onClick={() => setShowConfirmModal(false)} className="text-[#4C5768] font-bold cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-[#4C5768]">
              You have selected the following candidate. Please review before printing your VVPAT slip:
            </p>

            <div className="p-3 bg-[#EAF1FB] border border-[#BED4F3] rounded-[4px] flex items-center gap-3">
              <span className="text-2xl">{selectedCandidate.symbolEmoji || selectedCandidate.symbol || selectedCandidate.symbolIcon || "🗳️"}</span>
              <div>
                <strong className="text-sm text-[#0B3B6F] block">
                  {currentLanguage === "gu" ? selectedCandidate.nameGujarati : selectedCandidate.name}
                </strong>
                <span className="text-xs text-[#4C5768]">{selectedCandidate.party} ({selectedCandidate.symbolName})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn-outline-navy text-xs h-9 min-h-0 py-1"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleConfirmVote}
                className="btn-saffron text-xs h-9 min-h-0 py-1"
              >
                Confirm & Print VVPAT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7-Second Physical VVPAT Inspection Chamber */}
      {showVvpatWindow && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="gov-card max-w-sm w-full p-5 space-y-4 bg-[#FFFFFF]">
            <div className="flex items-center justify-between border-b border-[#D9E0EA] pb-2">
              <span className="font-bold text-xs text-[#0B3B6F] uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#FF9933]" />
                <span>VVPAT Glass Chamber (7s Inspection)</span>
              </span>
              <span className="font-mono text-xs font-bold text-[#C62828]">{vvpatTimer}s remaining</span>
            </div>

            <div className="p-4 bg-[#2C3440] rounded-[4px] flex flex-col items-center">
              {/* Printed VVPAT Paper Slip */}
              <div className="vvpat-paper-slip w-full max-w-[260px] text-xs space-y-1.5 animate-slide-down">
                <div className="text-[10px] text-center font-bold uppercase tracking-wider text-slate-600 pb-1 border-b border-dashed border-slate-400">
                  Election Commission of India · VVPAT Slip
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span>Serial No:</span>
                  <strong>#0{candidates.findIndex(c => c.id === selectedCandidate.id) + 1}</strong>
                </div>
                <div>Candidate: <strong>{selectedCandidate.name}</strong></div>
                <div>Party: <strong>{selectedCandidate.party}</strong></div>
                <div className="flex items-center justify-between pt-1">
                  <span>Symbol:</span>
                  <span className="text-xl">{selectedCandidate.symbolEmoji || selectedCandidate.symbol || selectedCandidate.symbolIcon || "🗳️"}</span>
                </div>
                <div className="text-[9px] text-[#4C5768] font-mono pt-1 border-t border-dashed border-slate-300 truncate">
                  Slip Hash: 8F2A-91C0-5E4D
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center text-[#4C5768]">
              Slip will be securely dropped into the sealed compartment in <strong>{vvpatTimer} seconds</strong>.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowVvpatWindow(false);
                  onCastVote(selectedCandidate.id);
                }}
                className="w-full btn-saffron text-xs h-8 min-h-0 py-1"
              >
                Complete Ballot Now (Skip Wait)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
