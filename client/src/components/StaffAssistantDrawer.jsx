import React, { useState } from "react";
import { 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  RefreshCw,
  Globe
} from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function StaffAssistantDrawer({
  isOpen,
  onClose,
  currentLanguage = "en",
  onLanguageChange,
  demoToken
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  
  const defaultWelcome = currentLanguage === "gu"
    ? "👋 નમસ્તે! હું ECI પોલિંગ સ્ટાફ AI સહાયક છું. હું તમને ECI SOPs, ફોર્મ 17B, ૫-મિનિટ ટોકન નિયમો અને ગોપનીયતા આર્કિટેક્ચરમાં મદદ કરી શકું છું."
    : currentLanguage === "hi"
      ? "👋 नमस्ते! मैं ईसीआई पोलिंग स्टाफ एआई सहायक हूं। मैं एसओपी, फॉर्म 17B और टोकन नियमों में आपकी सहायता कर सकता हूं।"
      : "👋 Hello! I am the ECI Polling Staff AI Assistant. I can help you with SOP guidelines, duplicate voter dispute resolution (Form 17B), 5-minute token rules, and Privacy-by-Design architecture.";

  const defaultChips = currentLanguage === "gu"
    ? [
        "આ મતદાર કેમ બ્લોક છે?",
        "૫-મિનિટ ટોકન સમાપ્ત થઈ જાય તો શું કરવું?",
        "વોટર આઈડી મળતું નથી",
        "મતદાન ગોપનીયતા સમજાવો",
        "સમાંતર સેશન રક્ષણ શું છે?"
      ]
    : currentLanguage === "hi"
      ? [
          "यह मतदाता क्यों ब्लॉक है?",
          "टोकन समाप्त हो जाए तो क्या करें?",
          "वोटर आईडी नहीं मिल रहा",
          "मतदान गोपनीयता समझाएं",
          "समानांतर सत्र सुरक्षा क्या है?"
        ]
      : [
          "Why is this voter blocked?",
          "Token expired — what now?",
          "Voter ID not found",
          "Explain vote secrecy",
          "What is simultaneous session protection?"
        ];

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: t?.aiAssistant?.welcome || defaultWelcome
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const headers = { "Content-Type": "application/json" };
      if (demoToken) headers["Authorization"] = `Bearer ${demoToken}`;

      const res = await fetch("/api/ai/copilot-chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: query,
          language: currentLanguage,
          context: {
            role: "POLLING_OFFICER",
            activeSession: true
          }
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: currentLanguage === "gu" 
              ? "ECI SOP સહાયક: કૃપા કરીને ફરી પ્રયાસ કરો અથવા પોલિંગ સુપરવાઇઝરનો સંપર્ક કરો."
              : currentLanguage === "hi"
                ? "ईसीआई एसओपी सहायक: कृपया पुनः प्रयास करें या पर्यवेक्षक से संपर्क करें।"
                : "ECI SOP Assistant: Please check your query or contact the Presiding Officer."
          }
        ]);
      }
    } catch (e) {
      console.error("AI Copilot Error:", e);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Network error connecting to AI Assistant." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col border-l border-[#D9E0EA]">
        {/* Drawer Header */}
        <div className="bg-[#0B3B6F] text-white p-4 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#FF9933]" />
            <div>
              <h3 className="font-bold text-sm leading-tight">AI Staff Assistant (ECI SOPs)</h3>
              <p className="text-[11px] text-blue-200">Trilingual Protocol & Rule 49P Reference</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[3px] text-blue-200 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Chips */}
        <div className="p-3 bg-[#F4F6F9] border-b border-[#D9E0EA] space-y-1.5">
          <span className="text-[10px] font-bold text-[#4C5768] uppercase tracking-wider block">
            Common Inquiries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {defaultChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] font-medium px-2 py-1 rounded-[3px] bg-white border border-[#D9E0EA] text-[#0B3B6F] hover:bg-[#EAF1FB] transition-colors cursor-pointer text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-6 h-6 rounded-full bg-[#EAF1FB] text-[#0B3B6F] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-[4px] max-w-[85%] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#0B3B6F] text-white"
                    : "bg-[#F4F6F9] border border-[#D9E0EA] text-[#1A2233]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#4C5768]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0B3B6F]" />
              <span>AI is reviewing official electoral rules...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#D9E0EA] bg-[#FFFFFF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask SOP question (e.g. Form 17B, Token Expiry)..."
              className="flex-1 py-2 px-3 text-xs border border-[#D9E0EA] rounded-[4px] focus:border-[#0B3B6F] outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="btn-saffron text-xs h-8 min-h-0 py-1 px-3"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
