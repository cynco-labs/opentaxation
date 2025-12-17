/**
 * Industry-Specific E-Invoice Guidelines
 * Based on LHDN Industry-Specific FAQs
 * Source: https://www.hasil.gov.my/en/e-invoice/reference-for-the-implementation-of-e-invoice/frequently-asked-questions/industry-specific-frequently-asked-questions/
 */

export interface Industry {
  id: string;
  name: string;
  nameMalay: string;
  icon: string; // Phosphor icon name
  category: IndustryCategory;
  summary: string;
  consolidatedAllowed: boolean;
  consolidatedNotes?: string;
  selfBilledScenarios: string[]; // IDs from selfBilledScenarios.ts
  keyPoints: string[];
  commonTransactions: string[];
  specialRules?: string[];
  officialGuideUrl?: string;
}

export type IndustryCategory =
  | 'services'
  | 'retail-commerce'
  | 'manufacturing-construction'
  | 'finance-insurance'
  | 'transport-logistics'
  | 'other';

export const industryCategories: Record<IndustryCategory, { label: string; icon: string }> = {
  'services': { label: 'Services', icon: 'Briefcase' },
  'retail-commerce': { label: 'Retail & Commerce', icon: 'Storefront' },
  'manufacturing-construction': { label: 'Manufacturing & Construction', icon: 'Factory' },
  'finance-insurance': { label: 'Finance & Insurance', icon: 'Bank' },
  'transport-logistics': { label: 'Transport & Logistics', icon: 'Truck' },
  'other': { label: 'Other Sectors', icon: 'Buildings' }
};

export const industries: Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    nameMalay: 'Penjagaan Kesihatan',
    icon: 'FirstAidKit',
    category: 'services',
    summary: 'Hospitals, clinics, pharmacies, medical laboratories, and healthcare providers',
    consolidatedAllowed: true,
    consolidatedNotes: 'Allowed for B2C patient transactions where patient does not request e-invoice',
    selfBilledScenarios: ['insurance-claims'],
    keyPoints: [
      'Can continue existing invoicing arrangements under e-invoice mandate',
      'Insurance claim settlements may require self-billed e-invoice',
      'Medical supplies procurement follows standard B2B rules',
      'Patient billing can use consolidated e-invoice for B2C'
    ],
    commonTransactions: [
      'Patient consultation fees',
      'Medical procedures and treatments',
      'Pharmacy sales',
      'Laboratory tests',
      'Insurance claim reimbursements'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'construction',
    name: 'Construction',
    nameMalay: 'Pembinaan',
    icon: 'HardHat',
    category: 'manufacturing-construction',
    summary: 'Contractors, subcontractors, developers, and construction material suppliers',
    consolidatedAllowed: false,
    consolidatedNotes: 'NOT allowed for sales of construction materials under CIDB Act 1994',
    selfBilledScenarios: ['foreign-suppliers', 'non-business-individuals'],
    keyPoints: [
      'Progress claims require individual e-invoices',
      'Subcontractor payments need e-invoices (including penalties)',
      'Construction materials sales cannot use consolidated e-invoice',
      'Main contractors can maintain current billing cycles'
    ],
    commonTransactions: [
      'Progress billing/claims',
      'Subcontractor payments',
      'Material purchases',
      'Equipment rental',
      'Professional services (architects, engineers)'
    ],
    specialRules: [
      'Certification of work completion does not exempt from e-invoice',
      'Variation orders require separate e-invoices',
      'Retention money releases need e-invoice documentation'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    nameMalay: 'Telekomunikasi',
    icon: 'WifiHigh',
    category: 'services',
    summary: 'Telcos, internet service providers, mobile operators, and communication services',
    consolidatedAllowed: true,
    consolidatedNotes: 'Allowed for individual consumer subscriptions',
    selfBilledScenarios: ['agents-dealers', 'foreign-suppliers'],
    keyPoints: [
      'Monthly subscription billing follows standard e-invoice rules',
      'Dealer/agent commissions require self-billed e-invoices',
      'Prepaid top-ups can use consolidated e-invoices',
      'B2B corporate accounts need individual e-invoices'
    ],
    commonTransactions: [
      'Monthly subscriptions',
      'Prepaid credits/top-ups',
      'Device sales',
      'Installation services',
      'Dealer commissions'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    nameMalay: 'E-Dagang',
    icon: 'ShoppingCartSimple',
    category: 'retail-commerce',
    summary: 'Online marketplaces, e-commerce platforms, dropshippers, and digital sellers',
    consolidatedAllowed: true,
    consolidatedNotes: 'Platforms can issue consolidated e-invoices for seller payouts',
    selfBilledScenarios: ['ecommerce-platforms', 'agents-dealers', 'foreign-suppliers'],
    keyPoints: [
      'Platforms (Shopee, Lazada) issue self-billed e-invoices for seller payments',
      'Individual sellers must comply based on their revenue threshold',
      'Cross-border sales require proper documentation',
      'Platform fees and commissions follow standard rules'
    ],
    commonTransactions: [
      'Product sales',
      'Platform commissions',
      'Seller payouts',
      'Shipping fees',
      'Return/refund processing'
    ],
    specialRules: [
      'Marketplace operators responsible for platform-level compliance',
      'Individual sellers responsible for their own B2B transactions',
      'Dropshippers must issue e-invoices to end customers'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'petroleum',
    name: 'Petroleum Operations',
    nameMalay: 'Operasi Petroleum',
    icon: 'GasPump',
    category: 'manufacturing-construction',
    summary: 'Oil & gas companies, petrol stations, refineries, and energy distributors',
    consolidatedAllowed: true,
    consolidatedNotes: 'Retail fuel sales to consumers can be consolidated',
    selfBilledScenarios: ['foreign-suppliers'],
    keyPoints: [
      'Retail fuel sales can use consolidated e-invoices',
      'Fleet card transactions may need individual e-invoices',
      'Upstream operations follow B2B rules',
      'Import of petroleum products requires self-billed e-invoices'
    ],
    commonTransactions: [
      'Fuel retail sales',
      'Wholesale fuel distribution',
      'Fleet card transactions',
      'Lubricant sales',
      'Equipment and supplies'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'insurance-takaful',
    name: 'Insurance & Takaful',
    nameMalay: 'Insurans & Takaful',
    icon: 'ShieldCheck',
    category: 'finance-insurance',
    summary: 'Insurance companies, takaful operators, brokers, and agents',
    consolidatedAllowed: false,
    consolidatedNotes: 'Individual e-invoices required for policy transactions',
    selfBilledScenarios: ['insurance-claims', 'agents-dealers'],
    keyPoints: [
      'Premium payments require individual e-invoices',
      'Claim payouts may require self-billed e-invoices from claimants',
      'Agent commissions need self-billed e-invoices',
      'Takaful follows same rules as conventional insurance'
    ],
    commonTransactions: [
      'Premium collections',
      'Claim settlements',
      'Agent/broker commissions',
      'Policy administration fees',
      'Investment-linked transactions'
    ],
    specialRules: [
      'Insurers issuing claim payments issue standard e-invoice',
      'When claimant provides service (repairs), self-billed may apply'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'aviation',
    name: 'Aviation',
    nameMalay: 'Penerbangan',
    icon: 'Airplane',
    category: 'transport-logistics',
    summary: 'Airlines, airports, ground handlers, and aviation service providers',
    consolidatedAllowed: false,
    consolidatedNotes: 'Ticket sales and cargo require individual e-invoices',
    selfBilledScenarios: ['foreign-suppliers'],
    keyPoints: [
      'Ticket sales require individual e-invoices',
      'Cargo services need proper e-invoice documentation',
      'Airport charges and fees follow B2B rules',
      'International transactions may need self-billing'
    ],
    commonTransactions: [
      'Passenger ticket sales',
      'Cargo and freight services',
      'Ground handling fees',
      'Airport service charges',
      'In-flight sales'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'tourism',
    name: 'Tourism & Hospitality',
    nameMalay: 'Pelancongan & Hospitaliti',
    icon: 'Buildings',
    category: 'services',
    summary: 'Hotels, travel agencies, tour operators, and hospitality services',
    consolidatedAllowed: true,
    consolidatedNotes: 'Walk-in guests not requesting e-invoice can be consolidated',
    selfBilledScenarios: ['agents-dealers', 'foreign-suppliers'],
    keyPoints: [
      'Hotel bookings require e-invoices for B2B',
      'Walk-in guests can be consolidated if no e-invoice requested',
      'Travel agency commissions may need self-billing',
      'OTA (Online Travel Agent) transactions follow e-commerce rules'
    ],
    commonTransactions: [
      'Room bookings',
      'Tour packages',
      'F&B services',
      'Event hosting',
      'Travel agency services'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    nameMalay: 'Perkhidmatan Kewangan',
    icon: 'CurrencyCircleDollar',
    category: 'finance-insurance',
    summary: 'Banks, stockbrokers, unit trusts, money changers, and financial institutions',
    consolidatedAllowed: false,
    consolidatedNotes: 'Financial transactions typically require individual documentation',
    selfBilledScenarios: ['profit-distribution', 'interest-payments', 'agents-dealers'],
    keyPoints: [
      'Interest payments may require self-billed e-invoices',
      'Unit trust distributions need proper documentation',
      'Brokerage commissions follow standard B2B rules',
      'Money changing services require e-invoices'
    ],
    commonTransactions: [
      'Banking fees and charges',
      'Investment transactions',
      'Brokerage commissions',
      'Currency exchange',
      'Fund management fees'
    ],
    specialRules: [
      'Dividend distributions from listed companies exempt from self-billing',
      'Non-listed unit trust distributions require self-billed e-invoice'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'fnb',
    name: 'Food & Beverage',
    nameMalay: 'Makanan & Minuman',
    icon: 'ForkKnife',
    category: 'retail-commerce',
    summary: 'Restaurants, cafes, food manufacturers, and F&B outlets',
    consolidatedAllowed: true,
    consolidatedNotes: 'Walk-in customers not requesting e-invoice can be consolidated daily',
    selfBilledScenarios: ['agents-dealers', 'non-business-individuals'],
    keyPoints: [
      'Dine-in customers can be consolidated if no e-invoice requested',
      'Delivery platform sales follow e-commerce rules',
      'Catering services to businesses need individual e-invoices',
      'Food supplier purchases follow B2B rules'
    ],
    commonTransactions: [
      'Dine-in sales',
      'Takeaway orders',
      'Delivery sales',
      'Catering services',
      'Ingredient purchases'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'retail',
    name: 'Retail',
    nameMalay: 'Runcit',
    icon: 'Storefront',
    category: 'retail-commerce',
    summary: 'Retail stores, supermarkets, department stores, and general merchandise',
    consolidatedAllowed: true,
    consolidatedNotes: 'Consumer sales not requesting e-invoice can be consolidated',
    selfBilledScenarios: ['agents-dealers', 'foreign-suppliers'],
    keyPoints: [
      'POS systems need e-invoice integration',
      'Consumer sales can use consolidated e-invoices',
      'B2B wholesale transactions need individual e-invoices',
      'Returns and refunds require credit/debit notes'
    ],
    commonTransactions: [
      'Consumer retail sales',
      'Wholesale transactions',
      'Supplier purchases',
      'Returns and exchanges',
      'Gift card sales'
    ],
    specialRules: [
      'Luxury goods may have additional requirements',
      'Cross-border retail needs proper documentation'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    nameMalay: 'Pembuatan',
    icon: 'Factory',
    category: 'manufacturing-construction',
    summary: 'Factories, production facilities, and industrial manufacturers',
    consolidatedAllowed: false,
    consolidatedNotes: 'B2B sales require individual e-invoices',
    selfBilledScenarios: ['foreign-suppliers', 'non-business-individuals'],
    keyPoints: [
      'All B2B sales require individual e-invoices',
      'Raw material imports need self-billed e-invoices',
      'Contract manufacturing follows standard B2B rules',
      'Export sales require proper documentation'
    ],
    commonTransactions: [
      'Product sales',
      'Raw material purchases',
      'Equipment and machinery',
      'Maintenance services',
      'Subcontracted work'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'wholesale',
    name: 'Wholesale & Distribution',
    nameMalay: 'Borong & Pengedaran',
    icon: 'Package',
    category: 'retail-commerce',
    summary: 'Wholesalers, distributors, and supply chain intermediaries',
    consolidatedAllowed: false,
    consolidatedNotes: 'B2B transactions require individual e-invoices',
    selfBilledScenarios: ['foreign-suppliers', 'agents-dealers'],
    keyPoints: [
      'All wholesale transactions need individual e-invoices',
      'Distributor margins and rebates require documentation',
      'Import of goods needs self-billed e-invoices',
      'Multi-tier distribution chains each need e-invoices'
    ],
    commonTransactions: [
      'Bulk sales to retailers',
      'Import and distribution',
      'Rebates and incentives',
      'Logistics services',
      'Warehousing'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    nameMalay: 'Perkhidmatan Profesional',
    icon: 'Briefcase',
    category: 'services',
    summary: 'Consultants, lawyers, accountants, architects, engineers, and advisors',
    consolidatedAllowed: false,
    consolidatedNotes: 'Professional fees require individual e-invoices',
    selfBilledScenarios: ['foreign-suppliers', 'non-business-individuals'],
    keyPoints: [
      'Professional fees require individual e-invoices per client',
      'Retainer arrangements need periodic e-invoices',
      'Disbursements on behalf of clients require documentation',
      'Subcontracted professional work follows B2B rules'
    ],
    commonTransactions: [
      'Consulting fees',
      'Legal services',
      'Audit and accounting',
      'Architectural/engineering services',
      'Advisory and training'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'donations',
    name: 'Donations & Contributions',
    nameMalay: 'Derma & Sumbangan',
    icon: 'HandHeart',
    category: 'other',
    summary: 'Charitable organizations, NGOs, foundations, and donation recipients',
    consolidatedAllowed: true,
    consolidatedNotes: 'Small anonymous donations may be consolidated',
    selfBilledScenarios: [],
    keyPoints: [
      'Donation receipts still required for tax relief claims',
      'Approved charitable organizations have specific guidelines',
      'Corporate donations need proper e-invoice documentation',
      'Zakat payments have separate documentation requirements'
    ],
    commonTransactions: [
      'Cash donations',
      'In-kind contributions',
      'Sponsorships',
      'Grants',
      'Membership fees'
    ],
    specialRules: [
      'Approved organizations under Section 44(6) have specific rules',
      'Political donations have separate requirements'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'education',
    name: 'Education',
    nameMalay: 'Pendidikan',
    icon: 'GraduationCap',
    category: 'services',
    summary: 'Schools, universities, training centers, and educational institutions',
    consolidatedAllowed: true,
    consolidatedNotes: 'Student fees can be consolidated for individuals not requesting e-invoice',
    selfBilledScenarios: ['foreign-suppliers'],
    keyPoints: [
      'Tuition fees to individuals can use consolidated e-invoices',
      'Corporate training requires individual e-invoices',
      'Book and material sales follow retail rules',
      'Government/public institutions may have exemptions'
    ],
    commonTransactions: [
      'Tuition and course fees',
      'Examination fees',
      'Book and material sales',
      'Corporate training',
      'Facility rentals'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'property',
    name: 'Property & Real Estate',
    nameMalay: 'Hartanah',
    icon: 'House',
    category: 'other',
    summary: 'Property developers, real estate agents, property managers, and landlords',
    consolidatedAllowed: false,
    consolidatedNotes: 'Property transactions require individual documentation',
    selfBilledScenarios: ['rental-non-business'],
    keyPoints: [
      'Property sales require e-invoices',
      'Rental income from business landlords needs e-invoices',
      'Rental to non-business landlords requires self-billing by tenant',
      'Property management fees follow B2B rules'
    ],
    commonTransactions: [
      'Property sales',
      'Rental collections',
      'Property management fees',
      'Agent commissions',
      'Maintenance charges'
    ],
    specialRules: [
      'Joint ownership properties need clear invoicing arrangements',
      'Strata management has specific requirements'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  },
  {
    id: 'logistics',
    name: 'Logistics & Freight',
    nameMalay: 'Logistik & Fret',
    icon: 'Truck',
    category: 'transport-logistics',
    summary: 'Courier services, freight forwarders, shipping companies, and logistics providers',
    consolidatedAllowed: false,
    consolidatedNotes: 'B2B logistics services require individual e-invoices',
    selfBilledScenarios: ['foreign-suppliers'],
    keyPoints: [
      'Freight charges require individual e-invoices',
      'International shipping needs proper documentation',
      'Customs and duties handling has specific rules',
      'Last-mile delivery follows standard rules'
    ],
    commonTransactions: [
      'Freight and shipping',
      'Courier services',
      'Warehousing',
      'Customs clearance',
      'Packaging services'
    ],
    officialGuideUrl: 'https://www.hasil.gov.my/en/e-invoice/'
  }
];

/**
 * Get industries by category
 */
export function getIndustriesByCategory(category: IndustryCategory): Industry[] {
  return industries.filter(i => i.category === category);
}

/**
 * Search industries by keyword
 */
export function searchIndustries(query: string): Industry[] {
  const lowerQuery = query.toLowerCase();
  return industries.filter(i =>
    i.name.toLowerCase().includes(lowerQuery) ||
    i.summary.toLowerCase().includes(lowerQuery) ||
    i.commonTransactions.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get industry by ID
 */
export function getIndustryById(id: string): Industry | undefined {
  return industries.find(i => i.id === id);
}
