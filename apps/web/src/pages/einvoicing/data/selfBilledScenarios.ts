/**
 * Self-Billed E-Invoice Scenarios
 * 10 key scenarios where buyer issues e-invoice instead of seller
 * Source: https://jomeinvoice.my/self-billed-e-invoice-malaysia-scenarios/
 */

export interface SelfBilledScenario {
  id: string;
  title: string;
  titleMalay: string;
  icon: string;
  description: string;
  detailedExplanation: string;
  example: {
    situation: string;
    issuer: string;
    recipient: string;
    action: string;
  };
  keyRules: string[];
  requiredInfo: {
    forMalaysian: string[];
    forForeigner: string[];
  };
  consolidatedAllowed: boolean;
  relatedIndustries: string[];
}

export const selfBilledScenarios: SelfBilledScenario[] = [
  {
    id: 'agents-dealers',
    title: 'Payments to Agents, Dealers & Distributors',
    titleMalay: 'Pembayaran kepada Ejen, Pengedar & Pengedar',
    icon: 'Users',
    description: 'Commission payments to intermediaries who sell products or services on behalf of a company',
    detailedExplanation: 'When a business pays commissions, incentives, or other compensation to agents, dealers, or distributors for their sales efforts, the paying business must issue a self-billed e-invoice. This applies regardless of whether the recipient is an individual or a company.',
    example: {
      situation: 'Sarah, a sales agent for MegaFashion Sdn Bhd, successfully sells designer clothing worth RM50,000 and earns a 15% commission (RM7,500).',
      issuer: 'MegaFashion Sdn Bhd',
      recipient: 'Sarah (Sales Agent)',
      action: 'MegaFashion issues self-billed e-invoice for RM7,500 commission as proof of expense and Sarah\'s income'
    },
    keyRules: [
      'Consolidated e-invoice NOT allowed for agent payments',
      'Each transaction must be individually e-invoiced',
      'Applies even if agent has multiple sales in same month',
      'Must issue within stipulated timeframe'
    ],
    requiredInfo: {
      forMalaysian: ['Full name', 'MyKad number', 'TIN (or use EI00000000010 if only MyKad provided)', 'Address', 'Contact'],
      forForeigner: ['Full name as per passport', 'Passport number', 'Country', 'Address']
    },
    consolidatedAllowed: false,
    relatedIndustries: ['insurance-takaful', 'ecommerce', 'retail', 'telecommunications']
  },
  {
    id: 'foreign-suppliers',
    title: 'Purchases from Foreign Suppliers',
    titleMalay: 'Pembelian dari Pembekal Asing',
    icon: 'Globe',
    description: 'Imports of goods or services from overseas vendors who don\'t use Malaysia\'s MyInvois system',
    detailedExplanation: 'When a Malaysian business acquires goods or services from a foreign supplier, the foreign entity is not required to issue Malaysian e-invoices. Therefore, the Malaysian buyer must issue a self-billed e-invoice to document the transaction for their records and tax purposes.',
    example: {
      situation: 'Tech Solutions Sdn Bhd hires ABC Advisory Ltd, a UK-based legal firm, for international compliance services costing RM25,000.',
      issuer: 'Tech Solutions Sdn Bhd (Malaysian Buyer)',
      recipient: 'ABC Advisory Ltd (UK Supplier)',
      action: 'Tech Solutions issues self-billed e-invoice to record the RM25,000 expense'
    },
    keyRules: [
      'Self-billed e-invoice does not need to be shared with foreign supplier',
      'LHDN notification sent to Malaysian buyer only',
      'Use MSIC code "00000" for foreign suppliers without classification',
      'Use "NA" for activity description when not applicable'
    ],
    requiredInfo: {
      forMalaysian: ['N/A - This scenario is for foreign entities'],
      forForeigner: ['Company/individual name', 'Country code', 'Address', 'Registration number (if available)']
    },
    consolidatedAllowed: true,
    relatedIndustries: ['manufacturing', 'wholesale', 'ecommerce', 'professional-services']
  },
  {
    id: 'profit-distribution',
    title: 'Profit Distribution from Non-Listed Entities',
    titleMalay: 'Pengagihan Keuntungan dari Entiti Tidak Tersenarai',
    icon: 'ChartPieSlice',
    description: 'Distributions from non-listed unit trusts, partnerships, and similar entities',
    detailedExplanation: 'When profits or dividends are distributed from non-listed entities such as unlisted unit trusts, the recipient may need to issue a self-billed e-invoice. However, distributions from public listed companies are exempt from self-billing requirements.',
    example: {
      situation: 'Capital Growth Fund (unlisted unit trust) distributes RM10,000 profit to an investor.',
      issuer: 'Investor (Recipient)',
      recipient: 'Capital Growth Fund (Distributor)',
      action: 'Investor issues self-billed e-invoice to document the distribution received'
    },
    keyRules: [
      'Applies to non-listed unit trusts and similar vehicles',
      'Public listed company dividends are EXEMPT',
      'Single-tier dividend distributions may have different treatment',
      'Check latest guidelines for specific scenarios'
    ],
    requiredInfo: {
      forMalaysian: ['Fund/entity name', 'Registration number', 'Distribution amount', 'Distribution date'],
      forForeigner: ['Same as Malaysian requirements']
    },
    consolidatedAllowed: false,
    relatedIndustries: ['financial-services']
  },
  {
    id: 'ecommerce-platforms',
    title: 'E-Commerce Platform Seller Payouts',
    titleMalay: 'Pembayaran Penjual Platform E-Dagang',
    icon: 'ShoppingBagOpen',
    description: 'Payments from e-commerce platforms like Shopee and Lazada to their sellers',
    detailedExplanation: 'When e-commerce platforms make payouts to sellers for completed sales, the platform issues self-billed e-invoices on behalf of sellers who may not have their own invoicing systems. This ensures proper documentation of seller income.',
    example: {
      situation: 'Shopee processes RM8,000 in sales for a small home business seller and makes the payout after deducting platform fees.',
      issuer: 'Shopee Malaysia (Platform)',
      recipient: 'Home Business Seller',
      action: 'Shopee issues self-billed e-invoice documenting the seller payout'
    },
    keyRules: [
      'Platform responsible for issuing self-billed e-invoices',
      'Seller receives documentation for their records',
      'Platform fees may be shown separately',
      'Individual sellers still responsible for their own B2B transactions'
    ],
    requiredInfo: {
      forMalaysian: ['Seller registration details', 'Bank account info', 'Sales summary'],
      forForeigner: ['Passport/identification', 'Country', 'Banking details']
    },
    consolidatedAllowed: false,
    relatedIndustries: ['ecommerce', 'retail']
  },
  {
    id: 'betting-gaming',
    title: 'Betting & Gaming Winner Payouts',
    titleMalay: 'Pembayaran Pemenang Pertaruhan & Permainan',
    icon: 'Trophy',
    description: 'Payments made to winners in legitimate betting and gaming activities',
    detailedExplanation: 'When licensed betting or gaming operators pay out winnings to winners, they must issue self-billed e-invoices to document these payments. This ensures proper record-keeping for both the operator and winner.',
    example: {
      situation: 'Sports Toto pays RM50,000 jackpot winnings to a lucky winner.',
      issuer: 'Sports Toto (Gaming Operator)',
      recipient: 'Jackpot Winner',
      action: 'Sports Toto issues self-billed e-invoice for the RM50,000 payout'
    },
    keyRules: [
      'Applies to licensed gaming operators only',
      'Winner identification required',
      'Consolidated e-invoice NOT allowed',
      'Each payout must be individually documented'
    ],
    requiredInfo: {
      forMalaysian: ['Winner\'s full name', 'MyKad number', 'Winning amount', 'Game/draw reference'],
      forForeigner: ['Passport details', 'Country', 'Winning amount']
    },
    consolidatedAllowed: false,
    relatedIndustries: []
  },
  {
    id: 'non-business-individuals',
    title: 'Acquisitions from Non-Business Individuals',
    titleMalay: 'Pemerolehan dari Individu Bukan Perniagaan',
    icon: 'User',
    description: 'Purchases of goods or services from individuals who are not conducting business',
    detailedExplanation: 'When a business purchases goods or services from an individual who is not operating a business (and therefore has no obligation to issue invoices), the buying business must issue a self-billed e-invoice to document the transaction.',
    example: {
      situation: 'Furniture Recycle Sdn Bhd buys antique furniture worth RM3,000 from a private individual clearing their home.',
      issuer: 'Furniture Recycle Sdn Bhd (Buyer)',
      recipient: 'Private Individual (Seller)',
      action: 'Furniture Recycle issues self-billed e-invoice for the RM3,000 purchase'
    },
    keyRules: [
      'Applies when seller is not conducting business',
      'If seller is a registered business, they should issue standard e-invoice',
      'Common for secondhand goods, agricultural produce from farmers',
      'Must obtain proper identification from seller'
    ],
    requiredInfo: {
      forMalaysian: ['Full name', 'MyKad number', 'Address', 'Description of goods/services'],
      forForeigner: ['Full name as per passport', 'Passport number', 'Country', 'Address']
    },
    consolidatedAllowed: false,
    relatedIndustries: ['retail', 'manufacturing', 'wholesale']
  },
  {
    id: 'interest-payments',
    title: 'Interest Payments',
    titleMalay: 'Pembayaran Faedah',
    icon: 'Percent',
    description: 'Interest payments made to lenders or depositors, with specific exceptions',
    detailedExplanation: 'Generally, interest payments may require self-billed e-invoices. However, there are exceptions when financial institutions, employers, or certain foreign entities are the payers - in those cases, the payer issues a regular e-invoice instead.',
    example: {
      situation: 'ABC Sdn Bhd pays RM5,000 in interest to an individual who provided a personal loan to the company.',
      issuer: 'ABC Sdn Bhd (Borrower)',
      recipient: 'Individual Lender',
      action: 'ABC Sdn Bhd issues self-billed e-invoice for the interest payment'
    },
    keyRules: [
      'Financial institutions paying interest issue regular e-invoices (not self-billed)',
      'Employer paying interest to employees issues regular e-invoice',
      'Company borrowing from individuals uses self-billed',
      'Check specific scenarios in LHDN guidelines'
    ],
    requiredInfo: {
      forMalaysian: ['Lender details', 'Interest amount', 'Loan reference', 'Period covered'],
      forForeigner: ['Same as Malaysian, plus country code']
    },
    consolidatedAllowed: false,
    relatedIndustries: ['financial-services']
  },
  {
    id: 'insurance-claims',
    title: 'Insurance Claim Settlements',
    titleMalay: 'Penyelesaian Tuntutan Insurans',
    icon: 'ShieldCheck',
    description: 'Claim payments made by insurance companies to claimants or service providers',
    detailedExplanation: 'When an insurer settles a claim, the documentation requirements depend on the nature of the payment. If the claimant provides a service (like repairs), self-billing may apply. Direct compensation payments may have different treatment.',
    example: {
      situation: 'Car insurance company pays RM15,000 to a workshop for vehicle repair on behalf of the insured customer.',
      issuer: 'Insurance Company',
      recipient: 'Workshop (Service Provider)',
      action: 'Insurance company issues e-invoice or coordinates self-billing depending on scenario'
    },
    keyRules: [
      'Direct claim settlements to individuals may require self-billing',
      'Payments to service providers (workshops, hospitals) follow B2B rules',
      'Insurer typically responsible for proper documentation',
      'Consult LHDN insurance-specific guidelines'
    ],
    requiredInfo: {
      forMalaysian: ['Claimant/provider details', 'Claim reference', 'Settlement amount', 'Policy details'],
      forForeigner: ['Same as Malaysian requirements']
    },
    consolidatedAllowed: false,
    relatedIndustries: ['insurance-takaful', 'healthcare']
  },
  {
    id: 'rental-non-business',
    title: 'Rental Payments to Non-Business Landlords',
    titleMalay: 'Pembayaran Sewa kepada Tuan Rumah Bukan Perniagaan',
    icon: 'House',
    description: 'Rent paid to individual property owners who are not conducting a rental business',
    detailedExplanation: 'When a business rents property from an individual landlord who is not operating the rental as a business, the tenant must issue self-billed e-invoices for the rental payments. This includes rent and related utility bills if applicable.',
    example: {
      situation: 'Smart Gadget Shop rents a shoplot from Tina, who owns it personally and does not run a rental business.',
      issuer: 'Smart Gadget Shop (Tenant)',
      recipient: 'Tina (Individual Landlord)',
      action: 'Smart Gadget Shop issues monthly self-billed e-invoices for rent and utilities'
    },
    keyRules: [
      'Applies when landlord is not conducting rental as business',
      'If landlord has multiple properties as business, they should issue standard e-invoice',
      'Joint ownership requires proportionate self-billed e-invoices',
      'Include utility bills if paid to landlord'
    ],
    requiredInfo: {
      forMalaysian: ['Landlord name', 'MyKad number', 'Property address', 'Rental amount', 'Period'],
      forForeigner: ['Passport details', 'Country', 'Property address', 'Rental details']
    },
    consolidatedAllowed: false,
    relatedIndustries: ['property', 'retail', 'professional-services']
  },
  {
    id: 'imported-goods',
    title: 'Imported Goods from Foreign Suppliers',
    titleMalay: 'Barangan Import dari Pembekal Asing',
    icon: 'Package',
    description: 'Documentation for goods imported into Malaysia from overseas',
    detailedExplanation: 'When importing physical goods from foreign suppliers, the Malaysian importer must issue self-billed e-invoices to document the purchase for local tax and compliance purposes, as foreign suppliers are not obligated to use the Malaysian e-invoicing system.',
    example: {
      situation: 'Electronics Mart Sdn Bhd imports RM100,000 worth of smartphones from a factory in China.',
      issuer: 'Electronics Mart Sdn Bhd (Importer)',
      recipient: 'Chinese Factory (Foreign Supplier)',
      action: 'Electronics Mart issues self-billed e-invoice based on commercial invoice and customs documentation'
    },
    keyRules: [
      'Use commercial invoice value for self-billed amount',
      'Customs documentation supports the e-invoice',
      'Currency conversion may apply',
      'Self-billed e-invoice not shared with foreign supplier'
    ],
    requiredInfo: {
      forMalaysian: ['N/A - This is for imports'],
      forForeigner: ['Foreign supplier name', 'Country code', 'Commercial invoice reference', 'Customs declaration number']
    },
    consolidatedAllowed: true,
    relatedIndustries: ['wholesale', 'retail', 'manufacturing', 'ecommerce']
  }
];

/**
 * General TIN for certain scenarios
 */
export const generalTIN = {
  code: 'EI00000000010',
  description: 'Used when individual only provides MyKad/MyTentera number without TIN',
  usage: [
    'Malaysian individuals who only provide IC number',
    'Consolidated invoices for "General Public"',
    'When recipient TIN is genuinely not available'
  ]
};

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): SelfBilledScenario | undefined {
  return selfBilledScenarios.find(s => s.id === id);
}

/**
 * Get scenarios by industry
 */
export function getScenariosByIndustry(industryId: string): SelfBilledScenario[] {
  return selfBilledScenarios.filter(s => s.relatedIndustries.includes(industryId));
}
