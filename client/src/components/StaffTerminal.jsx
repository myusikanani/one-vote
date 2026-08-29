import React, { useState, useRef, useEffect } from "react";
import { 
  Check, 
  Camera, 
  CreditCard, 
  Clock, 
  ShieldAlert, 
  Key, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight,
  WifiOff,
  UserCheck,
  ShieldCheck,
  Volume2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function StaffTerminal({
  currentCity,
  voterIdInput,
  onVoterIdChange,
  onVerifyVoter,
  verificationResult,
  isVerifying,
  activeToken,
  tokenTimeLeft,
  onProceedToVoting,
  onExplainScreen,
  onPlayVoiceAnnouncement,
  onSelectPresetVoter,
  onOpenResetModal,
  isOffline,
  currentLanguage = "en"
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [showQrModal, setShowQrModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef(null);

  const boothNumberMap = {
    Ahmedabad: "Booth 12",
    Surat: "Booth 07",
    Vadodara: "Booth 03",
    Rajkot: "Booth 05"
  };

  const SYNTHETIC_VOTER_ID_REGEX = /^DEMO-V\d{3}$/;

  const normalizeInput = (val) => {
    if (!val) return "";
    const clean = val.trim().toUpperCase();
    if (clean === "1" || clean === "1ST" || clean === "V101" || clean === "DEMO1" || clean === "DEMO-1" || clean === "DEMO101" || clean === "DEMO-101") return "DEMO-V101";
    if (clean === "2" || clean === "2ND" || clean === "V102" || clean === "DEMO2" || clean === "DEMO-2" || clean === "DEMO102" || clean === "DEMO-102") return "DEMO-V102";
    if (clean === "3" || clean === "3RD" || clean === "V103" || clean === "DEMO3" || clean === "DEMO-3" || clean === "DEMO103" || clean === "DEMO-103") return "DEMO-V103";
    if (clean === "4" || clean === "4TH" || clean === "V104" || clean === "DEMO4" || clean === "DEMO-4" || clean === "DEMO104" || clean === "DEMO-104") return "DEMO-V104";
    if (clean === "5" || clean === "5TH" || clean === "V105" || clean === "DEMO5" || clean === "DEMO-5" || clean === "DEMO105" || clean === "DEMO-105") return "DEMO-V105";
    return clean;
  };

  const rawInput = voterIdInput ? voterIdInput.trim() : "";
  const normalizedInput = normalizeInput(rawInput);
  const isFormatValid = SYNTHETIC_VOTER_ID_REGEX.test(normalizedInput);
  const isInputEmpty = rawInput.length === 0;
  const isShortcutMapped = isFormatValid && rawInput.toUpperCase() !== normalizedInput;

  // Auto-focus input when needed
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTimer = (seconds) => {
    if (seconds === null || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSimulateScan = (id) => {
    if (isOffline) return;
    setIsScanning(true);
    setTimeout(() => {
      onVoterIdChange(id);
      setIsScanning(false);
      setShowQrModal(false);
      onVerifyVoter(id);
    }, 500);
  };

  const handleSelectChip = (id) => {
    onVoterIdChange(id);
    if (onSelectPresetVoter) {
      onSelectPresetVoter(id);
    } else {
      onVerifyVoter(id);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onVoterIdChange(val);
  };

  const handleTriggerVerify = () => {
    if (!isFormatValid || isOffline || isVerifying) return;
    onVerifyVoter(normalizedInput);
  };

  return (
    <div className="w-full space-y-4">
      {/* Offline Alert Box */}
      {isOffline && (
        <div className="status-box-danger flex items-center gap-3">
          <WifiOff className="w-5 h-5 shrink-0 text-[#C62828]" />
          <div className="text-xs">
            <span className="font-bold block uppercase tracking-wider">Offline — Central Unreachable</span>
            <span>{t.offlineBanner.desc}</span>
          </div>
        </div>
      )}

      {/* Main Government Form Card */}
      <div className="gov-card">
        <div className="gov-card-header flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#0B3B6F]">
            {currentCity} · {boothNumberMap[currentCity] || "Booth 12"}
          </h2>
          <span className="text-xs text-[#4C5768] font-mono">Terminal GJ-ELEC-01</span>
        </div>

        <div className="gov-card-body space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A2233] uppercase tracking-wider">
              {currentLanguage === "gu" ? "વોટર આઈડી દાખલ કરો" : currentLanguage === "hi" ? "वोटर आईडी दर्ज करें" : "Enter Voter ID"}
            </label>
            
            <input
              ref={inputRef}
              type="text"
              disabled={isOffline}
              value={voterIdInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTriggerVerify();
                }
              }}
              placeholder="DEMO-V101 (or type 1)"
              aria-invalid={!isInputEmpty && !isFormatValid}
              aria-describedby="voter-id-help voter-id-error"
              className={`w-full py-2.5 px-3 text-base font-mono font-bold rounded-[4px] border bg-[#FFFFFF] text-[#1A2233] focus:ring-1 outline-none transition-colors ${
                !isInputEmpty && !isFormatValid
                  ? "border-[#C62828] focus:border-[#C62828] focus:ring-[#C62828]"
                  : "border-[#D9E0EA] focus:border-[#134A8A] focus:ring-[#134A8A]"
              }`}
            />

            {/* Shortcut Mapping Helper */}
            {isShortcutMapped && (
              <div className="flex items-center gap-1.5 text-xs text-[#128807] font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Auto-mapped shortcut '{rawInput}' → {normalizedInput}</span>
              </div>
            )}

            {/* Inline Validation Errors */}
            <div aria-live="polite">
              {!isInputEmpty && !isFormatValid && (
                <div id="voter-id-error" className="flex items-center gap-1.5 text-xs text-[#C62828] font-bold mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid Demo Voter ID format. Use DEMO-V101 or type 1.</span>
                </div>
              )}
            </div>

            {/* Helper Text */}
            <p id="voter-id-help" className="text-[11px] text-[#4C5768]">
              Synthetic demo IDs only (e.g. DEMO-V101 or 1). Do not enter real personal information.
            </p>
          </div>

          {/* Quick Demo ID Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-[#4C5768] uppercase tracking-wider block">
              Quick Synthetic Demo ID Badges (Click to test):
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "DEMO-V101", title: "1. DEMO-V101 (Ramesh Patel)", badge: "Eligible · Not Voted", badgeClass: "bg-[#EBF7EB] text-[#128807] border-[#B8E4B6]" },
                { id: "DEMO-V102", title: "2. DEMO-V102 (Priya Shah)", badge: "Already Voted", badgeClass: "bg-[#FDECEC] text-[#C62828] border-[#F5B5B5]" },
                { id: "DEMO-V103", title: "3. DEMO-V103 (Vikram Desai)", badge: "Ineligible", badgeClass: "bg-[#FFF6E0] text-[#8A6100] border-[#F2DC9B]" },
                { id: "DEMO-V104", title: "4. DEMO-V104 (Ananya Mehta)", badge: "Eligible · Not Voted", badgeClass: "bg-[#EBF7EB] text-[#128807] border-[#B8E4B6]" },
                { id: "DEMO-V105", title: "5. DEMO-V105 (Tariq Khan)", badge: "Anomaly Monitored", badgeClass: "bg-[#FFF6E0] text-[#8A6100] border-[#F2DC9B]" }
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleSelectChip(chip.id)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-[4px] border transition-all cursor-pointer flex items-center gap-2 ${
                    normalizedInput === chip.id
                      ? "bg-[#0B3B6F] text-white border-[#0B3B6F] shadow-sm"
                      : "bg-[#F4F6F9] text-[#0B3B6F] border-[#D9E0EA] hover:bg-[#EAF1FB] hover:border-[#BED4F3]"
                  }`}
                >
                  <span>{chip.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-[3px] border font-sans font-bold ${chip.badgeClass}`}>
                    {chip.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isVerifying || isInputEmpty || !isFormatValid || isOffline}
              onClick={handleTriggerVerify}
              className="btn-saffron text-xs"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.staffTerminal.verifying}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{currentLanguage === "gu" ? "મતદાર ચકાસો" : currentLanguage === "hi" ? "सत्यापित करें" : "Verify voter"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isOffline}
              onClick={() => setShowQrModal(true)}
              className="btn-outline-navy text-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{currentLanguage === "gu" ? "QR સ્કેન કરો" : currentLanguage === "hi" ? "QR स्कैन करें" : "Scan QR"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Outcome Cards */}
      {verificationResult && (
        <div className="space-y-4" aria-live="polite">
          {/* CASE A: Verified & Token Issued (Green Status Box) */}
          {verificationResult.success && verificationResult.status === "ELIGIBLE_TOKEN_ISSUED" && (
            <div className="gov-card border-[#B8E4B6]">
              <div className="status-box-success flex flex-wrap items-center justify-between gap-2 border-b border-[#B8E4B6] rounded-b-none">
                <div className="flex items-center gap-2">
                  <span className="gov-tag gov-tag-green">VERIFIED & CLEARED</span>
                  <span className="text-xs font-bold">
                    {currentLanguage === "gu" ? verificationResult.voter?.nameGujarati : verificationResult.voter?.name} ({verificationResult.voter?.voterId})
                  </span>
                </div>
                <button
                  onClick={() => onPlayVoiceAnnouncement("token_issued", verificationResult.voter)}
                  className="px-2.5 py-1 bg-white text-[#128807] border border-[#B8E4B6] rounded-[3px] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Voice Prompt</span>
                </button>
              </div>

              <div className="gov-card-body space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px]">
                    <span className="text-[#4C5768] block">Registered Constituency:</span>
                    <strong className="text-[#1A2233]">{verificationResult.voter?.constituency}</strong>
                  </div>
                  <div className="p-3 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px]">
                    <span className="text-[#4C5768] block">Home District:</span>
                    <strong className="text-[#1A2233]">{verificationResult.voter?.registeredCity}</strong>
                  </div>
                  <div className="p-3 bg-[#EAF1FB] border border-[#BED4F3] rounded-[4px] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#0B3B6F]">
                      <span>5-MIN TOKEN:</span>
                      <span className="font-mono text-[#C62828] font-bold">{formatTimer(tokenTimeLeft)}</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-[#0B3B6F] text-center mt-1">
                      {verificationResult.token?.token || activeToken}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#D9E0EA]">
                  <span className="text-xs text-[#4C5768]">
                    Single-use token is valid for 5 minutes. Token is cryptographically bound to {currentCity}.
                  </span>
                  <button
                    onClick={onProceedToVoting}
                    className="btn-saffron text-xs"
                  >
                    <span>Proceed to EVM Ballot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CASE B: Invalid Voter ID Format */}
          {verificationResult.code === "INVALID_VOTER_ID_FORMAT" && (
            <div className="status-box-danger space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <XCircle className="w-5 h-5 text-[#C62828]" />
                <span className="uppercase tracking-wider">Invalid Voter ID</span>
              </div>
              <p className="text-xs text-[#1A2233] font-medium">
                Please enter a synthetic ID in the format DEMO-V101.
              </p>
              <div>
                <button
                  type="button"
                  onClick={focusInput}
                  className="btn-outline-navy text-xs h-8 min-h-0 py-1"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* CASE C: Voter ID Not Found */}
          {verificationResult.code === "VOTER_NOT_FOUND" && (
            <div className="status-box-danger space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <XCircle className="w-5 h-5 text-[#C62828]" />
                <span className="uppercase tracking-wider">Voter ID Not Found</span>
              </div>
              <p className="text-xs text-[#1A2233] font-medium">
                This ID is not present in the synthetic demo database.
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    onVoterIdChange("");
                    focusInput();
                  }}
                  className="btn-outline-navy text-xs h-8 min-h-0 py-1"
                >
                  Enter Another ID
                </button>
              </div>
            </div>
          )}

          {/* CASE D: Duplicate Vote Blocked (Already Voted) */}
          {(verificationResult.code === "ALREADY_VOTED" || verificationResult.status === "ALREADY_VOTED") && (
            <div className="status-box-danger space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-[#C62828]" />
                <span className="uppercase tracking-wider">Already Voted</span>
              </div>
              <p className="text-xs text-[#1A2233] font-medium">
                This voter has already completed voting. A second attempt is blocked.
              </p>
              {verificationResult.previousVote && (
                <div className="p-2.5 bg-[#FFFFFF] border border-[#F5B5B5] rounded-[4px] text-xs font-mono text-[#1A2233] space-y-0.5">
                  <div>Previous Ballot: <strong>{verificationResult.previousVote.boothCity}</strong> ({new Date(verificationResult.previousVote.timestamp).toLocaleTimeString()})</div>
                  <div className="truncate text-[#4C5768]">Audit Seal: {verificationResult.previousVote.cryptoSeal}</div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onVoterIdChange("");
                    focusInput();
                  }}
                  className="btn-outline-navy text-xs h-8 min-h-0 py-1"
                >
                  Verify Another Voter
                </button>

                {onOpenResetModal && (
                  <button
                    type="button"
                    onClick={onOpenResetModal}
                    className="btn-saffron text-xs h-8 min-h-0 py-1"
                  >
                    Reset Demo Records to Re-Vote
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CASE E: Simultaneous Session Exists */}
          {(verificationResult.code === "ACTIVE_SESSION_EXISTS" || verificationResult.status === "ACTIVE_SESSION_EXISTS") && (
            <div className="status-box-warn space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Clock className="w-5 h-5 text-[#8A6100]" />
                <span className="uppercase tracking-wider">ACTIVE_SESSION_EXISTS</span>
              </div>
              <p className="text-xs text-[#1A2233] font-medium">
                {verificationResult.message || t.staffTerminal.activeSessionDesc}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onProceedToVoting) onProceedToVoting();
                  }}
                  className="btn-saffron text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentLanguage === "gu" ? "મતદાન બૂથ પર આગળ વધો" : currentLanguage === "hi" ? "मतदान बूथ पर आगे बढ़ें" : "Proceed to Voting Booth"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onOpenResetModal && (
                  <button
                    type="button"
                    onClick={onOpenResetModal}
                    className="btn-outline-navy text-xs h-8 min-h-0 py-1"
                  >
                    {currentLanguage === "gu" ? "સેશન રીસેટ કરો" : "Reset Session"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CASE F: Ineligible Voter */}
          {(verificationResult.code === "NOT_ELIGIBLE" || verificationResult.status === "INELIGIBLE") && (
            <div className="status-box-warn space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-[#8A6100]" />
                <span className="uppercase tracking-wider">Voting Cannot Continue</span>
              </div>
              <p className="text-xs text-[#1A2233] font-medium">
                This synthetic voter record is not eligible to vote.
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    onVoterIdChange("");
                    focusInput();
                  }}
                  className="btn-outline-navy text-xs h-8 min-h-0 py-1"
                >
                  Verify Another Voter
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optical QR Scanner Modal Simulation */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="gov-card max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9E0EA] pb-2">
              <span className="font-bold text-sm text-[#0B3B6F] flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Simulated QR Code Scanner</span>
              </span>
              <button onClick={() => setShowQrModal(false)} className="text-[#4C5768] hover:text-[#1A2233] font-bold cursor-pointer">✕</button>
            </div>

            <div className="p-6 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px] text-center space-y-3">
              <div className="w-28 h-28 border border-dashed border-[#0B3B6F] rounded-[4px] mx-auto flex items-center justify-center font-mono text-xs text-[#0B3B6F] bg-white">
                Camera Feed
              </div>
              <p className="text-xs text-[#4C5768]">Simulate optical scan with synthetic test credentials:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  onClick={() => handleSimulateScan("DEMO-V101")}
                  className="btn-saffron text-xs h-8 min-h-0 py-1"
                >
                  Scan DEMO-V101
                </button>
                <button
                  onClick={() => handleSimulateScan("DEMO-V102")}
                  className="btn-danger text-xs h-8 min-h-0 py-1"
                >
                  Scan DEMO-V102 (Duplicate)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOW VOTE SECRECY IS PRESERVED Bottom Card */}
      <div className="gov-card p-5 space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF9933]">
          HOW VOTE SECRECY IS PRESERVED
        </h3>
        <p className="text-xs text-[#4C5768] leading-relaxed">
          {currentLanguage === "gu"
            ? "વોટર સ્ટેટસ ટેબલ માત્ર વોટર આઈડી, પાત્રતા અને VOTED/NOT_VOTED સ્ટેટસ સંગ્રહિત કરે છે. વોટ સ્ટોર માત્ર એક અનામી વોટ આઈડી અને ઉમેદવાર સંગ્રહિત કરે છે — ક્યારેય વોટર આઈડી નહીં. આ સિસ્ટમમાં કંઈ પણ એવું નથી જે તમે કોને મત આપ્યો તે લિંક કરી શકે."
            : currentLanguage === "hi"
              ? "वोटर स्टेटस टेबल केवल वोटर आईडी, पात्रता और VOTED/NOT_VOTED स्थिति संग्रहीत करता है। वोट स्टोर केवल एक अनाम वोट आईडी और उम्मीदवार संग्रहीत करता है — कभी वोटर आईडी नहीं। इस सिस्टम में ऐसा कुछ भी नहीं है जो यह जोड़ सके कि आपने किसे वोट दिया।"
              : "The Voter Status table only ever stores a Voter ID, eligibility and VOTED/NOT_VOTED. The Vote Store only ever stores an anonymous Vote ID and a candidate — never a Voter ID. Nothing in this system can link who you voted for."}
        </p>
      </div>
    </div>
  );
}
