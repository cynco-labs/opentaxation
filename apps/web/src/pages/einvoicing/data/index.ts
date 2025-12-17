/**
 * E-Invoicing Data Module
 * Central export for all e-invoicing reference data
 */

// Phases and timeline
export {
  einvoicePhases,
  getPhaseByRevenue,
  getDaysUntilPhase,
  isInRelaxationPeriod,
  keyDates,
  ruleChanges,
  type EInvoicePhase
} from './phases';

// Industries
export {
  industries,
  industryCategories,
  getIndustriesByCategory,
  searchIndustries,
  getIndustryById,
  type Industry,
  type IndustryCategory
} from './industries';

// Document types
export {
  documentTypes,
  consolidatedRestrictions,
  submissionMethods,
  getDocumentTypeById,
  type DocumentType,
  type DocumentExample
} from './documentTypes';

// Self-billed scenarios
export {
  selfBilledScenarios,
  generalTIN,
  getScenarioById,
  getScenariosByIndustry,
  type SelfBilledScenario
} from './selfBilledScenarios';

// Implementation steps
export {
  implementationSteps,
  submissionMethodDecision,
  taxIncentives,
  getStepById,
  type ImplementationStep,
  type Substep,
  type Resource
} from './implementationSteps';

// Exemptions
export {
  exemptions,
  exemptionCategories,
  checkBasicExemption,
  getExemptionsByCategory,
  type Exemption,
  type ExemptionCategory,
  type ExemptionCheckResult
} from './exemptions';

// FAQ
export {
  faqs,
  faqCategories,
  getFAQsByCategory,
  searchFAQs,
  getFAQById,
  type FAQ,
  type FAQCategory
} from './faq';

/**
 * Entity types for compliance checker
 */
export const entityTypes = [
  {
    id: 'sdn-bhd',
    label: 'Sdn Bhd (Private Limited)',
    icon: 'Buildings',
    description: 'Private limited company registered with SSM'
  },
  {
    id: 'sole-prop',
    label: 'Sole Proprietor / Enterprise',
    icon: 'User',
    description: 'Individual business owner'
  },
  {
    id: 'partnership',
    label: 'Partnership / LLP',
    icon: 'UsersThree',
    description: 'Partnership or Limited Liability Partnership'
  },
  {
    id: 'plc',
    label: 'Public Listed Company',
    icon: 'ChartLineUp',
    description: 'Company listed on Bursa Malaysia'
  },
  {
    id: 'foreign',
    label: 'Foreign Company',
    icon: 'Globe',
    description: 'Foreign entity operating in Malaysia'
  },
  {
    id: 'npo',
    label: 'Non-Profit / Association',
    icon: 'HandHeart',
    description: 'NGO, society, or charitable organization'
  },
  {
    id: 'government',
    label: 'Government / Statutory Body',
    icon: 'Bank',
    description: 'Government entity or statutory body (typically exempt)'
  }
];

/**
 * Quick stats for hero section
 */
export const quickStats = [
  {
    label: 'Implementation Phases',
    value: '4',
    description: 'Based on revenue threshold'
  },
  {
    label: 'Exemption Threshold',
    value: 'RM1M',
    description: 'Annual revenue below this is exempt'
  },
  {
    label: 'Document Types',
    value: '5',
    description: 'Invoice, Credit/Debit Note, Refund, Self-Billed'
  },
  {
    label: 'Industries Covered',
    value: 'All',
    description: 'No industry exemptions'
  }
];

/**
 * Official resource links
 */
export const officialResources = [
  {
    id: 'lhdn-einvoice',
    title: 'LHDN E-Invoice Portal',
    description: 'Official e-invoicing information from LHDN',
    url: 'https://www.hasil.gov.my/en/e-invoice/',
    icon: 'FileText'
  },
  {
    id: 'mytax',
    title: 'MyTax Portal',
    description: 'Access MyInvois, check TIN, register for e-invoicing',
    url: 'https://mytax.hasil.gov.my/',
    icon: 'SignIn'
  },
  {
    id: 'sdk',
    title: 'MyInvois SDK',
    description: 'Technical documentation for API integration',
    url: 'https://sdk.myinvois.hasil.gov.my/',
    icon: 'Code'
  },
  {
    id: 'msic',
    title: 'MSIC Code Lookup',
    description: 'Find your business classification code',
    url: 'https://msic.stats.gov.my/bi/',
    icon: 'MagnifyingGlass'
  },
  {
    id: 'faq-pdf',
    title: 'LHDN FAQ Document',
    description: 'Official frequently asked questions PDF',
    url: 'https://www.hasil.gov.my/media/0xqitc2t/lhdnm-e-invoice-general-faqs.pdf',
    icon: 'Question'
  },
  {
    id: 'industry-faq',
    title: 'Industry-Specific FAQs',
    description: 'Official guides for specific industries',
    url: 'https://www.hasil.gov.my/en/e-invoice/reference-for-the-implementation-of-e-invoice/frequently-asked-questions/industry-specific-frequently-asked-questions/',
    icon: 'Factory'
  }
];
