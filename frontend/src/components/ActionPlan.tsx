import React, { useState } from 'react';
import { SafeAction } from '../types';
import { ShieldCheck, CheckSquare, Square, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionPlanProps {
  actions: SafeAction[];
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ actions }) => {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const toggleCheck = (step: number) => {
    setCheckedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              What should you do now?
            </h3>
            <p className="text-xs text-slate-500">
              Follow this verified 6-point safety action plan before committing funds or sharing data.
            </p>
          </div>
        </div>

        <Link
          to="/safety"
          className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          <span>View Detailed Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Numbered Steps */}
      <div className="space-y-3">
        {actions.map((act) => {
          const isDone = !!checkedSteps[act.step];
          return (
            <div
              key={act.step}
              onClick={() => toggleCheck(act.step)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-slate-50/80 border-slate-200 opacity-70'
                  : act.isUrgent
                  ? 'bg-rose-50/30 border-rose-200/80 hover:border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-cyan-600 transition-colors shrink-0"
                aria-label={`Toggle step ${act.step}`}
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-500 uppercase">
                    Step {act.step}
                  </span>
                  {act.isUrgent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                      Urgent
                    </span>
                  )}
                  <h4
                    className={`font-semibold text-sm ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {act.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-cyan-600" />
          <span>Interactive safety checklist — check items as you complete them.</span>
        </div>
        <button
          onClick={() => setCheckedSteps({})}
          className="text-xs text-slate-400 hover:text-slate-700 underline"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
