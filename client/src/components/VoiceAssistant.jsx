import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw, Globe, Gauge } from "lucide-react";

export default function VoiceAssistant({
  currentText,
  scriptKey,
  isDarkMode,
  autoSpeak = false
}) {
  const [language, setLanguage] = useState("en"); // 'en' | 'gu' | 'hi'
  const [speed, setSpeed] = useState(1.0); // 1.0 | 0.8
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef(null);
  const speechSynthUtteranceRef = useRef(null);

  const languageLabels = {
    en: { name: "English", listen: "Listen Guidance", code: "en-US" },
    gu: { name: "ગુજરાતી (Gujarati)", listen: "સાંભળો", code: "gu-IN" },
    hi: { name: "हिन्दी (Hindi)", listen: "सुनिए", code: "hi-IN" }
  };

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleSpeak = async () => {
    if (isPlaying) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    setIsLoadingAudio(true);

    try {
      const response = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentText,
          scriptKey,
          language,
          speed
        })
      });

      const data = await response.json();

      if (data.isAudioStream && data.audioBase64) {
        // OpenAI TTS MP3 stream
        const audioSrc = `data:${data.contentType};base64,${data.audioBase64}`;
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = audioSrc;
        audioRef.current.playbackRate = speed;
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          fallbackBrowserSpeech(data.text || currentText);
        };
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        // Local Browser Speech Synthesis fallback
        fallbackBrowserSpeech(data.text || currentText);
      }
    } catch (err) {
      console.warn("Backend TTS failed, using browser speech synthesis fallback:", err);
      fallbackBrowserSpeech(currentText);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const fallbackBrowserSpeech = (textToSpeak) => {
    if (!window.speechSynthesis) {
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak || "Please verify your voter ID.");
    utterance.lang = languageLabels[language].code;
    utterance.rate = speed;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Toggle speed between 1.0x and 0.8x
  const toggleSpeed = () => {
    const nextSpeed = speed === 1.0 ? 0.8 : 1.0;
    setSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  return (
    <div
      className={`p-3 sm:p-4 rounded-2xl border-2 transition-all flex flex-wrap items-center justify-between gap-3 shadow-sm ${
        isDarkMode
          ? "bg-zinc-900 border-zinc-700 text-white"
          : "bg-blue-50/80 border-blue-200 text-slate-900"
      }`}
    >
      {/* Left: Listen Button & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSpeak}
          disabled={isLoadingAudio}
          className={`touch-target px-4 py-2.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 shadow-md transition-transform active:scale-95 ${
            isPlaying
              ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          aria-label="Listen to voice guidance"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span>
            {isLoadingAudio
              ? "Loading Voice..."
              : isPlaying
              ? "Pause Audio"
              : `🔊 ${languageLabels[language].listen}`}
          </span>
        </button>

        <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-zinc-400 hidden sm:inline">
          Low-literacy & Senior Citizen Voice Guidance
        </span>
      </div>

      {/* Right: Language Selector & Audio Controls */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 shadow-sm">
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <select
            value={language}
            onChange={(e) => {
              stopAllAudio();
              setLanguage(e.target.value);
            }}
            className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-white cursor-pointer focus:outline-none"
            aria-label="Select Voice Language"
          >
            <option value="gu" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">
              ગુજરાતી (Gujarati)
            </option>
            <option value="hi" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">
              हिन्दी (Hindi)
            </option>
            <option value="en" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">
              English
            </option>
          </select>
        </div>

        {/* Speed Toggle (1x / 0.8x) */}
        <button
          onClick={toggleSpeed}
          className="touch-target px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs sm:text-sm font-black text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-1 shadow-sm transition-colors"
          title="Toggle Slow Audio for Elderly / Accessibility"
        >
          <Gauge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{speed === 0.8 ? "0.8x (Slow)" : "1.0x (Normal)"}</span>
        </button>

        {/* Repeat Button */}
        <button
          onClick={() => {
            stopAllAudio();
            setTimeout(handleSpeak, 100);
          }}
          className="touch-target p-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 shadow-sm transition-colors"
          title="Repeat Audio Guidance"
          aria-label="Repeat Audio Guidance"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
