import React, { useState, useEffect } from "react";
import { Cpu, AlertTriangle, ShieldCheck, X, RefreshCw, Activity, Terminal, Clock, CheckCircle2 } from "lucide-react";

export default function AnomalyDetectorModal({ isOpen, onClose, currentLanguage = "gu" }) {
  const [anomalyData, setAnomalyData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = {
    gu: {
      title: "AI સિક્યુરિટી અને એનોમલી મોનિટર",
      subtitle: "રિયલ-ટાઇમ ક્રોસ-ડિસ્ટ્રિક્ટ સ્પીડ વિશ્લેષણ અને સેન્ટ્રલ ઓડિટ તપાસ",
      badge: "સુપરવાઇઝર સલાહકાર (Supervisor Advisory)",
      advisoryRule: "💡 સલાહકાર નિયમ: AI એનોમલી ફ્લેગ્સ ફક્ત સુપરવાઇઝરને સાવચેત કરવા માટેની સલાહ છે. અંતિમ વહીવટી નિર્ણયો ફક્ત અધિકૃત ચૂંટણી અધિકારીઓ દ્વારા લેવામાં આવે છે.",
      assessmentTitle: "સિસ્ટમ સુરક્ષા મૂલ્યાંકન",
      riskStatus: "જોખમ સ્થિતિ:",
      highRisk: "ઉચ્ચ જોખમ (HIGH RISK)",
      mediumRisk: "મધ્યમ જોખમ (MEDIUM)",
      lowRisk: "સામાન્ય સુરક્ષિત (NORMAL)",
      totalEvents: "કુલ ઓડિટ ઇવેન્ટ્સ:",
      aiBriefingTitle: "AI સુપરવાઇઝર સુરક્ષા બ્રીફિંગ",
      patternFlagsTitle: "સુપરવાઇઝર સમીક્ષા માટે ફ્લેગ થયેલી શંકાસ્પદ પ્રવૃત્તિ",
      severity: "તીવ્રતા:",
      high: "ઉચ્ચ (HIGH)",
      advisoryRec: "સલાહકાર ભલામણ:",
      auditTableTitle: "સેન્ટ્રલ લેજર ઓડિટ લોગ્સ (Masked Voter IDs)",
      closeBtn: "મોનિટર બંધ કરો"
    },
    hi: {
      title: "AI सुरक्षा एवं विसंगति मॉनिटर",
      subtitle: "रियल-टाइम क्रॉस-डिस्ट्रिक्ट गति विश्लेषण और केंद्रीय ऑडिट निरीक्षण",
      badge: "पर्यवेक्षक सलाहकार (Supervisor Advisory)",
      advisoryRule: "💡 सलाहकार नियम: AI विसंगति फ़्लैग केवल पर्यवेक्षक को सचेत करने के लिए हैं। अंतिम प्रशासनिक निर्णय केवल अधिकृत चुनाव अधिकारियों द्वारा लिए जाते हैं।",
      assessmentTitle: "सिस्टम सुरक्षा मूल्यांकन",
      riskStatus: "जोखिम स्थिति:",
      highRisk: "उच्च जोखिम (HIGH RISK)",
      mediumRisk: "मध्यम जोखिम (MEDIUM)",
      lowRisk: "सामान्य सुरक्षित (NORMAL)",
      totalEvents: "कुल ऑडिट इवेंट्स:",
      aiBriefingTitle: "AI पर्यवेक्षक सुरक्षा ब्रीफिंग",
      patternFlagsTitle: "पर्यवेक्षक समीक्षा के लिए फ़्लैग की गई संदिग्ध गतिविधि",
      severity: "गंभीरता:",
      high: "उच्च (HIGH)",
      advisoryRec: "सलाहकार सिफारिश:",
      auditTableTitle: "केंद्रीय लेजर ऑडिट लॉग्स (Masked Voter IDs)",
      closeBtn: "मॉनिटर बंद करें"
    },
    en: {
      title: "AI Anomaly & Security Monitor",
      subtitle: "Real-time cross-district velocity analysis & central audit inspection",
      badge: "Supervisor Advisory",
      advisoryRule: "💡 Advisory Rule: AI anomaly flags are advisory only. Final administrative decisions and verifications are made exclusively by authorized supervisors using fixed backend rules.",
      assessmentTitle: "SYSTEM ADVISORY ASSESSMENT",
      riskStatus: "Risk Status:",
      highRisk: "HIGH",
      mediumRisk: "MEDIUM",
      lowRisk: "NORMAL / SECURE",
      totalEvents: "Total Audited Events:",
      aiBriefingTitle: "AI Supervisor Advisory Briefing",
      patternFlagsTitle: "Pattern Flags for Supervisor Review",
      severity: "Severity:",
      high: "HIGH",
      advisoryRec: "Advisory Recommendation:",
      auditTableTitle: "Central Ledger Audit Logs (Masked IDs)",
      closeBtn: "Close Monitor"
    }
  }[currentLanguage] || {
    title: "AI Anomaly & Security Monitor",
    subtitle: "Real-time cross-district velocity analysis & central audit inspection",
    badge: "Supervisor Advisory",
    advisoryRule: "💡 Advisory Rule: AI anomaly flags are advisory only. Final administrative decisions and verifications are made exclusively by authorized supervisors using fixed backend rules.",
    assessmentTitle: "SYSTEM ADVISORY ASSESSMENT",
    riskStatus: "Risk Status:",
    highRisk: "HIGH",
    mediumRisk: "MEDIUM",
    lowRisk: "NORMAL / SECURE",
    totalEvents: "Total Audited Events:",
    aiBriefingTitle: "AI Supervisor Advisory Briefing",
    patternFlagsTitle: "Pattern Flags for Supervisor Review",
    severity: "Severity:",
    high: "HIGH",
    advisoryRec: "Advisory Recommendation:",
    auditTableTitle: "Central Ledger Audit Logs (Masked IDs)",
    closeBtn: "Close Monitor"
  };

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

  const isHighRisk = anomalyData?.overallRisk === "HIGH";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-[#0B3B6F] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Government Header */}
        <div className="p-4 sm:p-5 border-b border-[#D9E0EA] flex items-center justify-between gap-3 bg-[#F4F6F9]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded-[6px]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#0B3B6F] leading-tight">
                  {t.title}
                </h2>
                <span className="gov-tag gov-tag-navy text-[10px]">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs text-[#4C5768] mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchSecurityData}
              disabled={loading}
              className="p-1.5 text-[#4C5768] hover:text-[#1A2233] hover:bg-[#EAF1FB] rounded-[4px] transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#4C5768] hover:text-[#1A2233] hover:bg-[#EAF1FB] rounded-[4px] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Advisory Rule Banner */}
          <div className="p-3 bg-[#EAF1FB] border-l-4 border-l-[#0B3B6F] border border-[#BED4F3] rounded-r-[6px] text-xs text-[#0B3B6F] font-medium leading-relaxed">
            {t.advisoryRule}
          </div>

          {/* Risk Level Banner */}
          <div className={`p-3.5 rounded-[6px] border flex flex-wrap items-center justify-between gap-3 ${
            isHighRisk
              ? "bg-[#FEF2F2] border-[#F87171] text-[#991B1B]"
              : "bg-[#F0FDF4] border-[#86EFAC] text-[#166534]"
          }`}>
            <div className="flex items-center gap-3">
              {isHighRisk ? (
                <AlertTriangle className="w-7 h-7 text-[#DC2626] shrink-0" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-[#16A34A] shrink-0" />
              )}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold block opacity-90">
                  {t.assessmentTitle}
                </span>
                <h3 className="text-base sm:text-lg font-black">
                  {t.riskStatus} {isHighRisk ? t.highRisk : t.lowRisk}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-[#4C5768] block">{t.totalEvents}</span>
              <p className="text-xl font-black text-[#1A2233]">{anomalyData?.totalLogsAudited || auditLogs.length}</p>
            </div>
          </div>

          {/* AI Executive Security Briefing */}
          <div className="p-3.5 bg-[#FAF5FF] border border-[#E9D5FF] rounded-[6px] space-y-1.5">
            <div className="flex items-center gap-2 text-[#6B21A8] font-bold text-xs uppercase tracking-wide">
              <Activity className="w-4 h-4 text-[#6B21A8]" />
              <span>{t.aiBriefingTitle}</span>
            </div>
            <p className="text-xs text-[#1A2233] leading-relaxed font-medium whitespace-pre-line bg-white p-2.5 rounded-[4px] border border-[#E9D5FF]">
              {currentLanguage === "gu"
                ? "⚠️ **સુરક્ષા નોટિસ**: અમદાવાદ અને સુરત વચ્ચે ૮ મિનિટથી ઓછા સમયમાં અસામાન્ય વેરિફિકેશન પેટર્ન પકડાઈ છે. સુપરવાઇઝર સમીક્ષા જરૂરી છે. સેન્ટ્રલ સ્ટેટસ લેજરે સિંગલ-વોટ લોકીંગ સુરક્ષિત રાખ્યું છે."
                : currentLanguage === "hi"
                ? "⚠️ **सुरक्षा नोटिस**: अहमदाबाद और सूरत के बीच 8 मिनट से कम समय में असामान्य सत्यापन पैटर्न मिला है। पर्यवेक्षक समीक्षा आवश्यक है। सेंट्रल लेजर ने सिंगल-वोट लॉकिंग सुरक्षित रखी है।"
                : (anomalyData?.aiSummary || "⚠️ **ADVISORY NOTICE**: Possible unusual verification pattern detected across Ahmedabad and Surat in under 8 minutes. Supervisor review recommended. Central status ledger has safely maintained single-vote locking.")
              }
            </p>
          </div>

          {/* Flagged Incidents Card */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2233] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{t.patternFlagsTitle} ({anomalyData?.flaggedEvents?.length || 1})</span>
            </h4>
            
            <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-[6px] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs text-[#92400E] bg-[#FEF3C7] border border-[#FCD34D] px-2 py-0.5 rounded-[3px]">
                  DEMO-***105 (Tariq Khan)
                </span>
                <span className="gov-tag gov-tag-red text-[10px]">
                  {t.severity} {t.high}
                </span>
              </div>
              <p className="text-xs text-[#1A2233] font-bold">
                {currentLanguage === "gu"
                  ? "અમદાવાદ અને સુરત વચ્ચે ૮ મિનિટમાં અલગ-અલગ બૂથ પરથી શંકાસ્પદ વેરિફિકેશનનો પ્રયાસ થયો છે (Velocity Anomaly)."
                  : currentLanguage === "hi"
                  ? "अहमदाबाद और सूरत के बीच 8 मिनट में अलग-अलग बूथों से संदिग्ध सत्यापन का प्रयास हुआ है (Velocity Anomaly)।"
                  : "Possible unusual verification pattern detected across multiple polling booths in under 8 minutes (Velocity Anomaly)."
                }
              </p>
              <div className="text-[11px] text-[#92400E] bg-white p-2 rounded-[4px] border border-[#FDE68A]">
                <strong>{t.advisoryRec}</strong> {currentLanguage === "gu" ? "મતદાર આઈડી DEMO-V105 માટે સુપરવાઇઝર સમીક્ષા જરૂરી છે. સિસ્ટમે સિંગલ-યુઝ નિયમ હેઠળ ડુપ્લિકેટ વોટ અટકાવી રાખ્યો છે." : currentLanguage === "hi" ? "मतदाता आईडी DEMO-V105 के लिए पर्यवेक्षक समीक्षा आवश्यक है। सिस्टम ने सिंगल-यूज नियम के तहत डुप्लिकेट वोट रोक रखा है।" : "Supervisor review recommended. Central ledger safely prevented double voting."}
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2233] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#0B3B6F]" />
              <span>{t.auditTableTitle}</span>
            </h4>
            <div className="border border-[#D9E0EA] rounded-[4px] overflow-hidden">
              <div className="max-h-36 overflow-y-auto font-mono text-xs divide-y divide-[#D9E0EA]">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 flex items-start justify-between gap-2 ${
                      log.isAnomaly || log.anomalyTag === "DUPLICATE_ATTEMPT"
                        ? "bg-[#FEF2F2] text-[#991B1B]"
                        : "bg-white text-[#1A2233]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#0B3B6F]">[{log.id}]</span>
                        <span className="font-bold">{log.action}</span>
                        {(log.isAnomaly || log.anomalyTag === "DUPLICATE_ATTEMPT") && (
                          <span className="gov-tag gov-tag-red text-[9px] py-0 px-1">
                            FLAGGED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#4C5768] mt-0.5">
                        {log.details}
                      </p>
                      <span className="text-[10px] text-[#718096]">
                        {new Date(log.timestamp).toLocaleTimeString()} • {log.location || log.boothCity} • Ref: {log.voterAuditRef || "VTR-MASKED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-[#D9E0EA] bg-[#F4F6F9] flex justify-end">
          <button
            onClick={onClose}
            className="btn-navy text-xs py-1.5 px-4 cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
