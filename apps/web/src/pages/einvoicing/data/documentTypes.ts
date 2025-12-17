/**
 * E-Invoice Document Types
 * Based on LHDN MyInvois specifications
 * Source: https://sdk.myinvois.hasil.gov.my/codes/
 */

export interface DocumentType {
  id: string;
  code: string;
  name: string;
  nameMalay: string;
  icon: string;
  description: string;
  whenToUse: string[];
  keyFields: string[];
  examples: DocumentExample[];
  relatedDocuments?: string[];
}

export interface DocumentExample {
  scenario: string;
  description: string;
  parties: {
    issuer: string;
    recipient: string;
  };
}

export const documentTypes: DocumentType[] = [
  {
    id: 'invoice',
    code: '01',
    name: 'Invoice',
    nameMalay: 'Invois',
    icon: 'Receipt',
    description: 'Standard document issued by a supplier to a buyer for goods sold or services rendered',
    whenToUse: [
      'When selling goods or providing services',
      'When billing for completed work or deliveries',
      'For all B2B transactions',
      'For B2C transactions when customer requests'
    ],
    keyFields: [
      'Supplier TIN and details',
      'Buyer TIN and details (for B2B)',
      'Invoice number and date',
      'Item descriptions, quantities, prices',
      'Tax amounts and totals',
      'MSIC code',
      'Payment terms'
    ],
    examples: [
      {
        scenario: 'Product Sale',
        description: 'ABC Sdn Bhd sells office furniture worth RM5,000 to XYZ Sdn Bhd',
        parties: { issuer: 'ABC Sdn Bhd (Supplier)', recipient: 'XYZ Sdn Bhd (Buyer)' }
      },
      {
        scenario: 'Service Provision',
        description: 'Consulting firm bills RM10,000 for advisory services rendered',
        parties: { issuer: 'Consultant (Supplier)', recipient: 'Client Company (Buyer)' }
      }
    ],
    relatedDocuments: ['credit-note', 'debit-note']
  },
  {
    id: 'credit-note',
    code: '02',
    name: 'Credit Note',
    nameMalay: 'Nota Kredit',
    icon: 'ArrowCircleDown',
    description: 'Document issued to reduce the amount owed by a buyer, typically for returns, discounts, or corrections',
    whenToUse: [
      'When goods are returned by the buyer',
      'When giving discounts after invoice issuance',
      'To correct overcharges or billing errors',
      'For price adjustments downward'
    ],
    keyFields: [
      'Reference to original invoice',
      'Reason for credit',
      'Credit amount',
      'Original and adjusted values',
      'Date of credit note'
    ],
    examples: [
      {
        scenario: 'Goods Return',
        description: 'Customer returns RM500 worth of defective products',
        parties: { issuer: 'Original Supplier', recipient: 'Original Buyer' }
      },
      {
        scenario: 'Volume Discount',
        description: 'Retrospective 5% discount applied for meeting purchase target',
        parties: { issuer: 'Supplier', recipient: 'Buyer' }
      }
    ],
    relatedDocuments: ['invoice']
  },
  {
    id: 'debit-note',
    code: '03',
    name: 'Debit Note',
    nameMalay: 'Nota Debit',
    icon: 'ArrowCircleUp',
    description: 'Document issued to increase the amount owed by a buyer, typically for additional charges or corrections',
    whenToUse: [
      'When additional charges need to be billed',
      'To correct undercharges or billing errors',
      'For price adjustments upward',
      'When adding costs not in original invoice'
    ],
    keyFields: [
      'Reference to original invoice',
      'Reason for debit',
      'Additional amount',
      'Original and adjusted values',
      'Date of debit note'
    ],
    examples: [
      {
        scenario: 'Additional Charges',
        description: 'Supplier adds RM200 delivery surcharge not included in original invoice',
        parties: { issuer: 'Supplier', recipient: 'Buyer' }
      },
      {
        scenario: 'Price Correction',
        description: 'Correcting undercharged amount due to pricing error',
        parties: { issuer: 'Supplier', recipient: 'Buyer' }
      }
    ],
    relatedDocuments: ['invoice']
  },
  {
    id: 'refund-note',
    code: '04',
    name: 'Refund Note',
    nameMalay: 'Nota Bayaran Balik',
    icon: 'ArrowUUpLeft',
    description: 'Document issued to record a refund payment made to the buyer',
    whenToUse: [
      'When processing customer refunds',
      'When returning deposits or advance payments',
      'For cancelled orders that were prepaid',
      'When reversing completed transactions'
    ],
    keyFields: [
      'Reference to original transaction',
      'Refund amount',
      'Reason for refund',
      'Refund method',
      'Date of refund'
    ],
    examples: [
      {
        scenario: 'Order Cancellation',
        description: 'Refunding RM1,000 deposit for cancelled event booking',
        parties: { issuer: 'Service Provider', recipient: 'Customer' }
      },
      {
        scenario: 'Overpayment Return',
        description: 'Returning excess payment of RM150 to customer',
        parties: { issuer: 'Supplier', recipient: 'Customer' }
      }
    ],
    relatedDocuments: ['invoice', 'credit-note']
  },
  {
    id: 'self-billed',
    code: '11',
    name: 'Self-Billed Invoice',
    nameMalay: 'Invois Bil Sendiri',
    icon: 'ArrowsLeftRight',
    description: 'Invoice issued by the buyer instead of the supplier, used in specific scenarios defined by LHDN',
    whenToUse: [
      'Payments to foreign suppliers',
      'Payments to agents, dealers, distributors',
      'Acquisitions from non-business individuals',
      'Rental payments to non-business landlords',
      'E-commerce platform seller payouts',
      'Insurance claim settlements',
      'Interest payments (with exceptions)',
      'Betting/gaming winner payouts',
      'Profit distributions from non-listed entities',
      'Imported goods documentation'
    ],
    keyFields: [
      'Buyer (issuer) TIN and details',
      'Supplier/recipient details',
      'Self-billed indicator',
      'Transaction details',
      'Reason/scenario code'
    ],
    examples: [
      {
        scenario: 'Foreign Supplier',
        description: 'Malaysian company imports machinery from German supplier',
        parties: { issuer: 'Malaysian Buyer', recipient: 'Foreign Supplier' }
      },
      {
        scenario: 'Agent Commission',
        description: 'Company pays 10% commission to sales agent',
        parties: { issuer: 'Company (Payer)', recipient: 'Agent (Recipient)' }
      },
      {
        scenario: 'Rental Payment',
        description: 'Business tenant pays rent to individual landlord',
        parties: { issuer: 'Tenant (Payer)', recipient: 'Individual Landlord' }
      }
    ],
    relatedDocuments: ['invoice']
  },
  {
    id: 'consolidated',
    code: '01',
    name: 'Consolidated Invoice',
    nameMalay: 'Invois Gabungan',
    icon: 'StackSimple',
    description: 'Monthly summary invoice for B2C transactions where individual customers did not request e-invoices',
    whenToUse: [
      'For aggregating B2C retail sales',
      'When customers do not request individual e-invoices',
      'For personal consumption purchases',
      'To summarize walk-in customer transactions'
    ],
    keyFields: [
      'Buyer name: "General Public"',
      'Buyer TIN: "EI00000000010"',
      'All other buyer fields: "NA"',
      'Summary of transactions for the month',
      'Total amounts'
    ],
    examples: [
      {
        scenario: 'Retail Store',
        description: 'Supermarket consolidates all consumer sales for November into one e-invoice',
        parties: { issuer: 'Supermarket', recipient: 'General Public' }
      },
      {
        scenario: 'Restaurant',
        description: 'Restaurant consolidates daily dine-in sales from customers not requesting e-invoices',
        parties: { issuer: 'Restaurant', recipient: 'General Public' }
      }
    ],
    relatedDocuments: ['invoice']
  }
];

/**
 * Consolidated invoice restrictions
 */
export const consolidatedRestrictions = {
  notAllowedFor: [
    'B2B transactions (business-to-business)',
    'Transactions exceeding RM10,000 (from 1 Jan 2026)',
    'When buyer requests individual e-invoice',
    'Automotive sales',
    'Aviation transactions',
    'Betting and gaming',
    'Construction materials (under CIDB Act)',
    'Luxury goods',
    'Agent, dealer, distributor payments'
  ],
  deadline: '7 calendar days after month end',
  buyerDetails: {
    name: 'General Public',
    tin: 'EI00000000010',
    otherFields: 'NA'
  }
};

/**
 * Document submission methods
 */
export const submissionMethods = [
  {
    id: 'portal',
    name: 'MyInvois Portal',
    description: 'Manual entry through LHDN web portal',
    suitableFor: 'Low volume transactions, MSMEs',
    features: [
      'Free to use',
      'No technical integration needed',
      'Manual or bulk upload via spreadsheet',
      'Suitable for <100 invoices/month'
    ]
  },
  {
    id: 'api',
    name: 'API Integration',
    description: 'Automated submission via system integration',
    suitableFor: 'High volume transactions, larger businesses',
    features: [
      'Automated submission from ERP/POS',
      'Real-time processing',
      'Suitable for high volume',
      'Requires technical setup'
    ]
  }
];

/**
 * Get document type by ID
 */
export function getDocumentTypeById(id: string): DocumentType | undefined {
  return documentTypes.find(d => d.id === id);
}
