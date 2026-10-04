import React from 'react';
import { RiskBand } from '../types';
import { AlertTriangle, AlertOctagon, CheckCircle2, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RiskBannerProps {
  riskBand: RiskBand;
  confidenceLabel: string;
  summary: string;
}

export const RiskBanner: React.FC<RiskBannerProps> = ({
  riskBand,
  confidenceLabel,
  summary,
}) => {
  const { t } = useTranslation();

  const config = {
    LOW_CONCERN: {
      title: t('riskBands.LOW_CONCERN', 'Low Concern'),
      color: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      glow: 'shadow-glow-green',
      uncertaintyNote: 'No prominent automated scam signals were detected. However, standard investor due diligence is always advised.',
    },
    NEEDS_VERIFICATION: {
      title: t('riskBands.NEEDS_VERIFICATION', 'Needs Verification'),
      color: 'bg-amber-500/10 border-amber-500/40 text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: HelpCircle,
      iconColor: 'text-amber-600',
      glow: 'shadow-glow-amber',
      uncertaintyNote: 'This assessment identifies claims requiring independent verification with official regulatory records before proceeding.',
    },
    HIGH_CONCERN: {
      title: t('riskBands.HIGH_CONCERN', 'High Concern'),
      color: 'bg-orange-500/10 border-orange-500/40 text-orange-950',
      badge: 'bg-orange-100 text-orange-900 border-orange-300',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      glow: 'shadow-card-soft',
      uncertaintyNote: 'This assessment identifies multiple high-risk warning signals. Proceeding presents serious potential for capital loss.',
    },
    CRITICAL_SAFETY_WARNING: {
      title: t('riskBands.CRITICAL_SAFETY_WARNING', 'Critical Safety Warning'),
      color: 'bg-rose-500/15 border-rose-500/50 text-rose-950',
      badge: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
      icon: AlertOctagon,
      iconColor: 'text-rose-600',
      glow: 'shadow-glow-red',
      uncertaintyNote: 'Critical safety red flags detected (e.g. OTP harvesting or advance fee traps). Do not send funds or disclose private credentials.',
    },
  }[riskBand];

  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all relative overflow-hidden ${config.color} ${config.glow}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/90 shadow-sm border border-slate-200/60 flex items-center justify-center shrink-0">
            <Icon className={`w-7 h-7 ${config.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge}`}>
                {config.title}
              </span>
              <span className="text-xs text-slate-500 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200">
                Confidence: {confidenceLabel}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
              {config.title}
            </h2>
          </div>
        </div>
      </div>

      <p className="mt-3.5 text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
        {summary}
      </p>

      <div className="mt-4 pt-3 border-t border-slate-300/40 flex items-center justify-between text-xs text-slate-600">
        <span>{config.uncertaintyNote}</span>
        <span className="shrink-0 italic hidden sm:inline">Indicative safety assessment</span>
      </div>
    </div>
  );
};
