import React from 'react';
import { Signal } from '../types';
import { AlertCircle, AlertTriangle, ShieldX, Info, CheckCircle2 } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const severityConfig = {
    CRITICAL: {
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      border: 'border-rose-200/90 hover:border-rose-300',
      icon: ShieldX,
      iconColor: 'text-rose-600',
      bgGlow: 'bg-rose-50/40',
    },
    HIGH: {
      badge: 'bg-orange-100 text-orange-800 border-orange-300',
      border: 'border-orange-200/90 hover:border-orange-300',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgGlow: 'bg-orange-50/40',
    },
    MEDIUM: {
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      border: 'border-amber-200/90 hover:border-amber-300',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      bgGlow: 'bg-amber-50/40',
    },
    LOW: {
      badge: 'bg-slate-100 text-slate-800 border-slate-300',
      border: 'border-slate-200 hover:border-slate-300',
      icon: Info,
      iconColor: 'text-slate-600',
      bgGlow: 'bg-slate-50/40',
    },
  }[signal.severity];

  const Icon = severityConfig.icon;

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-all duration-200 bg-white ${severityConfig.border} ${severityConfig.bgGlow}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200/70 flex items-center justify-center shrink-0">
            <Icon className={`w-4 h-4 ${severityConfig.iconColor}`} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">
              {signal.title}
            </h3>
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              {signal.type}
            </span>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${severityConfig.badge}`}>
          {signal.severity}
        </span>
      </div>

      {/* Exact Evidence Snippet */}
      <div className="mt-4 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800">
        <div className="text-[10px] uppercase font-sans font-bold text-cyan-400 tracking-wider mb-1 flex items-center gap-1">
          <span>Detected Evidence:</span>
        </div>
        <p className="selection:bg-cyan-600 text-amber-200">"{signal.evidence}"</p>
      </div>

      {/* Why it Matters (Explanation) */}
      <div className="mt-3.5 space-y-1">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-600" />
          <span>Why It Matters:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {signal.whyItMatters}
        </p>
      </div>

      {/* Recommended Action */}
      {signal.actionRecommendation && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs font-medium text-slate-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong className="text-slate-900">Recommended Action:</strong> {signal.actionRecommendation}</span>
        </div>
      )}
    </div>
  );
};
