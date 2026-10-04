import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, ShieldX, Eye, HelpCircle } from 'lucide-react';
import { EDUCATIONAL_SCAMS } from '../data/educationalData';

export const LearnDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const scam = EDUCATIONAL_SCAMS.find((s) => s.slug === slug);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!scam) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Scam Type Not Found</h2>
        <Link to="/learn" className="text-cyan-600 font-semibold underline">
          Return to Learning Hub
        </Link>
      </div>
    );
  }

  const isCorrect = selectedOption === scam.quiz.correctIndex;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/learn')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Scam Types</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-3 py-0.5 rounded-full border border-rose-200">
            {scam.riskSeverity} RISK LEVEL
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Category Guide & Safety Quiz
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {scam.title}
        </h1>
        <p className="text-base text-slate-600 font-normal leading-relaxed">
          {scam.shortDesc}
        </p>
      </div>

      {/* 4 Pillars of Knowledge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. What it looks like */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Eye className="w-4 h-4 text-cyan-600" />
            <span>What It Looks Like (Typical Phrasing)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {scam.whatItLooksLike.map((item, i) => (
              <li key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-800">
                "{item}"
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Why it is risky */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Why It Is Risky (The Mechanism)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            {scam.whyItIsRisky.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. What to check */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>What You Should Check</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            {scam.whatToCheck.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. What NOT to do */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ShieldX className="w-4 h-4 text-rose-600" />
            <span>What You Must NEVER Do</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
            {scam.whatNotToDo.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span className="font-semibold text-rose-950">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Scenario Quiz (Section 27) */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 sm:p-8 space-y-6 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Safety Scenario Challenge</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold leading-snug">
          {scam.quiz.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {scam.quiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === scam.quiz.correctIndex;

            let buttonStyle = 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200';
            if (hasSubmitted) {
              if (isCorrectOption) {
                buttonStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
              } else if (isSelected && !isCorrectOption) {
                buttonStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                buttonStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-cyan-950 border-cyan-400 text-cyan-200';
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
              >
                <span>{option}</span>
                {hasSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {hasSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action button */}
        {!hasSubmitted ? (
          <button
            disabled={selectedOption === null}
            onClick={() => setHasSubmitted(true)}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
              isCorrect
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
            }`}>
              <div className="font-bold mb-1">
                {isCorrect ? '✓ Correct Safety Instinct!' : '✗ Unsafe Choice — Here is Why:'}
              </div>
              <p>{scam.quiz.explanation}</p>
            </div>

            <button
              onClick={() => {
                setSelectedOption(null);
                setHasSubmitted(false);
              }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Try Question Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
