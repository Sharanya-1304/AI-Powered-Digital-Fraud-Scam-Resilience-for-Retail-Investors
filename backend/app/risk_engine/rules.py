import re
from dataclasses import dataclass
from typing import List
from app.schemas.scan import SignalModel

@dataclass
class RuleDefinition:
    type: str
    title: str
    severity: str
    pattern: str
    why_it_matters: str
    action_recommendation: str

RULES_CONFIG: List[RuleDefinition] = [
    RuleDefinition(
        type="GUARANTEED_RETURN",
        title="Guaranteed or Assured Return Claim",
        severity="HIGH",
        pattern=r"(?i)(guaranteed|assured|fixed|100%|risk[- ]?free|no risk|double your money|triple your money|daily return|monthly return|weekly profit|guarantee).*(profit|return|\d+%\s*return|\d+%\s*profit|gain)",
        why_it_matters="Guaranteed or unusually high return promises are a primary hallmark of investment fraud. SEBI strictly prohibits registered market intermediaries from assuring fixed returns on market investments.",
        action_recommendation="Never transfer funds to any scheme promising guaranteed market returns or zero downside."
    ),
    RuleDefinition(
        type="OTP_REQUEST",
        title="Sensitive Credential / OTP Request",
        severity="CRITICAL",
        pattern=r"(?i)(send|share|tell|give|enter|forward|provide|disclose).*(otp|one[- ]?time[- ]?password|verification code|pin|password|mpin)|(otp|code).*(activate|verify|pending|suspend)",
        why_it_matters="OTPs provide direct cryptographic access to debit bank accounts or liquidate demat securities. Legitimate brokers and regulators never request OTPs verbally or through chat.",
        action_recommendation="Never disclose OTPs, PINs, or passwords to anyone, regardless of their claimed authority."
    ),
    RuleDefinition(
        type="URGENCY",
        title="Manufactured Urgency & High-Pressure Tactics",
        severity="HIGH",
        pattern=r"(?i)(pay today|pay within|urgent|last chance|hurry|today only|only \d+ slots?|expires in|act now|before .* closes|time is running|account suspend)",
        why_it_matters="High-pressure timelines are deliberately engineered to short-circuit critical evaluation and prevent investors from conducting independent verification.",
        action_recommendation="Enforce a mandatory 24-hour cooling-off period before committing funds to unsolicited opportunities."
    ),
    RuleDefinition(
        type="PAYMENT_REQUEST",
        title="Direct Personal or Unverified Payment Request",
        severity="HIGH",
        pattern=r"(?i)(pay ₹|transfer ₹|deposit ₹|pay \d+|send to.*upi|personal account|qr code|gpay|phonepe|paytm|wallet address|usdt)",
        why_it_matters="Registered financial entities accept money strictly into regulated corporate client accounts. Demanding payment to personal UPI handles or crypto wallets strongly indicates fraudulent diversion.",
        action_recommendation="Do not transfer money to personal bank accounts, third-party UPI IDs, or cryptocurrency addresses."
    ),
    RuleDefinition(
        type="REGULATORY_IMPERSONATION",
        title="Regulatory or Exchange Impersonation Claim",
        severity="HIGH",
        pattern=r"(?i)(sebi approved|sebi certified|sebi registered|rbi approved|nse authorized|bse verified|govt approved scheme|government certified)",
        why_it_matters="SEBI and stock exchanges regulate market integrity; they do not endorse individual retail schemes, guarantee returns, or operate private investment pools.",
        action_recommendation="Cross-check the exact claimed registration number independently on the official sebi.gov.in portal."
    ),
    RuleDefinition(
        type="FAKE_APP",
        title="Sideloaded / Unverified APK Distribution",
        severity="HIGH",
        pattern=r"(?i)(install.*apk|download.*apk|\.apk|sideload|unknown sources|download this app|install.*custom app)",
        why_it_matters="Apps distributed outside official application stores (Google Play, Apple App Store) bypass security audits and can contain spyware, screen recorders, or remote-access Trojans.",
        action_recommendation="Only download financial and trading apps directly through official store listings verified against registered broker details."
    ),
    RuleDefinition(
        type="WITHDRAWAL_FEE",
        title="Upfront Withdrawal Fee / Advance Tax Trap",
        severity="CRITICAL",
        pattern=r"(?i)(withdrawal fee|clearance fee|deposit to release|pay .* tax to withdraw|unlock balance|frozen funds|processing fee to withdraw)",
        why_it_matters="Legitimate financial intermediaries never demand external cash deposits to release account balances; statutory taxes are settled automatically through clearing accounts.",
        action_recommendation="Do not pay extra fees to release previously deposited funds. Preserve evidence and report immediately to 1930."
    ),
    RuleDefinition(
        type="REFERRAL_PRESSURE",
        title="Multi-Level Recruitment or Referral Pressure",
        severity="MEDIUM",
        pattern=r"(?i)(refer.*earn|invite.*friends|bring \d+ members|downline|binary commission|level income)",
        why_it_matters="Multi-level marketing (MLM) structures in investment schemes suggest pyramid or Ponzi mechanisms where revenue depends on incoming deposits rather than genuine asset management.",
        action_recommendation="Avoid schemes where earnings are tied to recruiting additional participants."
    ),
    RuleDefinition(
        type="INVESTMENT_SOLICITATION",
        title="Unsolicited VIP / Institutional Trading Invitation",
        severity="MEDIUM",
        pattern=r"(?i)(vip trading|institutional quota|insider signals|premium calls|jackpot call|sure-shot call|99% accuracy)",
        why_it_matters="Unsolicited promises of insider trades or exclusive institutional quotas in messaging apps are standard lures used by unregistered tipping syndicates.",
        action_recommendation="Verify whether the adviser is SEBI-registered as a Research Analyst (RA) or Investment Adviser (IA)."
    )
]

def scan_text_with_rules(text: str) -> List[SignalModel]:
    signals = []
    sig_id = 1
    for r in RULES_CONFIG:
        match = re.search(r.pattern, text)
        if match:
            signals.append(
                SignalModel(
                    id=f"sig-{sig_id}",
                    type=r.type,
                    title=r.title,
                    severity=r.severity,
                    evidence=match.group(0),
                    whyItMatters=r.why_it_matters,
                    actionRecommendation=r.action_recommendation
                )
            )
            sig_id += 1
    return signals
