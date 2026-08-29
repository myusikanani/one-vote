import React from "react";
import { TRANSLATIONS } from "../translations";

export default function StepProgressTracker({ currentStep, onStepClick, currentLanguage = "en" }) {
  const steps = [
    { 
      number: 1, 
      label: currentLanguage === "gu" ? "૧ મતદાર તપાસો" : currentLanguage === "hi" ? "१ मतदाता जांचें" : "1 Verify voter" 
    },
    { 
      number: 2, 
      label: currentLanguage === "gu" ? "૨ અધિકૃત કરો" : currentLanguage === "hi" ? "२ अधिकृत करें" : "2 Authorize" 
    },
    { 
      number: 3, 
      label: currentLanguage === "gu" ? "૩ મત આપો" : currentLanguage === "hi" ? "३ वोट दें" : "3 Cast vote" 
    },
    { 
      number: 4, 
      label: currentLanguage === "gu" ? "૪ પૂર્ણ" : currentLanguage === "hi" ? "४ पूर्ण" : "4 Done" 
    }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-5 pb-1">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {steps.map((step) => {
          let active = false;
          if (step.number === 1 && currentStep === 1) active = true;
          if (step.number === 2 && (currentStep === 2 || currentStep === 3)) active = true;
          if (step.number === 3 && currentStep === 4) active = true;
          if (step.number === 4 && currentStep === 5) active = true;

          const isPassed = 
            (step.number === 1 && currentStep > 1) ||
            (step.number === 2 && currentStep > 3) ||
            (step.number === 3 && currentStep > 4);

          return (
            <button
              key={step.number}
              onClick={() => onStepClick && onStepClick(step.number === 4 ? 5 : step.number === 3 ? 4 : step.number)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-xs font-bold transition-all cursor-pointer border ${
                active
                  ? "bg-[#0B3B6F] text-white border-[#0B3B6F]"
                  : isPassed
                  ? "bg-[#EAF1FB] text-[#0B3B6F] border-[#BED4F3]"
                  : "bg-[#FFFFFF] text-[#4C5768] border-[#D9E0EA]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                active 
                  ? "bg-[#FF9933] text-white" 
                  : isPassed
                  ? "bg-[#0B3B6F] text-white"
                  : "bg-[#D9E0EA] text-[#4C5768]"
              }`}>
                {step.number}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
