import React from 'react';
import { Lock, EyeOff } from 'lucide-react';

export const PrivacyNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-950 p-4 sm:p-5 text-white shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Your safety comes first.</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                Privacy By Design
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              We never request OTPs, passwords, PINs, bank credentials, or brokerage logins. Never enter sensitive access keys into any analyzer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 shrink-0">
          <EyeOff className="w-3.5 h-3.5" />
          <span>Ephemeral Analysis</span>
        </div>
      </div>
    </div>
  );
};
