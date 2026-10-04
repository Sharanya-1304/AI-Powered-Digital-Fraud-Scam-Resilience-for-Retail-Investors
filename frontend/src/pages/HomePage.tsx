import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Mic,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronRight,
  Eye,
  FileCheck,
  Zap,
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { EDUCATIONAL_SCAMS } from '../data/educationalData';
import { useAppStore } from '../store/useAppStore';
import { scanText } from '../services/api';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setCurrentScan, setAnalyzing } = useAppStore();

  const handleLaunchQuickDemo = async (scenarioId: string) => {
    const sc = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];
    setAnalyzing(true, 1);
    navigate('/scan/text');
    const res = await scanText(sc.sampleData);
    res.isDemo = true;
    setCurrentScan(res);
    setTimeout(() => {
      setAnalyzing(false);
      navigate(`/results/${res.id}`);
    }, 1200);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        {/* Subtle cyber background grid & radial glow */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Track A Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>SANGYAN Hackathon 2026 • Track A: Fraud Resilience</span>
              </div>


              {/* Hero Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {t('hero.title', 'Before you trust it, check it.')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t(
                  'hero.subtitle',
                  'Scan suspicious investment messages, screenshots and links. Understand the warning signs. Verify the claim. Take safer action.'
                )}
              </p>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/scan"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ShieldAlert className="w-5 h-5 text-slate-950" />
                  <span>{t('hero.ctaScan', 'Scan Something Suspicious')}</span>
                </Link>

                <Link
                  to="/learn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-base transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>{t('hero.ctaLearn', 'Learn to Spot Scams')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Privacy Line */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('hero.privacyNotice', 'Private by design • No OTPs • No passwords • No brokerage login')}</span>
              </div>
            </div>

            {/* Right: Sophisticated Cyber Visual Flow */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md p-6 rounded-2xl bg-slate-800/80 border border-slate-700/90 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>EVIDENCE PIPELINE</span>
                  </div>
                  <span className="text-[10px] bg-slate-700/60 px-2 py-0.5 rounded text-slate-300 font-mono">
                    STATUS: ACTIVE
                  </span>
                </div>

                {/* Animated Pipeline Nodes */}
                <div className="space-y-3 font-mono text-xs">
                  {/* Step 1: Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-slate-300">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>INPUT: WhatsApp / Telegram</span>
                    </div>
                    <span className="text-slate-400 text-[10px]">RAW TEXT</span>
                  </motion.div>

                  <div className="flex justify-center text-cyan-500/70 text-xs">↓</div>

                  {/* Step 2: Signal Extraction */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>DETECT: Guaranteed Return (30%)</span>
                    </div>
                    <span className="text-amber-400 text-[10px] font-bold">SIGNAL</span>
                  </motion.div>

                  <div className="flex justify-center text-cyan-500/70 text-xs">↓</div>

                  {/* Step 3: Entity Verification */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-blue-200"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-400" />
                      <span>VERIFY: SEBI Database Match</span>
                    </div>
                    <span className="text-rose-400 text-[10px] font-bold">UNVERIFIED</span>
                  </motion.div>

                  <div className="flex justify-center text-cyan-500/70 text-xs">↓</div>

                  {/* Step 4: Protection Action */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 flex items-center justify-between text-rose-200"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      <span className="font-bold">PROTECT: Stop Transfer & Preserve</span>
                    </div>
                    <span className="text-rose-400 text-[10px] font-bold">ACTION</span>
                  </motion.div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/70 text-[11px] text-slate-400 text-center font-sans">
                  Deterministic Rules + NLP Heuristics + Safe URL Analyzer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SCAN CARDS (Section 11) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t('quickScan.heading', 'What do you want to check?')}
          </h2>
          <p className="text-sm text-slate-500">
            Choose what you received. We extract evidence and provide an actionable safety report.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Message */}
          <Link
            to="/scan/text"
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-cyan-500/60 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                {t('quickScan.messageTitle', 'Suspicious Message')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'quickScan.messageDesc',
                  'Paste a WhatsApp, Telegram, SMS or DM investment offer'
                )}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
              <span>{t('quickScan.messageBtn', 'Scan Message')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Screenshot */}
          <Link
            to="/scan/image"
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-cyan-500/60 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {t('quickScan.screenshotTitle', 'App Screenshot')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'quickScan.screenshotDesc',
                  'Upload a WhatsApp, Telegram, Instagram or trading-app screenshot'
                )}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
              <span>{t('quickScan.screenshotBtn', 'Analyze Screenshot')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Link */}
          <Link
            to="/scan/url"
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-cyan-500/60 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                {t('quickScan.urlTitle', 'Suspicious Link')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('quickScan.urlDesc', 'Check an investment website, trading portal, or APK download URL')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
              <span>{t('quickScan.urlBtn', 'Check Link')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Voice Call & Transcript */}
          <Link
            to="/scan/call"
            className="group relative bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-purple-500/60 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Live Mic & Audio
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                {t('quickScan.voiceTitle', 'Voice Call & Transcript')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'quickScan.voiceDesc',
                  'Analyze suspicious phone calls, digital arrest threats, or voice recordings via live speech or script'
                )}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-700">
              <span>{t('quickScan.voiceBtn', 'Scan Voice / Call')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Section 67) */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('howItWorks.title', 'Evidence-First Verification Pipeline')}
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              {t(
                'howItWorks.subtitle',
                'We do not just tell users something looks risky. We show them exactly why.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                num: '01',
                step: 'Scan',
                desc: 'Paste a message, upload a screenshot, or submit a URL safely.',
                icon: Search,
              },
              {
                num: '02',
                step: 'Detect',
                desc: 'The system extracts evidence and warning signals deterministically.',
                icon: AlertTriangle,
              },
              {
                num: '03',
                step: 'Explain',
                desc: 'See exactly what triggered each warning and why it matters to you.',
                icon: Eye,
              },
              {
                num: '04',
                step: 'Verify',
                desc: 'Check relevant entities and claims using official public sources.',
                icon: FileCheck,
              },
              {
                num: '05',
                step: 'Protect',
                desc: 'Follow an interactive, step-by-step safety action checklist.',
                icon: ShieldCheck,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-600">
                      STEP {st.num}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{st.step}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LIVE DEMO SCENARIOS PREVIEW (Section 31-35) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Hackathon Jury Demo Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              One-Click Test Scenarios
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Test real scam archetypes instantly with zero setup time.
            </p>
          </div>

          <Link
            to="/demo"
            className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1"
          >
            <span>Open All 5 Demo Scenarios</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_SCENARIOS.slice(0, 3).map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    {scenario.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                    CRITICAL
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{scenario.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{scenario.description}</p>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 line-clamp-2">
                  "{scenario.sampleData}"
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleLaunchQuickDemo(scenario.id)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Test this Scenario</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EVIDENCE-FIRST HIGHLIGHT SHOWCASE (Section 20 & 52) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                CORE DIFFERENTIATOR
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                No Blind Black-Box AI. Complete Evidence Traceability.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Generic chatbots often hallucinate safety or generate bland advice. Sangyan Shield anchors every assessment to verifiable strings, explicit regulatory mandates, and structured risk rules.
              </p>
              <div className="pt-2 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Exact detected phrase quoted alongside risk rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Explains WHY the regulatory or security danger exists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Direct links to official SEBI recognized lists</span>
                </div>
              </div>
            </div>

            {/* Simulated Result Card Visual */}
            <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl border border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-mono text-rose-400 font-bold">
                  HIGH CONCERN DETECTED
                </span>
                <span className="text-xs text-slate-400">Scan ID: #DEMO-SEBI-30</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-700/80 font-mono text-xs">
                <span className="text-slate-400">Original Text: </span>
                <span className="text-amber-300">
                  "Guaranteed 30% monthly return! Send OTP to activate your account."
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                  <span className="font-bold text-amber-400 block mb-1">
                    ⚠ GUARANTEED_RETURN
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    SEBI prohibits promises of fixed returns in securities. High probability of Ponzi dynamics.
                  </p>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                  <span className="font-bold text-rose-400 block mb-1">
                    🚨 OTP_REQUEST (CRITICAL)
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Legitimate advisers never request OTPs. Verbal or chat sharing leads to immediate account compromise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMMON SCAM TYPES (Section 26) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('learn.title', 'Learn to Spot Scams')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore 8 recognized investment fraud archetypes with interactive safety quizzes.
            </p>
          </div>
          <Link
            to="/learn"
            className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1"
          >
            <span>Explore Educational Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {EDUCATIONAL_SCAMS.slice(0, 4).map((scam) => (
            <Link
              key={scam.slug}
              to={`/learn/${scam.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-cyan-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {scam.riskSeverity} RISK
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{scam.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {scam.shortDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
                <span>View Warning Signs</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA (Section 68) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-8 sm:p-12 text-center text-white border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Think something feels wrong?
          </h2>
          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Check it before you act. Scan any unsolicited message, trading screenshot, or APK link in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/scan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow transition-all hover:scale-105 active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 text-slate-950" />
              <span>Scan Something Suspicious</span>
            </Link>
            <Link
              to="/learn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <span>Learn to Spot Scams</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
