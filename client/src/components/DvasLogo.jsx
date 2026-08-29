import React from "react";

export function DvasEmblem({ className = "w-10 h-10", isWhiteOnDark = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DVAS Emblem"
    >
      <defs>
        <linearGradient id="dvasShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B3B6F" />
          <stop offset="100%" stopColor="#062140" />
        </linearGradient>
        <linearGradient id="dvasOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="dvasGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id="dvasSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>

      {/* Shield Bottom & Right Arc (Deep Navy) */}
      <path
        d="M20 38 L20 62 C20 78 50 92 50 92 C50 92 80 78 80 62 L80 38 Z"
        fill="url(#dvasShieldGrad)"
      />

      {/* Inner White Cutout of Shield */}
      <path
        d="M26 42 L26 60 C26 73 50 84 50 84 C50 84 74 73 74 60 L74 42 Z"
        fill="#FFFFFF"
      />

      {/* Left Silver Fold Accent */}
      <path
        d="M20 38 L34 38 L26 58 L20 54 Z"
        fill="url(#dvasSilverGrad)"
      />

      {/* Stylized "D" Center Navy Core */}
      <path
        d="M32 44 L50 44 C62 44 68 50 68 58 C68 66 62 72 50 72 L32 72 Z M42 51 L42 65 L49 65 C55 65 59 62 59 58 C59 54 55 51 49 51 Z"
        fill="#0B3B6F"
      />

      {/* Orange Figure (Left/Center Person with Raised Arms) */}
      {/* Head */}
      <circle cx="48" cy="18" r="6" fill="url(#dvasOrangeGrad)" />
      {/* Body & Celebrating Raised Arms */}
      <path
        d="M34 26 C38 31 43 35 48 37 C53 35 58 31 62 26 C57 23 53 28 48 29 C43 28 39 23 34 26 Z"
        fill="url(#dvasOrangeGrad)"
      />
      <path
        d="M44 32 C42 42 36 50 34 52 C37 53 45 44 48 36 C51 44 59 53 62 52 C60 50 54 42 52 32 Z"
        fill="url(#dvasOrangeGrad)"
        opacity="0.9"
      />

      {/* Green Figure (Right Person with Raised Arms) */}
      {/* Head */}
      <circle cx="70" cy="27" r="5" fill="url(#dvasGreenGrad)" />
      {/* Body & Raised Arms */}
      <path
        d="M58 36 C62 39 67 42 71 43 C75 41 78 38 82 34 C78 32 75 36 71 37 C67 36 64 32 58 36 Z"
        fill="url(#dvasGreenGrad)"
      />
    </svg>
  );
}

export default function DvasLogo({ className = "", isCompact = false }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem in Crisp Rounded White Badge */}
      <div className="w-10 h-10 rounded-lg bg-white p-1 shadow-sm border border-white/20 flex items-center justify-center shrink-0">
        <DvasEmblem className="w-full h-full" />
      </div>

      {!isCompact && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white leading-none">
              DVAS
            </span>
            <span className="h-0.5 w-6 bg-blue-300 rounded-full" />
            <span className="text-sm font-bold text-white tracking-tight">
              One Voter ID, Anywhere Voting
            </span>
          </div>
          <span className="text-[11px] text-blue-200 font-medium tracking-normal mt-0.5">
            Vote Anywhere, Vote Only Once · Digital Voter Authorization System
          </span>
        </div>
      )}
    </div>
  );
}
