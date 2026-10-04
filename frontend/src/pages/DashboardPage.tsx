import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  RotateCcw,
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';
import { formatDate } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const { scanHistory, clearHistory } = useAppStore();

  // Synthetic demo dataset + real local session history
  const signalDistribution = [
    { name: 'Guaranteed Returns', count: 48, fill: '#F59E0B' },
    { name: 'OTP / Credential Harvesting', count: 39, fill: '#EF4444' },
    { name: 'Urgency & Pressure', count: 34, fill: '#FB923C' },
    { name: 'Regulatory Impersonation', count: 28, fill: '#8B5CF6' },
    { name: 'Sideloaded APK / Unknown App', count: 22, fill: '#EC4899' },
    { name: 'Withdrawal Clearance Fee', count: 19, fill: '#DC2626' },
  ];

  const riskBandsData = [
    { name: 'Critical Warning', value: 42, color: '#EF4444' },
    { name: 'High Concern', value: 31, color: '#F97316' },
    { name: 'Needs Verification', value: 18, color: '#F59E0B' },
    { name: 'Low Concern', value: 9, color: '#10B981' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with explicit DEMO DATA disclaimer banner (Section 30) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
              Demo Data • Simulation Analytics
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-cyan-600" />
            <span>Resilience & Threat Intelligence Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated indicator prevalence, detected risk bands, and live session scans.
          </p>
        </div>

        <Link
          to="/scan"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs shadow hover:bg-slate-800"
        >
          <span>Scan Something</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </Link>
      </div>

      {/* Mandatory Section 30 Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> Aggregate statistics displayed below are simulated prototype demo figures for SANGYAN Hackathon Track A evaluation and do not represent real-world adoption census data.
        </p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Evaluated (Demo)</span>
            <ShieldAlert className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">1,248</div>
          <div className="text-xs text-slate-500 font-medium">Across messages, URLs & screenshots</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Critical Warnings</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">524</div>
          <div className="text-xs text-rose-700/80 font-medium">OTP harvesting & upfront fee traps</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Needs Verification</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">225</div>
          <div className="text-xs text-amber-700/80 font-medium">Uncorroborated intermediary claims</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Current Session Scans</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{scanHistory.length}</div>
          <div className="text-xs text-slate-500 font-medium">Locally stored in browser memory</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Most Common Scam Signals */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Prevalence of Detected Scam Signals (Demo Distribution)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={signalDistribution}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {signalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Risk Bands Distribution */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Risk Band Breakdown</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskBandsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskBandsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-1 text-xs">
            {riskBandsData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Machine Learning Model Evaluation Bench (Section Strict ML Prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Machine Learning Evaluation Bench (Empirical Test Results)
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                Verified Test Set
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Architecture: CalibratedLogisticRegression • Pipeline: TF-IDF (1-3 ngrams) + Domain Feature Union
            </p>
          </div>

          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            5-Fold Stratified CV Mean F1: 86.8% (±4.8%)
          </div>
        </div>

        {/* 5 Real Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-[11px] uppercase font-bold block">Accuracy</span>
            <span className="text-2xl font-black text-slate-900">95.0%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-[11px] uppercase font-bold block">Precision</span>
            <span className="text-2xl font-black text-emerald-600">100.0%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-[11px] uppercase font-bold block">Recall</span>
            <span className="text-2xl font-black text-cyan-700">90.9%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 text-[11px] uppercase font-bold block">F1-Score</span>
            <span className="text-2xl font-black text-purple-700">95.2%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
            <span className="text-slate-500 text-[11px] uppercase font-bold block">ROC-AUC</span>
            <span className="text-2xl font-black text-rose-600">1.000</span>
          </div>
        </div>

        {/* Confusion Matrix + Top Global Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Confusion Matrix Table */}
          <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Holdout Test Set Confusion Matrix (20 Samples)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="text-[10px] uppercase block font-sans font-bold text-emerald-700">True Negative</span>
                <span className="text-xl font-bold">9</span>
                <span className="text-[10px] block text-emerald-600">Correct Benign</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                <span className="text-[10px] uppercase block font-sans font-bold text-slate-500">False Positive</span>
                <span className="text-xl font-bold">0</span>
                <span className="text-[10px] block text-slate-400">Zero False Alarms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                <span className="text-[10px] uppercase block font-sans font-bold text-amber-700">False Negative</span>
                <span className="text-xl font-bold">1</span>
                <span className="text-[10px] block text-amber-600">Missed Low-Yield</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-100 text-rose-900 border border-rose-300">
                <span className="text-[10px] uppercase block font-sans font-bold text-rose-700">True Positive</span>
                <span className="text-xl font-bold">10</span>
                <span className="text-[10px] block text-rose-600">Correct Scams</span>
              </div>
            </div>
          </div>

          {/* Top Predictive Positive Features */}
          <div className="md:col-span-7 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Global Feature Weights (Top Scam Prediction Signals)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { name: 'credential_intensity', weight: '+1.31' },
                { name: 'apk_indicator', weight: '+0.95' },
                { name: 'exclamation_density', weight: '+0.78' },
                { name: 'guarantee_intensity', weight: '+0.78' },
                { name: 'payment_intensity', weight: '+0.76' },
                { name: 'urgency_intensity', weight: '+0.71' },
              ].map((item, i) => (
                <div key={i} className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between">
                  <span className="truncate text-slate-800">{item.name}</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">{item.weight}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-sans pt-1">
              Deterministic, non-random model calibrated with Platt scaling.
            </p>
          </div>
        </div>
      </div>

      {/* Local Session Scans List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Recent Scans</h3>
            <p className="text-xs text-slate-500">
              Ephemeral history stored temporarily in your local browser session.
            </p>
          </div>
          {scanHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {scanHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No scans performed in this session yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scanHistory.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 uppercase font-bold">
                      [{item.inputType}]
                    </span>
                    <span className="font-bold text-slate-900">
                      {item.riskBand.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 italic font-sans">
                    "{item.originalInput}"
                  </p>
                </div>

                <Link
                  to={`/results/${item.id}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 font-semibold text-slate-700 transition-colors shrink-0"
                >
                  View Report
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
