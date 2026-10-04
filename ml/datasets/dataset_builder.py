"""
SANGYAN SHIELD - Ground Truth Labeled Multilingual Dataset Builder
Creates curated, high-integrity financial communications dataset across English, Hindi, and Telugu.
Labels:
  - Task A (3-class): BENIGN, SUSPICIOUS, SCAM_LIKE
  - Task B (multi-label): Subset of 16 scam signals

Strict adherence to data provenance, quality checks, and leak prevention.
"""

import json
import os
import re
import hashlib
from typing import List, Dict, Any, Tuple
from ml.preprocessing.language import detect_language
from ml.preprocessing.normalizer import normalize_text

ALL_SIGNALS = [
    "GUARANTEED_RETURN",
    "URGENCY",
    "OTP_REQUEST",
    "PAYMENT_REQUEST",
    "IMPERSONATION",
    "FAKE_REGISTRATION",
    "FAKE_APP",
    "SUSPICIOUS_URL",
    "REFERRAL_PRESSURE",
    "WITHDRAWAL_FEE",
    "SOCIAL_PROOF",
    "EMOTIONAL_PRESSURE",
    "INVESTMENT_SOLICITATION",
    "PASSWORD_REQUEST",
    "PIN_REQUEST",
    "UNKNOWN_APP"
]

# Source definitions
# - OFFICIAL_ADVISORY: SEBI/RBI/CERT-In public warnings & caution circulars
# - CURATED_SCAM_PATTERNS: Documented Telegram/WhatsApp investment fraud templates
# - CURATED_BENIGN_FINANCIAL: Broker trade notes, depository statements, banking alerts
# - MULTILINGUAL_SYNTHETIC: Transliterated & native Hindi/Telugu variations of verified patterns

RAW_RECORDS: List[Dict[str, Any]] = [
    # =========================================================================
    # ENGLISH SAMPLES (SCAM_LIKE & SUSPICIOUS)
    # =========================================================================
    {
        "id": "en_scam_001",
        "template_group": "guaranteed_return_group",
        "text": "Guaranteed 30% monthly return with zero market risk. Invest ₹10,000 today and receive ₹3,000 every month directly in your account.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_002",
        "template_group": "guaranteed_return_group",
        "text": "Our VIP institutional fund guarantees 100% principal protection with fixed 25% weekly profit. Minimum deposit ₹5,000.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "PAYMENT_REQUEST", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_003",
        "template_group": "algorithmic_double_group",
        "text": "Double your capital in just 15 days! 100% sure-shot algorithmic returns with SEBI approved institutional trading slots.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "IMPERSONATION", "FAKE_REGISTRATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_004",
        "template_group": "forex_arbitrage_group",
        "text": "Earn assured 50% monthly profit trading forex and crypto. Zero loss guarantee backed by automated arbitrage bots. Join t.me/fastcrypto",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "SUSPICIOUS_URL", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_005",
        "template_group": "festival_plan_group",
        "text": "Special festival fixed return plan: Deposit ₹25,000 today and get ₹75,000 in 30 days guaranteed. Limited slots available.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "URGENCY", "PAYMENT_REQUEST"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_006",
        "template_group": "zero_risk_daily_group",
        "text": "Zero risk high yield investment opportunity! 5% daily returns guaranteed. Withdraw your profits anytime without lock-in.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_007",
        "template_group": "elite_investor_group",
        "text": "Guaranteed 20% return every month. Join our elite investor group and watch your savings multiply safely with no loss.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_008",
        "template_group": "intraday_options_group",
        "text": "Assured 40% profit on intraday options. 100% accurate tips provided by former fund managers. Money back guarantee.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "SOCIAL_PROOF"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_009",
        "template_group": "trading_pool_group",
        "text": "Deposit ₹50,000 in our institutional trading pool and receive fixed ₹15,000 every Friday without fail.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "PAYMENT_REQUEST"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_010",
        "template_group": "wealth_scheme_group",
        "text": "Risk-free wealth creation scheme approved by top analysts. Earn 300% return in 6 months guaranteed.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "SOCIAL_PROOF"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    # OTP & Sensitive Credential Harvesting (Safety-Critical)
    {
        "id": "en_scam_011",
        "template_group": "kyc_suspension_group",
        "text": "Dear client, your demat account KYC is pending suspension. Send the 6-digit OTP received on your phone immediately to verify.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY", "EMOTIONAL_PRESSURE"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_012",
        "template_group": "unauthorized_login_group",
        "text": "Security Alert: Unauthorized login detected on your trading app. Disclose the one-time password (OTP) to our executive to secure funds.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY", "IMPERSONATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_013",
        "template_group": "aadhaar_blocked_group",
        "text": "Your trading account is blocked due to unverified Aadhaar link. Share the OTP sent to your registered mobile to unblock.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_014",
        "template_group": "sebi_kyc_code_group",
        "text": "SEBI mandatory KYC update: Provide the 6-digit verification code sent via SMS to prevent permanent account freezing.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "IMPERSONATION", "URGENCY"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_015",
        "template_group": "mpin_dividend_group",
        "text": "Enter your trading MPIN and one-time password on this portal to claim your ₹5,000 annual dividend credit.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "PIN_REQUEST", "PASSWORD_REQUEST"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_016",
        "template_group": "demat_escrow_group",
        "text": "Your demat holdings are being transferred to escrow. Read out the verification code received on your phone to cancel unauthorized transfer.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY", "EMOTIONAL_PRESSURE"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_017",
        "template_group": "bank_officer_upi_group",
        "text": "Bank KYC verification officer: Please share the OTP received on SMS to reactivate your frozen UPI trading mandate.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "IMPERSONATION", "URGENCY"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_018",
        "template_group": "audit_password_group",
        "text": "Urgent: Demat account audit in progress. Provide your password and OTP to complete annual security clearance.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["PASSWORD_REQUEST", "OTP_REQUEST", "URGENCY"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_019",
        "template_group": "vip_broker_otp_group",
        "text": "To activate institutional VIP trading privileges, forward the OTP received from your broker to this chat.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "IMPERSONATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_020",
        "template_group": "payout_rtgs_group",
        "text": "Your trading profit payout of ₹84,000 is ready. Disclose the 6-digit confirmation code to authorize instant RTGS debit to your wallet.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "PAYMENT_REQUEST"],
        "source": "OFFICIAL_ADVISORY"
    },
    # Sideloaded APKs & Unknown Applications
    {
        "id": "en_scam_021",
        "template_group": "apk_alpha_group",
        "text": "Install this exclusive VIP-Trade-Alpha.apk from this link to access 99.8% accurate AI trading bot signals.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP", "GUARANTEED_RETURN"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_022",
        "template_group": "telegram_preipo_group",
        "text": "Download our custom institutional trading app APK from Telegram to trade pre-IPO shares with zero brokerage.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP", "INVESTMENT_SOLICITATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_023",
        "template_group": "nse_institutional_pro_group",
        "text": "Click this link to download the proprietary NSE Institutional Pro APK and bypass standard retail trade limits.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "IMPERSONATION", "UNKNOWN_APP"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_024",
        "template_group": "sideload_android_group",
        "text": "Sideload this trading application to your Android phone to execute automated high-frequency arbitrage trades.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_025",
        "template_group": "apextrade_apk_group",
        "text": "Download ApexTrade.apk to access secret institutional stock breakout alerts before market open.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_026",
        "template_group": "unreleased_beta_group",
        "text": "Install this unreleased beta trading app to get 10x leverage on all NSE index options without margin rules.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_027",
        "template_group": "secret_wealth_apk_group",
        "text": "Exclusive mobile app: Download this APK file directly from chat to participate in secret government wealth funds.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "IMPERSONATION", "UNKNOWN_APP"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_028",
        "template_group": "unknown_sources_group",
        "text": "Click here to download VIP-Trading-Terminal.apk. Enable 'Install from unknown sources' in settings to start earning.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP", "GUARANTEED_RETURN"],
        "source": "OFFICIAL_ADVISORY"
    },
    # Advance-Fee & Withdrawal Clearance Traps
    {
        "id": "en_scam_029",
        "template_group": "tax_clearance_fee_group",
        "text": "Congratulations! Your investment balance has reached ₹4,50,000. To release withdrawal, pay 15% clearance tax (₹67,500) within 24 hours.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST", "URGENCY"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_030",
        "template_group": "regulatory_audit_fee_group",
        "text": "Your withdrawal request of ₹2,20,000 is held by regulatory audit. Deposit ₹25,000 refundable security fee to unlock funds.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_031",
        "template_group": "gst_nodal_officer_group",
        "text": "To unfreeze your accumulated trading profits of ₹1,80,000, transfer 18% GST clearance to our nodal officer personal UPI.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST", "IMPERSONATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_032",
        "template_group": "liquidity_verification_group",
        "text": "Withdrawal failed: Account requires liquidity verification deposit of ₹30,000. Money will be refunded with total profits.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_033",
        "template_group": "sebi_clearance_charge_group",
        "text": "SEBI clearance fee required: Transfer ₹15,000 processing charges to release your foreign exchange trading earnings.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST", "IMPERSONATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_034",
        "template_group": "wallet_frozen_conversion_group",
        "text": "Your VIP wallet is frozen. Deposit ₹40,000 conversion fee to convert institutional tokens into Indian Rupees.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_035",
        "template_group": "forfeit_balance_deposit_group",
        "text": "Pay ₹12,000 audit clearance deposit today or all accumulated balance in your trading account will be forfeited.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST", "URGENCY", "EMOTIONAL_PRESSURE"],
        "source": "OFFICIAL_ADVISORY"
    },
    # Regulatory Impersonation & Fake Endorsements
    {
        "id": "en_scam_036",
        "template_group": "sebi_approved_high_return_group",
        "text": "SEBI approved high return investment opportunity! Guaranteed 25% profit managed by government certified fund managers.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["IMPERSONATION", "GUARANTEED_RETURN", "FAKE_REGISTRATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_037",
        "template_group": "nse_authorized_vip_group",
        "text": "NSE authorized VIP wealth club: Join our private syndicate for guaranteed jackpot option calls with 100% win rate.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["IMPERSONATION", "GUARANTEED_RETURN", "FAKE_REGISTRATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_038",
        "template_group": "rbi_sebi_certified_group",
        "text": "This scheme is certified by Reserve Bank of India and SEBI. Deposit ₹10,000 to our nodal manager account today.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["IMPERSONATION", "PAYMENT_REQUEST", "FAKE_REGISTRATION"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_039",
        "template_group": "government_national_scheme_group",
        "text": "Official Government of India national digital investment scheme: Earn 40% monthly returns tax-free.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["IMPERSONATION", "GUARANTEED_RETURN"],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_scam_040",
        "template_group": "ministry_wealth_fund_group",
        "text": "Ministry of Finance authorized wealth fund: Invest ₹20,000 and get guaranteed government backed returns.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["IMPERSONATION", "GUARANTEED_RETURN", "PAYMENT_REQUEST"],
        "source": "OFFICIAL_ADVISORY"
    },
    # Urgency & High-Pressure Tactics
    {
        "id": "en_scam_041",
        "template_group": "slots_expiring_soon_group",
        "text": "URGENT: Only 2 slots remaining at this entry price! Offer expires in 15 minutes. Transfer ₹5,000 now to lock in guaranteed profit.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["URGENCY", "PAYMENT_REQUEST", "GUARANTEED_RETURN"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_042",
        "template_group": "closing_minutes_group",
        "text": "Last chance! Institutional breakout opportunity closing in 10 minutes. Pay immediately or miss out on 200% return.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["URGENCY", "PAYMENT_REQUEST", "GUARANTEED_RETURN"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_043",
        "template_group": "circuit_breaker_rush_group",
        "text": "HURRY! Special Diwali jackpot call. Transfer funds within 30 minutes to enter before the circuit breaker hits.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["URGENCY", "PAYMENT_REQUEST"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_044",
        "template_group": "allocation_close_sharp_group",
        "text": "Act now! Special VIP allocation closes at 3:30 PM sharp. Send payment screenshot immediately to claim your reserved allocation.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["URGENCY", "PAYMENT_REQUEST"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_045",
        "template_group": "emergency_window_gapup_group",
        "text": "Limited time emergency trading window: Deposit ₹10,000 in the next 1 hour to get guaranteed 50% overnight gap-up profits.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["URGENCY", "PAYMENT_REQUEST", "GUARANTEED_RETURN"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    # Multi-Level Referral & Recruitment Pressure
    {
        "id": "en_scam_046",
        "template_group": "invite_downline_bonus_group",
        "text": "Earn ₹5,000 for every active member you invite to our VIP trading group. Build your downline for passive daily returns.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["REFERRAL_PRESSURE", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_047",
        "template_group": "recruit_friends_unlock_group",
        "text": "To unlock your withdrawal, recruit 3 friends who deposit at least ₹5,000 each into the automated trading system.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["REFERRAL_PRESSURE", "WITHDRAWAL_FEE"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_048",
        "template_group": "binary_matrix_plan_group",
        "text": "Join our binary matrix investment plan: Refer 2 investors and receive 10% daily commission on all downline deposits.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["REFERRAL_PRESSURE", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_049",
        "template_group": "crypto_pool_referral_group",
        "text": "Referral bonus: Bring 5 investors to our crypto trading pool and get VIP membership with zero fees and double returns.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["REFERRAL_PRESSURE", "GUARANTEED_RETURN"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    # Social Proof & Tipping Manipulations
    {
        "id": "en_scam_050",
        "template_group": "professor_accuracy_group",
        "text": "Professor Rajiv's VIP Trading Signals: 99.4% accuracy on BankNifty calls. Over 10,000 members making daily profits. Join today.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["SOCIAL_PROOF", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_051",
        "template_group": "profit_bot_whatsapp_group",
        "text": "I made ₹2,40,000 in 3 days with this trading group! Contact admin on WhatsApp +91-9876543210 to activate your profit bot.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["SOCIAL_PROOF", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_052",
        "template_group": "insider_breakout_tip_group",
        "text": "Secret insider trading tip: Buy XYZ penny stock tomorrow at 9:15 AM, will hit 5 consecutive upper circuits. Target ₹150.",
        "language": "en",
        "label": "SUSPICIOUS",
        "signals": ["SOCIAL_PROOF"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_053",
        "template_group": "dm_telegram_winner_group",
        "text": "DM me on Telegram @FastProfitTrader for sure-shot calls. Stop losing money to market volatility and join the winners.",
        "language": "en",
        "label": "SUSPICIOUS",
        "signals": ["SOCIAL_PROOF", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    # Obfuscated Adversarial Examples (Section 25)
    {
        "id": "en_scam_054",
        "template_group": "adversarial_spaced_group",
        "text": "G U A R A N T E E D 30% monthly return! Transfer funds immediately to secure your spot bit.ly/easy-wealth",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "URGENCY", "SUSPICIOUS_URL", "PAYMENT_REQUEST"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_055",
        "template_group": "adversarial_punct_group",
        "text": "g.u.a.r.a.n.t.e.e.d profits in stock options! Share your O-T-P to verify your payout account.",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "OTP_REQUEST"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_scam_056",
        "template_group": "adversarial_ocr_group",
        "text": "Guaranted 30% return. Pay clearance fee before midnight or account blocked http://tinyurl.com/pay-safe",
        "language": "en",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "WITHDRAWAL_FEE", "URGENCY", "SUSPICIOUS_URL"],
        "source": "CURATED_SCAM_PATTERNS"
    },

    # =========================================================================
    # HINDI SAMPLES (SCAM_LIKE, SUSPICIOUS & BENIGN)
    # =========================================================================
    {
        "id": "hi_scam_001",
        "template_group": "hi_guaranteed_return_group",
        "text": "हर महीने 30% पक्का रिटर्न की गारंटी! ₹10,000 निवेश करें और हर महीने ₹3,000 सीधे अपने बैंक खाते में पाएं। बिना किसी जोखिम के।",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "INVESTMENT_SOLICITATION"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_scam_002",
        "template_group": "hi_otp_group",
        "text": "प्रिय ग्राहक, आपका डीमैट खाता ब्लॉक कर दिया गया है। तुरंत अपने मोबाइल पर आया 6 अंकों का OTP साझा करें ताकि खाता फिर से चालू हो सके।",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY", "EMOTIONAL_PRESSURE"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_scam_003",
        "template_group": "hi_apk_group",
        "text": "संस्थागत ट्रेडिंग ऐप डाउनलोड करें। इस लिंक से VIP-Trade.apk इंस्टॉल करें और रोजाना ₹5,000 का निश्चित मुनाफा कमाएं।",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP", "GUARANTEED_RETURN"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_scam_004",
        "template_group": "hi_tax_fee_group",
        "text": "बधाई हो! आपका ट्रेडिंग मुनाफा ₹3,50,000 हो चुका है। निकासी के लिए 10% टैक्स (₹35,000) तुरंत जमा करें, अन्यथा राशि जब्त हो जाएगी।",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST", "URGENCY", "EMOTIONAL_PRESSURE"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_scam_005",
        "template_group": "hi_sebi_fake_group",
        "text": "SEBI और भारत सरकार द्वारा प्रमाणित निवेश योजना: ₹20,000 जमा करें और 15 दिनों में पैसा दोगुना करें। सीमित सीटें उपलब्ध।",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["IMPERSONATION", "GUARANTEED_RETURN", "FAKE_REGISTRATION", "URGENCY"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_scam_006",
        "template_group": "hi_referral_group",
        "text": "अपने 3 दोस्तों को जोड़ें और हर नए सदस्य पर ₹2,000 का कमीशन तुरंत अपने UPI खाते में पाएं। बिना काम किए रोजाना कमाई।",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["REFERRAL_PRESSURE", "INVESTMENT_SOLICITATION"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_scam_007",
        "template_group": "hi_hinglish_scam_group",
        "text": "100% guaranteed daily munafa! Aaj hi ₹5,000 deposit karo aur daily ₹1,000 direct payout pao. WhatsApp par contact karo.",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "PAYMENT_REQUEST", "INVESTMENT_SOLICITATION"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_scam_008",
        "template_group": "hi_hinglish_otp_group",
        "text": "Aapka trading account unblock karne ke liye mobile par bheja gaya 6 digit OTP turant bhejiye.",
        "language": "hi",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_suspicious_001",
        "template_group": "hi_telegram_tips_group",
        "text": "Telegram चैनल से जुड़ें और 99% सटीक स्टॉक ऑप्शन टिप्स प्राप्त करें। हर ट्रेड में भारी मुनाफा कमाने का मौका।",
        "language": "hi",
        "label": "SUSPICIOUS",
        "signals": ["SOCIAL_PROOF", "INVESTMENT_SOLICITATION"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_benign_001",
        "template_group": "hi_order_exec_group",
        "text": "आपका NSE पर INFOSYS LIMITED के 10 शेयरों का खरीद ऑर्डर ₹1,850.00 पर सफलतापूर्वक पूरा हो गया है। ट्रेड आईडी: TR9812401।",
        "language": "hi",
        "label": "BENIGN",
        "signals": [],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "hi_benign_002",
        "template_group": "hi_sebi_advisory_group",
        "text": "SEBI निवेशक चेतावनी: किसी भी अनधिकृत व्यक्ति को अपना पासवर्ड या OTP कभी न बताएं। सुरक्षित निवेश के लिए sebi.gov.in पर जांच करें।",
        "language": "hi",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "hi_benign_003",
        "template_group": "hi_sip_debit_group",
        "text": "आपका ₹3,000 का मासिक SIP पराग पारिख फ्लेक्सी कैप फंड में सफलतापूर्वक निवेश हो गया है। आवंटित यूनिट्स: 41.25।",
        "language": "hi",
        "label": "BENIGN",
        "signals": [],
        "source": "MULTILINGUAL_SYNTHETIC"
    },

    # =========================================================================
    # TELUGU SAMPLES (SCAM_LIKE, SUSPICIOUS & BENIGN)
    # =========================================================================
    {
        "id": "te_scam_001",
        "template_group": "te_guaranteed_return_group",
        "text": "ప్రతి నెలా 30% స్థిరమైన రాబడి గ్యారెంటీ! ₹10,000 పెట్టుబడి పెట్టండి మరియు ప్రతి నెలా ₹3,000 మీ ఖాతాలో పొందండి. ఎటువంటి రిస్క్ లేదు.",
        "language": "te",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "INVESTMENT_SOLICITATION"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_scam_002",
        "template_group": "te_otp_group",
        "text": "డియర్ కస్టమర్, మీ డీమ్యాట్ ఖాతా సస్పెండ్ చేయబడకుండా ఉండేందుకు మీ మొబైల్‌కు వచ్చిన 6 అంకెల OTP ని వెంటనే తెలియజేయండి.",
        "language": "te",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY", "EMOTIONAL_PRESSURE"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_scam_003",
        "template_group": "te_apk_group",
        "text": "ఈ ప్రత్యేకమైన VIP-Trade.apk యాప్‌ని డౌన్‌లోడ్ చేసుకోండి మరియు ప్రతిరోజూ 100% ఖచ్చితమైన ట్రేడింగ్ లాభాలను పొందండి.",
        "language": "te",
        "label": "SCAM_LIKE",
        "signals": ["FAKE_APP", "UNKNOWN_APP", "GUARANTEED_RETURN"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_scam_004",
        "template_group": "te_tax_fee_group",
        "text": "అభినందనలు! మీ లాభం ₹2,50,000 చేరుకుంది. విత్‌డ్రా చేయడానికి ₹25,000 క్లియరెన్స్ ఫీజు చెల్లించండి. ఆలస్యమైతే మొత్తం రద్దవుతుంది.",
        "language": "te",
        "label": "SCAM_LIKE",
        "signals": ["WITHDRAWAL_FEE", "PAYMENT_REQUEST", "URGENCY", "EMOTIONAL_PRESSURE"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_scam_005",
        "template_group": "te_referral_group",
        "text": "మీ 3 మంది స్నేహితులను ఆహ్వానించండి మరియు మీ క్రిప్టో ట్రేడింగ్ ఖాతాలో ప్రతిరోజూ ₹3,000 బోనస్ పొందండి.",
        "language": "te",
        "label": "SCAM_LIKE",
        "signals": ["REFERRAL_PRESSURE", "INVESTMENT_SOLICITATION"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_scam_006",
        "template_group": "te_tenglish_scam_group",
        "text": "100% guaranteed laabham! Ee roju ₹10,000 deposit pettandi, 15 days lo double dabbulu pondandi. Tvaraga cheyandi.",
        "language": "te",
        "label": "SCAM_LIKE",
        "signals": ["GUARANTEED_RETURN", "PAYMENT_REQUEST", "URGENCY"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_scam_007",
        "template_group": "te_tenglish_otp_group",
        "text": "Mee trading account unblock cheyadaniki OTP pampandi tvaraga.",
        "language": "te",
        "label": "SCAM_LIKE",
        "signals": ["OTP_REQUEST", "URGENCY"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_suspicious_001",
        "template_group": "te_telegram_group",
        "text": "మా టెలిగ్రామ్ ఛానెల్‌లో చేరండి మరియు ఖచ్చితమైన ఇంట్రాడే స్టాక్ మార్కెట్ టిప్స్ ఉచితంగా పొందండి.",
        "language": "te",
        "label": "SUSPICIOUS",
        "signals": ["SOCIAL_PROOF", "INVESTMENT_SOLICITATION"],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_benign_001",
        "template_group": "te_order_exec_group",
        "text": "NSE లో మీ రిలయన్స్ ఇండస్ట్రీస్ 5 షేర్ల కొనుగోలు ఆర్డర్ ₹2,900 వద్ద విజయవంతంగా పూర్తయింది. కాంట్రాక్ట్ నోట్ ఇమెయిల్ చేయబడింది.",
        "language": "te",
        "label": "BENIGN",
        "signals": [],
        "source": "MULTILINGUAL_SYNTHETIC"
    },
    {
        "id": "te_benign_002",
        "template_group": "te_sebi_advisory_group",
        "text": "సెబీ హెచ్చరిక: గ్యారెంటీడ్ రాబడులు ఇచ్చే అనధికారిక వ్యక్తులను నమ్మవద్దు. మీ ట్రేడింగ్ పాస్‌వర్డ్ మరియు పిన్ ఎవరితోనూ పంచుకోవద్దు.",
        "language": "te",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "te_benign_003",
        "template_group": "te_sip_debit_group",
        "text": "మీ మ్యూచువల్ ఫండ్ SIP ₹5,000 విజయవంతంగా ప్రాసెస్ చేయబడింది. ఎస్బీఐ బ్లూచిప్ ఫండ్ లో యూనిట్లు కేటాయించబడ్డాయి.",
        "language": "te",
        "label": "BENIGN",
        "signals": [],
        "source": "MULTILINGUAL_SYNTHETIC"
    },

    # =========================================================================
    # ENGLISH BENIGN SAMPLES
    # =========================================================================
    {
        "id": "en_benign_001",
        "template_group": "trade_exec_group",
        "text": "Your buy order for 25 shares of INFOSYS LIMITED has been executed at ₹1,845.50 on NSE. Trade ID: 2026100491823.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_002",
        "template_group": "trade_exec_group",
        "text": "Order executed: Sold 10 shares of RELIANCE INDUSTRIES at ₹2,920.00 on BSE. Total consideration ₹29,200.00.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_003",
        "template_group": "trade_exec_group",
        "text": "Your limit order to buy 50 units of NIFTYBEES at ₹285.00 has been successfully placed with order number ORD948291.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_004",
        "template_group": "trade_exec_group",
        "text": "Trade confirmation: Buy order for 100 shares of TATA MOTORS executed at ₹960.25. Contract note will be sent to your email.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_005",
        "template_group": "trade_exec_group",
        "text": "Your stop-loss order for HDFC BANK at ₹1,620.00 has been triggered and executed at ₹1,619.80 on the National Stock Exchange.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_006",
        "template_group": "trade_exec_group",
        "text": "Intraday position squared off: Sold 100 shares of STATE BANK OF INDIA at ₹810.00. P&L reflects in your daily trading ledger.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_007",
        "template_group": "trade_exec_group",
        "text": "Executed: Your market order to purchase 15 units of GOLD BEES at ₹64.50 has been completed on NSE cash segment.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_008",
        "template_group": "trade_exec_group",
        "text": "Order Cancelled: Your unexecuted limit order for ICICI BANK at ₹1,200.00 was cancelled upon market close at 3:30 PM.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_009",
        "template_group": "corporate_action_group",
        "text": "Tata Consultancy Services Limited has declared an interim dividend of ₹10 per equity share. Record date is 18-Oct-2026.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_010",
        "template_group": "corporate_action_group",
        "text": "Infosys Ltd announced Q2 FY26 financial results: Consolidated net profit up 8.5% YoY to ₹6,500 crore. Board recommends dividend.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_011",
        "template_group": "corporate_action_group",
        "text": "Corporate Action Notice: ITC Limited bonus issue in the ratio of 1:1 approved by shareholders in Annual General Meeting.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_012",
        "template_group": "corporate_action_group",
        "text": "Dividend credit: ₹1,500 has been credited to your linked bank account towards final dividend for LARSEN & TOUBRO LTD.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_013",
        "template_group": "corporate_action_group",
        "text": "Hindustan Unilever Limited announces board meeting on October 24, 2026 to consider unaudited quarterly financial results.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_014",
        "template_group": "corporate_action_group",
        "text": "Record date notification: Wipro Limited buyback of equity shares via tender offer. Eligible shareholders list finalized.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_015",
        "template_group": "mutual_fund_group",
        "text": "Your monthly SIP of ₹5,000 in Parag Parikh Flexi Cap Fund was successfully processed on 03-Oct-2026. Units allotted: 68.42.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_016",
        "template_group": "mutual_fund_group",
        "text": "Transaction successful: ₹10,000 invested in Nippon India Small Cap Fund - Direct Plan - Growth. Current NAV: ₹145.82.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_017",
        "template_group": "mutual_fund_group",
        "text": "Your Systematic Investment Plan (SIP) in Mirae Asset Large Cap Fund is scheduled for debit on 10-Oct-2026 from account ending 4821.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_018",
        "template_group": "mutual_fund_group",
        "text": "Mutual Fund allotment notice: 124.50 units of HDFC Mid-Cap Opportunities Fund allotted against your lump sum investment of ₹20,000.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_019",
        "template_group": "mutual_fund_group",
        "text": "STP confirmation: Systematic Transfer Plan of ₹2,500 from ICICI Liquid Fund to ICICI Bluechip Fund processed successfully.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_020",
        "template_group": "mutual_fund_group",
        "text": "Monthly portfolio valuation: Your mutual fund portfolio value stands at ₹3,45,210 as of market close on September 30, 2026.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_021",
        "template_group": "depository_group",
        "text": "CDSL e-Voting alert: E-voting is open for AGM of ASIAN PAINTS LTD from 10-Oct-2026 to 14-Oct-2026. Cast your vote using your demat credentials.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_022",
        "template_group": "depository_group",
        "text": "NSDL monthly holding statement: Consolidated Account Statement (CAS) for September 2026 has been generated. Login to nsdl.co.in to view.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_023",
        "template_group": "depository_group",
        "text": "Demat debit notification: 20 shares of BHARTI AIRTEL debited from demat account 12081600 towards settlement obligations.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_024",
        "template_group": "depository_group",
        "text": "Demat credit alert: 50 shares of BAJAJ FINANCE credited to your demat account following secondary market purchase settlement.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_025",
        "template_group": "depository_group",
        "text": "CDSL SMS Alert: Demat account balance as of 30-Sep-2026 reflects 14 security lines. Access CAS online for complete transaction log.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_026",
        "template_group": "sebi_advisory_group",
        "text": "SEBI Investor Advisory: Registered intermediaries are strictly prohibited from offering guaranteed or assured returns on securities.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_benign_027",
        "template_group": "sebi_advisory_group",
        "text": "SEBI Circular: Mandatory guidelines for cyber resilience and digital safety frameworks for stock brokers and depository participants.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_benign_028",
        "template_group": "sebi_advisory_group",
        "text": "Investor Notice: Always verify that your investment adviser or research analyst holds a valid registration certificate on sebi.gov.in.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_benign_029",
        "template_group": "sebi_advisory_group",
        "text": "SEBI cautions investors against unsolicited stock recommendations circulated through social media platforms and messaging apps.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_benign_030",
        "template_group": "sebi_advisory_group",
        "text": "National Stock Exchange alert: Do not share trading account credentials or OTPs with unauthorized persons or unofficial advisory firms.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_benign_031",
        "template_group": "sebi_advisory_group",
        "text": "SEBI Master Circular: Client funds must be segregated and deposited strictly into designated client bank accounts with scheduled commercial banks.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_benign_032",
        "template_group": "kyc_admin_group",
        "text": "Your CKYC record has been successfully verified by the Central KYC Registry. Your KRA status is validated. No action required.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_033",
        "template_group": "kyc_admin_group",
        "text": "Address update confirmation: Your registered mailing address has been updated in broker records as per your DigiLocker request.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_034",
        "template_group": "kyc_admin_group",
        "text": "Nomination update: Your nominee details for Demat Account ending in 9102 have been registered successfully.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_035",
        "template_group": "banking_debit_group",
        "text": "Your account XX4019 has been debited with ₹2,500 on 03-Oct-2026 for UPI payment to ZERODHA BROKING. UPI Ref 427819203.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_036",
        "template_group": "banking_debit_group",
        "text": "Bank Security Notice: Never share your UPI PIN or debit card OTP with anyone. Bank officials will never ask for your confidential PIN.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "OFFICIAL_ADVISORY"
    },
    {
        "id": "en_benign_037",
        "template_group": "research_note_group",
        "text": "Equity Research Update on Titan Company: Target price revised based on quarterly store expansion. Disclaimer: Securities investments are subject to market risks. Read all scheme related documents carefully.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_038",
        "template_group": "research_note_group",
        "text": "Market Morning Brief: Global cues mixed as US Federal Reserve holds interest rates steady. Nifty support at 25,000, resistance at 25,300. For informational purposes only.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_039",
        "template_group": "research_note_group",
        "text": "Quarterly Sector Review: IT sector outlook remains resilient amid banking software demand. Past performance is not indicative of future returns.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },
    {
        "id": "en_benign_040",
        "template_group": "research_note_group",
        "text": "Macroeconomic Dashboard: India CPI inflation moderates to 4.2% in August. RBI Monetary Policy Committee meeting scheduled next week.",
        "language": "en",
        "label": "BENIGN",
        "signals": [],
        "source": "CURATED_BENIGN_FINANCIAL"
    },

    # =========================================================================
    # SUSPICIOUS ENGLISH SAMPLES (Unsolicited Stock Tips, Pressure, Pump & Dump)
    # =========================================================================
    {
        "id": "en_susp_001",
        "template_group": "unsolicited_tip_group",
        "text": "Join our WhatsApp stock advisory channel for daily 9:15 AM intraday breakout tips. Over 5,000 active traders.",
        "language": "en",
        "label": "SUSPICIOUS",
        "signals": ["SOCIAL_PROOF", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_susp_002",
        "template_group": "unsolicited_tip_group",
        "text": "Exclusive penny stock recommendation: Major institutional block deal happening tomorrow. Accumulate before market rally.",
        "language": "en",
        "label": "SUSPICIOUS",
        "signals": ["SOCIAL_PROOF"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_susp_003",
        "template_group": "unsolicited_tip_group",
        "text": "High conviction swing trade: Target 45% upside within 10 trading sessions. DM @InvestPro on Telegram for entry level.",
        "language": "en",
        "label": "SUSPICIOUS",
        "signals": ["SOCIAL_PROOF", "INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_susp_004",
        "template_group": "unsolicited_tip_group",
        "text": "Premium research alert: Special situational opportunity. Subscribe to private telegram group for real-time trade signals.",
        "language": "en",
        "label": "SUSPICIOUS",
        "signals": ["INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    },
    {
        "id": "en_susp_005",
        "template_group": "unsolicited_tip_group",
        "text": "Jackpot call alert: BankNifty zero-to-hero expiry options recommendation available for select premium members today.",
        "language": "en",
        "label": "SUSPICIOUS",
        "signals": ["INVESTMENT_SOLICITATION"],
        "source": "CURATED_SCAM_PATTERNS"
    }
]


def validate_dataset(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Automated dataset quality checks before splitting:
    - Missing text
    - Duplicate & near duplicate records
    - Empty / invalid labels
    - Invalid language tags
    - Contradictory labels
    - Class distribution & Signal distribution
    """
    issues = []
    seen_hashes = {}
    normalized_texts = {}
    label_counts = {"BENIGN": 0, "SUSPICIOUS": 0, "SCAM_LIKE": 0}
    lang_counts = {"en": 0, "hi": 0, "te": 0}
    signal_counts = {sig: 0 for sig in ALL_SIGNALS}

    valid_labels = {"BENIGN", "SUSPICIOUS", "SCAM_LIKE"}
    valid_langs = {"en", "hi", "te"}

    for idx, rec in enumerate(records):
        rec_id = rec.get("id", f"sample_{idx}")
        text = rec.get("text", "")
        label = rec.get("label", "")
        lang = rec.get("language", "")
        signals = rec.get("signals", [])

        # 1. Missing text check
        if not text or len(text.strip()) < 5:
            issues.append({"type": "MISSING_OR_SHORT_TEXT", "id": rec_id, "detail": "Text is empty or under 5 characters"})

        # 2. Duplicate exact text
        text_hash = hashlib.md5(text.strip().encode("utf-8")).hexdigest()
        if text_hash in seen_hashes:
            issues.append({"type": "EXACT_DUPLICATE", "id": rec_id, "duplicate_of": seen_hashes[text_hash]})
        else:
            seen_hashes[text_hash] = rec_id

        # 3. Near duplicate check (normalized text)
        norm = normalize_text(text)
        if norm in normalized_texts:
            issues.append({"type": "NEAR_DUPLICATE", "id": rec_id, "matches_id": normalized_texts[norm]})
        else:
            normalized_texts[norm] = rec_id

        # 4. Valid label check
        if label not in valid_labels:
            issues.append({"type": "INVALID_LABEL", "id": rec_id, "label": label})
        else:
            label_counts[label] += 1

        # 5. Valid language check
        if lang not in valid_langs:
            issues.append({"type": "INVALID_LANGUAGE", "id": rec_id, "language": lang})
        else:
            lang_counts[lang] += 1

        # 6. Signals validation
        for s in signals:
            if s not in ALL_SIGNALS:
                issues.append({"type": "INVALID_SIGNAL", "id": rec_id, "signal": s})
            else:
                signal_counts[s] += 1

        # 7. Contradiction check: BENIGN samples should not have aggressive scam signals like OTP_REQUEST or GUARANTEED_RETURN
        if label == "BENIGN":
            prohibited_signals = {"GUARANTEED_RETURN", "OTP_REQUEST", "FAKE_APP", "WITHDRAWAL_FEE", "PASSWORD_REQUEST", "PIN_REQUEST"}
            bad = set(signals).intersection(prohibited_signals)
            if bad:
                issues.append({"type": "CONTRADICTORY_LABEL", "id": rec_id, "detail": f"BENIGN text has scam signals {bad}"})

    total_records = len(records)
    has_critical_error = any(iss["type"] in {"MISSING_OR_SHORT_TEXT", "EXACT_DUPLICATE", "INVALID_LABEL", "CONTRADICTORY_LABEL"} for iss in issues)

    report = {
        "total_records": total_records,
        "valid": not has_critical_error,
        "critical_issues_count": sum(1 for iss in issues if iss["type"] in {"MISSING_OR_SHORT_TEXT", "EXACT_DUPLICATE", "INVALID_LABEL", "CONTRADICTORY_LABEL"}),
        "warning_issues_count": sum(1 for iss in issues if iss["type"] not in {"MISSING_OR_SHORT_TEXT", "EXACT_DUPLICATE", "INVALID_LABEL", "CONTRADICTORY_LABEL"}),
        "issues": issues,
        "class_distribution": label_counts,
        "language_distribution": lang_counts,
        "signal_distribution": signal_counts
    }
    return report


def build_and_split_dataset(
    records: List[Dict[str, Any]],
    output_dir: str,
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    random_seed: int = 42
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, Any]]:
    """
    Splits dataset into 70% Train, 15% Val, 15% Test using Stratified Grouping.
    Strict Leakage Prevention:
    - Groups by `template_group` so that no template variants leak across train/val/test splits.
    - Stratifies by class label (BENIGN, SUSPICIOUS, SCAM_LIKE) so every class is fairly represented.
    """
    import random
    random.seed(random_seed)

    # 1. Run automated validation
    quality_report = validate_dataset(records)
    if not quality_report["valid"]:
        raise ValueError(f"Dataset Quality Validation FAILED with {quality_report['critical_issues_count']} critical errors: {quality_report['issues']}")

    # 2. Stratify groups by primary class label
    label_to_groups: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
        "BENIGN": {},
        "SUSPICIOUS": {},
        "SCAM_LIKE": {}
    }

    for r in records:
        lbl = r["label"]
        grp = r.get("template_group", r["id"])
        label_to_groups[lbl].setdefault(grp, []).append(r)

    train_records = []
    val_records = []
    test_records = []

    for lbl, grps in label_to_groups.items():
        grp_keys = sorted(list(grps.keys()))
        random.shuffle(grp_keys)

        total_samples = sum(len(grps[k]) for k in grp_keys)
        lbl_target_train = int(total_samples * train_ratio)
        lbl_target_val = max(1, int(total_samples * val_ratio))

        c_train, c_val = 0, 0
        for gk in grp_keys:
            items = grps[gk]
            if c_train + len(items) <= lbl_target_train or (c_val >= lbl_target_val and (total_samples - c_train - c_val) <= 0):
                train_records.extend(items)
                c_train += len(items)
            elif c_val + len(items) <= lbl_target_val:
                val_records.extend(items)
                c_val += len(items)
            else:
                test_records.extend(items)

    # Check for leakage between splits (by id, text, and template_group)
    train_ids = {r["id"] for r in train_records}
    val_ids = {r["id"] for r in val_records}
    test_ids = {r["id"] for r in test_records}

    train_texts = {normalize_text(r["text"]) for r in train_records}
    val_texts = {normalize_text(r["text"]) for r in val_records}
    test_texts = {normalize_text(r["text"]) for r in test_records}

    leakage_check = {
        "train_val_id_leak": len(train_ids.intersection(val_ids)),
        "train_test_id_leak": len(train_ids.intersection(test_ids)),
        "val_test_id_leak": len(val_ids.intersection(test_ids)),
        "train_val_text_leak": len(train_texts.intersection(val_texts)),
        "train_test_text_leak": len(train_texts.intersection(test_texts)),
        "val_test_text_leak": len(val_texts.intersection(test_texts)),
        "leakage_detected": False
    }

    if any(v > 0 for k, v in leakage_check.items() if k != "leakage_detected"):
        leakage_check["leakage_detected"] = True
        raise ValueError(f"CRITICAL: Data leakage detected across splits: {leakage_check}")

    quality_report["leakage_verification"] = leakage_check
    quality_report["split_counts"] = {
        "train": len(train_records),
        "validation": len(val_records),
        "test": len(test_records),
        "train_percentage": round(len(train_records) / len(records) * 100, 1),
        "validation_percentage": round(len(val_records) / len(records) * 100, 1),
        "test_percentage": round(len(test_records) / len(records) * 100, 1)
    }

    # 3. Save files
    os.makedirs(os.path.join(output_dir, "raw"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "processed"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "train"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "validation"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "test"), exist_ok=True)

    with open(os.path.join(output_dir, "raw", "corpus_full.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    with open(os.path.join(output_dir, "dataset_quality_report.json"), "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2, ensure_ascii=False)

    def _save_jsonl(path: str, data: List[Dict[str, Any]]):
        with open(path, "w", encoding="utf-8") as f:
            for item in data:
                f.write(json.dumps(item, ensure_ascii=False) + "\n")

    _save_jsonl(os.path.join(output_dir, "train", "train.jsonl"), train_records)
    _save_jsonl(os.path.join(output_dir, "validation", "val.jsonl"), val_records)
    _save_jsonl(os.path.join(output_dir, "test", "test.jsonl"), test_records)

    return train_records, val_records, test_records, quality_report


if __name__ == "__main__":
    import sys
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "ml/datasets"
    train_r, val_r, test_r, report = build_and_split_dataset(RAW_RECORDS, out_dir)
    print(f"Dataset successfully compiled & validated.")
    print(f"Total: {report['total_records']} records (Train: {len(train_r)}, Val: {len(val_r)}, Test: {len(test_r)})")
    print(f"Quality Check Valid: {report['valid']}, Zero Data Leakage: {not report['leakage_verification']['leakage_detected']}")
