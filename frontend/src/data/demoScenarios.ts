import { DemoScenario } from '../types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-1-guaranteed-returns',
    title: 'Guaranteed 30% Return + OTP Request',
    category: 'High-Yield Investment Fraud',
    description: 'Classic compound scam combining false SEBI claims, guaranteed returns, urgency, and OTP harvesting.',
    inputType: 'text',
    sampleData: 'SEBI approved investment opportunity! Guaranteed 30% monthly return with zero risk. Pay ₹5,000 today to secure your institutional slot. Send OTP received on your phone to activate your trading account.',
    expectedRiskBand: 'CRITICAL_SAFETY_WARNING',
    keySignals: ['GUARANTEED_RETURN', 'REGULATORY_IMPERSONATION', 'URGENCY', 'PAYMENT_REQUEST', 'OTP_REQUEST'],
  },
  {
    id: 'demo-2-otp-phishing',
    title: 'Direct OTP Phishing Trap',
    category: 'Credential Theft',
    description: 'Impersonating broker customer care to solicit time-sensitive one-time passwords.',
    inputType: 'text',
    sampleData: 'Dear customer, your demat KYC update is pending. Send the 6-digit OTP received on your phone immediately to avoid account suspension and penalty.',
    expectedRiskBand: 'CRITICAL_SAFETY_WARNING',
    keySignals: ['OTP_REQUEST', 'URGENCY', 'IMPERSONATION'],
  },
  {
    id: 'demo-3-fake-apk',
    title: 'Sideloaded Trading APK Solicitation',
    category: 'Malicious App Distribution',
    description: 'Bypassing official app stores by distributing unverified Android APK packages via messaging groups.',
    inputType: 'text',
    sampleData: 'Install this exclusive VIP-Trade-Alpha.apk from this link to access our 99% accurate automated institutional trading bot and arbitrage signals.',
    expectedRiskBand: 'HIGH_CONCERN',
    keySignals: ['UNKNOWN_APP', 'FAKE_APP', 'INVESTMENT_SOLICITATION'],
  },
  {
    id: 'demo-4-suspicious-url',
    title: 'Spoofed Regulator Domain',
    category: 'Domain & Brand Spoofing',
    description: 'A look-alike website attempting to mislead users into believing it is an official SEBI or NSE investment portal.',
    inputType: 'url',
    sampleData: 'https://secure-sebi-quickinvest.vip-trade.net/login?claim=rewards',
    expectedRiskBand: 'HIGH_CONCERN',
    keySignals: ['SUSPICIOUS_URL', 'REGULATORY_IMPERSONATION'],
  },
  {
    id: 'demo-5-withdrawal-fee',
    title: 'Withdrawal Clearance Fee Scam',
    category: 'Advance Fee Fraud',
    description: 'Demanding upfront tax or clearance deposits to release fake "frozen" profits.',
    inputType: 'text',
    sampleData: 'Congratulations! Your investment account has accumulated ₹4,20,000 profits. To withdraw your funds, deposit 10% (₹42,000) regulatory clearance tax to our nodal officer UPI ID within 24 hours.',
    expectedRiskBand: 'CRITICAL_SAFETY_WARNING',
    keySignals: ['WITHDRAWAL_FEE', 'PAYMENT_REQUEST', 'URGENCY', 'REGULATORY_IMPERSONATION'],
  }
];
