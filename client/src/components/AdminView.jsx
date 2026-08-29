import React, { useState, useEffect } from "react";
import { Settings, RefreshCcw, Activity, ShieldCheck, Database, CheckCircle2, Server } from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function AdminView({
  demoToken,
  onOpenResetModal,
  currentLanguage = "en"
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const headers = demoToken ? { Authorization: `Bearer ${demoToken}` } : {};
      const res = await fetch("/api/demo/stats", { headers });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (err) {
      console.error("Admin stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, [demoToken]);

  return (
    <div className="w-full space-y-4">
      {/* Top Banner */}
      <div className="gov-card">
        <div className="gov-card-header flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0B3B6F]">
              System Health & Demo Data Administration
            </h2>
            <p className="text-xs text-[#4C5768]">
              Manage prototype state, view aggregate metrics, and reset synthetic test data
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenResetModal}
            className="btn-danger text-xs"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Aggregate Stats Grid */}
        <div className="gov-card-body grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px] space-y-1">
            <span className="text-[11px] font-bold text-[#4C5768] uppercase">System State</span>
            <div className="text-lg font-bold text-[#128807]">{stats?.systemStatus || "HEALTHY"}</div>
            <p className="text-[11px] text-[#4C5768]">Decoupled Architecture Online</p>
          </div>

          <div className="p-3 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px] space-y-1">
            <span className="text-[11px] font-bold text-[#4C5768] uppercase">Synthetic Voter Roll</span>
            <div className="text-lg font-bold text-[#0B3B6F]">{stats?.totalSyntheticVoters || 5} Records</div>
            <p className="text-[11px] text-[#4C5768]">Preset Demo Citizens</p>
          </div>

          <div className="p-3 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px] space-y-1">
            <span className="text-[11px] font-bold text-[#4C5768] uppercase">Voter Participation</span>
            <div className="text-lg font-bold text-[#0B3B6F]">{stats?.turnoutPercentage || 0}%</div>
            <p className="text-[11px] text-[#4C5768]">{stats?.votedCount || 0} Registered Ballots</p>
          </div>

          <div className="p-3 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px] space-y-1">
            <span className="text-[11px] font-bold text-[#4C5768] uppercase">Anonymous Vault</span>
            <div className="text-lg font-bold text-[#0B3B6F]">{stats?.totalAnonymousVotes || 0} Ballots</div>
            <p className="text-[11px] text-[#4C5768]">Zero Voter Linkage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
