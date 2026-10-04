import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ScanHubPage } from './pages/ScanHubPage';
import { TextScannerPage } from './pages/TextScannerPage';
import { ImageScannerPage } from './pages/ImageScannerPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
import { CallTranscriptScannerPage } from './pages/CallTranscriptScannerPage';
import { ResultPage } from './pages/ResultPage';
import { VerifyPage } from './pages/VerifyPage';
import { LearnPage } from './pages/LearnPage';
import { LearnDetailPage } from './pages/LearnDetailPage';
import { SafetyPage } from './pages/SafetyPage';
import { DemoCenterPage } from './pages/DemoCenterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SecurityPage } from './pages/SecurityPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import DemoOne from './components/ui/demo';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanHubPage />} />
            <Route path="/scan/text" element={<TextScannerPage />} />
            <Route path="/scan/image" element={<ImageScannerPage />} />
            <Route path="/scan/url" element={<UrlScannerPage />} />
            <Route path="/scan/call" element={<CallTranscriptScannerPage />} />
            <Route path="/scan/transcript" element={<CallTranscriptScannerPage />} />
            <Route path="/results/:id" element={<ResultPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:slug" element={<LearnDetailPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/demo" element={<DemoCenterPage />} />
            <Route path="/demo/prisma" element={<DemoOne />} />
            <Route path="/prisma" element={<DemoOne />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
