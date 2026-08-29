import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Wrench, Shield, Sparkles, ChevronDown } from "lucide-react";

export default function StaffHelpAssistant({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "👋 **Presiding Staff AI Assistant Active**\n\nI am your read-only civic policy assistant. Ask about duplicate blocks, token expiration, voter secrecy, or cross-district regulations.",
      toolUsed: null
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const presetChips = [
    { label: "Why is this voter blocked?", query: "Why is this voter blocked from voting?" },
    { label: "Token expired — what now?", query: "The 5-minute token expired for a voter. What is the procedure?" },
    { label: "Voter ID not found", query: "Voter ID not found in the central registry." },
    { label: "Explain vote secrecy", query: "Explain the vote secrecy and data decoupling protocol." },
    { label: "Cross-district rules", query: "What are the rules for cross-district anywhere voting in Gujarat?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "ai" ? "assistant" : "user",
            content: m.text
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: data.reply,
            toolUsed: data.toolUsed
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: "⚠️ Assistant error: Unable to fetch help article. Please consult the Presiding Officer manual.",
            toolUsed: null
          }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "⚠️ Network unavailable. Please ensure local server connection.",
          toolUsed: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 touch-target px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-2xl flex items-center gap-2.5 active:scale-95 transition-all animate-bounce"
          aria-label="Open Polling Staff Assistant"
        >
          <Bot className="w-6 h-6" />
          <span className="hidden sm:inline">Staff Help AI</span>
          <span className="sm:hidden">Help</span>
        </button>
      )}

      {/* Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[550px] max-h-[90vh] bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-700 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base leading-tight">Polling Staff Assistant</h3>
                <span className="text-[11px] text-blue-100 font-medium">
                  OpenAI Strict Read-Only Tool Calling
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Guardrail Info Banner */}
          <div className="px-3 py-1.5 bg-blue-50 dark:bg-zinc-800/80 border-b border-blue-100 dark:border-zinc-800 flex items-center gap-1.5 text-[11px] text-blue-800 dark:text-blue-300 font-semibold">
            <Shield className="w-3.5 h-3.5 shrink-0 text-blue-600" />
            <span>Read-Only Guardrail: Cannot override voter locks or cast ballots.</span>
          </div>

          {/* Preset Chips */}
          <div className="p-2.5 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-50 dark:bg-zinc-950">
            {presetChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                className="touch-target px-2.5 py-1 bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold text-slate-700 dark:text-zinc-300 whitespace-nowrap transition-colors shadow-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white font-medium rounded-br-none"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-bl-none border border-slate-200 dark:border-zinc-700"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Tool Call Badge if OpenAI triggered a function */}
                  {msg.toolUsed && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-zinc-700 text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Wrench className="w-3 h-3" />
                      <span>Verified via tool: {msg.toolUsed.name}()</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Bot className="w-4 h-4 animate-spin text-blue-600" />
                <span>Assistant is consulting central SOP knowledgebase...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask polling assistant..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="touch-target p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow active:scale-95 transition-all"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
