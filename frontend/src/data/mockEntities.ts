import { EntityVerification } from '../types';

export const OFFICIAL_REGISTRY_SAMPLE: Record<string, Partial<EntityVerification>> = {
  'zerodha': {
    entityName: 'Zerodha Broking Limited',
    claimedRegistration: 'INZ000031633',
    entityType: 'Broker',
    status: 'VERIFIED_MATCH',
    source: 'SEBI Intermediary Database',
    sourceUrl: 'https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes',
    details: 'Active Stock Broker registered under SEBI. Official trading website is zerodha.com and kite.zerodha.com.',
    isMockData: false,
    matchedRecord: {
      legalName: 'Zerodha Broking Limited',
      sebiRegNo: 'INZ000031633',
      validity: 'Permanent / Active',
      officialDomain: 'zerodha.com'
    }
  },
  'groww': {
    entityName: 'Nextbillion Technology Private Limited (Groww)',
    claimedRegistration: 'INZ000301838',
    entityType: 'Broker',
    status: 'VERIFIED_MATCH',
    source: 'SEBI Intermediary Database',
    sourceUrl: 'https://www.sebi.gov.in',
    details: 'Active Stock Broker and Depository Participant registered with SEBI.',
    isMockData: false,
    matchedRecord: {
      legalName: 'Nextbillion Technology Private Limited',
      sebiRegNo: 'INZ000301838',
      validity: 'Active',
      officialDomain: 'groww.in'
    }
  },
  'angel one': {
    entityName: 'Angel One Limited',
    claimedRegistration: 'INZ000161534',
    entityType: 'Broker',
    status: 'VERIFIED_MATCH',
    source: 'SEBI Intermediary Database',
    sourceUrl: 'https://www.sebi.gov.in',
    details: 'Active Stock Broker and Research Analyst registered with SEBI.',
    isMockData: false,
    matchedRecord: {
      legalName: 'Angel One Limited',
      sebiRegNo: 'INZ000161534',
      validity: 'Active',
      officialDomain: 'angelone.in'
    }
  },
  'icici direct': {
    entityName: 'ICICI Securities Limited',
    claimedRegistration: 'INZ000183631',
    entityType: 'Broker',
    status: 'VERIFIED_MATCH',
    source: 'SEBI Intermediary Database',
    sourceUrl: 'https://www.sebi.gov.in',
    details: 'Active SEBI registered intermediary and Depository Participant.',
    isMockData: false,
    matchedRecord: {
      legalName: 'ICICI Securities Limited',
      sebiRegNo: 'INZ000183631',
      validity: 'Active',
      officialDomain: 'icicidirect.com'
    }
  }
};
