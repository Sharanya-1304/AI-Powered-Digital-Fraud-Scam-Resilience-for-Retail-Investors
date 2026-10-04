import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { RiskBanner } from '../components/RiskBanner';
import { RiskMeter } from '../components/RiskMeter';
import { SignalCard } from '../components/SignalCard';
import { VerificationCard } from '../components/VerificationCard';
import { ActionPlan } from '../components/ActionPlan';
import { LanguageSelector } from '../components/LanguageSelector';
import { MLAnalysisCard } from '../components/MLAnalysisCard';
import {
  FileText,
  ArrowLeft,
  Share2,
  Printer,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentScan, scanHistory } = useAppStore();

  // Find scan by ID in currentScan or scanHistory
  const scan =
    currentScan?.id === id
      ? currentScan
      : scanHistory.find((s) => s.id === id) || currentScan;

  if (!scan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Analysis Found</h2>
        <p className="text-sm text-slate-500">
          This scan session has expired or does not exist. Remember, Sangyan Shield uses privacy-first ephemeral processing and does not permanently store user submissions.
        </p>
        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start a New Scan</span>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SANGYAN SHIELD Safety Report',
        text: `Safety Assessment: ${scan.riskBand}. Score: ${scan.riskScore}/100. Check before you invest.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => navigate('/scan')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors print:hidden"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Scan Another Message</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <LanguageSelector className="print:hidden" />
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-colors print:hidden"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-colors print:hidden"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Header Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 font-mono">
        <div>
          <span>SCAN ID: <strong className="text-slate-800 font-bold">{scan.id}</strong></span>
          <span className="mx-2">•</span>
          <span>FORMAT: <strong className="text-slate-800 uppercase">{scan.inputType}</strong></span>
        </div>
        <div>
          <span>ANALYZED: {formatDate(scan.timestamp)}</span>
        </div>
      </div>

      {/* 1. RISK BANNER (Section 19 & 21) */}
      <RiskBanner
        riskBand={scan.riskBand}
        confidenceLabel={scan.confidenceLabel}
        summary={scan.summaryExplanation}
      />

      {/* 2. PROTOTYPE RISK SCORE GAUGE (Section 22) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <RiskMeter score={scan.riskScore} riskBand={scan.riskBand} />
        </div>

        {/* Original Input / Extracted Evidence Display (Section 29) */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Original Inspected Content</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-sans italic">
              Original evidence preserved verbatim
            </span>
          </div>

          {scan.imageUrl && (
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-hidden flex items-center justify-center">
              <img
                src={scan.imageUrl}
                alt="Analyzed screenshot"
                className="max-h-44 object-contain rounded-lg"
              />
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed max-h-48 overflow-y-auto border border-slate-800 selection:bg-cyan-600">
            {scan.originalInput}
          </div>
        </div>
      </div>

      {/* 2.5 REAL MACHINE LEARNING DETECTION LAYER (Section 51 & 52) */}
      {scan.mlAnalysis && (
        <MLAnalysisCard
          mlAnalysis={scan.mlAnalysis}
          signalsCount={scan.signals.length}
          rulesCount={scan.signals.filter((s) => !s.id.startsWith('sig-ml')).length}
          urlSignalsCount={scan.urlAnalysis?.riskFlags?.length || 0}
          verificationStatus={
            scan.entities.length > 0
              ? scan.entities[0].status === 'VERIFIED_MATCH'
                ? 'Verified Match (SEBI Registered)'
                : 'Unverified / Warning'
              : 'Unverified (Independent Check Needed)'
          }
        />
      )}

      {/* 3. EVIDENCE-FIRST RESULT: WHY ARE WE CONCERNED? (Section 20 & 52) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>{t('results.whyConcerned', 'Why are we concerned?')}</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {scan.signals.length} Signal{scan.signals.length !== 1 ? 's' : ''} Identified
          </span>
        </div>

        {scan.signals.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">No Direct Scam Patterns Detected</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Our automated rules did not match common phrases for guaranteed returns, OTP requests, or unverified sideloaded applications. However, always exercise standard investor caution.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scan.signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </div>

      {/* 4. ENTITY VERIFICATION SECTION (Section 24 & 25) */}
      {scan.entities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-600" />
              <span>{t('results.entityCheckTitle', 'Official Entity Verification')}</span>
            </h3>
            <span className="text-xs text-slate-500">
              Cross-checked with SEBI Database
            </span>
          </div>

          <div className="space-y-4">
            {scan.entities.map((entity, index) => (
              <VerificationCard key={index} entity={entity} />
            ))}
          </div>
        </div>
      )}

      {/* 5. SAFETY ACTION PLAN (Section 23 & 51) */}
      <ActionPlan actions={scan.safeActions} />

      {/* Official Grievance & Reporting Section */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">
            Lost funds or suspect active cyber fraud?
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            Immediately contact the National Cyber Crime Helpline at <strong className="text-slate-900 font-bold">1930</strong> or register an incident on the national portal. For securities grievances, access SEBI SCORES.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>National Cyber Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
          <a
            href="https://scores.sebi.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-colors"
          >
            <span>SEBI SCORES</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
