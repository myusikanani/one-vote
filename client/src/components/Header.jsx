import React from "react";
import { 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  RefreshCcw,
  Globe,
  Compass,
  Monitor,
  WifiOff,
  UserCheck,
  ShieldAlert,
  Settings
} from "lucide-react";
import { TRANSLATIONS } from "../translations";

import { DvasEmblem } from "./DvasLogo";

export default function Header({
  currentCity,
  onCityChange,
  booths,
  isOffline,
  onToggleOffline,
  onOpenResetModal,
  onOpenPrivacyModal,
  activeRole = "POLLING_OFFICER",
  onRequestRoleChange,
  currentLanguage = "en",
  onLanguageChange,
  onOpenAnomalyModal
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const boothNumberMap = {
    Ahmedabad: "Booth 12",
    Surat: "Booth 07",
    Vadodara: "Booth 03",
    Rajkot: "Booth 05"
  };

  return (
    <header className="w-full bg-[#0B3B6F] text-white">
      {/* 1. Main Portal Header */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: DVAS Shield Emblem + Full Form & Titles */}
        <div className="flex items-center gap-3.5">
          {/* DVAS Shield Emblem in Crisp White Badge */}
          <div className="w-10 h-10 rounded-lg bg-white p-1 shadow-sm border border-white/20 flex items-center justify-center shrink-0">
            <DvasEmblem className="w-full h-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                DVAS — One Voter ID, Anywhere Voting
              </h1>
              <span className="border border-[#FF9933] text-[#FF9933] text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-wider">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-blue-200 mt-0.5 font-normal">
              Digital Voter Authorization System · Demo · <span className="opacity-80">Vote Anywhere, Vote Only Once</span>
            </p>
          </div>
        </div>

        {/* Right: Language Switcher Pills + Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switch Pills: EN | HI | GU */}
          <div className="inline-flex rounded-[3px] bg-[#082B52] p-0.5 border border-blue-400/30 text-xs">
            {[
              { code: "en", label: "EN" },
              { code: "hi", label: "HI" },
              { code: "gu", label: "GU" }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`px-2.5 py-1 text-xs font-bold rounded-[2px] transition-colors cursor-pointer ${
                  currentLanguage === lang.code
                    ? "bg-white text-[#0B3B6F]"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Offline Toggle */}
          <button
            onClick={onToggleOffline}
            className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isOffline
                ? "bg-[#C62828] text-white border-red-400"
                : "bg-[#082B52] text-blue-200 border-blue-400/30 hover:bg-[#062140]"
            }`}
            title="Simulate network offline state"
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? "bg-white" : "bg-[#128807]"}`} />
            <span>{isOffline ? "Offline" : "Online"}</span>
          </button>
        </div>
      </div>

      {/* 2. Tricolor Bar (4px tall: Saffron, White, Green) */}
      <div className="gov-tricolor-bar" />

      {/* 3. Persistent Caution Banner */}
      <div className="bg-[#FFF6E0] border-b border-[#F2DC9B] text-[#8A6100] px-4 sm:px-6 py-2 text-xs font-medium">
        <div className="max-w-[1180px] mx-auto flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF9933]" />
          <span>
            {currentLanguage === "gu" 
              ? "આ મોક મતદાર ડેટાનો ઉપયોગ કરીને બનાવવામાં આવેલ હેકાથોન પ્રોટોટાઇપ છે. તે ભારતના ચૂંટણી પંચની સત્તાવાર સિસ્ટમ નથી અને કોઈપણ વાસ્તવિક ચૂંટણી ડેટાબેઝ કે EVM સાથે જોડાયેલ નથી." 
              : currentLanguage === "hi"
                ? "यह मॉक मतदाता डेटा का उपयोग करने वाला एक हैकाथॉन प्रोटोटाइप है। यह भारत निर्वाचन आयोग की आधिकारिक प्रणाली नहीं है और किसी वास्तविक चुनावी डेटाबेस या ईवीएम से जुड़ा नहीं है।"
                : "This is a hackathon prototype using mock voter data. It is not an official Government of India system and is not connected to any real electoral database or EVM."}
          </span>
        </div>
      </div>

      {/* 4. Unified Tab Bar (Booths + Roles) */}
      <div className="bg-[#FFFFFF] border-b border-[#D9E0EA] text-[#1A2233] px-4 sm:px-6">
        <div className="max-w-[1180px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Left: Role Navigation Tabs */}
          <div className="flex items-center gap-1 border-r border-[#D9E0EA] pr-3 my-1.5">
            <span className="text-[11px] font-bold text-[#4C5768] uppercase tracking-wider mr-1">Role:</span>
            
            <button
              onClick={() => onRequestRoleChange("POLLING_OFFICER")}
              className={`px-3 py-1.5 rounded-[3px] font-bold transition-colors cursor-pointer ${
                activeRole === "POLLING_OFFICER"
                  ? "bg-[#EAF1FB] text-[#0B3B6F] border border-[#BED4F3]"
                  : "text-[#4C5768] hover:text-[#0B3B6F]"
              }`}
            >
              {currentLanguage === "gu" ? "પોલિંગ ઓફિસર" : currentLanguage === "hi" ? "पोलिंग ऑफिसर" : "Polling Officer"}
            </button>

            <button
              onClick={() => onRequestRoleChange("SUPERVISOR")}
              className={`px-3 py-1.5 rounded-[3px] font-bold transition-colors cursor-pointer ${
                activeRole === "SUPERVISOR"
                  ? "bg-[#EAF1FB] text-[#0B3B6F] border border-[#BED4F3]"
                  : "text-[#4C5768] hover:text-[#0B3B6F]"
              }`}
            >
              {currentLanguage === "gu" ? "સેન્ટ્રલ મોનિટર (સુપરવાઇઝર)" : currentLanguage === "hi" ? "सेंट्रल मॉनिटर (सुपरवाइजर)" : "Central Monitor"}
            </button>

            <button
              onClick={() => onRequestRoleChange("DEMO_ADMIN")}
              className={`px-3 py-1.5 rounded-[3px] font-bold transition-colors cursor-pointer ${
                activeRole === "DEMO_ADMIN"
                  ? "bg-[#EAF1FB] text-[#0B3B6F] border border-[#BED4F3]"
                  : "text-[#4C5768] hover:text-[#0B3B6F]"
              }`}
            >
              {currentLanguage === "gu" ? "ડેમો એડમિન" : currentLanguage === "hi" ? "डेमो एडमिन" : "Demo Admin"}
            </button>
          </div>

          {/* Center: Booth Selection Tabs (when Polling Officer) */}
          {activeRole === "POLLING_OFFICER" && (
            <div className="flex items-center gap-3 flex-wrap py-2">
              <span className="text-[11px] font-bold text-[#4C5768] uppercase tracking-wider">Booth:</span>
              {["Ahmedabad", "Surat", "Vadodara", "Rajkot"].map((city) => {
                const isActive = currentCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => onCityChange(city)}
                    className={`flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                      isActive
                        ? "text-[#0B3B6F] border-b-2 border-[#0B3B6F] pb-0.5"
                        : "text-[#4C5768] hover:text-[#0B3B6F]"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#0B3B6F]" : "bg-[#D9E0EA]"}`} />
                    <span>{city} · {boothNumberMap[city] || "Booth 01"}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Right: Auxiliary Actions */}
          <div className="flex items-center gap-2 py-1.5 ml-auto">
            {activeRole === "DEMO_ADMIN" && (
              <button
                type="button"
                onClick={onOpenResetModal}
                className="btn-danger text-xs h-7 min-h-0 py-1 px-3.5"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </button>
            )}

            <button
              onClick={onOpenAnomalyModal}
              className="text-[#4C5768] hover:text-[#0B3B6F] font-bold flex items-center gap-1 px-2 py-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#8A6100]" />
              <span>AI Insights</span>
            </button>

            <button
              onClick={onOpenPrivacyModal}
              className="text-[#4C5768] hover:text-[#0B3B6F] font-bold flex items-center gap-1 px-2 py-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#128807]" />
              <span>Privacy Vault</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
