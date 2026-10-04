import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, AlertCircle, FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';

interface ScanProgressProps {
  onComplete?: () => void;
  speedMs?: number;
}

const STEPS = [
  { id: 1, label: 'Reading content & normalizing text...', icon: Search },
  { id: 2, label: 'Extracting evidence & entity claims...', icon: FileSearch },
  { id: 3, label: 'Detecting warning signals & regex triggers...', icon: AlertCircle },
  { id: 4, label: 'Checking suspicious patterns & URL structures...', icon: ShieldCheck },
  { id: 5, label: 'Preparing safety explanation & risk bands...', icon: Sparkles },
  { id: 6, label: 'Building your safety report...', icon: CheckCircle2 },
];

export const ScanProgress: React.FC<ScanProgressProps> = ({ onComplete, speedMs = 450 }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speedMs);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        onComplete?.();
      }, 350);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStep, speedMs, onComplete]);

  const progressPercent = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card-soft text-center space-y-6">
      {/* Animated Pulsing Shield */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cyan-500 rounded-full blur-xl"
        />
        <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/50 flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Analyzing Safety Signals
        </h3>
        <p className="text-xs text-slate-500">
          Running deterministic rules, heuristic signal detection, and safe URL inspection
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Analysis Pipeline</span>
          <span className="text-cyan-600">{progressPercent}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5 text-left pt-2 border-t border-slate-100">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isCurrent || isDone ? 1 : 0.4 }}
              className={`flex items-center gap-3 p-2 rounded-lg text-xs font-medium transition-colors ${
                isCurrent
                  ? 'bg-cyan-50/80 text-cyan-900 font-semibold border border-cyan-200/60'
                  : isDone
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-600'
                    : isCurrent
                    ? 'bg-cyan-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>
              <span className="truncate">{step.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
