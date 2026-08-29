import React from "react";
import { 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw, 
  ExternalLink,
  Copy,
  Lock,
  ArrowRight
} from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function CompletionScreen({
  voteReceipt,
  voter,
  currentCity,
  onTestDuplicateVerification,
  onNewVerification,
  onOpenPrivacyModal,
  onOpenResetModal,
  currentLanguage = "en"
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <div className="w-full space-y-4">
      {/* Success Banner */}
      <div className="gov-card border-[#B8E4B6]">
        <div className="status-box-success flex items-center justify-between border-b border-[#B8E4B6] rounded-b-none">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#128807]" />
            <span className="font-bold text-sm uppercase tracking-wider">
              {currentLanguage === "gu" ? "મતદાન સફળતાપૂર્વક પૂર્ણ થયું" : currentLanguage === "hi" ? "मतदान सफलतापूर्वक संपन्न" : "Vote Cast Successfully"}
            </span>
          </div>
          <span className="gov-tag gov-tag-green">STATUS: VOTED</span>
        </div>

        <div className="gov-card-body space-y-4">
          <p className="text-xs text-[#1A2233] leading-relaxed">
            {currentLanguage === "gu"
              ? "તમારો મત એનોનિમસ વોટ સ્ટોરમાં સુરક્ષિત રીતે સંગ્રહિત કરવામાં આવ્યો છે. વોટર રજિસ્ટ્રીમાં તમારું સ્ટેટસ VOTED થઈ ગયું છે."
              : currentLanguage === "hi"
                ? "आपका वोट अनाम वोट स्टोर में सुरक्षित रूप से दर्ज कर दिया गया है। वोटर रजिस्ट्री में आपकी स्थिति VOTED हो गई है।"
                : "Your ballot has been committed to the decoupled anonymous vote store. The central ledger has marked your Voter ID as VOTED."}
          </p>

          {/* Receipt Box */}
          <div className="p-4 bg-[#F4F6F9] border border-[#D9E0EA] rounded-[4px] space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9E0EA]">
              <span className="font-bold text-[#0B3B6F]">Digital Acknowledgement Slip</span>
              <span className="font-mono text-[#4C5768]">{new Date().toLocaleTimeString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-[#4C5768] block">Voter Name:</span>
                <strong className="text-[#1A2233]">{currentLanguage === "gu" ? voter?.nameGujarati : voter?.name}</strong>
              </div>
              <div>
                <span className="text-[#4C5768] block">Voter ID:</span>
                <strong className="font-mono text-[#1A2233]">{voter?.voterId}</strong>
              </div>
              <div>
                <span className="text-[#4C5768] block">Cast Location:</span>
                <strong className="text-[#1A2233]">{currentCity} Central Booth</strong>
              </div>
              <div>
                <span className="text-[#4C5768] block">Home Constituency:</span>
                <strong className="text-[#1A2233]">{voter?.constituency}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-[#D9E0EA]">
              <span className="text-[#4C5768] block text-[11px]">Cryptographic Receipt Hash (Zero-Linkage Proof):</span>
              <span className="font-mono text-[11px] text-[#0B3B6F] font-bold block truncate">
                {voteReceipt?.receiptHash || "SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
              </span>
            </div>
          </div>

          {/* Duplicate Test Action */}
          <div className="p-3 bg-[#FFF6E0] border border-[#F2DC9B] rounded-[4px] flex flex-wrap items-center justify-between gap-3">
            <div>
              <strong className="text-xs text-[#8A6100] block">Test Multi-District Duplicate Blocking</strong>
              <span className="text-[11px] text-[#8A6100]">Attempt to verify this same voter in another district (e.g. Rajkot).</span>
            </div>

            <button
              type="button"
              onClick={() => onTestDuplicateVerification(voter?.voterId)}
              className="btn-saffron text-xs h-8 min-h-0 py-1"
            >
              <span>Test Duplicate in Rajkot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D9E0EA]">
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="text-xs text-[#0B3B6F] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>How Privacy is Guaranteed</span>
            </button>

            <div className="flex items-center gap-2">
              {onOpenResetModal && (
                <button
                  type="button"
                  onClick={onOpenResetModal}
                  className="btn-saffron text-xs h-8 min-h-0 py-1"
                >
                  <span>Reset Demo & Vote Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={onNewVerification}
                className="btn-outline-navy text-xs h-8 min-h-0 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Voter Verification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
