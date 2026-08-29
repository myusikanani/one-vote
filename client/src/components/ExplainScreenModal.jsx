import React from "react";
import { HelpCircle, X, ShieldCheck, Lock, RefreshCw, Key, Clock } from "lucide-react";

export default function ExplainScreenModal({ isOpen, onClose, screenContext = "verify" }) {
  if (!isOpen) return null;

  const contextExplanations = {
    verify: {
      title: "How Central Real-Time Verification Works",
      subtitle: "Preventing cross-district duplicate voting across Gujarat",
      items: [
        {
          icon: RefreshCw,
          title: "Real-Time Centralized Ledger Sync",
          desc: "When a citizen presents their ID at any polling station (e.g. Ahmedabad), the system queries the statewide central registry in milliseconds."
        },
        {
          icon: Key,
          title: "5-Minute SHA-256 Hashed Token",
          desc: "Upon verification, a one-time authorization token valid for exactly 300 seconds is issued. The central registry stores only the SHA-256 hash, and the token self-destructs after single use."
        },
        {
          icon: ShieldCheck,
          title: "Instant Duplicate Locking",
          desc: "The moment a ballot is cast in Surat, the voter's record transitions to VOTED. Any attempt to verify the same ID in Ahmedabad, Rajkot, or Vadodara is blocked on the spot."
        }
      ]
    },
    active_session: {
      title: "Simultaneous Request Race-Condition Block",
      subtitle: "Why only one active authorization token is permitted statewide",
      items: [
        {
          icon: Clock,
          title: "Atomic Session Reservation",
          desc: "If verification requests for the same voter ID arrive at almost the same time from two different cities (e.g. Ahmedabad and Surat), only the first one receives an active session token."
        },
        {
          icon: Lock,
          title: "One Active Token Rule",
          desc: "The second request is immediately halted with 'ACTIVE_SESSION_EXISTS' to eliminate the risk of simultaneous voting sessions."
        }
      ]
    },
    already_voted: {
      title: "Why is this Voter Blocked?",
      subtitle: "Cryptographic proof of previous vote prevents double voting",
      items: [
        {
          icon: Lock,
          title: "Previous Ballot Record Found",
          desc: "The central ledger shows that this voter ID has already submitted a ballot. The timestamp, polling booth, and digital seal are displayed on the terminal."
        },
        {
          icon: ShieldCheck,
          title: "Constitutional One Person, One Vote Guarantee",
          desc: "No polling staff or automated system has authority to override this block. If the citizen disputes this, Form 17B (Tendered Ballot) must be initiated manually."
        }
      ]
    },
    ballot: {
      title: "Privacy-by-Design & Decoupled Data Architecture",
      subtitle: "Why no one can ever see who you voted for",
      items: [
        {
          icon: Lock,
          title: "Decoupled Data Architecture",
          desc: "The database tracking voter eligibility and the database storing candidate choices are physically separated. The ballot store contains ZERO voter names, IDs, tokens, or locations."
        },
        {
          icon: ShieldCheck,
          title: "VVPAT Verification Slip",
          desc: "The electronic voting unit displays a 7-second physical audit slip confirming your choice before it drops into the sealed digital box."
        }
      ]
    }
  };

  const info = contextExplanations[screenContext] || contextExplanations.verify;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close Explanation"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {info.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              {info.subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4 my-6">
          {info.items.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-slate-50 dark:bg-zinc-800/80 rounded-xl border border-slate-200 dark:border-zinc-700">
                <ItemIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full touch-target py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-xl shadow active:scale-95 transition-all"
        >
          Understood / સમજાઈ ગયું
        </button>
      </div>
    </div>
  );
}
