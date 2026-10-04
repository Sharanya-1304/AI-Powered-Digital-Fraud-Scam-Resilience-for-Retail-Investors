import React from 'react';
import { Eye, Keyboard, Sparkles, Shield } from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold">
          <Eye className="w-3.5 h-3.5 text-cyan-600" />
          <span>Universal Design & Inclusivity</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Accessibility Commitments (WCAG 2.1 AA)
        </h1>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Designed so that every investor—regardless of visual, cognitive, or physical abilities—can inspect threats safely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <Eye className="w-5 h-5 text-cyan-600" />
          <h3 className="font-bold text-slate-900 text-base">Color-Independent Indicators</h3>
          <p className="text-slate-600 leading-relaxed">
            We never communicate risk solely through color. Every risk band pairs color with explicit text labels, distinct iconography (Check, Alert, Triangle, Octagon), and clear textual severity definitions for color-blind users.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <Keyboard className="w-5 h-5 text-cyan-600" />
          <h3 className="font-bold text-slate-900 text-base">Full Keyboard Navigation</h3>
          <p className="text-slate-600 leading-relaxed">
            All interactive elements—including scanner inputs, interactive checklist toggles, language switchers, and scenario buttons—support standard Tab, Shift+Tab, and Enter keyboard focus.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-cyan-600" />
          <h3 className="font-bold text-slate-900 text-base">Respect for Reduced Motion</h3>
          <p className="text-slate-600 leading-relaxed">
            Animations and progress transitions observe user system preferences (<code>prefers-reduced-motion</code>), suppressing decorative scaling or pulsing when requested.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
          <Shield className="w-5 h-5 text-cyan-600" />
          <h3 className="font-bold text-slate-900 text-base">Multilingual Accessibility</h3>
          <p className="text-slate-600 leading-relaxed">
            Full native translation in English, Hindi (हिन्दी), and Telugu (తెలుగు) ensures that non-English speaking first-time investors can navigate safety assessments without linguistic barriers.
          </p>
        </div>
      </div>
    </div>
  );
};
