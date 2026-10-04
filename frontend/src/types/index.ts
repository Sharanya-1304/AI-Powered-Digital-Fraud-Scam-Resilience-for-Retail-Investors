export type RiskBand =
  | 'LOW_CONCERN'
  | 'NEEDS_VERIFICATION'
  | 'HIGH_CONCERN'
  | 'CRITICAL_SAFETY_WARNING';

export type SignalSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SignalType =
  | 'GUARANTEED_RETURN'
  | 'URGENCY'
  | 'OTP_REQUEST'
  | 'PAYMENT_REQUEST'
  | 'PASSWORD_REQUEST'
  | 'PIN_REQUEST'
  | 'IMPERSONATION'
  | 'FAKE_REGISTRATION'
  | 'FAKE_APP'
  | 'UNKNOWN_APP'
  | 'SUSPICIOUS_URL'
  | 'REFERRAL_PRESSURE'
  | 'WITHDRAWAL_FEE'
  | 'SOCIAL_PROOF'
  | 'EMOTIONAL_PRESSURE'
  | 'INVESTMENT_SOLICITATION'
  | 'REGULATORY_IMPERSONATION';

export interface Signal {
  id: string;
  type: SignalType;
  title: string;
  severity: SignalSeverity;
  evidence: string;
  whyItMatters: string;
  actionRecommendation?: string;
  start?: number;
  end?: number;
  confidence?: number;
  location?: {
    page?: number;
    boundingBox?: [number, number, number, number];
    lineNumber?: number;
  };
}

export type VerificationStatus =
  | 'VERIFIED_MATCH'
  | 'NO_MATCH_FOUND'
  | 'AMBIGUOUS'
  | 'UNAVAILABLE'
  | 'DEMO_SIMULATION';

export interface EntityVerification {
  entityName: string;
  claimedRegistration?: string;
  entityType?: 'Broker' | 'Investment Adviser' | 'Research Analyst' | 'Portfolio Manager' | 'Mutual Fund' | 'Unknown';
  status: VerificationStatus;
  source: string;
  sourceUrl?: string;
  details: string;
  isMockData: boolean;
  matchedRecord?: {
    legalName: string;
    sebiRegNo: string;
    validity: string;
    officialDomain: string;
  };
}

export interface UrlFinding {
  url: string;
  isHttps: boolean;
  domain: string;
  registrableDomain: string;
  hasIpAddress: boolean;
  isPunycode: boolean;
  isShortener: boolean;
  hasRegulatorKeywords: boolean;
  hasApkOrDownload: boolean;
  hasPaymentOrLoginKeywords: boolean;
  brandMismatch: boolean;
  riskFlags: string[];
}

export interface SafeAction {
  step: number;
  title: string;
  description: string;
  isUrgent?: boolean;
}

export interface MLFeatureContribution {
  feature: string;
  category: string;
  weight: number;
}

export interface MLAnalysis {
  scamProbability: number;
  predictedLabel: string;
  confidenceLevel: string;
  modelArchitecture: string;
  topContributingFeatures: MLFeatureContribution[];
  linguisticSummary?: Record<string, any>;
  uncertainty?: number;
  classProbabilities?: Record<string, number>;
  modelVersion?: string;
  calibrationStatus?: string;
}

export interface ScanResult {
  id: string;
  inputType: 'text' | 'image' | 'url' | 'voice';
  timestamp: string;
  originalInput: string;
  extractedText?: string;
  language: string;
  riskBand: RiskBand;
  riskScore: number;
  confidenceLabel: 'Indicative' | 'High Confidence' | 'Needs Corroboration' | string;
  summaryExplanation: string;
  signals: Signal[];
  entities: EntityVerification[];
  urlAnalysis?: UrlFinding;
  mlAnalysis?: MLAnalysis;
  safeActions: SafeAction[];
  isDemo?: boolean;
  imageUrl?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  inputType: 'text' | 'image' | 'url';
  sampleData: string;
  expectedRiskBand: RiskBand;
  keySignals: SignalType[];
}

export interface EducationalScamType {
  slug: string;
  title: string;
  shortDesc: string;
  riskSeverity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  commonChannels: string[];
  whatItLooksLike: string[];
  whyItIsRisky: string[];
  whatToCheck: string[];
  whatNotToDo: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface MLModelMetrics {
  model_architecture: string;
  pipeline_version: string;
  training_timestamp: string;
  random_state: number;
  dataset_split: {
    total_samples: number;
    train_samples: number;
    test_samples: number;
    scam_ratio: number;
  };
  cross_validation_f1: Record<string, { mean_f1: number; std_f1: number }>;
  test_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    confusion_matrix: {
      true_negative: number;
      false_positive: number;
      false_negative: number;
      true_positive: number;
    };
  };
  explainability: {
    top_scam_indicators: Array<{ feature: string; weight: number }>;
    top_benign_indicators: Array<{ feature: string; weight: number }>;
  };
}
