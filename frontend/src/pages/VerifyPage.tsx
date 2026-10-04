import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ExternalLink, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { verifyEntity } from '../services/api';
import { EntityVerification } from '../types';
import { VerificationCard } from '../components/VerificationCard';

export const VerifyPage: React.FC = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [domain, setDomain] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<EntityVerification | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsVerifying(true);
    try {
      const res = await verifyEntity(name, regNo, domain);
      setResult(res);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSample = (sampleName: string, sampleReg: string, sampleDomain: string) => {
    setName(sampleName);
    setRegNo(sampleReg);
    setDomain(sampleDomain);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 text-cyan-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>Regulatory Registry Cross-Check</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('verify.title', 'Intermediary & Entity Verification')}
        </h1>
        <p className="text-sm text-slate-600">
          {t(
            'verify.subtitle',
            'Check if an investment adviser, broker, or financial entity is recognized on official regulatory lists.'
          )}
        </p>
      </div>

      {/* Critical Disclaimer Card (Section 24) */}
      <div className="bg-amber-500/10 border border-amber-400/50 rounded-2xl p-5 flex items-start gap-3.5 text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <h4 className="font-bold text-amber-900">
            Crucial Verification Rule
          </h4>
          <p className="text-amber-800">
            {t(
              'verify.disclaimer',
              'A registration match does NOT prove that a particular message, phone call, or payment request is genuine. Scammers frequently impersonate genuine registered entities.'
            )}
          </p>
        </div>
      </div>

      {/* Quick Test Samples */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Quick Verification Examples:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSample('Zerodha Broking Limited', 'INZ000031633', 'zerodha.com')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
          >
            ✓ Zerodha (Registered Broker)
          </button>
          <button
            type="button"
            onClick={() => handleSample('Groww', 'INZ000301838', 'groww.in')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
          >
            ✓ Groww (Registered Broker)
          </button>
          <button
            type="button"
            onClick={() => handleSample('Apex Global VIP Investment Club', 'INA99999999', 'apex-vip.club')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
          >
            ✗ Unregistered Apex Club (Simulation)
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleVerify}
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t('verify.nameLabel', 'Company or Intermediary Name')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zerodha Broking, Angel One, ICICI Securities..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {t('verify.regLabel', 'Claimed SEBI Registration Number (Optional)')}
              </label>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. INZ000031633, INA00000000..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {t('verify.domainLabel', 'Website / Domain (Optional)')}
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. zerodha.com, groww.in..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400">
            Searches official SEBI registered intermediary database cache.
          </div>

          <button
            type="submit"
            disabled={isVerifying || !name.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm shadow transition-all hover:scale-[1.02] active:scale-95"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>{isVerifying ? 'Checking Records...' : t('verify.btnVerify', 'Verify Entity')}</span>
          </button>
        </div>
      </form>

      {/* Verification Result Card */}
      {result && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900">Verification Result:</h3>
          <VerificationCard entity={result} />
        </div>
      )}

      {/* Official Directory Link Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Manual Verification via SEBI Official Portal
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            You can independently confirm any stock broker, investment adviser (RIA), or research analyst on the official website.
          </p>
        </div>
        <a
          href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm shrink-0"
        >
          <span>Open SEBI Recognised Directory</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-600" />
        </a>
      </div>
    </div>
  );
};
