"""
SANGYAN SHIELD - Ground Truth Labeled Training Dataset for Financial Fraud Detection
Contains verified, curated samples of digital investment scams (Class 1) and legitimate
financial communications (Class 0) representing Indian retail financial channels.
"""

from typing import List, Tuple

# Format: (text, label) where 1 = Scam / Unsolicited Fraudulent Solicitation, 0 = Legitimate / Benign Financial Content
RAW_DATASET: List[Tuple[str, int]] = [
    # ==========================================
    # CLASS 1: INVESTMENT FRAUD & SCAMS (label: 1)
    # ==========================================
    # Guaranteed & Fixed Return Solicitations
    ("Guaranteed 30% monthly return with zero market risk. Invest ₹10,000 today and receive ₹3,000 every month directly in your account.", 1),
    ("Our VIP institutional fund guarantees 100% principal protection with fixed 25% weekly profit. Minimum deposit ₹5,000.", 1),
    ("Double your capital in just 15 days! 100% sure-shot algorithmic returns with SEBI approved institutional trading slots.", 1),
    ("Earn assured 50% monthly profit trading forex and crypto. Zero loss guarantee backed by automated arbitrage bots.", 1),
    ("Special festival fixed return plan: Deposit ₹25,000 today and get ₹75,000 in 30 days guaranteed. Limited slots available.", 1),
    ("Zero risk high yield investment opportunity! 5% daily returns guaranteed. Withdraw your profits anytime without lock-in.", 1),
    ("Guaranteed 20% return every month. Join our elite investor group and watch your savings multiply safely with no loss.", 1),
    ("Assured 40% profit on intraday options. 100% accurate tips provided by former fund managers. Money back guarantee.", 1),
    ("Deposit ₹50,000 in our institutional trading pool and receive fixed ₹15,000 every Friday without fail.", 1),
    ("Risk-free wealth creation scheme approved by top analysts. Earn 300% return in 6 months guaranteed.", 1),

    # OTP & Sensitive Credential Harvesting
    ("Dear client, your demat account KYC is pending suspension. Send the 6-digit OTP received on your phone immediately to verify.", 1),
    ("Security Alert: Unauthorized login detected on your trading app. Disclose the one-time password (OTP) to our executive to secure funds.", 1),
    ("Your trading account is blocked due to unverified Aadhaar link. Share the OTP sent to your registered mobile to unblock.", 1),
    ("SEBI mandatory KYC update: Provide the 6-digit verification code sent via SMS to prevent permanent account freezing.", 1),
    ("Enter your trading MPIN and one-time password on this portal to claim your ₹5,000 annual dividend credit.", 1),
    ("Your demat holdings are being transferred to escrow. Read out the verification code received on your phone to cancel unauthorized transfer.", 1),
    ("Bank KYC verification officer: Please share the OTP received on SMS to reactivate your frozen UPI trading mandate.", 1),
    ("Urgent: Demat account audit in progress. Provide your password and OTP to complete annual security clearance.", 1),
    ("To activate institutional VIP trading privileges, forward the OTP received from your broker to this chat.", 1),
    ("Your trading profit payout of ₹84,000 is ready. Disclose the 6-digit confirmation code to authorize instant RTGS debit to your wallet.", 1),

    # Sideloaded APKs & Malicious Applications
    ("Install this exclusive VIP-Trade-Alpha.apk from this link to access 99.8% accurate AI trading bot signals.", 1),
    ("Download our custom institutional trading app APK from Telegram to trade pre-IPO shares with zero brokerage.", 1),
    ("Click this link to download the proprietary NSE Institutional Pro APK and bypass standard retail trade limits.", 1),
    ("Sideload this trading application to your Android phone to execute automated high-frequency arbitrage trades.", 1),
    ("Download ApexTrade.apk to access secret institutional stock breakout alerts before market open.", 1),
    ("Install this unreleased beta trading app to get 10x leverage on all NSE index options without margin rules.", 1),
    ("Exclusive mobile app: Download this APK file directly from chat to participate in secret government wealth funds.", 1),
    ("Click here to download VIP-Trading-Terminal.apk. Enable 'Install from unknown sources' in settings to start earning.", 1),

    # Advance-Fee & Withdrawal Clearance Traps
    ("Congratulations! Your investment balance has reached ₹4,50,000. To release withdrawal, pay 15% clearance tax (₹67,500) within 24 hours.", 1),
    ("Your withdrawal request of ₹2,20,000 is held by regulatory audit. Deposit ₹25,000 refundable security fee to unlock funds.", 1),
    ("To unfreeze your accumulated trading profits of ₹1,80,000, transfer 18% GST clearance to our nodal officer personal UPI.", 1),
    ("Withdrawal failed: Account requires liquidity verification deposit of ₹30,000. Money will be refunded with total profits.", 1),
    ("SEBI clearance fee required: Transfer ₹15,000 processing charges to release your foreign exchange trading earnings.", 1),
    ("Your VIP wallet is frozen. Deposit ₹40,000 conversion fee to convert institutional tokens into Indian Rupees.", 1),
    ("Pay ₹12,000 audit clearance deposit today or all accumulated balance in your trading account will be forfeited.", 1),

    # Regulatory Impersonation & Fake Endorsements
    ("SEBI approved high return investment opportunity! Guaranteed 25% profit managed by government certified fund managers.", 1),
    ("NSE authorized VIP wealth club: Join our private syndicate for guaranteed jackpot option calls with 100% win rate.", 1),
    ("This scheme is certified by Reserve Bank of India and SEBI. Deposit ₹10,000 to our nodal manager account today.", 1),
    ("Official Government of India national digital investment scheme: Earn 40% monthly returns tax-free.", 1),
    ("SEBI certified institutional adviser offering guaranteed 5x return on smallcap stocks. Verified registration certificate attached.", 1),
    ("Ministry of Finance authorized wealth fund: Invest ₹20,000 and get guaranteed government backed returns.", 1),

    # Urgency & High-Pressure Tactics
    ("URGENT: Only 2 slots remaining at this entry price! Offer expires in 15 minutes. Transfer ₹5,000 now to lock in guaranteed profit.", 1),
    ("Last chance! Institutional breakout opportunity closing in 10 minutes. Pay immediately or miss out on 200% return.", 1),
    ("HURRY! Special Diwali jackpot call. Transfer funds within 30 minutes to enter before the circuit breaker hits.", 1),
    ("Act now! Special VIP allocation closes at 3:30 PM sharp. Send payment screenshot immediately to claim your reserved allocation.", 1),
    ("Limited time emergency trading window: Deposit ₹10,000 in the next 1 hour to get guaranteed 50% overnight gap-up profits.", 1),

    # Multi-Level Referral & Recruitment Pressure
    ("Earn ₹5,000 for every active member you invite to our VIP trading group. Build your downline for passive daily returns.", 1),
    ("To unlock your withdrawal, recruit 3 friends who deposit at least ₹5,000 each into the automated trading system.", 1),
    ("Join our binary matrix investment plan: Refer 2 investors and receive 10% daily commission on all downline deposits.", 1),
    ("Referral bonus: Bring 5 investors to our crypto trading pool and get VIP membership with zero fees and double returns.", 1),

    # Social Proof & Tipping Manipulations
    ("Professor Rajiv's VIP Trading Signals: 99.4% accuracy on BankNifty calls. Over 10,000 members making daily profits. Join today.", 1),
    ("I made ₹2,40,000 in 3 days with this trading group! Contact admin on WhatsApp +91-9876543210 to activate your profit bot.", 1),
    ("Secret insider trading tip: Buy XYZ penny stock tomorrow at 9:15 AM, will hit 5 consecutive upper circuits. Target ₹150.", 1),
    ("DM me on Telegram @FastProfitTrader for sure-shot calls. Stop losing money to market volatility and join the winners.", 1),

    # ==========================================
    # CLASS 0: LEGITIMATE FINANCIAL CONTENT (label: 0)
    # ==========================================
    # Trade Execution Confirmations
    ("Your buy order for 25 shares of INFOSYS LIMITED has been executed at ₹1,845.50 on NSE. Trade ID: 2026100491823.", 0),
    ("Order executed: Sold 10 shares of RELIANCE INDUSTRIES at ₹2,920.00 on BSE. Total consideration ₹29,200.00.", 0),
    ("Your limit order to buy 50 units of NIFTYBEES at ₹285.00 has been successfully placed with order number ORD948291.", 0),
    ("Trade confirmation: Buy order for 100 shares of TATA MOTORS executed at ₹960.25. Contract note will be sent to your email.", 0),
    ("Your stop-loss order for HDFC BANK at ₹1,620.00 has been triggered and executed at ₹1,619.80 on the National Stock Exchange.", 0),
    ("Intraday position squared off: Sold 100 shares of STATE BANK OF INDIA at ₹810.00. P&L reflects in your daily trading ledger.", 0),
    ("Executed: Your market order to purchase 15 units of GOLD BEES at ₹64.50 has been completed on NSE cash segment.", 0),
    ("Order Cancelled: Your unexecuted limit order for ICICI BANK at ₹1,200.00 was cancelled upon market close at 3:30 PM.", 0),

    # Dividend & Corporate Action Announcements
    ("Tata Consultancy Services Limited has declared an interim dividend of ₹10 per equity share. Record date is 18-Oct-2026.", 0),
    ("Infosys Ltd announced Q2 FY26 financial results: Consolidated net profit up 8.5% YoY to ₹6,500 crore. Board recommends dividend.", 0),
    ("Corporate Action Notice: ITC Limited bonus issue in the ratio of 1:1 approved by shareholders in Annual General Meeting.", 0),
    ("Dividend credit: ₹1,500 has been credited to your linked bank account towards final dividend for LARSEN & TOUBRO LTD.", 0),
    ("Hindustan Unilever Limited announces board meeting on October 24, 2026 to consider unaudited quarterly financial results.", 0),
    ("Record date notification: Wipro Limited buyback of equity shares via tender offer. Eligible shareholders list finalized.", 0),

    # Mutual Fund & SIP Transaction Notifications
    ("Your monthly SIP of ₹5,000 in Parag Parikh Flexi Cap Fund was successfully processed on 03-Oct-2026. Units allotted: 68.42.", 0),
    ("Transaction successful: ₹10,000 invested in Nippon India Small Cap Fund - Direct Plan - Growth. Current NAV: ₹145.82.", 0),
    ("Your Systematic Investment Plan (SIP) in Mirae Asset Large Cap Fund is scheduled for debit on 10-Oct-2026 from account ending 4821.", 0),
    ("Mutual Fund allotment notice: 124.50 units of HDFC Mid-Cap Opportunities Fund allotted against your lump sum investment of ₹20,000.", 0),
    ("STP confirmation: Systematic Transfer Plan of ₹2,500 from ICICI Liquid Fund to ICICI Bluechip Fund processed successfully.", 0),
    ("Monthly portfolio valuation: Your mutual fund portfolio value stands at ₹3,45,210 as of market close on September 30, 2026.", 0),

    # Depository & Demat Holding Statements (NSDL / CDSL)
    ("CDSL e-Voting alert: E-voting is open for AGM of ASIAN PAINTS LTD from 10-Oct-2026 to 14-Oct-2026. Cast your vote using your demat credentials.", 0),
    ("NSDL monthly holding statement: Consolidated Account Statement (CAS) for September 2026 has been generated. Login to nsdl.co.in to view.", 0),
    ("Demat debit notification: 20 shares of BHARTI AIRTEL debited from demat account 12081600 towards settlement obligations.", 0),
    ("Demat credit alert: 50 shares of BAJAJ FINANCE credited to your demat account following secondary market purchase settlement.", 0),
    ("CDSL SMS Alert: Demat account balance as of 30-Sep-2026 reflects 14 security lines. Access CAS online for complete transaction log.", 0),

    # Official SEBI & Regulatory Awareness Circulars
    ("SEBI Investor Advisory: Registered intermediaries are strictly prohibited from offering guaranteed or assured returns on securities.", 0),
    ("SEBI Circular: Mandatory guidelines for cyber resilience and digital safety frameworks for stock brokers and depository participants.", 0),
    ("Investor Notice: Always verify that your investment adviser or research analyst holds a valid registration certificate on sebi.gov.in.", 0),
    ("SEBI cautions investors against unsolicited stock recommendations circulated through social media platforms and messaging apps.", 0),
    ("National Stock Exchange alert: Do not share trading account credentials or OTPs with unauthorized persons or unofficial advisory firms.", 0),
    ("SEBI Master Circular: Client funds must be segregated and deposited strictly into designated client bank accounts with scheduled commercial banks.", 0),

    # Standard KYC & Account Administrative Notices
    ("Your CKYC record has been successfully verified by the Central KYC Registry. Your KRA status is validated. No action required.", 0),
    ("Address update confirmation: Your registered mailing address has been updated in broker records as per your DigiLocker request.", 0),
    ("Nomination update: Your nominee details for Demat Account ending in 9102 have been registered successfully.", 0),
    ("Annual account maintenance: Your demat maintenance statement for FY26 has been emailed to your registered address.", 0),
    ("Bank account change: New bank account ending in 3319 has been added as secondary payout account after penny drop verification.", 0),

    # Standard Banking Debit Alerts with Inherent Security Warnings
    ("Your account XX4019 has been debited with ₹2,500 on 03-Oct-2026 for UPI payment to ZERODHA BROKING. UPI Ref 427819203.", 0),
    ("Auto-debit successful: ₹15,000 transferred towards credit card bill payment. If this was not authorized by you, call your bank helpline.", 0),
    ("Bank Security Notice: Never share your UPI PIN or debit card OTP with anyone. Bank officials will never ask for your confidential PIN.", 0),
    ("Salary credit: ₹75,000 credited to account ending 8912 via NEFT from employer corporate account on 30-Sep-2026.", 0),
    ("Fixed deposit maturity advice: Your term deposit of ₹1,00,000 has matured and renewed for 1 year at prevailing interest rate of 6.8%.", 0),

    # Legitimate Research Notes with Mandatory Disclaimers
    ("Equity Research Update on Titan Company: Target price revised based on quarterly store expansion. Disclaimer: Securities investments are subject to market risks. Read all scheme related documents carefully.", 0),
    ("Market Morning Brief: Global cues mixed as US Federal Reserve holds interest rates steady. Nifty support at 25,000, resistance at 25,300. For informational purposes only.", 0),
    ("Quarterly Sector Review: IT sector outlook remains resilient amid banking software demand. Past performance is not indicative of future returns.", 0),
    ("Macroeconomic Dashboard: India CPI inflation moderates to 4.2% in August. RBI Monetary Policy Committee meeting scheduled next week.", 0)
]

def get_training_data() -> Tuple[List[str], List[int]]:
    """Returns texts and integer labels (1 = Scam, 0 = Legitimate)."""
    texts = [sample[0] for sample in RAW_DATASET]
    labels = [sample[1] for sample in RAW_DATASET]
    return texts, labels
