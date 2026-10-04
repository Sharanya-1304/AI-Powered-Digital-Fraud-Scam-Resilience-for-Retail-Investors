import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, HelpCircle } from 'lucide-react';
import { EDUCATIONAL_SCAMS } from '../data/educationalData';

export const LearnPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 text-cyan-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
          <span>Interactive Investor Safety Education</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Learn to Spot Investment Scams
        </h1>
        <p className="text-sm text-slate-600">
          Understand the psychology, delivery mechanisms, and exact warning signs behind the 8 most prevalent digital financial fraud schemes.
        </p>
      </div>

      {/* Grid of 8 Scam Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EDUCATIONAL_SCAMS.map((scam) => {
          const isCritical = scam.riskSeverity === 'CRITICAL';
          const isHigh = scam.riskSeverity === 'HIGH';

          return (
            <Link
              key={scam.slug}
              to={`/learn/${scam.slug}`}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-cyan-500/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : isHigh
                        ? 'bg-orange-100 text-orange-800 border-orange-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {scam.riskSeverity} RISK
                  </span>

                  <span className="text-[11px] font-semibold text-cyan-600 group-hover:underline flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Includes Quiz</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {scam.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    {scam.shortDesc}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Common Vectors:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {scam.commonChannels.slice(0, 2).map((ch, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                <span>Explore Guide & Test Knowledge</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
