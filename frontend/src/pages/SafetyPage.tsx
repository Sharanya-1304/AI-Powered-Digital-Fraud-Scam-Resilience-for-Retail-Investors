import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Immediately Stop Pending Transactions & Payments',
      desc: 'Do not transfer any further funds under any pretext, including supposed "taxes", "processing charges", or "release deposits". Scammers operate fast-moving mule account rings.',
      urgent: true,
    },
    {
      num: 2,
      title: 'Never Disclose OTPs, Passwords, or MPINs',
      desc: 'No broker, regulator, exchange, or bank official will ever ask you to verbally tell them an OTP or enter it on an unverified link.',
      urgent: true,
    },
    {
      num: 3,
      title: 'Block and Preserve All Digital Evidence',
      desc: 'Do not delete the chat history. Take uncropped screenshots showing phone numbers, UPI handles, bank transaction IDs, website URLs, and chat logs.',
      urgent: false,
    },
    {
      num: 4,
      title: 'Report to National Cyber Crime Helpline (1930)',
      desc: 'If money was debited, call 1930 within the golden hour to initiate banking lien freezes. File a formal complaint online at cybercrime.gov.in.',
      urgent: true,
    },
    {
      num: 5,
      title: 'File Securities Grievance on SEBI SCORES',
      desc: 'If the fraudulent solicitation involved claims of SEBI-registered entities, file an official grievance through SCORES (scores.sebi.gov.in).',
      urgent: false,
    },
    {
      num: 6,
      title: 'Contact Depository Participant (NSDL / CDSL)',
      desc: 'If you suspect your demat account or holdings have been accessed, notify your Depository Participant immediately to freeze demat debits.',
      urgent: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>Investor Defense & Escalation Ladder</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Safety Action Plan & Grievance Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          If you have encountered a suspicious investment scheme or suspect financial fraud, follow these verified next steps in order of priority.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-7 text-white border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono font-bold text-amber-400">Immediate Emergency Hotline</div>
              <h2 className="text-2xl font-black tracking-wide text-white">Call 1930</h2>
            </div>
          </div>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition-all"
          >
            <span>Visit cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
          Operated by the Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs. The golden-hour reporting window is critical to freezing fraudulent fund flows across banking gateways.
        </p>
      </div>

      {/* 6-Point Priority Action Steps */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          The 6-Step Investor Defense Protocol
        </h3>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`p-5 rounded-2xl border transition-all ${
                step.urgent
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    step.urgent
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  0{step.num}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">
                      {step.title}
                    </h4>
                    {step.urgent && (
                      <span className="text-[10px] uppercase font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grievance Escalation Pathways */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900">
          Official Grievance & Complaint Redressal Channels
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">SEBI SCORES Portal</h4>
            <p className="text-slate-600 leading-relaxed">
              SEBI Complaints Redress System for grievances against registered stock brokers, investment advisers, or portfolio managers.
            </p>
            <a
              href="https://scores.sebi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 font-bold hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>scores.sebi.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">NSDL Investor Grievances</h4>
            <p className="text-slate-600 leading-relaxed">
              National Securities Depository Limited investor grievance cell for demat security discrepancies and depository inquiries.
            </p>
            <a
              href="https://nsdl.co.in/investor-grievances.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 font-bold hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>nsdl.co.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
