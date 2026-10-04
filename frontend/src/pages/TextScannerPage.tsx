import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, ShieldAlert, RotateCcw, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { scanText } from '../services/api';
import { ScanProgress } from '../components/ScanProgress';
import { PrivacyNotice } from '../components/PrivacyNotice';

const EXAMPLES = [
  {
    label: 'Guaranteed 30% Return + OTP',
    text: 'SEBI approved institutional quota! Guaranteed 30% monthly returns with zero downside. Pay ₹5,000 today to activate your trading slot. Send the OTP received on your mobile to complete KYC.',
  },
  {
    label: 'Account Suspension Threat',
    text: 'URGENT: Your Demat trading account will be suspended today at 5:00 PM due to uncompleted KYC. Send your 6-digit OTP immediately to our verification officer to avoid ₹10,000 penalty.',
  },
  {
    label: 'Sideloaded VIP Trading APK',
    text: 'Exclusive invitation: Install our custom institutional VIP-Trade-Alpha.apk from this link to access 99.8% accurate AI algorithmic signals and pre-IPO allocations.',
  },
  {
    label: 'Withdrawal Clearance Tax Trap',
    text: 'Your VIP account has generated ₹3,85,000 in trading profits. To unlock your withdrawal, deposit 12% regulatory clearance fee (₹46,200) to our nodal officer UPI ID within 24 hours.',
  },
];

export const TextScannerPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAnalyzing, setAnalyzing, setCurrentScan, addScanToHistory, language, setLanguage } = useAppStore();

  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleAnalyze = async () => {
    if (!message.trim()) {
      setError('Please paste or type a message before analyzing.');
      return;
    }
    setError(null);
    setAnalyzing(true, 1);

    try {
      const result = await scanText(message, language);
      setCurrentScan(result);
      addScanToHistory(result);
      // Wait for progress animation steps to display
      setTimeout(() => {
        setAnalyzing(false);
        navigate(`/results/${result.id}`);
      }, 2400);
    } catch {
      setAnalyzing(false);
      setError('Failed to analyze content. Please try again.');
    }
  };

  const handleClear = () => {
    setMessage('');
    setError(null);
  };

  const handleLoadExample = (text: string) => {
    setMessage(text);
    setError(null);
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
      {/* Back button & Title */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/scan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Scan Hub</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-cyan-600" />
              <span>{t('scanners.textTitle', 'Check a suspicious message')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t(
                'scanners.textSubtitle',
                'Paste the message exactly as you received it from WhatsApp, Telegram, SMS, or social media.'
              )}
            </p>
          </div>

          {/* Language Selector in Scanner (Section 13) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'te', label: 'తెలుగు' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => handleLanguageSelect(l.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === l.code
                    ? 'bg-white text-cyan-700 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Example Loaders */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Quick Scam Examples:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadExample(ex.text)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200/80 text-slate-700 transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            placeholder={t(
              'scanners.placeholder',
              'Example: Guaranteed 30% monthly returns! Pay ₹5,000 today to activate your account...'
            )}
            className="w-full rounded-xl border border-slate-300 p-4 text-sm font-sans placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-y leading-relaxed outline-none"
          />
          <div className="text-right text-[11px] text-slate-400 mt-1">
            {message.length} characters
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('scanners.btnClear', 'Clear')}</span>
          </button>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!message.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow transition-all hover:scale-[1.02] active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>{t('scanners.btnAnalyze', 'Analyze Message')}</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice Component */}
      <PrivacyNotice />
    </div>
  );
};
