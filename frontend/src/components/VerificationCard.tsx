import React from 'react';
import { EntityVerification } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ExternalLink, AlertTriangle } from 'lucide-react';

interface VerificationCardProps {
  entity: EntityVerification;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ entity }) => {
  const isMatch = entity.status === 'VERIFIED_MATCH';
  const isNoMatch = entity.status === 'NO_MATCH_FOUND';
  const isAmbiguous = entity.status === 'AMBIGUOUS';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Entity Verification
            </span>
            {entity.isMockData && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                Demo Verification
              </span>
            )}
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-0.5">
            {entity.entityName}
          </h4>
          {entity.claimedRegistration && (
            <p className="text-xs font-mono text-slate-500">
              Claimed Reg No: <span className="text-slate-800 font-semibold">{entity.claimedRegistration}</span>
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div>
          {isMatch && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Match</span>
            </span>
          )}
          {isNoMatch && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <XCircle className="w-3.5 h-3.5" />
              <span>No Match Found</span>
            </span>
          )}
          {isAmbiguous && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ambiguous Record</span>
            </span>
          )}
        </div>
      </div>

      {/* Details snippet */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
        <p>{entity.details}</p>
        {entity.matchedRecord && (
          <div className="mt-2 pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div>Legal Name: <strong className="text-slate-900 font-sans">{entity.matchedRecord.legalName}</strong></div>
            <div>SEBI Reg: <strong className="text-cyan-700">{entity.matchedRecord.sebiRegNo}</strong></div>
            <div>Validity: <strong className="text-emerald-700">{entity.matchedRecord.validity}</strong></div>
            <div>Domain: <strong className="text-slate-900">{entity.matchedRecord.officialDomain}</strong></div>
          </div>
        )}
      </div>

      {/* Critical Verification Warning (Section 24 Rule) */}
      <div className="flex items-start gap-2 bg-amber-500/10 p-3 rounded-lg border border-amber-400/40 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Important Security Note:</strong> A registration match in SEBI records does <em>not</em> prove that a particular private message, phone call, or payment request is genuine. Scammers frequently impersonate genuine registered brokers.
        </p>
      </div>

      {/* Footer / CTA */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-slate-400">
          Source: <strong className="text-slate-600">{entity.source}</strong>
        </span>
        <a
          href={entity.sourceUrl || 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-cyan-600 hover:text-cyan-800"
        >
          <span>Open Official SEBI Source</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
