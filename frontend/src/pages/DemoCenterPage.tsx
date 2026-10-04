import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Play } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { useAppStore } from '../store/useAppStore';
import { scanText, scanUrl } from '../services/api';

export const DemoCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentScan, setAnalyzing, addScanToHistory } = useAppStore();

  const handleRunDemo = async (scenario: typeof DEMO_SCENARIOS[0]) => {
    setAnalyzing(true, 1);

    try {
      let result;
      if (scenario.inputType === 'url') {
        result = await scanUrl(scenario.sampleData);
      } else {
        result = await scanText(scenario.sampleData);
      }

      result.isDemo = true;
      setCurrentScan(result);
      addScanToHistory(result);

      setTimeout(() => {
        setAnalyzing(false);
        navigate(`/results/${result.id}`);
      }, 1500);
    } catch {
      setAnalyzing(false);
      alert('Demo execution failed. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 text-cyan-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-cyan-600" />
          <span>SANGYAN Hackathon Jury Evaluation Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Demo Center: 1-Click Verification Scenarios
        </h1>
        <p className="text-sm text-slate-600">
          Curated scenarios demonstrating exact evidence extraction, regex rule triggering, URL domain mismatch detection, and safe action plans.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-6">
        {DEMO_SCENARIOS.map((scenario, index) => (
          <div
            key={scenario.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:border-cyan-500/50 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{scenario.title}</h3>
                  <span className="text-xs text-slate-400">{scenario.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Expected: {scenario.expectedRiskBand.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              {scenario.description}
            </p>

            {/* Sample Input Payload */}
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-200 border border-slate-800 leading-relaxed">
              <span className="text-cyan-400 font-bold block mb-1">
                INPUT PAYLOAD ({scenario.inputType.toUpperCase()}):
              </span>
              <span className="text-amber-200">"{scenario.sampleData}"</span>
            </div>

            {/* Expected Trigger Signals */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Expected Trigger Signals:
              </span>
              {scenario.keySignals.map((sig) => (
                <span
                  key={sig}
                  className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                >
                  {sig}
                </span>
              ))}
            </div>

            {/* Launch Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleRunDemo(scenario)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition-all hover:scale-[1.02] active:scale-95"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>Start Demo Scenario {index + 1}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Labs & Extended Demos */}
      <div className="pt-6 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Specialized Hackathon Evaluation Labs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 border border-purple-800 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                Live Speech + Audio
              </span>
              <h3 className="text-lg font-bold text-white">Call Transcript & Voice Threat Scanner</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Test real-time microphone dictation or simulate Digital Arrest police extortion, fake SEBI clearance calls, and OTP extraction dialogues.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-800/80">
              <button
                type="button"
                onClick={() => navigate('/scan/call')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-sm shadow transition-all hover:scale-[1.02]"
              >
                <span>Open Voice Call Scanner</span>
                <Play className="w-4 h-4 fill-slate-950" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                shadcn UI / Framer Motion
              </span>
              <h3 className="text-lg font-bold text-white">Prisma Cinematic Hero Showcase</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full-screen standalone demonstration of the WordsPullUp animated typography and video hero component designed with shadcn structure.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/demo/prisma')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow transition-all hover:scale-[1.02]"
              >
                <span>Launch Prisma Hero Demo</span>
                <Play className="w-4 h-4 fill-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
