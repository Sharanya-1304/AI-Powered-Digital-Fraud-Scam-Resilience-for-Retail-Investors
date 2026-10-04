import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, ShieldAlert, ArrowLeft, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { scanUrl } from '../services/api';
import { ScanProgress } from '../components/ScanProgress';
import { PrivacyNotice } from '../components/PrivacyNotice';

const SAMPLE_URLS = [
  {
    label: 'Spoofed SEBI Domain',
    url: 'https://secure-sebi-quickinvest.vip-trade.net/login?claim=rewards',
  },
  {
    label: 'Direct APK Download',
    url: 'https://cdn.apex-trading-bot.cloud/download/NSE-Institutional-v4.apk',
  },
  {
    label: 'URL Shortener Redirect',
    url: 'https://bit.ly/guaranteed-30-percent-returns-club',
  },
  {
    label: 'Direct IP Address Host',
    url: 'http://185.220.101.54:8080/vip/register',
  },
];

export const UrlScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAnalyzing, setAnalyzing, setCurrentScan, addScanToHistory } = useAppStore();

  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputUrl.trim()) {
      setError('Please enter a URL to inspect.');
      return;
    }

    setError(null);
    setAnalyzing(true, 1);

    try {
      const result = await scanUrl(inputUrl);
      setCurrentScan(result);
      addScanToHistory(result);

      setTimeout(() => {
        setAnalyzing(false);
        navigate(`/results/${result.id}`);
      }, 2200);
    } catch {
      setAnalyzing(false);
      setError('Failed to analyze URL structure.');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <ScanProgress />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/scan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scan Hub</span>
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <LinkIcon className="w-7 h-7 text-indigo-600" />
            <span>Check a Suspicious Investment Link</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze website links, trading portals, and APK download URLs for impersonation, punycode spoofing, and brand mismatches.
          </p>
        </div>
      </div>

      {/* Critical Security Principle Banner (Section 16 & 17) */}
      <div className="bg-amber-500/10 border border-amber-400/50 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950">
        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <h4 className="font-bold text-amber-900">
            Important Cybersecurity Rule: HTTPS Does NOT Guarantee Safety
          </h4>
          <p className="text-amber-800">
            Virtually all modern phishing and scam websites use free SSL/TLS certificates with a green padlock. We never designate a link as safe solely because it starts with <code>https://</code>.
          </p>
        </div>
      </div>

      {/* Quick Sample URLs */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Test Suspicious Link Samples:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_URLS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputUrl(sample.url);
                setError(null);
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 text-slate-700 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Suspicious URL or Domain
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. https://secure-sebi-quickinvest.vip-trade.net/login"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-mono placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Analyzed using safe client-side parsing without executing remote code (SSRF-safe).
          </span>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!inputUrl.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm shadow transition-all hover:scale-[1.02] active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Analyze Link Safety</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <PrivacyNotice />
    </div>
  );
};
