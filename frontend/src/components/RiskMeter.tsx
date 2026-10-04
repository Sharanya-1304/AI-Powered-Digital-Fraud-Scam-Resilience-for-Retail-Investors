import React from 'react';
import { RiskBand } from '../types';
import { Gauge, Info } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  riskBand: RiskBand;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, riskBand: _riskBand }) => {
  const getMeterColor = () => {
    if (score >= 75) return 'from-amber-500 via-rose-500 to-rose-600';
    if (score >= 50) return 'from-yellow-400 via-amber-500 to-orange-500';
    if (score >= 25) return 'from-teal-400 via-yellow-400 to-amber-500';
    return 'from-emerald-400 to-teal-500';
  };

  const getScoreTextColor = () => {
    if (score >= 75) return 'text-rose-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Gauge className="w-4 h-4 text-cyan-600" />
          <span>Prototype Risk Calibration</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-black ${getScoreTextColor()}`}>{score}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getMeterColor()} transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(Math.max(score, 4), 100)}%` }}
          />
        </div>

        {/* Band Markers */}
        <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5 pt-0.5">
          <span>0 (Low)</span>
          <span>25 (Verify)</span>
          <span>50 (High)</span>
          <span>75 (Critical)</span>
          <span>100</span>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-xs text-slate-500">
        <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Prototype Calibration:</strong> Calculated using multi-signal heuristics (rules + NLP patterns + URL indicators). These numbers are not a formal regulatory assessment.
        </p>
      </div>
    </div>
  );
};
