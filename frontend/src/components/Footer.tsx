import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldLogo } from './ShieldLogo';
import { PhoneCall, ExternalLink, Lock, EyeOff } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Emergency & Trust Alert */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">
                National Cyber Crime Helpline: <span className="text-amber-400 text-base font-bold tracking-wide">1930</span>
              </div>
              <div className="text-xs text-slate-400">
                If you have transferred funds or shared financial credentials under duress, lodge an immediate report at{' '}
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  cybercrime.gov.in <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700 text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ephemeral Processing • Zero Credential Storage</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-sm">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <ShieldLogo size="md" />
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mt-2">
              SANGYAN SHIELD is an investor safety and scam resilience assistant developed for SANGYAN Hackathon 2026 (Track A) in collaboration with SEBI and NSDL. Designed to scan, explain, verify, and protect investors before financial harm occurs.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-cyan-400">
              <EyeOff className="w-4 h-4" />
              <span>We never ask for OTPs, PINs, passwords, or brokerage logins.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Scanner Tools</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link to="/scan/text" className="hover:text-cyan-400 transition-colors">Scan Message / Offer</Link></li>
              <li><Link to="/scan/image" className="hover:text-cyan-400 transition-colors">Analyze Screenshot OCR</Link></li>
              <li><Link to="/scan/url" className="hover:text-cyan-400 transition-colors">Check Suspicious Link</Link></li>
              <li><Link to="/verify" className="hover:text-cyan-400 transition-colors">Verify SEBI Intermediary</Link></li>
              <li><Link to="/demo" className="hover:text-cyan-400 transition-colors">Jury Demo Center</Link></li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Safety & Standards</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link to="/learn" className="hover:text-cyan-400 transition-colors">Spot Scam Patterns</Link></li>
              <li><Link to="/safety" className="hover:text-cyan-400 transition-colors">Safety Action Plan</Link></li>
              <li><Link to="/security" className="hover:text-cyan-400 transition-colors">SSRF & Privacy Controls</Link></li>
              <li><Link to="/accessibility" className="hover:text-cyan-400 transition-colors">Accessibility Standards</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About SANGYAN Shield</Link></li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="leading-relaxed text-center md:text-left">
            <strong className="text-slate-400">Important Disclaimer:</strong> Sangyan Shield is a digital safety and verification assistant. It is strictly NOT an investment adviser, does not offer stock recommendations or price forecasts, and cannot recover stolen funds. All risk assessments are indicative heuristics for investor safety.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/security" className="hover:text-slate-400 transition-colors">Security</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-400 transition-colors">Track A Team</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
