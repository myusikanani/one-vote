import React from "react";
import { Volume2, Globe, Gauge } from "lucide-react";
import { TRANSLATIONS } from "../translations";

export default function AudioVoiceBar({
  currentLanguage,
  onLanguageChange,
  audioSpeed,
  onSpeedChange,
  onPlaySample,
  isDarkMode
}) {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.gu;

  const languages = [
    { code: "gu", label: "ગુજરાતી (Gujarati)" },
    { code: "hi", label: "हिन्दी (Hindi)" },
    { code: "en", label: "English (EN)" }
  ];

  return (
    <div
      className={`w-full py-2.5 px-4 sm:px-8 border-b transition-colors flex flex-wrap items-center justify-between gap-3 text-sm ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-800 text-zinc-300"
          : "bg-blue-50/70 border-blue-100 text-slate-700"
      }`}
    >
      {/* Left: Language Selection */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <Globe className="w-4 h-4" />
          <span>{t.audioBar.voterLang}</span>
        </div>
        <div className="inline-flex rounded-xl bg-white dark:bg-zinc-800 p-1 border border-slate-200 dark:border-zinc-700 shadow-xs">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`px-3 py-1 text-xs sm:text-sm font-black rounded-lg transition-all ${
                currentLanguage === lang.code
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Audio Speed & Voice Guidance Status */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
          <span className="text-xs font-semibold">{t.audioBar.speed}</span>
          <div className="inline-flex rounded-lg bg-white dark:bg-zinc-800 p-0.5 border border-slate-200 dark:border-zinc-700">
            <button
              onClick={() => onSpeedChange(1.0)}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                audioSpeed === 1.0
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              {t.audioBar.speedNormal}
            </button>
            <button
              onClick={() => onSpeedChange(0.8)}
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                audioSpeed === 0.8
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"
              }`}
            >
              {t.audioBar.speedAccessible}
            </button>
          </div>
        </div>

        {/* Quick Audio Test Button */}
        <button
          onClick={onPlaySample}
          className="touch-target px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 shadow-xs active:scale-95 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>{t.audioBar.testAudio}</span>
        </button>
      </div>
    </div>
  );
}
