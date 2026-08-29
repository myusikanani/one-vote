import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StepProgressTracker from "./components/StepProgressTracker";
import StaffTerminal from "./components/StaffTerminal";
import CitizenVotingBooth from "./components/CitizenVotingBooth";
import CompletionScreen from "./components/CompletionScreen";
import SupervisorView from "./components/SupervisorView";
import AdminView from "./components/AdminView";
import RoleSwitchModal from "./components/RoleSwitchModal";
import ResetDemoModal from "./components/ResetDemoModal";
import GuidedTourModal from "./components/GuidedTourModal";
import ExplainScreenModal from "./components/ExplainScreenModal";
import AnomalyDetectorModal from "./components/AnomalyDetectorModal";
import PrivacyArchitectureModal from "./components/PrivacyArchitectureModal";
import StaffAssistantDrawer from "./components/StaffAssistantDrawer";
import DemoNarratorOverlay from "./components/DemoNarratorOverlay";
import { MessageSquare, Volume2, ShieldCheck, CheckCircle2, AlertCircle, X, Bot, Play } from "lucide-react";
import { TRANSLATIONS } from "./translations";

const DEFAULT_CANDIDATES = [
  {
    id: "CAND-01",
    name: "Aarav K. Patel",
    nameGujarati: "આરવ કે. પટેલ",
    party: "Progressive Civic Front (PCF)",
    partyGujarati: "પ્રગતિશીલ નાગરિક મોરચો",
    symbol: "🌳",
    symbolEmoji: "🌳",
    symbolName: "Banyan Tree / વડનું વૃક્ષ",
    color: "#16a34a",
    serialNo: 1,
    audioText: "Candidate number 1: Aarav Patel. Progressive Civic Front. Symbol: Banyan Tree.",
    audioTextGujarati: "ઉમેદવાર નંબર 1: આરવ પટેલ. પ્રગતિશીલ નાગરિક મોરચો. પ્રતીક: વડનું વૃક્ષ."
  },
  {
    id: "CAND-02",
    name: "Bhavna S. Joshi",
    nameGujarati: "ભાવના એસ. જોશી",
    party: "Clean Governance Alliance (CGA)",
    partyGujarati: "સ્વચ્છ શાસન ગઠબંધન",
    symbol: "☀️",
    symbolEmoji: "☀️",
    symbolName: "Rising Sun / ઉગતો સૂર્ય",
    color: "#ea580c",
    serialNo: 2,
    audioText: "Candidate number 2: Bhavna Joshi. Clean Governance Alliance. Symbol: Rising Sun.",
    audioTextGujarati: "ઉમેદવાર નંબર 2: ભાવના જોશી. સ્વચ્છ શાસન ગઠબંધન. પ્રતીક: ઉગતો સૂર્ય."
  },
  {
    id: "CAND-03",
    name: "Dharmesh N. Varma",
    nameGujarati: "ધર્મેશ એન. વર્મા",
    party: "United Democratic Peoples Party (UDPP)",
    partyGujarati: "યુનાઈટેડ ડેમોક્રેટિક પીપલ્સ પાર્ટી",
    symbol: "⚙️",
    symbolEmoji: "⚙️",
    symbolName: "Industrial Wheel / ઔદ્યોગિક ચક્ર",
    color: "#2563eb",
    serialNo: 3,
    audioText: "Candidate number 3: Dharmesh Varma. United Democratic Peoples Party. Symbol: Industrial Wheel.",
    audioTextGujarati: "ઉમેદવાર નંબર 3: ધર્મેશ વર્મા. યુનાઈટેડ ડેમોક્રેટિક પીપલ્સ પાર્ટી. પ્રતીક: ઔદ્યોગિક ચક્ર."
  },
  {
    id: "CAND-04",
    name: "Kiranbhai R. Solanki",
    nameGujarati: "કિરણભાઈ આર. સોલંકી",
    party: "Gujarat Jan Seva Dal (GJSD)",
    partyGujarati: "ગુજરાત જન સેવા દળ",
    symbol: "🌾",
    symbolEmoji: "🌾",
    symbolName: "Golden Harvest / સુવર્ણ કણસ",
    color: "#ca8a04",
    serialNo: 4,
    audioText: "Candidate number 4: Kiranbhai Solanki. Gujarat Jan Seva Dal. Symbol: Golden Harvest.",
    audioTextGujarati: "ઉમેદવાર નંબર 4: કિરણભાઈ સોલંકી. ગુજરાત જન સેવા દળ. પ્રતીક: સુવર્ણ કણસ."
  },
  {
    id: "CAND-NOTA",
    name: "None of the Above (NOTA)",
    nameGujarati: "ઉપરોક્તમાંથી કોઈ નહીં (NOTA)",
    party: "Constitutional Option",
    partyGujarati: "બંધારણીય વિકલ્પ",
    symbol: "❌",
    symbolEmoji: "❌",
    symbolName: "NOTA Cross / અસ્વીકાર",
    color: "#dc2626",
    serialNo: 5,
    audioText: "Candidate number 5: None of the Above, NOTA.",
    audioTextGujarati: "ઉમેદવાર નંબર 5: ઉપરોક્તમાંથી કોઈ નહીં, નોટા."
  }
];

function normalizeVoterId(id) {
  if (!id) return "";
  const clean = id.trim().toUpperCase();
  if (clean === "1" || clean === "1ST" || clean === "V101" || clean === "DEMO1" || clean === "DEMO-1" || clean === "DEMO101" || clean === "DEMO-101") return "DEMO-V101";
  if (clean === "2" || clean === "2ND" || clean === "V102" || clean === "DEMO2" || clean === "DEMO-2" || clean === "DEMO102" || clean === "DEMO-102") return "DEMO-V102";
  if (clean === "3" || clean === "3RD" || clean === "V103" || clean === "DEMO3" || clean === "DEMO-3" || clean === "DEMO103" || clean === "DEMO-103") return "DEMO-V103";
  if (clean === "4" || clean === "4TH" || clean === "V104" || clean === "DEMO4" || clean === "DEMO-4" || clean === "DEMO104" || clean === "DEMO-104") return "DEMO-V104";
  if (clean === "5" || clean === "5TH" || clean === "V105" || clean === "DEMO5" || clean === "DEMO-5" || clean === "DEMO105" || clean === "DEMO-105") return "DEMO-V105";
  return clean;
}

export default function App() {
  // Application State & Demo Role Session
  const [currentStep, setCurrentStep] = useState(1);
  const [currentCity, setCurrentCity] = useState("Ahmedabad");
  const [activeRole, setActiveRole] = useState(() => sessionStorage.getItem("demoRole") || "POLLING_OFFICER");
  const [demoToken, setDemoToken] = useState(() => sessionStorage.getItem("demoToken") || null);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [booths, setBooths] = useState([
    { city: "Ahmedabad", boothId: "BOOTH-AMD-104", name: "Ahmedabad · Booth 12" },
    { city: "Surat", boothId: "BOOTH-SRT-212", name: "Surat · Booth 07" },
    { city: "Vadodara", boothId: "BOOTH-VAD-305", name: "Vadodara · Booth 03" },
    { city: "Rajkot", boothId: "BOOTH-RJK-088", name: "Rajkot · Booth 05" }
  ]);
  const [isOffline, setIsOffline] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => localStorage.getItem("preferredLang") || "gu"); // default Gujarati
  const [audioSpeed, setAudioSpeed] = useState(1.0);

  // Active translation dictionary
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.gu || TRANSLATIONS.en;

  // Verification & Voting State
  const [voterIdInput, setVoterIdInput] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeToken, setActiveToken] = useState(null);
  const [tokenTimeLeft, setTokenTimeLeft] = useState(null);
  const [candidates, setCandidates] = useState(DEFAULT_CANDIDATES);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [voteReceipt, setVoteReceipt] = useState(null);

  // Modals & Overlays
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAssistantDrawerOpen, setIsAssistantDrawerOpen] = useState(false);
  const [isDemoNarratorOpen, setIsDemoNarratorOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isRoleSwitchModalOpen, setIsRoleSwitchModalOpen] = useState(false);
  const [targetRoleToSwitch, setTargetRoleToSwitch] = useState("POLLING_OFFICER");
  const [explainModalContext, setExplainModalContext] = useState(null);

  // Save language preference
  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem("preferredLang", langCode);
    showToast(
      langCode === "gu" 
        ? "ભાષા ગુજરાતી સેટ થઈ" 
        : langCode === "hi" 
          ? "भाषा हिन्दी सेट हो गई" 
          : "Language switched to English",
      "success"
    );
  };

  // Initialize Demo Role Session on Startup
  useEffect(() => {
    selectDemoRole(activeRole);
    fetchCandidates();
    fetchBooths();
  }, []);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const selectDemoRole = async (roleName) => {
    try {
      const res = await fetch("/api/demo/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleName })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setDemoToken(data.token);
        setActiveRole(data.role);
        sessionStorage.setItem("demoToken", data.token);
        sessionStorage.setItem("demoRole", data.role);
      }
    } catch (err) {
      console.error("Failed to select demo role:", err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch("/api/candidates");
      const data = await res.json();
      if (data.success && data.candidates && data.candidates.length > 0) {
        setCandidates(data.candidates);
      }
    } catch (e) {
      console.log("Using fallback candidate list:", e);
      setCandidates(DEFAULT_CANDIDATES);
    }
  };

  const fetchBooths = async () => {
    try {
      const res = await fetch("/api/booths");
      const data = await res.json();
      if (data.success && data.booths) {
        setBooths(data.booths);
      }
    } catch (e) {
      console.log("Using default booths:", e);
    }
  };

  // Live Token Countdown Timer (5 Minutes)
  useEffect(() => {
    let timer;
    if (activeToken && tokenTimeLeft !== null && tokenTimeLeft > 0) {
      timer = setInterval(() => {
        setTokenTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTokenExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeToken, tokenTimeLeft]);

  const handleTokenExpired = () => {
    alert("Authorization token has expired (5-minute window reached). Please re-verify citizen at the staff terminal.");
    setActiveToken(null);
    setVerificationResult(null);
    setCurrentStep(1);
  };

  // Role Switch Trigger & Confirmation
  const handleRequestRoleChange = (newRole) => {
    if (newRole === activeRole) return;
    setTargetRoleToSwitch(newRole);
    setIsRoleSwitchModalOpen(true);
  };

  const handleConfirmRoleSwitch = async (roleToSet) => {
    await selectDemoRole(roleToSet);
    setIsRoleSwitchModalOpen(false);
    showToast(`Active role switched to ${roleToSet.replace("_", " ")}`, "success");
  };

  // Verify Voter Action (with optional city override)
  const handleVerifyVoter = async (voterIdToVerify, cityToVerify) => {
    const rawId = (voterIdToVerify || voterIdInput || "").trim();
    const id = normalizeVoterId(rawId);
    if (!id) return;

    const city = cityToVerify || currentCity;

    if (isOffline) {
      alert("Central verification unavailable. New voting authorization cannot continue until secure connection is restored.");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    setActiveToken(null);

    try {
      const headers = { "Content-Type": "application/json" };
      if (demoToken) headers["Authorization"] = `Bearer ${demoToken}`;

      const res = await fetch("/api/voter/verify", {
        method: "POST",
        headers,
        body: JSON.stringify({
          voterId: id,
          boothCity: city
        })
      });

      const data = await res.json();
      setVerificationResult(data);

      if (data.success && data.status === "ELIGIBLE_TOKEN_ISSUED") {
        setActiveToken(data.token?.token || data.token);
        setTokenTimeLeft(data.token?.validSeconds || 300);
        setCurrentStep(4); // Advance directly to Citizen Voting Booth
        playVoice("token_issued", data.voter);
      } else if (data.status === "ACTIVE_SESSION_EXISTS") {
        const activeTok = data.token?.token || data.token || activeToken || "AUTH-DEMO101";
        setActiveToken(activeTok);
        setTokenTimeLeft(data.remainingSeconds || 300);
        setCurrentStep(4); // Advance directly to Citizen Voting Booth
        playVoice("token_issued", data.voter);
      } else if (data.status === "ALREADY_VOTED") {
        setCurrentStep(2);
        playVoice("already_voted", data.voter);
      } else {
        setCurrentStep(2);
      }
      return data;
    } catch (err) {
      console.error("Verification error:", err);
      alert("Error connecting to central verification server.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Cast Vote Action
  const handleCastVote = async (candidateId) => {
    if (!verificationResult?.voter?.voterId || !activeToken) return;

    if (isOffline) {
      alert("Central verification unavailable. Ballot submission is held until secure central connection is restored.");
      return;
    }

    setIsSubmittingVote(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (demoToken) headers["Authorization"] = `Bearer ${demoToken}`;

      const res = await fetch("/api/voter/vote", {
        method: "POST",
        headers,
        body: JSON.stringify({
          voterId: verificationResult.voter.voterId,
          token: activeToken,
          candidateId: candidateId,
          boothCity: currentCity
        })
      });

      const data = await res.json();
      if (data.success) {
        setVoteReceipt(data.receipt);
        setCurrentStep(5);
        setActiveToken(null);
        setTokenTimeLeft(null);
        playVoice("vote_success", verificationResult.voter);
      } else {
        alert(`Vote failed: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error("Vote cast error:", err);
      alert("Network error while submitting ballot.");
    } finally {
      setIsSubmittingVote(false);
    }
  };

  // Reset Demo Data
  const confirmAndResetData = async () => {
    setIsResetting(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (demoToken) headers["Authorization"] = `Bearer ${demoToken}`;

      const res = await fetch("/api/voter/reset", {
        method: "POST",
        headers
      });
      const data = await res.json();

      if (data.success) {
        setVerificationResult(null);
        setActiveToken(null);
        setTokenTimeLeft(null);
        setVoterIdInput("");
        setVoteReceipt(null);
        setCurrentStep(1);
        setIsResetModalOpen(false);
        showToast(
          currentLanguage === "gu" 
            ? "ડેમો રીસેટ પૂર્ણ. સિન્થેટિક રેકોર્ડ્સ તૈયાર છે." 
            : currentLanguage === "hi" 
              ? "डेमो रीसेट पूर्ण हुआ।" 
              : "Demo reset complete. Synthetic voter records are ready.",
          "success"
        );
      } else {
        setIsResetModalOpen(false);
        showToast("Demo reset could not be completed. Please check the central demo service and try again.", "error");
      }
    } catch (e) {
      console.error("Reset error:", e);
      setIsResetModalOpen(false);
      showToast("Demo reset could not be completed. Please check the central demo service and try again.", "error");
    } finally {
      setIsResetting(false);
    }
  };

  // Test Duplicate Verification in Another City
  const handleTestDuplicate = (voterId) => {
    const nextCity = currentCity === "Ahmedabad" ? "Rajkot" : "Ahmedabad";
    setCurrentCity(nextCity);
    setVoterIdInput(voterId || "DEMO-V101");
    setCurrentStep(1);
    setTimeout(() => {
      handleVerifyVoter(voterId || "DEMO-V101");
    }, 400);
  };

  // New Verification Reset
  const handleNewVerification = () => {
    setVerificationResult(null);
    setActiveToken(null);
    setTokenTimeLeft(null);
    setVoterIdInput("");
    setVoteReceipt(null);
    setCurrentStep(1);
  };

  // Audio Voice Prompt Generation
  const playVoice = async (type, contextData = {}) => {
    let scriptKey = "VERIFY_PROMPT";
    if (type === "step1_verify") scriptKey = "VERIFY_PROMPT";
    if (type === "token_issued" || type === "step2_token_issued") scriptKey = "TOKEN_ISSUED";
    if (type === "already_voted" || type === "step3_duplicate_blocked") scriptKey = "ALREADY_VOTED_BLOCK";
    if (type === "step4_ballot_instruction") scriptKey = "VOTE_PROMPT";
    if (type === "vote_success" || type === "step5_vote_success") scriptKey = "VOTE_CONFIRMATION";

    try {
      const headers = { "Content-Type": "application/json" };
      if (demoToken) headers["Authorization"] = `Bearer ${demoToken}`;

      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers,
        body: JSON.stringify({
          scriptKey: scriptKey,
          language: currentLanguage,
          speed: audioSpeed
        })
      });

      const data = await res.json();
      if (data.success && data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.playbackRate = audioSpeed;
        audio.play();
        return;
      }

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(data.text);
        utterance.rate = audioSpeed;
        if (currentLanguage === "gu") utterance.lang = "gu-IN";
        else if (currentLanguage === "hi") utterance.lang = "hi-IN";
        else utterance.lang = "en-IN";
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.log("Audio synthesis fallback:", e);
      if ("speechSynthesis" in window) {
        const fallbackMsg = currentLanguage === "gu" 
          ? "ચકાસણી સફળ. તમારો મત આપવા આગળ વધો." 
          : currentLanguage === "hi"
            ? "सत्यापन सफल. मतदान के लिए आगे बढ़ें."
            : "Verification complete. Please proceed to cast your vote.";
        const utterance = new SpeechSynthesisUtterance(fallbackMsg);
        utterance.rate = audioSpeed;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Candidate Specific Audio Prompt
  const handlePlayCandidateAudio = (candidate) => {
    let speechText = "";
    if (currentLanguage === "gu") {
      speechText = `ઉમેદવાર ${candidate.nameGujarati}, પક્ષ ${candidate.partyGujarati || candidate.party}, પ્રતીક ${candidate.symbolName}.`;
    } else if (currentLanguage === "hi") {
      speechText = `उम्मीदवार ${candidate.name}, पार्टी ${candidate.party}, चुनाव चिन्ह ${candidate.symbolName}.`;
    } else {
      speechText = `Candidate ${candidate.name}, Party ${candidate.party}, Symbol ${candidate.symbolName}.`;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = audioSpeed;
      if (currentLanguage === "gu") utterance.lang = "gu-IN";
      else if (currentLanguage === "hi") utterance.lang = "hi-IN";
      else utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  // AI Demo Narrator Step Action Dispatcher
  const handleRunDemoStepAction = async (actionKey) => {
    switch (actionKey) {
      case "VERIFY_RAMESH":
        setCurrentCity("Ahmedabad");
        setVoterIdInput("DEMO-V101");
        await handleVerifyVoter("DEMO-V101", "Ahmedabad");
        break;
      case "GO_TO_BOOTH":
        if (!activeToken) {
          const res = await handleVerifyVoter("DEMO-V101", "Ahmedabad");
          if (res && res.success && res.token) {
            setCurrentStep(4);
          }
        } else {
          setCurrentStep(4);
        }
        break;
      case "CAST_VOTE":
        if (candidates.length > 0) {
          if (!activeToken) {
            const res = await handleVerifyVoter("DEMO-V101", "Ahmedabad");
            if (res && res.success && res.token) {
              await handleCastVote(candidates[0].id);
            }
          } else {
            await handleCastVote(candidates[0].id);
          }
        }
        break;
      case "VIEW_COMPLETION":
        setCurrentStep(5);
        break;
      case "TEST_DUPLICATE":
        setCurrentCity("Rajkot");
        setVoterIdInput("DEMO-V101");
        setTimeout(() => {
          handleVerifyVoter("DEMO-V101", "Rajkot");
        }, 300);
        break;
      default:
        break;
    }
  };

  const isVotingSessionActive = (activeToken !== null && tokenTimeLeft > 0) || currentStep === 4;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-[#1A2233]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 animate-fade-in">
          <div className={`px-4 py-2.5 rounded-[4px] shadow-lg border flex items-center gap-2 text-xs font-bold ${
            toastMessage.type === "success"
              ? "bg-[#EBF7EB] border-[#B8E4B6] text-[#128807]"
              : "bg-[#FDECEC] border-[#F5B5B5] text-[#C62828]"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#128807]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C62828]" />
            )}
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Header with seal, tricolor bar, caution banner and unified tab bar */}
      <Header
        currentCity={currentCity}
        onCityChange={(city) => {
          setCurrentCity(city);
          if (verificationResult) {
            alert(`Polling booth switched to ${city}. Central ledger sync active.`);
          }
        }}
        booths={booths}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        activeRole={activeRole}
        onRequestRoleChange={handleRequestRoleChange}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenAnomalyModal={() => setIsAnomalyModalOpen(true)}
      />

      {/* 2. Step Progress Tracker (when Polling Officer) */}
      {activeRole === "POLLING_OFFICER" && (
        <StepProgressTracker
          currentStep={currentStep}
          onStepClick={(stepNum) => {
            if (stepNum === 1) handleNewVerification();
            else if (stepNum === 4 && activeToken) setCurrentStep(4);
          }}
          currentLanguage={currentLanguage}
        />
      )}

      {/* 3. Main Content Area (Single column of white cards, max-w-[1180px]) */}
      <main className="flex-1 max-w-[1180px] w-full mx-auto px-4 sm:px-6 py-4">
        {/* Polling Officer Views */}
        {activeRole === "POLLING_OFFICER" && (
          <>
            {(currentStep === 1 || currentStep === 2 || currentStep === 3) && (
              <StaffTerminal
                currentCity={currentCity}
                voterIdInput={voterIdInput}
                onVoterIdChange={setVoterIdInput}
                onVerifyVoter={handleVerifyVoter}
                verificationResult={verificationResult}
                isVerifying={isVerifying}
                activeToken={activeToken}
                tokenTimeLeft={tokenTimeLeft}
                onProceedToVoting={() => setCurrentStep(4)}
                onExplainScreen={(ctx) => setExplainModalContext(ctx)}
                onPlayVoiceAnnouncement={playVoice}
                onSelectPresetVoter={(id) => {
                  setVoterIdInput(id);
                  handleVerifyVoter(id);
                }}
                onOpenResetModal={() => setIsResetModalOpen(true)}
                isOffline={isOffline}
                currentLanguage={currentLanguage}
              />
            )}

            {currentStep === 4 && (
              <CitizenVotingBooth
                voter={verificationResult?.voter}
                token={activeToken}
                currentCity={currentCity}
                candidates={candidates}
                onCastVote={handleCastVote}
                isSubmitting={isSubmittingVote}
                onPlayCandidateAudio={handlePlayCandidateAudio}
                onCancel={() => setCurrentStep(3)}
                isOffline={isOffline}
                currentLanguage={currentLanguage}
              />
            )}

            {currentStep === 5 && (
              <CompletionScreen
                voteReceipt={voteReceipt}
                voter={verificationResult?.voter}
                currentCity={currentCity}
                onTestDuplicateVerification={handleTestDuplicate}
                onNewVerification={handleNewVerification}
                onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
                onOpenResetModal={() => setIsResetModalOpen(true)}
                currentLanguage={currentLanguage}
              />
            )}
          </>
        )}

        {/* Supervisor View */}
        {activeRole === "SUPERVISOR" && (
          <SupervisorView
            demoToken={demoToken}
            onExplainScreen={(ctx) => setExplainModalContext(ctx)}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Demo Admin View */}
        {activeRole === "DEMO_ADMIN" && (
          <AdminView
            demoToken={demoToken}
            onOpenResetModal={() => setIsResetModalOpen(true)}
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* 4. Floating Bottom-Right Stack */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {/* AI Demo Narrator Trigger */}
        <button
          onClick={() => setIsDemoNarratorOpen(true)}
          className="btn-outline-navy text-xs h-8 min-h-0 py-1 px-3 shadow-md bg-white cursor-pointer"
          title="Open AI Guided Demo Narrator"
        >
          <Play className="w-3.5 h-3.5 text-[#0B3B6F]" />
          <span>Demo Narrator</span>
        </button>

        {/* Voice Help Button (Saffron) */}
        <button
          onClick={() => {
            if (currentStep === 1) playVoice("step1_verify");
            else if (currentStep === 2 || currentStep === 3) playVoice("token_issued");
            else if (currentStep === 4) playVoice("step4_ballot_instruction");
            else if (currentStep === 5) playVoice("vote_success");
          }}
          className="btn-saffron text-xs h-8 min-h-0 py-1 px-3 shadow-md cursor-pointer"
          title="Play Voice Guidance"
        >
          <Volume2 className="w-3.5 h-3.5 text-white" />
          <span>{currentLanguage === "gu" ? "વોઇસ સહાય" : currentLanguage === "hi" ? "आवाज सहायता" : "Voice help"}</span>
        </button>

        {/* Ask AI Staff Assistant Button (Blue) */}
        <button
          onClick={() => setIsAssistantDrawerOpen(true)}
          className="btn-outline-navy text-xs h-8 min-h-0 py-1 px-3 shadow-md bg-[#0B3B6F] text-white border-[#082B52] hover:bg-[#082B52] cursor-pointer"
          title="Open AI Staff Assistant"
        >
          <Bot className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>{currentLanguage === "gu" ? "AI સ્ટાફ આસિસ્ટન્ટ" : currentLanguage === "hi" ? "AI स्टाफ सहायक" : "Ask AI staff assistant"}</span>
        </button>
      </div>

      {/* 5. Modals & Drawers */}
      <StaffAssistantDrawer
        isOpen={isAssistantDrawerOpen}
        onClose={() => setIsAssistantDrawerOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        demoToken={demoToken}
      />

      <DemoNarratorOverlay
        isOpen={isDemoNarratorOpen}
        onClose={() => setIsDemoNarratorOpen(false)}
        onRunStepAction={handleRunDemoStepAction}
      />

      <RoleSwitchModal
        isOpen={isRoleSwitchModalOpen}
        onClose={() => setIsRoleSwitchModalOpen(false)}
        targetRole={targetRoleToSwitch}
        onConfirmSwitch={handleConfirmRoleSwitch}
        isVotingSessionActive={isVotingSessionActive}
        currentLanguage={currentLanguage}
      />

      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={confirmAndResetData}
        isResetting={isResetting}
        currentLanguage={currentLanguage}
      />

      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onStartTourWorkflow={() => {
          setIsTourOpen(false);
          setVoterIdInput("DEMO-V101");
          handleVerifyVoter("DEMO-V101");
        }}
      />

      <ExplainScreenModal
        isOpen={explainModalContext !== null}
        onClose={() => setExplainModalContext(null)}
        screenContext={explainModalContext || "verify"}
      />

      <AnomalyDetectorModal
        isOpen={isAnomalyModalOpen}
        onClose={() => setIsAnomalyModalOpen(false)}
      />

      <PrivacyArchitectureModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
