import React from 'react';
import { Award, Target, EyeOff } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-cyan-600" />
          <span>SANGYAN Hackathon 2026 — Track A</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About SANGYAN SHIELD
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          A digital safety shield and fraud resilience assistant built specifically for retail and first-time investors in India.
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 p-6 sm:p-8 text-white border border-slate-800 space-y-3 shadow-md">
        <div className="text-xs uppercase font-mono font-bold text-cyan-400">
          Core Product Principle
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          "SCAN → EXPLAIN → VERIFY → PROTECT"
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          We do not just tell users something looks risky. We show them exactly why. By decomposing suspicious text into verifiable evidence, regex rule violations, and regulatory cross-checks, investors are empowered to evaluate hazards before transferring capital.
        </p>
      </div>

      {/* Non-Advisory Mandate (Critical Prompt Rule) */}
      <div className="bg-amber-500/10 border border-amber-400/50 rounded-2xl p-6 text-amber-950 space-y-2">
        <h3 className="font-bold text-amber-900 text-base">
          Crucial Disclaimer: Not An Investment Adviser
        </h3>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-normal">
          Sangyan Shield is strictly a digital fraud resilience and safety evaluation assistant. It does not provide buy, sell, or hold recommendations, does not forecast stock prices, and does not endorse commercial financial products.
        </p>
      </div>

      {/* Track & Collaboration Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <Target className="w-6 h-6 text-cyan-600" />
          <h4 className="font-bold text-slate-900 text-base">Hackathon Context</h4>
          <p className="text-slate-600 leading-relaxed font-normal">
            Developed for SANGYAN — organized by SNTC, IIT (BHU) Varanasi in collaboration with the Securities and Exchange Board of India (SEBI) and National Securities Depository Limited (NSDL).
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <EyeOff className="w-6 h-6 text-emerald-600" />
          <h4 className="font-bold text-slate-900 text-base">Privacy & Ephemeral Storage</h4>
          <p className="text-slate-600 leading-relaxed font-normal">
            Built from day one to operate ephemerally without storing user screenshots or financial messages on permanent databases. We never ask for OTPs, passwords, or account logins.
          </p>
        </div>
      </div>
    </div>
  );
};
