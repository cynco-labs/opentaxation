/**
 * E-Invoice Implementation Roadmap
 * Step-by-step guide for businesses to implement e-invoicing
 */

export interface ImplementationStep {
  id: string;
  number: number;
  title: string;
  titleMalay: string;
  icon: string;
  description: string;
  estimatedTime: string;
  substeps: Substep[];
  resources: Resource[];
  tips: string[];
}

export interface Substep {
  id: string;
  title: string;
  description: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'official' | 'guide' | 'tool';
}

export const implementationSteps: ImplementationStep[] = [
  {
    id: 'verify-tin',
    number: 1,
    title: 'Verify Your TIN',
    titleMalay: 'Sahkan TIN Anda',
    icon: 'IdentificationCard',
    description: 'Ensure your business has a valid Tax Identification Number (TIN) registered with LHDN',
    estimatedTime: '1-2 days if already registered',
    substeps: [
      {
        id: 'check-mytax',
        title: 'Check existing TIN on MyTax Portal',
        description: 'Log in to MyTax portal using your company director\'s identification to retrieve existing TIN',
        actionUrl: 'https://mytax.hasil.gov.my/',
        actionLabel: 'Go to MyTax Portal'
      },
      {
        id: 'register-edaftar',
        title: 'Register for TIN if not available',
        description: 'Use e-Daftar platform to register and obtain TIN if your business doesn\'t have one',
        actionUrl: 'https://mytax.hasil.gov.my/',
        actionLabel: 'Register via e-Daftar'
      },
      {
        id: 'verify-brn',
        title: 'Ensure BRN (SSM) is current',
        description: 'Your Business Registration Number from SSM must be valid and up to date'
      }
    ],
    resources: [
      { title: 'MyTax Portal', url: 'https://mytax.hasil.gov.my/', type: 'official' },
      { title: 'TIN Verification Guide', url: 'https://www.hasil.gov.my/', type: 'guide' }
    ],
    tips: [
      'Directors can check TIN using their personal MyKad login',
      'Keep your SSM registration current - expired registration may cause issues',
      'Sole proprietors use their personal TIN for all businesses'
    ]
  },
  {
    id: 'register-myinvois',
    number: 2,
    title: 'Register on MyInvois Portal',
    titleMalay: 'Daftar di Portal MyInvois',
    icon: 'UserCirclePlus',
    description: 'Access the MyInvois portal and complete your business registration for e-invoicing',
    estimatedTime: '30 minutes - 1 hour',
    substeps: [
      {
        id: 'login-mytax',
        title: 'Log in to MyTax Portal',
        description: 'Use your director\'s IC number and password to access MyTax',
        actionUrl: 'https://mytax.hasil.gov.my/',
        actionLabel: 'Login to MyTax'
      },
      {
        id: 'access-myinvois',
        title: 'Select MyInvois from menu',
        description: 'Navigate to MyInvois section and accept terms and conditions'
      },
      {
        id: 'apply-role',
        title: 'Apply for appropriate role',
        description: 'Select "Directors of the company / Organization Administrator" role and submit supporting documents (Form 49 or Section 58)',
      },
      {
        id: 'complete-profile',
        title: 'Complete taxpayer profile',
        description: 'Fill in all required business details including MSIC code, address, and contact information'
      }
    ],
    resources: [
      { title: 'MyInvois Portal', url: 'https://mytax.hasil.gov.my/', type: 'official' },
      { title: 'Registration Guide', url: 'https://www.hasil.gov.my/en/e-invoice/', type: 'guide' }
    ],
    tips: [
      'Have Form 49 or Section 58 ready in PDF format (less than 2MB)',
      'Only JPG, PNG, and PDF formats accepted for document uploads',
      'Role approval may take 1-3 business days'
    ]
  },
  {
    id: 'choose-method',
    number: 3,
    title: 'Choose Submission Method',
    titleMalay: 'Pilih Kaedah Penyerahan',
    icon: 'GitBranch',
    description: 'Decide between Portal (manual) or API (automated) submission based on your business needs',
    estimatedTime: 'Decision: 1 day | Setup: varies',
    substeps: [
      {
        id: 'assess-volume',
        title: 'Assess your invoice volume',
        description: 'Count average monthly invoices - Portal suits <100/month, API better for higher volumes'
      },
      {
        id: 'evaluate-systems',
        title: 'Evaluate existing systems',
        description: 'Check if your accounting software, ERP, or POS supports MyInvois API integration'
      },
      {
        id: 'portal-setup',
        title: 'Portal Method: Ready to use',
        description: 'If choosing Portal, you can start issuing immediately after registration'
      },
      {
        id: 'api-setup',
        title: 'API Method: Register ERP system',
        description: 'Register your accounting software as an ERP in MyInvois and configure API credentials'
      }
    ],
    resources: [
      { title: 'MyInvois SDK Documentation', url: 'https://sdk.myinvois.hasil.gov.my/', type: 'official' },
      { title: 'API Integration Guide', url: 'https://sdk.myinvois.hasil.gov.my/einvoicingapi/', type: 'guide' }
    ],
    tips: [
      'Start with Portal method to understand the process before investing in API',
      'Many accounting software vendors offer free or low-cost MyInvois integration',
      'Consider hybrid approach: API for regular sales, Portal for exceptions'
    ]
  },
  {
    id: 'prepare-data',
    number: 4,
    title: 'Prepare Mandatory Data',
    titleMalay: 'Sediakan Data Mandatori',
    icon: 'Database',
    description: 'Gather and organize all required data fields for your e-invoices',
    estimatedTime: '1-2 weeks',
    substeps: [
      {
        id: 'msic-code',
        title: 'Identify your MSIC code',
        description: '5-digit code representing your business activity - can be found on SSM registration or looked up',
        actionUrl: 'https://msic.stats.gov.my/bi/',
        actionLabel: 'MSIC Code Lookup'
      },
      {
        id: 'customer-data',
        title: 'Collect customer TINs and details',
        description: 'For B2B transactions, you need customer TIN, BRN, name, and address'
      },
      {
        id: 'product-data',
        title: 'Prepare product/service catalog',
        description: 'Organize item descriptions, unit prices, tax codes, and classification codes'
      },
      {
        id: 'bank-details',
        title: 'Verify bank account information',
        description: 'Ensure bank details are accurate for payment references'
      }
    ],
    resources: [
      { title: 'MSIC Code System', url: 'https://msic.stats.gov.my/bi/', type: 'tool' },
      { title: 'MyInvois Code Tables', url: 'https://sdk.myinvois.hasil.gov.my/codes/', type: 'official' }
    ],
    tips: [
      'Start collecting customer TINs early - send out requests to major customers',
      'If customer TIN unavailable, request at point of transaction',
      'For B2C, you can use consolidated invoices - less data needed'
    ]
  },
  {
    id: 'test-sandbox',
    number: 5,
    title: 'Test in Sandbox Environment',
    titleMalay: 'Uji dalam Persekitaran Sandbox',
    icon: 'TestTube',
    description: 'Practice e-invoice submission in the testing environment before going live',
    estimatedTime: '1-2 weeks',
    substeps: [
      {
        id: 'access-sandbox',
        title: 'Access the Sandbox environment',
        description: 'MyInvois provides a testing environment separate from production'
      },
      {
        id: 'submit-test',
        title: 'Submit test invoices',
        description: 'Create and submit sample invoices to verify data and format correctness'
      },
      {
        id: 'test-scenarios',
        title: 'Test all scenarios',
        description: 'Test regular invoices, credit notes, debit notes, and self-billed scenarios you\'ll use'
      },
      {
        id: 'verify-validation',
        title: 'Review validation results',
        description: 'Check for errors and warnings, fix any issues before production'
      }
    ],
    resources: [
      { title: 'Sandbox Guide', url: 'https://sdk.myinvois.hasil.gov.my/', type: 'guide' },
      { title: 'Sample XML/JSON Files', url: 'https://sdk.myinvois.hasil.gov.my/', type: 'tool' }
    ],
    tips: [
      'Use realistic data in sandbox to catch real-world issues',
      'Test edge cases: credit notes, refunds, foreign suppliers',
      'Verify QR codes and unique identifiers are generated correctly'
    ]
  },
  {
    id: 'go-live',
    number: 6,
    title: 'Go Live',
    titleMalay: 'Mula Operasi',
    icon: 'RocketLaunch',
    description: 'Start issuing live e-invoices in the production environment',
    estimatedTime: 'Ongoing',
    substeps: [
      {
        id: 'switch-production',
        title: 'Switch to production environment',
        description: 'Change API endpoints or portal access from sandbox to production'
      },
      {
        id: 'first-invoice',
        title: 'Issue first production e-invoice',
        description: 'Submit your first real e-invoice and verify successful validation'
      },
      {
        id: 'monitor-initially',
        title: 'Monitor closely for first week',
        description: 'Watch for validation errors, rejection rates, and customer feedback'
      },
      {
        id: 'train-staff',
        title: 'Train staff on procedures',
        description: 'Ensure all relevant staff understand e-invoice processes and error handling'
      }
    ],
    resources: [
      { title: 'LHDN e-Invoice Helpdesk', url: 'https://www.hasil.gov.my/', type: 'official' },
      { title: 'Troubleshooting Guide', url: 'https://sdk.myinvois.hasil.gov.my/', type: 'guide' }
    ],
    tips: [
      'Start during relaxation period to learn without penalty risk',
      'Have a backup plan (Portal) if API issues arise',
      'Document common issues and solutions for team reference'
    ]
  },
  {
    id: 'ongoing-compliance',
    number: 7,
    title: 'Maintain Ongoing Compliance',
    titleMalay: 'Kekalkan Pematuhan Berterusan',
    icon: 'ShieldCheck',
    description: 'Establish processes for continuous e-invoicing compliance',
    estimatedTime: 'Ongoing',
    substeps: [
      {
        id: 'regular-review',
        title: 'Regular compliance reviews',
        description: 'Periodically check that all transactions are properly e-invoiced'
      },
      {
        id: 'update-systems',
        title: 'Keep systems updated',
        description: 'Apply updates from your software vendor for LHDN guideline changes'
      },
      {
        id: 'consolidated-process',
        title: 'Monthly consolidated invoice process',
        description: 'Submit consolidated B2C invoices within 7 days of month end'
      },
      {
        id: 'stay-informed',
        title: 'Stay informed of changes',
        description: 'Monitor LHDN announcements for rule updates and new requirements'
      }
    ],
    resources: [
      { title: 'LHDN Announcements', url: 'https://www.hasil.gov.my/', type: 'official' },
      { title: 'e-Invoice Updates', url: 'https://www.hasil.gov.my/en/e-invoice/', type: 'official' }
    ],
    tips: [
      'Set calendar reminders for consolidated invoice deadlines',
      'Join industry groups to share experiences and best practices',
      'Keep records of all e-invoices for audit purposes'
    ]
  }
];

/**
 * Decision tree for Portal vs API
 */
export const submissionMethodDecision = {
  questions: [
    {
      id: 'volume',
      question: 'How many invoices do you issue per month?',
      options: [
        { value: 'low', label: 'Less than 50', recommendation: 'portal' },
        { value: 'medium', label: '50-200', recommendation: 'either' },
        { value: 'high', label: 'More than 200', recommendation: 'api' }
      ]
    },
    {
      id: 'software',
      question: 'Do you use accounting software or ERP?',
      options: [
        { value: 'none', label: 'No software / Manual', recommendation: 'portal' },
        { value: 'basic', label: 'Basic accounting software', recommendation: 'check' },
        { value: 'erp', label: 'ERP / Advanced system', recommendation: 'api' }
      ]
    },
    {
      id: 'technical',
      question: 'Do you have IT support for integration?',
      options: [
        { value: 'none', label: 'No IT resources', recommendation: 'portal' },
        { value: 'vendor', label: 'Software vendor can help', recommendation: 'api' },
        { value: 'inhouse', label: 'In-house IT team', recommendation: 'api' }
      ]
    }
  ],
  recommendations: {
    portal: {
      title: 'MyInvois Portal (Manual)',
      description: 'Best for businesses with low invoice volume and no existing software',
      pros: ['Free to use', 'No technical setup', 'Immediate access', 'Bulk upload via Excel'],
      cons: ['Manual data entry', 'Not scalable', 'Time-consuming for high volume']
    },
    api: {
      title: 'API Integration (Automated)',
      description: 'Best for businesses with high volume or existing accounting systems',
      pros: ['Automated submission', 'Scalable', 'Integrated with existing workflow', 'Real-time processing'],
      cons: ['Requires setup', 'May have software costs', 'Needs technical support']
    }
  }
};

/**
 * Tax incentives for e-invoicing
 */
export const taxIncentives = [
  {
    id: 'deduction',
    title: 'Tax Deduction for Implementation Costs',
    amount: 'Up to RM50,000 per year',
    period: '2024-2027',
    description: 'Businesses can claim tax deduction for costs incurred in implementing e-invoicing, including software, training, and consultation fees.',
    eligible: ['Software purchase/subscription', 'Implementation consulting', 'Staff training', 'Hardware for e-invoicing']
  },
  {
    id: 'capital-allowance',
    title: 'Accelerated Capital Allowance',
    amount: 'Claim over 2 years instead of normal period',
    period: '2024-2027',
    description: 'ICT equipment and software for e-invoicing can be claimed as capital allowance over 2 years, faster than the normal depreciation period.',
    eligible: ['Computers and hardware', 'Software licenses', 'Server infrastructure', 'POS systems']
  }
];

/**
 * Get step by ID
 */
export function getStepById(id: string): ImplementationStep | undefined {
  return implementationSteps.find(s => s.id === id);
}
