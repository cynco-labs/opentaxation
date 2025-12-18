/**
 * E-Invoice Exemptions
 * Who is exempt from e-invoicing requirements
 * Source: LHDN Guidelines
 */

export interface Exemption {
  id: string;
  category: ExemptionCategory;
  title: string;
  titleMalay: string;
  description: string;
  conditions?: string[];
  notes?: string;
}

export type ExemptionCategory =
  | 'persons'
  | 'revenue-threshold'
  | 'transactions'
  | 'special';

export const exemptionCategories: Record<ExemptionCategory, { label: string; icon: string }> = {
  'persons': { label: 'Exempt Persons', icon: 'UserCircle' },
  'revenue-threshold': { label: 'Revenue Threshold', icon: 'ChartBar' },
  'transactions': { label: 'Exempt Transactions', icon: 'Receipt' },
  'special': { label: 'Special Exemptions', icon: 'Star' }
};

export const exemptions: Exemption[] = [
  // Exempt Persons
  {
    id: 'ruler',
    category: 'persons',
    title: 'Ruler and Ruling Chief',
    titleMalay: 'Raja dan Ketua Memerintah',
    description: 'Current rulers and ruling chiefs of Malaysian states are exempt from issuing e-invoices.',
  },
  {
    id: 'former-ruler',
    category: 'persons',
    title: 'Former Ruler and Ruling Chief',
    titleMalay: 'Bekas Raja dan Ketua Memerintah',
    description: 'Former rulers and ruling chiefs retain their exemption status.',
  },
  {
    id: 'royal-consort',
    category: 'persons',
    title: 'Consort of Ruler',
    titleMalay: 'Permaisuri Raja',
    description: 'Consorts with titles of Raja Perempuan, Sultanah, Tengku Ampuan, Raja Permaisuri, Tengku Permaisuri, or Permaisuri are exempt.',
  },
  {
    id: 'former-royal-consort',
    category: 'persons',
    title: 'Consort of Former Ruler',
    titleMalay: 'Bekas Permaisuri Raja',
    description: 'Consorts of former rulers who previously held the listed royal titles.',
  },
  {
    id: 'government',
    category: 'persons',
    title: 'Federal Government',
    titleMalay: 'Kerajaan Persekutuan',
    description: 'The Federal Government of Malaysia is exempt from issuing e-invoices.',
  },
  {
    id: 'state-government',
    category: 'persons',
    title: 'State Government and State Authority',
    titleMalay: 'Kerajaan Negeri dan Pihak Berkuasa Negeri',
    description: 'All state governments and state authorities are exempt.',
  },
  {
    id: 'government-authority',
    category: 'persons',
    title: 'Government Authority',
    titleMalay: 'Pihak Berkuasa Kerajaan',
    description: 'Government authorities established under federal or state law are exempt.',
  },
  {
    id: 'local-authority',
    category: 'persons',
    title: 'Local Authority',
    titleMalay: 'Pihak Berkuasa Tempatan',
    description: 'City councils, municipal councils, and district councils are exempt.',
  },
  {
    id: 'statutory-body',
    category: 'persons',
    title: 'Statutory Authority and Statutory Body',
    titleMalay: 'Pihak Berkuasa Berkanun dan Badan Berkanun',
    description: 'Bodies established by statute including regulatory agencies and government-linked entities.',
  },
  {
    id: 'government-facilities',
    category: 'persons',
    title: 'Government Facilities',
    titleMalay: 'Kemudahan Kerajaan',
    description: 'Facilities provided by government, authorities, or statutory bodies such as government hospitals, clinics, and multipurpose halls.',
  },
  {
    id: 'diplomatic',
    category: 'persons',
    title: 'Diplomatic and Consular Personnel',
    titleMalay: 'Pegawai Diplomatik dan Konsular',
    description: 'Consular offices, diplomatic officers, consular officers, and consular employees are exempt.',
  },

  // Revenue Threshold
  {
    id: 'below-1m',
    category: 'revenue-threshold',
    title: 'Annual Revenue Below RM1 Million',
    titleMalay: 'Hasil Tahunan Bawah RM1 Juta',
    description: 'Businesses with annual turnover below RM1,000,000 are exempt from mandatory e-invoicing.',
    conditions: [
      'Must not have shareholders with revenue exceeding RM1 million',
      'Must not have subsidiaries with revenue exceeding RM1 million',
      'Must not have related companies exceeding threshold',
      'Must not have joint ventures exceeding threshold'
    ],
    notes: 'This threshold was raised from RM500,000 on 6 December 2025. If revenue exceeds RM1 million in a future year, compliance required from the second year after crossing threshold.'
  },
  {
    id: 'sole-prop-combined',
    category: 'revenue-threshold',
    title: 'Sole Proprietor Combined Revenue',
    titleMalay: 'Hasil Gabungan Milikan Tunggal',
    description: 'For sole proprietors with multiple businesses, all business revenues are combined to determine the threshold.',
    conditions: [
      'Total revenue across ALL businesses owned counts',
      'Even if individual businesses are below threshold, combined may exceed',
      'Once subject to e-invoicing, must continue even if revenue drops'
    ]
  },

  // Exempt Transactions
  {
    id: 'pre-implementation',
    category: 'transactions',
    title: 'Pre-Implementation Transactions',
    titleMalay: 'Transaksi Sebelum Pelaksanaan',
    description: 'Goods sold and services performed before your implementation date are exempt.',
    notes: 'E-invoice not required for transactions completed before your mandatory start date, even if payment received after.'
  },
  {
    id: 'government-collections',
    category: 'transactions',
    title: 'Government Collections',
    titleMalay: 'Kutipan Kerajaan',
    description: 'Collection of payments, fees, charges, statutory levies, summonses, compounds, and penalties under any written law.',
  },
  {
    id: 'securities-trading',
    category: 'transactions',
    title: 'Securities and Derivatives Trading',
    titleMalay: 'Perdagangan Sekuriti dan Derivatif',
    description: 'Contract value for buying or selling securities or derivatives traded on stock exchange or derivatives exchange.',
    conditions: [
      'Applies to exchanges in Malaysia or elsewhere',
      'Must be traded on recognized exchange',
      'OTC derivatives may have different treatment'
    ]
  },
  {
    id: 'share-disposal',
    category: 'transactions',
    title: 'Share Disposal (Certain Cases)',
    titleMalay: 'Pelupusan Saham (Kes Tertentu)',
    description: 'Disposal of shares of a company not listed on stock exchange is exempt in certain cases.',
    conditions: [
      'Exempt UNLESS the disposer is:',
      '- A company',
      '- A limited liability partnership',
      '- A trust body',
      '- A co-operative society'
    ]
  },
  {
    id: 'dividend-single-tier',
    category: 'transactions',
    title: 'Single-Tier Dividend Distributions',
    titleMalay: 'Pengagihan Dividen Peringkat Tunggal',
    description: 'Companies under single-tier taxation system and taxpayers listed on Bursa Malaysia are exempt from issuing self-billed e-invoices on dividend distributions.',
  },

  // Special Exemptions
  {
    id: 'subsidiary-exemption',
    category: 'special',
    title: 'Subsidiary of Compliant Company',
    titleMalay: 'Anak Syarikat Syarikat Patuh',
    description: 'Subsidiaries of companies that have implemented e-invoicing do NOT qualify for revenue threshold exemption.',
    notes: 'Even if subsidiary revenue is below RM1 million, if parent company has implemented e-invoicing, subsidiary must also comply.'
  }
];

/**
 * Check if a business might be exempt based on basic criteria
 */
export interface ExemptionCheckResult {
  isExempt: boolean;
  reason?: string;
  warnings: string[];
  recommendations: string[];
}

export function checkBasicExemption(
  entityType: string,
  annualRevenue: number,
  hasAffiliatesAboveThreshold: boolean
): ExemptionCheckResult {
  const warnings: string[] = [];

  // Check if it's an exempt person type
  const exemptPersonTypes = ['government', 'statutory-body', 'local-authority', 'diplomatic'];
  if (exemptPersonTypes.includes(entityType)) {
    return {
      isExempt: true,
      reason: 'Your entity type is exempt from e-invoicing requirements.',
      warnings: [],
      recommendations: ['Verify your exemption status with LHDN if uncertain.']
    };
  }

  // Check revenue threshold
  if (annualRevenue < 1_000_000) {
    if (hasAffiliatesAboveThreshold) {
      warnings.push('Although your revenue is below RM1 million, your affiliates may affect your exemption status.');
      return {
        isExempt: false,
        reason: 'Affiliates above threshold disqualify revenue exemption.',
        warnings,
        recommendations: ['Check if parent company, subsidiaries, or related companies have implemented e-invoicing.']
      };
    }

    return {
      isExempt: true,
      reason: 'Annual revenue below RM1 million exemption threshold.',
      warnings: ['If your revenue exceeds RM1 million in future, you must comply from the second year after.'],
      recommendations: ['Keep records of annual revenue for threshold monitoring.']
    };
  }

  // Above threshold - not exempt
  return {
    isExempt: false,
    reason: `Annual revenue of RM${(annualRevenue / 1_000_000).toFixed(1)} million exceeds the RM1 million exemption threshold.`,
    warnings,
    recommendations: [
      'Determine your implementation phase based on revenue.',
      'Start preparing for e-invoicing compliance.'
    ]
  };
}

/**
 * Get exemptions by category
 */
export function getExemptionsByCategory(category: ExemptionCategory): Exemption[] {
  return exemptions.filter(e => e.category === category);
}
