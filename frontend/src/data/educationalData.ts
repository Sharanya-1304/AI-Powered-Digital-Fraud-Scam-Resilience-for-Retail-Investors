import { EducationalScamType } from '../types';

export const EDUCATIONAL_SCAMS: EducationalScamType[] = [
  {
    slug: 'guaranteed-returns',
    title: 'Guaranteed Return Schemes',
    shortDesc: 'Promises of 10% to 50% fixed monthly profits with "zero risk" or "100% principal protection".',
    riskSeverity: 'HIGH',
    commonChannels: ['Telegram channels', 'WhatsApp groups', 'Instagram reels', 'YouTube ads'],
    whatItLooksLike: [
      '"Invest ₹10,000 and get ₹3,000 every single month guaranteed"',
      '"Our AI trading bot never makes a loss — 99.8% win rate"',
      '"Government approved fixed 25% return plan"'
    ],
    whyItIsRisky: [
      'In legitimate financial markets, all investments carry market risk. Guaranteed high returns do not exist.',
      'Usually structured as Ponzi schemes where early returns are paid using money from newly recruited victims before collapsing entirely.'
    ],
    whatToCheck: [
      'Check if the entity is registered with SEBI as an Investment Adviser (RIA) or Portfolio Manager (PMS).',
      'SEBI regulations strictly prohibit registered intermediaries from offering guaranteed or assured returns.'
    ],
    whatNotToDo: [
      'Never transfer money based on claims of fixed or assured returns.',
      'Never rely on screenshots of ledger balances or bank notifications as proof.'
    ],
    quiz: {
      question: 'A Telegram group admin promises that if you deposit ₹20,000 today, you will receive guaranteed ₹5,000 every week for 6 months. What should you do?',
      options: [
        'Deposit ₹5,000 first as a small test amount',
        'Ask them to share their SEBI registration and proceed if they send a certificate photo',
        'Recognize that SEBI-regulated entities are prohibited from guaranteeing returns, decline, and report',
        'Forward the offer to friends to earn a referral commission'
      ],
      correctIndex: 2,
      explanation: 'Under SEBI regulations, no registered intermediary is permitted to guarantee returns in equity or securities markets. Photos of certificates are easily fabricated.'
    }
  },
  {
    slug: 'fake-trading-apps',
    title: 'Fake Trading Apps & APK Sideloading',
    shortDesc: 'Malicious mobile applications distributed outside Google Play Store or Apple App Store mimicking reputable brokers.',
    riskSeverity: 'CRITICAL',
    commonChannels: ['Direct download links via WhatsApp', 'Telegram VIP groups', 'Direct APK downloads'],
    whatItLooksLike: [
      '"Download our proprietary VIP Institutional APK to avoid standard trading fees"',
      '"Install this custom app to access pre-IPO institutional quota"',
      'App displays simulated huge profits that cannot be withdrawn'
    ],
    whyItIsRisky: [
      'Sideloaded APKs bypass Google Play Protect and security verification.',
      'The app displays fake numbers and mock profit balances. When you deposit money, it goes directly to scammers, and the app will freeze withdrawals.'
    ],
    whatToCheck: [
      'Only download trading applications directly from official verified developer pages on Google Play Store or Apple App Store.',
      'Confirm the app developer name matches the registered legal entity.'
    ],
    whatNotToDo: [
      'Never enable "Install from Unknown Sources" for trading apps.',
      'Never install APK files sent through chat groups.'
    ],
    quiz: {
      question: 'Someone in an investment group sends an Android APK file named "NSE-Institutional-Trading-Pro.apk" to access exclusive stocks. What is the safest response?',
      options: [
        'Scan it with phone antivirus and install if it reports clean',
        'Do not install it. Authentic stock exchanges and registered brokers only distribute official apps through verified app stores',
        'Install on an older secondary phone that has no personal banking apps',
        'Share it with colleagues to verify if anyone else uses it'
      ],
      correctIndex: 1,
      explanation: 'Legitimate financial entities never distribute trading apps as loose APK files in chats. Sideloading bypasses operating system security safeguards.'
    }
  },
  {
    slug: 'otp-credential-theft',
    title: 'OTP & Account Credential Theft',
    shortDesc: 'Social engineering and fake customer care portals designed to harvest one-time passwords, passwords, or MPINs.',
    riskSeverity: 'CRITICAL',
    commonChannels: ['Phone calls pretending to be broker support', 'Phishing SMS alerts', 'Spoofed login forms'],
    whatItLooksLike: [
      '"Your trading account is temporarily locked. Share the OTP sent to your mobile to verify KYC"',
      '"System detected unauthorized login. Read out the 6-digit code immediately to prevent funds transfer"'
    ],
    whyItIsRisky: [
      'OTPs are single-use authentication factors designed solely for the account holder to authorize money debits or security changes.',
      'Once an OTP is handed over, attackers can liquidate holdings or initiate instant bank transfers.'
    ],
    whatToCheck: [
      'Read the actual SMS text of the OTP: it specifies exactly what transaction the OTP is approving (e.g., "OTP for debit of ₹50,000").'
    ],
    whatNotToDo: [
      'NEVER share an OTP with ANYONE over phone, chat, email, or unverified web forms.',
      'Bank and broker representatives will NEVER ask for your OTP.'
    ],
    quiz: {
      question: 'A caller claiming to be from your broker states: "We need your OTP right now to complete mandatory SEBI KYC re-verification before 5:00 PM." How should you handle this?',
      options: [
        'Provide the OTP since it is for regulatory KYC compliance',
        'Ask the caller for their employee ID and then provide the OTP',
        'Hang up immediately. Legitimate brokers and SEBI never ask users to verbally disclose OTPs',
        'Request the caller to send an email first, then provide the OTP in reply'
      ],
      correctIndex: 2,
      explanation: 'No financial institution, regulator, or broker will ever ask for your OTP over a call or chat. Verbal requests for OTPs are always fraudulent.'
    }
  },
  {
    slug: 'regulatory-impersonation',
    title: 'Regulator & Broker Impersonation',
    shortDesc: 'Using logos, fake letters, forged registration certificates, and spoofed letterheads of SEBI, NSE, BSE, or NSDL.',
    riskSeverity: 'CRITICAL',
    commonChannels: ['Telegram profiles', 'WhatsApp business accounts', 'PDF certificates', 'Phishing websites'],
    whatItLooksLike: [
      'Profile pictures featuring official SEBI emblem or NSE logo',
      'Forged PDF letters titled "SEBI Approval Certificate for High Return Fund"',
      'Individuals claiming to be "SEBI authorized fund managers" managing personal money'
    ],
    whyItIsRisky: [
      'SEBI is a market regulator, not an investment company. SEBI does NOT endorse individual investment schemes, manage private funds, or guarantee individual returns.'
    ],
    whatToCheck: [
      'Always visit the official SEBI website (sebi.gov.in) to verify registration details directly via the Intermediary Directory.',
      'Check if the bank account name matches the registered intermediary legal name, not an individual person.'
    ],
    whatNotToDo: [
      'Never accept PDF certificates or ID cards sent via chat as proof of legitimacy.',
      'Never transfer money to personal bank accounts or individual UPI IDs.'
    ],
    quiz: {
      question: 'A WhatsApp adviser provides a PDF certificate showing a SEBI registration number (INZ00000000) and asks for ₹25,000 sent to their personal UPI ID. What is the key red flag?',
      options: [
        'The registration number has too many zeroes',
        'Payments for legitimate investment services must never be deposited to individual personal accounts, and registration must be verified on sebi.gov.in',
        'WhatsApp does not support financial transactions',
        'Advisers are required to meet you in person before accepting UPI'
      ],
      correctIndex: 1,
      explanation: 'Scammers frequently fabricate certificates with real or fake registration numbers. Genuine registered brokers only accept funds via official client bank accounts, never personal UPI handles.'
    }
  },
  {
    slug: 'withdrawal-fee-traps',
    title: 'Withdrawal Fees & Clearance Traps',
    shortDesc: 'Demanding upfront "tax", "clearance deposits", or "conversion fees" before allowing investors to withdraw supposed profits.',
    riskSeverity: 'HIGH',
    commonChannels: ['Fake crypto trading platforms', 'Telegram forex groups', 'VIP investment clubs'],
    whatItLooksLike: [
      '"Your account has ₹3,50,000 in profits. Pay 18% GST (₹63,000) to release the funds"',
      '"Your withdrawal is held by regulatory audit. Deposit ₹20,000 clearance security"'
    ],
    whyItIsRisky: [
      'In legitimate stock and mutual fund transactions, taxes and brokerage are automatically deducted from the proceeds or settled through standard clearing procedures.',
      'Any fee paid to unlock withdrawals is simply stolen, followed by requests for even more fees.'
    ],
    whatToCheck: [
      'Legitimate platforms never require upfront external payments to release your own account balance.'
    ],
    whatNotToDo: [
      'Never pay extra money to withdraw existing funds.',
      'Recognize that once a platform asks for a fee to release your money, it is an advance-fee fraud.'
    ],
    quiz: {
      question: 'A trading dashboard shows you earned ₹2,00,000, but customer support says: "You must pay ₹20,000 capital gains tax upfront to your assigned agent to release the withdrawal." What should you do?',
      options: [
        'Pay the ₹20,000 since tax payment is required by law',
        'Ask if you can pay 50% now and 50% after receiving the ₹2,00,000',
        'Do not pay any money. Legitimate brokers never require external upfront cash payments to release withdrawals',
        'Take a loan to cover the clearance fee quickly'
      ],
      correctIndex: 2,
      explanation: 'This is a hallmark of advance-fee fraud. Genuine brokers settle statutory charges and taxes internally; they never demand external upfront deposits to unlock funds.'
    }
  },
  {
    slug: 'pressure-tactics',
    title: 'Pressure Tactics & Manufactured Urgency',
    shortDesc: 'Artificial countdowns, limited slots, and aggressive messaging designed to induce FOMO and prevent verification.',
    riskSeverity: 'MEDIUM',
    commonChannels: ['Direct calls', 'Countdown timers on phishing pages', 'Urgent chat alerts'],
    whatItLooksLike: [
      '"Only 3 slots remaining at this entry price — offer expires in 15 minutes!"',
      '"Transfer right now to catch the market opening breakout or miss out forever"'
    ],
    whyItIsRisky: [
      'Scammers deliberately create time pressure to prevent victims from consulting trusted advisors, checking official websites, or thinking critically.'
    ],
    whatToCheck: [
      'Legitimate investments do not vanish in 15 minutes. Genuine advisers encourage thoughtful due diligence.'
    ],
    whatNotToDo: [
      'Never make financial commitments under immediate time distress.',
      'Take a 24-hour pause before acting on any unsolicited investment solicitation.'
    ],
    quiz: {
      question: 'A message says: "Urgent! Special institutional round closes in 20 minutes. Pay now or lose your spot forever." What is the objective of this tactic?',
      options: [
        'To ensure only decisive investors join the fund',
        'To bypass slow banking clearance hours',
        'To manufacture artificial panic so you transfer funds before independently verifying the offer',
        'To meet regulatory closing deadlines'
      ],
      correctIndex: 2,
      explanation: 'Manufactured urgency is an emotional manipulation technique to short-circuit analytical thinking and prevent the user from performing verification.'
    }
  },
  {
    slug: 'social-media-scams',
    title: 'Social Media & Influencer Impersonation',
    shortDesc: 'Fraudulent investment promotions using stolen photos, fake influencer profiles, or spoofed comments sections.',
    riskSeverity: 'MEDIUM',
    commonChannels: ['Instagram reels', 'YouTube comment sections', 'Facebook ads', 'X / Twitter mentions'],
    whatItLooksLike: [
      'Accounts copying the profile picture, bio, and handle of verified finance creators with slight spelling alterations',
      'Comment bots raving: "Mr. Sharma helped me earn ₹80,000 in 3 days, contact him on WhatsApp"',
      'Sponsored ads claiming a famous business tycoon is launching an automated wealth system'
    ],
    whyItIsRisky: [
      'Social media platforms often do not pre-verify the legal credentials of advertisers.',
      'Victims believe they are interacting with a recognized public figure when it is an anonymous operator.'
    ],
    whatToCheck: [
      'Check official verification badges and the exact username handle.',
      'Verify if the creator has posted warnings about fake copycat accounts.'
    ],
    whatNotToDo: [
      'Never contact WhatsApp numbers posted in YouTube or Instagram comments.',
      'Do not trust sponsored ads promoting secret algorithmic trading schemes.'
    ],
    quiz: {
      question: 'In the comment section of a popular stock analysis video, multiple users write: "DM Professor Rajiv on Telegram at @ProfRajivTrades for guaranteed 50% weekly returns." How should you interpret this?',
      options: [
        'They are genuine happy customers sharing their gratitude',
        'They are coordinated bot or sockpuppet accounts designed to funnel users into an unverified scam channel',
        'The video creator has officially partnered with Professor Rajiv',
        'The returns must be legitimate because YouTube comments are monitored'
      ],
      correctIndex: 1,
      explanation: 'Comment sections are heavily targeted by coordinated bot rings. Promoted personal chat handles in social comments are almost universally fraudulent solicitation traps.'
    }
  },
  {
    slug: 'deepfake-investment',
    title: 'Deepfake & AI Voice Impersonation',
    shortDesc: 'AI-synthesized video and voice cloning depicting corporate leaders, public officials, or family members soliciting investments.',
    riskSeverity: 'HIGH',
    commonChannels: ['Video ads on social feeds', 'WhatsApp video clips', 'Voice notes'],
    whatItLooksLike: [
      'Videos showing prominent industrialist or news anchor supposedly unveiling a secret state-backed investment platform',
      'Mouth movements slightly misaligned with spoken audio, unnatural blinking, robotic cadence'
    ],
    whyItIsRisky: [
      'Generative AI makes realistic audio/video synthesis accessible, creating unprecedented emotional trust and deceptive authority.'
    ],
    whatToCheck: [
      'Look for subtle audio-visual artifacts: lip sync mismatches, blurred teeth/mouth borders, or unnatural speech pauses.',
      'Verify whether the alleged announcement appears on any reputable mainstream financial news outlet.'
    ],
    whatNotToDo: [
      'Never act on sensational video announcements seen solely on social media without cross-checking official corporate press releases.'
    ],
    quiz: {
      question: 'You see a video of a famous billionaire entrepreneur promoting an automatic ₹10,000 AI investment platform with 10x returns. What is the most critical check?',
      options: [
        'Check if the video has high resolution 1080p quality',
        'Verify if this announcement appears on official company investor relations websites and reputable national news publications',
        'Check if the comments are positive',
        'Deposit a small trial sum to test if the platform works'
      ],
      correctIndex: 1,
      explanation: 'Major corporate or executive initiatives are always reported across legitimate financial news outlets and corporate investor relations portals. Deepfakes rely entirely on isolated social media distribution.'
    }
  }
];
