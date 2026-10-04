import React from 'react';
import { Lock, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy-by-Design Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Data Principles
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Sangyan Shield treats investor privacy as an inviolable baseline, not an afterthought.
        </p>
      </div>

      {/* Core Privacy Commitments (Section 42 & 43) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          What We Never Collect or Request
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          {[
            'One-Time Passwords (OTPs)',
            'Trading Account Passwords',
            'Bank Account PINs / MPINs',
            'Bank Login Credentials',
            'Brokerage Login Credentials',
            'Device SMS Access',
            'Personal Contact Lists',
            'Permanent Message Archives',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <EyeOff className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ephemeral Processing Details (Section 43) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
        <h3 className="text-lg font-bold text-slate-900">
          Ephemeral Processing by Default
        </h3>
        <p>
          Uploaded screenshots and pasted text are evaluated in transient application memory for the duration of the scan session. Once the assessment report is generated, raw input strings are not written to persistent database records unless explicitly requested by the user.
        </p>
        <p>
          Telemetry metrics are strictly anonymized, consisting solely of high-level category counters, timestamps, and error codes without identifiable personal financial content.
        </p>
      </div>
    </div>
  );
};
