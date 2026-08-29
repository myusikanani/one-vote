import React, { useState, useEffect } from "react";
import { ShieldAlert, Activity, RefreshCcw, Lock, CheckCircle2, AlertTriangle, Monitor } from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function SupervisorView({
  demoToken,
  currentLanguage = "en",
  onExplainScreen
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [auditLogs, setAuditLogs] = useState([]);
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSupervisorData = async () => {
    setLoading(true);
    try {
      const headers = demoToken ? { Authorization: `Bearer ${demoToken}` } : {};

      const [logsRes, anomalyRes] = await Promise.all([
        fetch("/api/audit-logs", { headers }),
        fetch("/api/ai/anomalies", { headers })
      ]);

      const logsData = await logsRes.json();
      const anomalyData = await anomalyRes.json();

      if (logsData.success) setAuditLogs(logsData.logs || []);
      if (anomalyData.success) setAnomalies(anomalyData.analysis);
    } catch (err) {
      console.error("Supervisor fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisorData();
  }, [demoToken]);

  return (
    <div className="w-full space-y-4">
      {/* Top Banner */}
      <div className="gov-card">
        <div className="gov-card-header flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Monitor className="w-5 h-5 text-[#0B3B6F]" />
            <div>
              <h2 className="text-base font-bold text-[#0B3B6F]">
                Central Monitor & Pseudonymous Audit Log
              </h2>
              <p className="text-xs text-[#4C5768]">
                Real-time statewide audit telemetry · Voter identity references are masked (e.g. VTR-7A29)
              </p>
            </div>
          </div>

          <button
            onClick={fetchSupervisorData}
            disabled={loading}
            className="btn-outline-navy text-xs h-8 min-h-0 py-1"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* AI Anomaly Advisory Banner */}
        {anomalies && (
          <div className="p-4 bg-[#FFF6E0] border-b border-[#F2DC9B] text-xs text-[#8A6100] space-y-1.5">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-[#FF9933]" />
              <span className="uppercase">AI Anomaly Assessment: {anomalies.threatLevel || "LOW"} Risk</span>
            </div>
            <p className="text-[#8A6100]">{anomalies.assessment}</p>
          </div>
        )}

        {/* Plain-bordered Audit Logs Table */}
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>VOTER REF</th>
                <th>EVENT TYPE</th>
                <th>BOOTH LOCATION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-xs text-[#4C5768]">
                    No audit records recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F6F9]">
                    <td className="font-mono text-xs text-[#4C5768]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="font-mono text-xs font-bold text-[#0B3B6F]">
                      {log.voterRef || "VTR-7A29"}
                    </td>
                    <td className="text-xs font-semibold text-[#1A2233]">
                      {log.action}
                    </td>
                    <td className="text-xs text-[#4C5768]">
                      {log.city || "Ahmedabad Central"}
                    </td>
                    <td>
                      <span className={`gov-tag ${
                        log.status === "VOTED" || log.status === "SUCCESS"
                          ? "gov-tag-green"
                          : log.status === "BLOCKED" || log.status === "FAILED"
                          ? "gov-tag-red"
                          : "gov-tag-blue"
                      }`}>
                        {log.status || "CLEARED"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
