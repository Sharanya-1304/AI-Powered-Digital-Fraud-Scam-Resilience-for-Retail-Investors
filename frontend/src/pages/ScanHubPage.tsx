import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image as ImageIcon, Link as LinkIcon, Mic, ArrowRight, ShieldCheck } from 'lucide-react';
import { PrivacyNotice } from '../components/PrivacyNotice';

export const ScanHubPage: React.FC = () => {
  const scanOptions = [
    {
      to: '/scan/text',
      title: 'Message or Offer',
      subtitle: 'WhatsApp, Telegram, SMS, or social media DMs',
      desc: 'Paste the exact text of any unsolicited investment proposal, stock tipping group message, or VIP quota invitation.',
      icon: FileText,
      color: 'bg-cyan-50 border-cyan-200 text-cyan-600',
      btnText: 'Scan Message',
    },
    {
      to: '/scan/image',
      title: 'Screenshot or Chat Capture',
      subtitle: 'Chat logs, trading app screenshots, bank transfer slips',
      desc: 'Upload an image of an investment chat or profit screenshot. Our OCR engine extracts text and highlights red flags.',
      icon: ImageIcon,
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      btnText: 'Upload Screenshot',
    },
    {
      to: '/scan/url',
      title: 'Suspicious Website or Link',
      subtitle: 'Trading portals, broker clones, APK download links',
      desc: 'Inspect web links for lookalike domains, punycode spoofing, unverified regulator terms, and malicious download payloads.',
      icon: LinkIcon,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      btnText: 'Check Link',
    },
    {
      to: '/scan/call',
      title: 'Call Transcript & Voice Script',
      subtitle: 'Cold caller scripts, live speech, voice note transcripts',
      desc: 'Evaluate high-pressure cold calls from self-proclaimed advisers, digital arrest threats, or urgent KYC demands using live mic speech or transcript.',
      icon: Mic,
      color: 'bg-purple-50 border-purple-200 text-purple-600',
      btnText: 'Analyze Voice Call',
      badge: 'Live Mic + Audio',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 text-cyan-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>Multi-Format Scam Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What looks suspicious?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-normal">
          Choose what you received. We evaluate evidence, explain detected warning signals, and provide an actionable safety plan.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scanOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <Link
              key={opt.to + opt.title}
              to={opt.to}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-cyan-500/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${opt.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {opt.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {opt.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {opt.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {opt.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {opt.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:text-cyan-700">
                <span>{opt.btnText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Privacy Notice Component */}
      <PrivacyNotice />
    </div>
  );
};
