import { create } from 'zustand';
import { ScanResult } from '../types';

interface AppState {
  currentScan: ScanResult | null;
  scanHistory: ScanResult[];
  language: string;
  isAnalyzing: boolean;
  analysisStep: number;
  lowBandwidthMode: boolean;
  setCurrentScan: (scan: ScanResult | null) => void;
  addScanToHistory: (scan: ScanResult) => void;
  setLanguage: (lang: string) => void;
  setAnalyzing: (isAnalyzing: boolean, step?: number) => void;
  setAnalysisStep: (step: number) => void;
  toggleLowBandwidth: () => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentScan: null,
  scanHistory: [
    {
      id: 'demo-initial-1',
      inputType: 'text',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      originalInput: 'Guaranteed 30% monthly return with SEBI approved institutional slots. Transfer ₹5,000 today to VIP account.',
      language: 'en',
      riskBand: 'CRITICAL_SAFETY_WARNING',
      riskScore: 88,
      confidenceLabel: 'High Confidence',
      summaryExplanation: 'Multiple critical warning signals: guaranteed return promise, urgency, and regulatory impersonation.',
      signals: [
        {
          id: 'sig-demo-1',
          type: 'GUARANTEED_RETURN',
          title: 'Guaranteed Return Promise',
          severity: 'HIGH',
          evidence: 'Guaranteed 30% monthly return',
          whyItMatters: 'Guaranteed return claims in market securities are prohibited by SEBI and are a primary indicator of Ponzi fraud.'
        },
        {
          id: 'sig-demo-2',
          type: 'REGULATORY_IMPERSONATION',
          title: 'Unverified SEBI Endorsement',
          severity: 'HIGH',
          evidence: 'SEBI approved institutional slots',
          whyItMatters: 'Regulators oversee markets; they do not approve or endorse individual trading slots or private pools.'
        }
      ],
      entities: [],
      mlAnalysis: {
        scamProbability: 0.988,
        predictedLabel: 'SCAM_SOLICITATION',
        confidenceLevel: 'High Confidence',
        modelArchitecture: 'CalibratedLogisticRegression + TF-IDF Domain Hybrid',
        topContributingFeatures: [
          { feature: 'guarantee_intensity', category: 'domain heuristic', weight: 1.85 },
          { feature: 'credential_intensity', category: 'domain heuristic', weight: 2.40 },
          { feature: 'urgency_intensity', category: 'domain heuristic', weight: 1.10 }
        ]
      },
      safeActions: [
        {
          step: 1,
          title: 'Do not transfer money',
          description: 'Immediately stop any deposit or fund transfer to personal handles or unverified entities.'
        }
      ]
    }
  ],
  language: localStorage.getItem('sangyan_language') || 'en',
  isAnalyzing: false,
  analysisStep: 1,
  lowBandwidthMode: false,
  setCurrentScan: (scan) => set({ currentScan: scan }),
  addScanToHistory: (scan) =>
    set((state) => ({
      scanHistory: [scan, ...state.scanHistory.filter((s) => s.id !== scan.id)].slice(0, 20),
    })),
  setLanguage: (lang) => {
    localStorage.setItem('sangyan_language', lang);
    set({ language: lang });
  },
  setAnalyzing: (isAnalyzing, step = 1) => set({ isAnalyzing, analysisStep: step }),
  setAnalysisStep: (step) => set({ analysisStep: step }),
  toggleLowBandwidth: () => set((state) => ({ lowBandwidthMode: !state.lowBandwidthMode })),
  clearHistory: () => set({ scanHistory: [] }),
}));
