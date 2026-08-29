import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, EyeOff, Database, ArrowRight, X, CheckCircle2 } from "lucide-react";

export default function PrivacyArchitectureModal({ isOpen, onClose }) {
  const [anonymousVault, setAnonymousVault] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/audit/anonymous-vault")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setAnonymousVault(data.vault || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl">
              <EyeOff className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                Data Decoupling & Secrecy Vault
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Zero link between voter identity and cast ballots by design
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Architecture Comparison Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Store 1: Voter Status Store */}
            <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-black text-sm uppercase">
                <Database className="w-4 h-4" />
                1. Central Voter Status Ledger
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Stores ONLY verification metadata to enforce "One Person, One Vote".
              </p>
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-blue-200 dark:border-blue-900 font-mono text-xs space-y-1">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">✔ voter_id: "DEMO-V101"</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">✔ status: "VOTED"</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">✔ last_booth: "Ahmedabad"</div>
                <div className="text-red-500 font-bold">❌ candidate_choice: NULL (NEVER STORED)</div>
              </div>
            </div>

            {/* Store 2: Decoupled Anonymous Vault */}
            <div className="p-4 bg-purple-50/70 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-black text-sm uppercase">
                <Lock className="w-4 h-4" />
                2. Anonymous Vote Vault
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Stores ONLY the candidate ballot tally with cryptographic SHA-256 seal.
              </p>
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-purple-200 dark:border-purple-900 font-mono text-xs space-y-1">
                <div className="text-red-500 font-bold">❌ voter_id: NULL (BLINDED)</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">✔ candidate_id: "CAND-01"</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">✔ constituency: "GJ-07"</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">✔ crypto_hash: "0x7a89f..."</div>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-emerald-900 dark:text-emerald-200 text-sm sm:text-base">
                Constitutional Vote Secrecy Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                Even if a malicious actor accesses all backend servers and databases, it is mathematically impossible to link any citizen’s identity to their candidate choice.
              </p>
            </div>
          </div>

          {/* Live Decoupled Anonymous Vault Records */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" />
              Live Anonymous Vote Records (Currently Sealed in Vault: {anonymousVault.length})
            </h4>
            <div className="border border-slate-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm">
              <div className="max-h-48 overflow-y-auto font-mono text-xs divide-y divide-slate-200 dark:divide-zinc-800">
                {anonymousVault.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-zinc-900 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-purple-600 dark:text-purple-400">[{item.voteId}]</span>{" "}
                      <span className="font-bold text-slate-800 dark:text-zinc-200">{item.candidateName}</span>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                        Hash: {item.cryptoHash?.substring(0, 32)}...
                      </p>
                    </div>
                    <span className="text-[10px] bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-2 py-1 rounded-lg shrink-0">
                      {item.boothCity} • {item.constituencyCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="touch-target px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow active:scale-95 transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
