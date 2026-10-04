import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldLogo } from './ShieldLogo';
import { LanguageSelector } from './LanguageSelector';
import { ShieldAlert, Menu, X, ArrowRight, Zap, CheckCircle2, BookOpen, BarChart3, AlertOctagon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/scan', label: t('nav.scan', 'Scan'), icon: ShieldAlert },
    { to: '/verify', label: t('nav.verify', 'Verify'), icon: CheckCircle2 },
    { to: '/learn', label: t('nav.learn', 'Learn'), icon: BookOpen },
    { to: '/safety', label: t('nav.safety', 'Safety Plan'), icon: AlertOctagon },
    { to: '/demo', label: t('nav.demo', 'Demo Center'), icon: Zap },
    { to: '/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/scan' && location.pathname.startsWith('/scan')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group focus:outline-none">
          <ShieldLogo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-cyan-700 bg-cyan-50/90 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Language Selector + Scan CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSelector />
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all hover:shadow hover:gap-2.5 active:scale-95"
          >
            <span>{t('nav.scanNow', 'Scan Now')}</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSelector className="scale-90" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active ? 'bg-cyan-50 text-cyan-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-600" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm shadow"
            >
              <span>{t('nav.scanNow', 'Scan Now')}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
