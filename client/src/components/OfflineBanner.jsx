import React from "react";
import { WifiOff } from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function OfflineBanner({ isOffline, onRetry, currentLanguage = "gu" }) {
  if (!isOffline) return null;
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.gu;

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="bg-red-700 text-white px-4 py-3 sm:px-8 border-b-2 border-red-800 shadow-md flex flex-wrap items-center justify-between gap-3 animate-fade-in"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-800/80 rounded-lg shrink-0">
          <WifiOff className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black leading-tight">
            {t.offlineBanner.title}
          </h2>
          <p className="text-xs sm:text-sm text-red-100 font-medium">
            {t.offlineBanner.desc}
          </p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="touch-target px-4 py-2 bg-white text-red-700 hover:bg-red-50 font-black text-sm rounded-xl shadow active:scale-95 transition-all"
      >
        {t.offlineBanner.reconnectBtn}
      </button>
    </div>
  );
}
