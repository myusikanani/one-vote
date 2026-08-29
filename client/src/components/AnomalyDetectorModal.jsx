import React, { useState, useEffect } from "react";
import { Cpu, AlertTriangle, ShieldCheck, X, RefreshCw, Activity, Terminal, CheckCircle2 } from "lucide-react";

export default function AnomalyDetectorModal({ isOpen, onClose }) {
  const [anomalyData, setAnomalyData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const [anomalyRes, logsRes] = await Promise.all([
        fetch("/api/ai/anomalies").then((r) => r.json()),
        fetch("/api/audit/logs").then((r) => r.json())
      ]);

      if (anomalyRes.success) setAnomalyData(anomalyRes);
      if (logsRes.success) setAuditLogs(logsRes.logs || []);
    } catch (err) {
      console.error("Failed to load anomaly data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSecurityData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  AI Anomaly & Security Monitor
                </h2>
                <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                  Supervisor Advisory
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                Real-time cross-district velocity analysis & central audit inspection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchSecurityData}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Advisory Notice Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300 font-medium">
            💡 <strong>Advisory Rule:</strong> AI anomaly flags are advisory only. Final administrative decisions and verifications are made exclusively by authorized supervisors using fixed backend rules.
          </div>

          {/* Risk Level Banner */}
          <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 ${
            anomalyData?.overallRisk === "HIGH"
              ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200"
              : anomalyData?.overallRisk === "MEDIUM"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
              : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
          }`}>
            <div className="flex items-center gap-3">
              {anomalyData?.overallRisk === "HIGH" ? (
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0 animate-bounce" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold">System Advisory Assessment</span>
                <h3 className="text-xl font-black">
                  Risk Status: {anomalyData?.overallRisk || "EVALUATING"}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Total Audited Events</span>
              <p className="text-2xl font-black">{anomalyData?.totalLogsAudited || auditLogs.length}</p>
            </div>
          </div>

          {/* AI Executive Security Briefing */}
          <div className="p-4 bg-purple-50 dark:bg-zinc-800/80 rounded-2xl border border-purple-200 dark:border-purple-900/50">
            <div className="flex items-center gap-2 mb-2 text-purple-900 dark:text-purple-300 font-black text-sm uppercase tracking-wide">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              AI Supervisor Advisory Briefing
            </div>
            <p className="text-sm sm:text-base text-slate-800 dark:text-zinc-200 leading-relaxed font-medium whitespace-pre-line">
              {anomalyData?.aiSummary || "Evaluating system audit telemetry..."}
            </p>
          </div>

          {/* Flagged Anomaly Incidents */}
          {anomalyData?.flaggedEvents && anomalyData.flaggedEvents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Pattern Flags for Supervisor Review ({anomalyData.flaggedEvents.length})
              </h4>
              {anomalyData.flaggedEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-900/70 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-base text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-0.5 rounded-lg">
                      {event.maskedVoterId || event.voterId || "DEMO-V***"}
                    </span>
                    <span className="text-xs font-black bg-amber-600 text-white px-2 py-0.5 rounded-full uppercase">
                      Severity: {event.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-zinc-200 font-bold">
                    {event.description}
                  </p>
                  <div className="text-xs text-amber-900 dark:text-amber-200 font-medium bg-white/60 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-amber-300 dark:border-amber-900">
                    <strong>Advisory Recommendation:</strong> {event.recommendation || "Possible unusual verification pattern detected. Supervisor review recommended."}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chronological Audit Log Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              Central Ledger Audit Logs (Masked IDs)
            </h4>
            <div className="border border-slate-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm">
              <div className="max-h-56 overflow-y-auto font-mono text-xs divide-y divide-slate-200 dark:divide-zinc-800">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 flex items-start justify-between gap-3 ${
                      log.isAnomaly
                        ? "bg-amber-50/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200"
                        : "bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600 dark:text-blue-400">[{log.id}]</span>
                        <span className="font-bold">{log.action}</span>
                        {log.isAnomaly && (
                          <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded font-sans font-bold">
                            FLAGGED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">
                        {log.details}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString()} • {log.boothCity} ({log.boothId}) • ID: {log.voterIdMasked || "DEMO-V***"}
                      </span>
                    </div>
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
            className="touch-target px-6 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-bold text-sm rounded-xl shadow active:scale-95 transition-all"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
}
