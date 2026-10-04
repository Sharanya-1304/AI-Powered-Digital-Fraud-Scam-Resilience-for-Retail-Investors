import React from 'react';
import { ShieldCheck, Lock, Globe, Server, CheckCircle2 } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Application Hardening & Threat Controls</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Security Architecture & SSRF Protection
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          How Sangyan Shield prevents Server-Side Request Forgery (SSRF), sanitizes input, and safeguards system infrastructure.
        </p>
      </div>

      {/* SSRF Protection Callout (Section 24) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-base font-bold text-slate-900">
          <Server className="w-5 h-5 text-cyan-600" />
          <h3>Server-Side Request Forgery (SSRF) Defense</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          When analyzing URLs, attackers may submit internal infrastructure addresses to probe backend networks. Sangyan Shield implements strict deterministic defense filters:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
          {[
            'Rejection of localhost and 127.0.0.1 loopbacks',
            'Rejection of RFC 1918 private IPv4 ranges (10.x, 172.16-31.x, 192.168.x)',
            'Rejection of 169.254.x link-local metadata addresses',
            'Strict protocol allowlist: only HTTP and HTTPS (file://, ftp:// rejected)',
            'Safe lexical heuristics without executing untrusted remote code',
            'No automated follow-redirect execution without re-validation',
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Input Sanitation & Secret Protection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <Lock className="w-5 h-5 text-cyan-600" />
          <h4 className="font-bold text-slate-900 text-base">Secret Protection</h4>
          <p className="text-slate-600 leading-relaxed font-normal">
            No API keys, database credentials, or backend tokens are bundled into client-side production distributions. All communications utilize CORS policies and scoped endpoints.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <Globe className="w-5 h-5 text-cyan-600" />
          <h4 className="font-bold text-slate-900 text-base">HTTPS Fallacy Education</h4>
          <p className="text-slate-600 leading-relaxed font-normal">
            We explicitly educate users that SSL/TLS certificates do not equate to legitimacy. The system alerts users when an HTTPS website is hosted on an unverified or recently registered domain.
          </p>
        </div>
      </div>
    </div>
  );
};
