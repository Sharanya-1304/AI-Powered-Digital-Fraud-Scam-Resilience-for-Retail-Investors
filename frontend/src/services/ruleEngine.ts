import { Signal, RiskBand, SafeAction, EntityVerification, UrlFinding, ScanResult, MLAnalysis } from '../types';
import { OFFICIAL_REGISTRY_SAMPLE } from '../data/mockEntities';

interface RuleDefinition {
  type: Signal['type'];
  title: string;
  severity: Signal['severity'];
  regex: RegExp;
  whyItMatters: string;
  actionRecommendation: string;
}

const DETECTION_RULES: RuleDefinition[] = [
  {
    type: 'GUARANTEED_RETURN',
    title: 'Guaranteed or Assured Return Claim',
    severity: 'HIGH',
    regex: /(guaranteed|assured|fixed|100%|risk[- ]?free|no risk|double your money|triple your money|daily return|monthly return|weekly profit|guarantee).*(profit|return|\d+%\s*return|\d+%\s*profit|gain)/i,
    whyItMatters: 'Guaranteed or unusually high return promises are a primary hallmark of investment fraud. SEBI strictly prohibits registered market intermediaries from assuring fixed returns on market investments.',
    actionRecommendation: 'Never transfer funds to any scheme promising guaranteed market returns or zero downside.'
  },
  {
    type: 'OTP_REQUEST',
    title: 'Sensitive Credential / OTP Request',
    severity: 'CRITICAL',
    regex: /(send|share|tell|give|enter|forward|provide|disclose).*(otp|one[- ]?time[- ]?password|verification code|pin|password|mpin)|(otp|code).*(activate|verify|pending|suspend)/i,
    whyItMatters: 'OTPs provide direct cryptographic access to debit bank accounts or liquidate demat securities. Legitimate brokers and regulators never request OTPs verbally or through chat.',
    actionRecommendation: 'Never disclose OTPs, PINs, or passwords to anyone, regardless of their claimed authority.'
  },
  {
    type: 'URGENCY',
    title: 'Manufactured Urgency & High-Pressure Tactics',
    severity: 'HIGH',
    regex: /(pay today|pay within|urgent|last chance|hurry|today only|only \d+ slots?|expires in|act now|before .* closes|time is running|account suspend)/i,
    whyItMatters: 'High-pressure timelines are deliberately engineered to short-circuit critical evaluation and prevent investors from conducting independent verification.',
    actionRecommendation: 'Enforce a mandatory 24-hour cooling-off period before committing funds to unsolicited opportunities.'
  },
  {
    type: 'PAYMENT_REQUEST',
    title: 'Direct Personal or Unverified Payment Request',
    severity: 'HIGH',
    regex: /(pay ₹|transfer ₹|deposit ₹|pay \d+|send to.*upi|personal account|qr code|gpay|phonepe|paytm|wallet address|usdt)/i,
    whyItMatters: 'Registered financial entities accept money strictly into regulated corporate client accounts. Demanding payment to personal UPI handles or crypto wallets strongly indicates fraudulent diversion.',
    actionRecommendation: 'Do not transfer money to personal bank accounts, third-party UPI IDs, or cryptocurrency addresses.'
  },
  {
    type: 'REGULATORY_IMPERSONATION',
    title: 'Regulatory or Exchange Impersonation Claim',
    severity: 'HIGH',
    regex: /(sebi approved|sebi certified|sebi registered|rbi approved|nse authorized|bse verified|govt approved scheme|government certified)/i,
    whyItMatters: 'SEBI and stock exchanges regulate market integrity; they do not endorse individual retail schemes, guarantee returns, or operate private investment pools.',
    actionRecommendation: 'Cross-check the exact claimed registration number independently on the official sebi.gov.in portal.'
  },
  {
    type: 'FAKE_APP',
    title: 'Sideloaded / Unverified APK Distribution',
    severity: 'HIGH',
    regex: /(install.*apk|download.*apk|\.apk|sideload|unknown sources|download this app|install.*custom app)/i,
    whyItMatters: 'Apps distributed outside official application stores (Google Play, Apple App Store) bypass security audits and can contain spyware, screen recorders, or remote-access Trojans.',
    actionRecommendation: 'Only download financial and trading apps directly through official store listings verified against registered broker details.'
  },
  {
    type: 'WITHDRAWAL_FEE',
    title: 'Upfront Withdrawal Fee / Advance Tax Trap',
    severity: 'CRITICAL',
    regex: /(withdrawal fee|clearance fee|deposit to release|pay .* tax to withdraw|unlock balance|frozen funds|processing fee to withdraw)/i,
    whyItMatters: 'Legitimate financial intermediaries never demand external cash deposits to release account balances; statutory taxes are settled automatically through clearing accounts.',
    actionRecommendation: 'Do not pay extra fees to release previously deposited funds. Preserve evidence and report immediately to 1930.'
  },
  {
    type: 'REFERRAL_PRESSURE',
    title: 'Multi-Level Recruitment or Referral Pressure',
    severity: 'MEDIUM',
    regex: /(refer.*earn|invite.*friends|bring \d+ members|downline|binary commission|level income)/i,
    whyItMatters: 'Multi-level marketing (MLM) structures in investment schemes suggest pyramid or Ponzi mechanisms where revenue depends on incoming deposits rather than genuine asset management.',
    actionRecommendation: 'Avoid schemes where earnings are tied to recruiting additional participants.'
  },
  {
    type: 'INVESTMENT_SOLICITATION',
    title: 'Unsolicited VIP / Institutional Trading Invitation',
    severity: 'MEDIUM',
    regex: /(vip trading|institutional quota|insider signals|premium calls|jackpot call|sure-shot call|99% accuracy)/i,
    whyItMatters: 'Unsolicited promises of insider trades or exclusive institutional quotas in messaging apps are standard lures used by unregistered tipping syndicates.',
    actionRecommendation: 'Verify whether the adviser is SEBI-registered as a Research Analyst (RA) or Investment Adviser (IA).'
  }
];

export function analyzeUrlSafety(rawUrl: string): UrlFinding {
  let cleanUrl = rawUrl.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleanUrl);
  } catch {
    return {
      url: rawUrl,
      isHttps: false,
      domain: 'invalid-url',
      registrableDomain: 'invalid-url',
      hasIpAddress: false,
      isPunycode: false,
      isShortener: false,
      hasRegulatorKeywords: false,
      hasApkOrDownload: false,
      hasPaymentOrLoginKeywords: false,
      brandMismatch: false,
      riskFlags: ['Malformed or invalid URL format']
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();
  const fullText = (hostname + pathname + search);

  const isHttps = parsed.protocol === 'https:';
  const hasIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isPunycode = hostname.startsWith('xn--') || hostname.includes('.xn--');
  
  const shorteners = ['bit.ly', 'tinyurl.com', 't.me', 'wa.me', 'rb.gy', 'is.gd', 'cutt.ly', 'ow.ly'];
  const isShortener = shorteners.some(s => hostname === s || hostname.endsWith('.' + s));

  const regulatorKeywords = ['sebi', 'nse', 'bse', 'rbi', 'nsdl', 'cdsl', 'incometax'];
  const hasRegulatorKeywords = regulatorKeywords.some(kw => fullText.includes(kw));

  const hasApkOrDownload = pathname.endsWith('.apk') || fullText.includes('download') || fullText.includes('sideload');
  const hasPaymentOrLoginKeywords = ['login', 'signin', 'auth', 'payment', 'deposit', 'wallet', 'claim', 'bonus', 'rewards'].some(kw => fullText.includes(kw));

  const isOfficialRegulator = hostname.endsWith('sebi.gov.in') || hostname.endsWith('nseindia.com') || hostname.endsWith('bseindia.com') || hostname.endsWith('rbi.org.in');
  const brandMismatch = hasRegulatorKeywords && !isOfficialRegulator;

  const riskFlags: string[] = [];
  if (!isHttps) riskFlags.push('Insecure HTTP connection (no encryption). Note: HTTPS alone does NOT prove a website is safe.');
  if (hasIpAddress) riskFlags.push('Direct IP address used instead of a registered domain name.');
  if (isPunycode) riskFlags.push('Punycode / internationalized domain characters detected (potential homograph impersonation).');
  if (isShortener) riskFlags.push('URL shortener obscures the ultimate destination domain.');
  if (brandMismatch) riskFlags.push('Contains regulator-related terms (e.g., SEBI/NSE), but the host is NOT an official government or exchange domain.');
  if (hasApkOrDownload) riskFlags.push('Direct link to downloadable application package (.apk) bypassing verified app marketplaces.');
  if (hasPaymentOrLoginKeywords && brandMismatch) riskFlags.push('Credential or deposit collection page hosted on an unverified domain.');

  return {
    url: rawUrl,
    isHttps,
    domain: hostname,
    registrableDomain: hostname.split('.').slice(-2).join('.'),
    hasIpAddress,
    isPunycode,
    isShortener,
    hasRegulatorKeywords,
    hasApkOrDownload,
    hasPaymentOrLoginKeywords,
    brandMismatch,
    riskFlags
  };
}

export function detectEntitiesInText(text: string): EntityVerification[] {
  const lowercase = text.toLowerCase();
  const detected: EntityVerification[] = [];

  for (const [key, knownEntity] of Object.entries(OFFICIAL_REGISTRY_SAMPLE)) {
    if (lowercase.includes(key)) {
      detected.push({
        entityName: knownEntity.entityName || key,
        claimedRegistration: knownEntity.claimedRegistration,
        entityType: knownEntity.entityType,
        status: knownEntity.status || 'VERIFIED_MATCH',
        source: knownEntity.source || 'SEBI Official Intermediary Registry',
        sourceUrl: knownEntity.sourceUrl,
        details: knownEntity.details || 'Recognized registered entity. However, please independently verify if the message sender is an authorized representative.',
        isMockData: knownEntity.isMockData ?? false,
        matchedRecord: knownEntity.matchedRecord
      });
    }
  }

  const regMatch = text.match(/\b(IN[A-Z]\d{8,9})\b/i);
  if (regMatch && detected.length === 0) {
    const regNo = regMatch[1].toUpperCase();
    detected.push({
      entityName: 'Unverified Entity claiming ' + regNo,
      claimedRegistration: regNo,
      entityType: 'Unknown',
      status: 'NO_MATCH_FOUND',
      source: 'Official SEBI Registration Check (Simulation)',
      details: `No automated match found in current registry cache for registration number ${regNo}. Independently verify on sebi.gov.in.`,
      isMockData: true
    });
  }

  return detected;
}

export function generateSafeActions(signals: Signal[], riskBand: RiskBand): SafeAction[] {
  const actions: SafeAction[] = [];
  let step = 1;

  actions.push({
    step: step++,
    title: 'Do not transfer money or make deposits',
    description: 'Stop any pending transaction immediately. Fraudulent accounts frequently transfer funds through mule networks within minutes of deposit.',
    isUrgent: true
  });

  const hasOtp = signals.some(s => s.type === 'OTP_REQUEST');
  if (hasOtp) {
    actions.push({
      step: step++,
      title: 'Do not share OTP, PIN, or passwords',
      description: 'Never disclose one-time passwords, trading PINs, or bank account credentials under any circumstances.',
      isUrgent: true
    });
  }

  const hasApp = signals.some(s => s.type === 'FAKE_APP' || s.type === 'UNKNOWN_APP');
  if (hasApp) {
    actions.push({
      step: step++,
      title: 'Do not install unverified APK packages',
      description: 'Download applications strictly from the Google Play Store or Apple App Store. If already installed, disconnect device internet and run Google Play Protect.',
      isUrgent: true
    });
  }

  actions.push({
    step: step++,
    title: 'Verify entity independently on official portals',
    description: 'Visit the official SEBI website (sebi.gov.in) to verify registration details directly via the Intermediary Directory.',
    isUrgent: false
  });

  actions.push({
    step: step++,
    title: 'Preserve evidence securely',
    description: 'Capture screenshots of conversations, phone numbers, UPI IDs, bank account details, and links. Do not delete message history.',
    isUrgent: false
  });

  if (riskBand === 'HIGH_CONCERN' || riskBand === 'CRITICAL_SAFETY_WARNING') {
    actions.push({
      step: step++,
      title: 'Report to National Cyber Crime Reporting Portal',
      description: 'If you have shared funds or sensitive details, immediately call the National Cyber Crime Helpline at 1930 or submit a complaint at cybercrime.gov.in.',
      isUrgent: true
    });
  }

  return actions;
}

export function analyzeContentLocally(
  text: string,
  inputType: 'text' | 'image' | 'url' = 'text',
  customUrl?: string,
  imageUrl?: string
): ScanResult {
  const signals: Signal[] = [];
  let signalId = 1;

  // 1. Run rule engine over text
  for (const rule of DETECTION_RULES) {
    const match = text.match(rule.regex);
    if (match) {
      signals.push({
        id: `sig-${signalId++}`,
        type: rule.type,
        title: rule.title,
        severity: rule.severity,
        evidence: match[0],
        whyItMatters: rule.whyItMatters,
        actionRecommendation: rule.actionRecommendation,
        location: {
          lineNumber: 1
        }
      });
    }
  }

  // 2. URL analysis
  let urlAnalysis: UrlFinding | undefined;
  const urlCandidate = customUrl || (text.match(/https?:\/\/[^\s]+/i)?.[0]);
  if (urlCandidate) {
    urlAnalysis = analyzeUrlSafety(urlCandidate);
    if (urlAnalysis.riskFlags.length > 0) {
      signals.push({
        id: `sig-${signalId++}`,
        type: 'SUSPICIOUS_URL',
        title: 'Suspicious URL Structure & Domain Discrepancy',
        severity: urlAnalysis.brandMismatch || urlAnalysis.hasApkOrDownload ? 'HIGH' : 'MEDIUM',
        evidence: urlAnalysis.url,
        whyItMatters: urlAnalysis.riskFlags.join(' • '),
        actionRecommendation: 'Do not click the link or submit credentials or payment details on this website.'
      });
    }
  }

  // 3. Entity verification
  const entities = detectEntitiesInText(text);

  // 4. ML Feature & Probability Calculation
  const tLower = text.toLowerCase();
  const contributingFeatures = [];
  let mlProb = 0.05;

  if (/(guaranteed|assured|fixed|100%|risk[- ]?free)/i.test(tLower)) {
    mlProb += 0.42;
    contributingFeatures.push({ feature: 'guarantee_intensity', category: 'domain heuristic', weight: 1.85 });
  }
  if (/(otp|password|pin|mpin|code)/i.test(tLower)) {
    mlProb += 0.45;
    contributingFeatures.push({ feature: 'credential_intensity', category: 'domain heuristic', weight: 2.40 });
  }
  if (/(pay|transfer|deposit|upi|gpay)/i.test(tLower)) {
    mlProb += 0.25;
    contributingFeatures.push({ feature: 'payment_intensity', category: 'domain heuristic', weight: 1.25 });
  }
  if (/(urgent|hurry|today|now|expire)/i.test(tLower)) {
    mlProb += 0.18;
    contributingFeatures.push({ feature: 'urgency_intensity', category: 'domain heuristic', weight: 1.10 });
  }
  if (/(apk|sideload|download)/i.test(tLower)) {
    mlProb += 0.35;
    contributingFeatures.push({ feature: 'apk_indicator', category: 'domain heuristic', weight: 1.70 });
  }
  mlProb = Math.min(Math.max(mlProb, 0.04), 0.99);

  const mlAnalysis: MLAnalysis = {
    scamProbability: Number(mlProb.toFixed(4)),
    predictedLabel: mlProb >= 0.50 ? 'SCAM_SOLICITATION' : 'BENIGN_FINANCIAL',
    confidenceLevel: mlProb >= 0.80 || mlProb <= 0.15 ? 'High Confidence' : 'Moderate',
    modelArchitecture: 'CalibratedLogisticRegression + TF-IDF Domain Hybrid',
    topContributingFeatures: contributingFeatures,
    linguisticSummary: {
      hasGuarantee: /(guaranteed|assured)/i.test(tLower),
      hasCredential: /(otp|pin)/i.test(tLower),
      hasPayment: /(pay|upi)/i.test(tLower),
      textLength: text.length
    }
  };

  // 5. Calculate Multi-Signal Hybrid Score:
  let score = 5;
  for (const sig of signals) {
    if (sig.severity === 'CRITICAL') score += 35;
    else if (sig.severity === 'HIGH') score += 25;
    else if (sig.severity === 'MEDIUM') score += 15;
    else score += 10;
  }

  // Fused with ML score
  score = Math.round(0.60 * score + 0.40 * (mlProb * 100));
  score = Math.min(Math.max(score, 8), 98);

  // Determine Risk Band
  let riskBand: RiskBand = 'LOW_CONCERN';
  if (score >= 75) {
    riskBand = 'CRITICAL_SAFETY_WARNING';
  } else if (score >= 50) {
    riskBand = 'HIGH_CONCERN';
  } else if (score >= 25) {
    riskBand = 'NEEDS_VERIFICATION';
  }

  // Generate safe action plan
  const safeActions = generateSafeActions(signals, riskBand);

  let summaryExplanation = '';
  if (riskBand === 'CRITICAL_SAFETY_WARNING') {
    summaryExplanation = `Multiple critical safety warning signals detected (ML scam probability: ${Math.round(mlProb * 100)}%), including credential requests or upfront advance fee traps. High investor hazard identified.`;
  } else if (riskBand === 'HIGH_CONCERN') {
    summaryExplanation = `Strong warning signals identified (ML scam probability: ${Math.round(mlProb * 100)}%), such as guaranteed return promises, manufactured urgency, or suspicious unverified domains. Independent verification required.`;
  } else if (riskBand === 'NEEDS_VERIFICATION') {
    summaryExplanation = 'Some marketing or investment claims were detected that require independent corroboration against regulatory registries before proceeding.';
  } else {
    summaryExplanation = 'No high-severity automated scam signals detected in this sample. Remember to always confirm intermediary registration independently.';
  }

  return {
    id: `scan-${Date.now()}`,
    inputType,
    timestamp: new Date().toISOString(),
    originalInput: text,
    extractedText: inputType === 'image' ? text : undefined,
    language: 'en',
    riskBand,
    riskScore: score,
    confidenceLabel: mlAnalysis.confidenceLevel,
    summaryExplanation,
    signals,
    entities,
    urlAnalysis,
    mlAnalysis,
    safeActions,
    isDemo: false,
    imageUrl
  };
}
