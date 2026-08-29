import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, EyeOff, Database, X, CheckCircle2, Server, Cpu } from "lucide-react";

export default function PrivacyArchitectureModal({ isOpen, onClose, currentLanguage = "gu" }) {
  const [anonymousVault, setAnonymousVault] = useState([]);
  const [loading, setLoading] = useState(false);

  const t = {
    gu: {
      title: "ડેટા ડીકપલિંગ અને સિક્રેસી વૉલ્ટ",
      subtitle: "મતદારની ઓળખ અને આપેલા મત વચ્ચે ડિઝાઈનથી જ શૂન્ય લિંક",
      store1Title: "૧. સેન્ટ્રલ વોટર સ્ટેટસ લેજર",
      store1Desc: "માત્ર 'વન પર્સન, વન વોટ' નિયમ પાળવા માટે વેરિફિકેશન મેટાડેટા સંગ્રહે છે.",
      store1Item1: "✔ voter_id: \"DEMO-V101\"",
      store1Item2: "✔ status: \"VOTED\"",
      store1Item3: "✔ last_booth: \"Ahmedabad\"",
      store1Item4: "❌ candidate_choice: NULL (ક્યારેય સ્ટોર થતું નથી)",
      store2Title: "૨. અનામી વોટ વૉલ્ટ (Anonymous Vault)",
      store2Desc: "માત્ર SHA-256 ક્રિપ્ટોગ્રાફિક સીલ સાથે ઉમેદવારની મત ગણતરી સંગ્રહે છે.",
      store2Item1: "❌ voter_id: NULL (સંપૂર્ણ ગુપ્ત / Blinded)",
      store2Item2: "✔ candidate_id: \"CAND-01\"",
      store2Item3: "✔ constituency: \"GJ-07\"",
      store2Item4: "✔ crypto_hash: \"0x7a89f...\"",
      guaranteeTitle: "બંધારણીય મત ગોપનીયતા ગેરંટી (Secrecy Guarantee)",
      guaranteeDesc: "જો કોઈ હેકર તમામ સર્વર્સ અને ડેટાબેઝ એક્સેસ કરી લે, તો પણ કોઈપણ નાગરિકે કયા ઉમેદવારને મત આપ્યો તે શોધવું ગણિતીય રીતે અશક્ય છે.",
      vaultTitle: "લાઈવ અનામી વોટ રેકોર્ડ્સ (વૉલ્ટમાં સીલ થયેલા કુલ મત: ",
      closeBtn: "વૉલ્ટ બંધ કરો"
    },
    hi: {
      title: "ડેટા ડિકપલિંગ और गोपनीयता वॉल्ट",
      subtitle: "मतदाता पहचान और डाले गए मत के बीच शून्य संबंध",
      store1Title: "१. सेंट्रल वोटर स्टेटस लेजर",
      store1Desc: "केवल 'एक व्यक्ति, एक वोट' नियम लागू करने के लिए सत्यापन डेटा संग्रहीत करता है।",
      store1Item1: "✔ voter_id: \"DEMO-V101\"",
      store1Item2: "✔ status: \"VOTED\"",
      store1Item3: "✔ last_booth: \"Ahmedabad\"",
      store1Item4: "❌ candidate_choice: NULL (कभी स्टोर नहीं होता)",
      store2Title: "२. अनाम वोट वॉल्ट (Anonymous Vault)",
      store2Desc: "केवल SHA-256 क्रिप्टोग्राफिक सील के साथ उम्मीदवार का वोट संग्रहीत करता है।",
      store2Item1: "❌ voter_id: NULL (पूर्ण गोपनीय / Blinded)",
      store2Item2: "✔ candidate_id: \"CAND-01\"",
      store2Item3: "✔ constituency: \"GJ-07\"",
      store2Item4: "✔ crypto_hash: \"0x7a89f...\"",
      guaranteeTitle: "संवैधानिक वोट गोपनीयता गारंटी (Secrecy Guarantee)",
      guaranteeDesc: "यदि कोई हैकर सभी सर्वरों और डेटाबेस को एक्सेस कर ले, तब भी किसी नागरिक की पहचान को उसके वोट से जोड़ना गणितीय रूप से असंभव है।",
      vaultTitle: "लाइव अनाम वोट रिकॉर्ड्स (वॉल्ट में सील कुल मत: ",
      closeBtn: "वॉल्ट बंद करें"
    },
    en: {
      title: "Data Decoupling & Secrecy Vault",
      subtitle: "Zero link between voter identity and cast ballots by design",
      store1Title: "1. Central Voter Status Ledger",
      store1Desc: "Stores ONLY verification metadata to enforce 'One Person, One Vote'.",
      store1Item1: "✔ voter_id: \"DEMO-V101\"",
      store1Item2: "✔ status: \"VOTED\"",
      store1Item3: "✔ last_booth: \"Ahmedabad\"",
      store1Item4: "❌ candidate_choice: NULL (NEVER STORED)",
      store2Title: "2. Anonymous Vote Vault",
      store2Desc: "Stores ONLY the candidate ballot tally with cryptographic SHA-256 seal.",
      store2Item1: "❌ voter_id: NULL (BLINDED)",
      store2Item2: "✔ candidate_id: \"CAND-01\"",
      store2Item3: "✔ constituency: \"GJ-07\"",
      store2Item4: "✔ crypto_hash: \"0x7a89f...\"",
      guaranteeTitle: "Constitutional Vote Secrecy Guarantee",
      guaranteeDesc: "Even if a malicious actor accesses all backend servers and databases, it is mathematically impossible to link any citizen’s identity to their candidate choice.",
      vaultTitle: "Live Anonymous Vote Records (Currently Sealed in Vault: ",
      closeBtn: "Close Inspector"
    }
  }[currentLanguage] || {
    title: "Data Decoupling & Secrecy Vault",
    subtitle: "Zero link between voter identity and cast ballots by design",
    store1Title: "1. Central Voter Status Ledger",
    store1Desc: "Stores ONLY verification metadata to enforce 'One Person, One Vote'.",
    store1Item1: "✔ voter_id: \"DEMO-V101\"",
    store1Item2: "✔ status: \"VOTED\"",
    store1Item3: "✔ last_booth: \"Ahmedabad\"",
    store1Item4: "❌ candidate_choice: NULL (NEVER STORED)",
    store2Title: "2. Anonymous Vote Vault",
    store2Desc: "Stores ONLY the candidate ballot tally with cryptographic SHA-256 seal.",
    store2Item1: "❌ voter_id: NULL (BLINDED)",
    store2Item2: "✔ candidate_id: \"CAND-01\"",
    store2Item3: "✔ constituency: \"GJ-07\"",
    store2Item4: "✔ crypto_hash: \"0x7a89f...\"",
    guaranteeTitle: "Constitutional Vote Secrecy Guarantee",
    guaranteeDesc: "Even if a malicious actor accesses all backend servers and databases, it is mathematically impossible to link any citizen’s identity to their candidate choice.",
    vaultTitle: "Live Anonymous Vote Records (Currently Sealed in Vault: ",
    closeBtn: "Close Inspector"
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-[#0B3B6F] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Government Header */}
        <div className="p-4 sm:p-5 border-b border-[#D9E0EA] flex items-center justify-between gap-3 bg-[#F4F6F9]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EAF1FB] text-[#0B3B6F] border border-[#BED4F3] rounded-[6px]">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B3B6F] leading-tight">
                {t.title}
              </h2>
              <p className="text-xs text-[#4C5768] mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#4C5768] hover:text-[#1A2233] hover:bg-[#EAF1FB] rounded-[4px] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Decoupling Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Store 1: Voter Status Store */}
            <div className="p-3.5 bg-[#F8FAFC] border border-[#BED4F3] rounded-[6px] space-y-2">
              <div className="flex items-center gap-2 text-[#0B3B6F] font-bold text-xs uppercase tracking-wide">
                <Database className="w-4 h-4 text-[#0B3B6F]" />
                <span>{t.store1Title}</span>
              </div>
              <p className="text-[11px] text-[#4C5768] leading-normal">
                {t.store1Desc}
              </p>
              <div className="p-2.5 bg-white rounded-[4px] border border-[#D9E0EA] font-mono text-[11px] space-y-0.5">
                <div className="text-[#128807] font-bold">{t.store1Item1}</div>
                <div className="text-[#128807] font-bold">{t.store1Item2}</div>
                <div className="text-[#128807] font-bold">{t.store1Item3}</div>
                <div className="text-[#C62828] font-bold">{t.store1Item4}</div>
              </div>
            </div>

            {/* Store 2: Decoupled Anonymous Vault */}
            <div className="p-3.5 bg-[#FAF5FF] border border-[#E9D5FF] rounded-[6px] space-y-2">
              <div className="flex items-center gap-2 text-[#6B21A8] font-bold text-xs uppercase tracking-wide">
                <Lock className="w-4 h-4 text-[#6B21A8]" />
                <span>{t.store2Title}</span>
              </div>
              <p className="text-[11px] text-[#4C5768] leading-normal">
                {t.store2Desc}
              </p>
              <div className="p-2.5 bg-white rounded-[4px] border border-[#E9D5FF] font-mono text-[11px] space-y-0.5">
                <div className="text-[#C62828] font-bold">{t.store2Item1}</div>
                <div className="text-[#128807] font-bold">{t.store2Item2}</div>
                <div className="text-[#128807] font-bold">{t.store2Item3}</div>
                <div className="text-[#128807] font-bold">{t.store2Item4}</div>
              </div>
            </div>
          </div>

          {/* Constitutional Guarantee Box */}
          <div className="p-3.5 bg-[#F0FDF4] border-l-4 border-l-[#128807] border border-[#BBF7D0] rounded-r-[6px] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#128807] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#166534] text-xs sm:text-sm">
                {t.guaranteeTitle}
              </h4>
              <p className="text-[11px] sm:text-xs text-[#15803D] mt-0.5 leading-relaxed">
                {t.guaranteeDesc}
              </p>
            </div>
          </div>

          {/* Live Records Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2233] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0B3B6F]" />
              <span>{t.vaultTitle}{anonymousVault.length})</span>
            </h4>
            <div className="border border-[#D9E0EA] rounded-[4px] overflow-hidden">
              <div className="max-h-40 overflow-y-auto font-mono text-xs divide-y divide-[#D9E0EA]">
                {anonymousVault.length === 0 ? (
                  <div className="p-3 text-center text-[#4C5768] text-xs font-sans">
                    {currentLanguage === "gu" ? "હજુ સુધી કોઈ વોટ કાસ્ટ થયો નથી (વૉલ્ટ તૈયાર છે)." : currentLanguage === "hi" ? "अभी तक कोई वोट नहीं डाला गया (वॉल्ट तैयार है)।" : "No votes cast yet in this demo session. Cast a vote to see sealed records here."}
                  </div>
                ) : (
                  anonymousVault.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-[#0B3B6F]">[{item.voteId}]</span>{" "}
                        <span className="font-bold text-[#1A2233]">{item.candidateName}</span>
                        <p className="text-[10px] text-[#4C5768] mt-0.5">
                          SHA-256 Seal: {item.cryptoHash?.substring(0, 28)}...
                        </p>
                      </div>
                      <span className="text-[10px] bg-[#EAF1FB] text-[#0B3B6F] font-bold px-2 py-0.5 rounded-[3px] shrink-0">
                        {item.boothCity} • {item.constituencyCode}
                      </span>
                    </div>
                  ))
                )}
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
