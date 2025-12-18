/**
 * Tax Relief Catalog (Malaysia YA 2024/2025)
 * Complete catalog of all personal tax reliefs with limits and shared caps
 *
 * Source: LHDN Malaysia - https://www.hasil.gov.my/
 *
 * Key Concepts:
 * - Individual limits: Max amount claimable per relief
 * - Shared cap groups: Some reliefs share a combined cap (e.g., lifestyle RM2,500)
 * - Per-unit reliefs: Some reliefs are per child/dependent
 */

// ============================================================================
// Types
// ============================================================================

export type ReliefCategory =
  | 'lifestyle'
  | 'family'
  | 'medical'
  | 'education'
  | 'insurance_savings'
  | 'other';

export type SharedCapGroup =
  | 'lifestyle_general'   // RM2,500 cap for books, electronics, internet
  | 'lifestyle_sports'    // RM1,000 separate cap for sports
  | 'epf_insurance'       // RM7,000 combined for EPF + life insurance
  | 'prs_annuity'         // RM3,000 cap for PRS/annuity
  | 'none';               // No shared cap

export interface ReliefDefinition {
  /** Unique identifier for the relief */
  id: string;
  /** Category for grouping in UI */
  category: ReliefCategory;
  /** Display name */
  name: string;
  /** Brief description */
  description: string;
  /** Maximum amount claimable (individual limit) */
  limit: number;
  /** Shared cap group (if applicable) */
  sharedCapGroup: SharedCapGroup;
  /** Whether this is a per-unit relief (e.g., per child) */
  perUnit?: boolean;
  /** Unit label for per-unit reliefs (e.g., "child", "parent") */
  unitLabel?: string;
  /** Eligibility conditions/notes */
  conditions?: string[];
  /** Icon name from Phosphor icons */
  icon?: string;
  /** Whether this is a mandatory/automatic relief */
  mandatory?: boolean;
}

// ============================================================================
// Shared Cap Limits
// ============================================================================

export const SHARED_CAP_LIMITS: Record<SharedCapGroup, number> = {
  lifestyle_general: 2500,
  lifestyle_sports: 1000,
  epf_insurance: 7000,
  prs_annuity: 3000,
  none: Infinity,
};

export const SHARED_CAP_LABELS: Record<SharedCapGroup, string> = {
  lifestyle_general: 'Lifestyle (General)',
  lifestyle_sports: 'Sports & Recreation',
  epf_insurance: 'EPF & Life Insurance',
  prs_annuity: 'PRS & Annuity',
  none: 'No shared cap',
};

// ============================================================================
// Category Icons & Labels
// ============================================================================

export const CATEGORY_CONFIG: Record<ReliefCategory, { label: string; icon: string; color: string }> = {
  lifestyle: { label: 'Lifestyle', icon: 'Laptop', color: 'text-purple-600' },
  family: { label: 'Family', icon: 'Users', color: 'text-blue-600' },
  medical: { label: 'Medical', icon: 'FirstAid', color: 'text-rose-600' },
  education: { label: 'Education', icon: 'GraduationCap', color: 'text-amber-600' },
  insurance_savings: { label: 'Insurance & Savings', icon: 'Vault', color: 'text-emerald-600' },
  other: { label: 'Other Reliefs', icon: 'Gift', color: 'text-teal-600' },
};

// ============================================================================
// Relief Catalog
// ============================================================================

export const RELIEF_CATALOG: ReliefDefinition[] = [
  // -------------------------------------------------------------------------
  // MANDATORY (Auto-applied)
  // -------------------------------------------------------------------------
  {
    id: 'basic',
    category: 'other',
    name: 'Individual Relief',
    description: 'Basic relief for all taxpayers',
    limit: 9000,
    sharedCapGroup: 'none',
    icon: 'User',
    mandatory: true,
  },

  // -------------------------------------------------------------------------
  // LIFESTYLE (RM2,500 shared cap + RM1,000 sports)
  // -------------------------------------------------------------------------
  {
    id: 'lifestyle_books',
    category: 'lifestyle',
    name: 'Books & Publications',
    description: 'Books, journals, magazines, newspapers (printed & electronic)',
    limit: 2500,
    sharedCapGroup: 'lifestyle_general',
    icon: 'Books',
    conditions: ['Includes e-books and digital subscriptions'],
  },
  {
    id: 'lifestyle_electronics',
    category: 'lifestyle',
    name: 'Electronics',
    description: 'Personal computer, smartphone, or tablet',
    limit: 2500,
    sharedCapGroup: 'lifestyle_general',
    icon: 'DeviceMobile',
    conditions: ['For personal use, not for business'],
  },
  {
    id: 'lifestyle_internet',
    category: 'lifestyle',
    name: 'Internet Subscription',
    description: 'Monthly internet subscription fees',
    limit: 2500,
    sharedCapGroup: 'lifestyle_general',
    icon: 'WifiHigh',
    conditions: ['Registered under own name'],
  },
  {
    id: 'lifestyle_sports',
    category: 'lifestyle',
    name: 'Sports & Fitness',
    description: 'Sports equipment, gym membership, sports activities',
    limit: 1000,
    sharedCapGroup: 'lifestyle_sports',
    icon: 'Barbell',
    conditions: [
      'Sports equipment purchase or rental',
      'Gym/fitness membership fees',
      'Sports facility entry fees',
    ],
  },

  // -------------------------------------------------------------------------
  // FAMILY
  // -------------------------------------------------------------------------
  {
    id: 'spouse',
    category: 'family',
    name: 'Spouse Relief',
    description: 'Relief for spouse with no income or joint assessment',
    limit: 4000,
    sharedCapGroup: 'none',
    icon: 'Heart',
    conditions: ['Spouse has no income, OR', 'Spouse elects joint assessment'],
  },
  {
    id: 'spouse_disabled',
    category: 'family',
    name: 'Disabled Spouse',
    description: 'Additional relief for disabled spouse',
    limit: 5000,
    sharedCapGroup: 'none',
    icon: 'Wheelchair',
    conditions: ['Spouse certified as disabled by JKM'],
  },
  {
    id: 'alimony',
    category: 'family',
    name: 'Alimony to Former Wife',
    description: 'Alimony payments to former wife',
    limit: 4000,
    sharedCapGroup: 'none',
    icon: 'Scales',
    conditions: ['Payments made under court order or agreement'],
  },
  {
    id: 'child_under18',
    category: 'family',
    name: 'Child Under 18',
    description: 'Relief for each unmarried child under 18',
    limit: 2000,
    sharedCapGroup: 'none',
    perUnit: true,
    unitLabel: 'child',
    icon: 'Baby',
    conditions: ['Unmarried', 'Under 18 years old'],
  },
  {
    id: 'child_18plus_studying',
    category: 'family',
    name: 'Child 18+ (A-Level/Matrikulasi)',
    description: 'Child 18+ in pre-university studies (A-Level, STPM, matriculation)',
    limit: 2000,
    sharedCapGroup: 'none',
    perUnit: true,
    unitLabel: 'child',
    icon: 'Student',
    conditions: ['Unmarried', 'Full-time A-Level, STPM, or matriculation'],
  },
  {
    id: 'child_tertiary',
    category: 'family',
    name: 'Child in Tertiary Education',
    description: 'Child 18+ in diploma/degree at recognized institution',
    limit: 8000,
    sharedCapGroup: 'none',
    perUnit: true,
    unitLabel: 'child',
    icon: 'GraduationCap',
    conditions: [
      'Unmarried',
      'Full-time diploma or above',
      'Institution recognized by Malaysian government',
    ],
  },
  {
    id: 'child_disabled',
    category: 'family',
    name: 'Disabled Child',
    description: 'Additional relief for disabled child',
    limit: 6000,
    sharedCapGroup: 'none',
    perUnit: true,
    unitLabel: 'child',
    icon: 'Wheelchair',
    conditions: ['Child certified as disabled by JKM'],
  },
  {
    id: 'child_disabled_tertiary',
    category: 'family',
    name: 'Disabled Child (Tertiary)',
    description: 'Additional relief for disabled child in tertiary education',
    limit: 8000,
    sharedCapGroup: 'none',
    perUnit: true,
    unitLabel: 'child',
    icon: 'Wheelchair',
    conditions: [
      'Child certified as disabled by JKM',
      'Full-time diploma or above',
    ],
  },

  // -------------------------------------------------------------------------
  // MEDICAL
  // -------------------------------------------------------------------------
  {
    id: 'parents_medical',
    category: 'medical',
    name: 'Parents Medical',
    description: 'Medical expenses for parents',
    limit: 8000,
    sharedCapGroup: 'none',
    icon: 'Heartbeat',
    conditions: [
      'Parents not claiming own medical relief',
      'Certified medical treatment by registered practitioner',
    ],
  },
  {
    id: 'serious_disease_self',
    category: 'medical',
    name: 'Serious Disease (Self/Spouse/Child)',
    description: 'Treatment for serious diseases',
    limit: 8000,
    sharedCapGroup: 'none',
    icon: 'FirstAidKit',
    conditions: [
      'AIDS, cancer, kidney failure, leukemia, heart disease, etc.',
      'Certified by registered medical practitioner',
    ],
  },
  {
    id: 'fertility',
    category: 'medical',
    name: 'Fertility Treatment',
    description: 'IVF and fertility treatment expenses',
    limit: 8000,
    sharedCapGroup: 'none',
    icon: 'HeartHalf',
    conditions: ['Self or spouse', 'At registered medical facility'],
  },
  {
    id: 'full_medical_checkup',
    category: 'medical',
    name: 'Full Medical Checkup',
    description: 'Complete medical examination',
    limit: 1000,
    sharedCapGroup: 'none',
    icon: 'Stethoscope',
    conditions: ['For self, spouse, or child', 'At registered medical facility'],
  },
  {
    id: 'vaccination',
    category: 'medical',
    name: 'Vaccination',
    description: 'Vaccination expenses for self, spouse, or child',
    limit: 1000,
    sharedCapGroup: 'none',
    icon: 'Syringe',
    conditions: ['Registered vaccine', 'At registered medical facility'],
  },
  {
    id: 'mental_health',
    category: 'medical',
    name: 'Mental Health',
    description: 'Mental health treatment and consultation',
    limit: 1000,
    sharedCapGroup: 'none',
    icon: 'Brain',
    conditions: [
      'For self, spouse, or child',
      'By registered psychiatrist or clinical psychologist',
    ],
  },

  // -------------------------------------------------------------------------
  // EDUCATION
  // -------------------------------------------------------------------------
  {
    id: 'self_education',
    category: 'education',
    name: 'Self Education',
    description: 'Course fees for further education',
    limit: 7000,
    sharedCapGroup: 'none',
    icon: 'Certificate',
    conditions: [
      'Degree at Masters or Doctorate level, OR',
      'Any course approved by KPT/MOE, OR',
      'Professional qualifications (ACCA, ICAEW, etc.)',
    ],
  },
  {
    id: 'upskilling',
    category: 'education',
    name: 'Upskilling & Self-Enhancement',
    description: 'Technical, vocational, or skill enhancement courses',
    limit: 2000,
    sharedCapGroup: 'none',
    icon: 'Wrench',
    conditions: [
      'Recognized by Director General of Skills Development',
      'Includes soft skills courses',
    ],
  },

  // -------------------------------------------------------------------------
  // INSURANCE & SAVINGS
  // -------------------------------------------------------------------------
  {
    id: 'epf',
    category: 'insurance_savings',
    name: 'EPF Contribution',
    description: 'Employee Provident Fund contributions',
    limit: 4000,
    sharedCapGroup: 'epf_insurance',
    icon: 'Wallet',
    conditions: ['Mandatory and voluntary contributions'],
  },
  {
    id: 'life_insurance',
    category: 'insurance_savings',
    name: 'Life Insurance / Takaful',
    description: 'Life insurance or family takaful premiums',
    limit: 3000,
    sharedCapGroup: 'epf_insurance',
    icon: 'ShieldCheck',
    conditions: ['Premiums paid for self, spouse, or children'],
  },
  {
    id: 'education_medical_insurance',
    category: 'insurance_savings',
    name: 'Education/Medical Insurance',
    description: 'Medical or education insurance premiums',
    limit: 3000,
    sharedCapGroup: 'none',
    icon: 'ShieldPlus',
    conditions: ['For self, spouse, or children'],
  },
  {
    id: 'prs',
    category: 'insurance_savings',
    name: 'Private Retirement Scheme',
    description: 'PRS contributions for retirement',
    limit: 3000,
    sharedCapGroup: 'prs_annuity',
    icon: 'ChartLine',
    conditions: ['Approved PRS provider'],
  },
  {
    id: 'sspn',
    category: 'insurance_savings',
    name: 'SSPN (Education Savings)',
    description: 'National education savings scheme deposits',
    limit: 8000,
    sharedCapGroup: 'none',
    icon: 'PiggyBank',
    conditions: ['SSPN-i or SSPN-i Plus'],
  },
  {
    id: 'socso',
    category: 'insurance_savings',
    name: 'SOCSO / EIS',
    description: 'Social security contributions',
    limit: 350,
    sharedCapGroup: 'none',
    icon: 'Umbrella',
    conditions: ['SOCSO and Employment Insurance contributions'],
  },

  // -------------------------------------------------------------------------
  // OTHER
  // -------------------------------------------------------------------------
  {
    id: 'ev_charging',
    category: 'other',
    name: 'EV Charging Equipment',
    description: 'Electric vehicle charging facilities',
    limit: 2500,
    sharedCapGroup: 'none',
    icon: 'Lightning',
    conditions: ['Charging equipment purchase', 'Installation, rental, or subscription'],
  },
  {
    id: 'breastfeeding',
    category: 'other',
    name: 'Breastfeeding Equipment',
    description: 'Breast pump and accessories',
    limit: 1000,
    sharedCapGroup: 'none',
    icon: 'Baby',
    conditions: [
      'For working mothers only',
      'Child under 2 years old',
      'Once every 2 years',
    ],
  },
  {
    id: 'childcare',
    category: 'other',
    name: 'Childcare Fees',
    description: 'Registered childcare or kindergarten fees',
    limit: 3000,
    sharedCapGroup: 'none',
    icon: 'Buildings',
    conditions: [
      'Child 6 years old and below',
      'TASKA/TADIKA registered with KEMAS/JKM/MOE',
    ],
  },
  {
    id: 'domestic_tourism',
    category: 'other',
    name: 'Domestic Tourism',
    description: 'Local travel accommodation and entrance fees',
    limit: 1000,
    sharedCapGroup: 'none',
    icon: 'Airplane',
    conditions: [
      'Accommodation at registered premises',
      'Entrance fees to tourist attractions',
      'Extended until YA 2026',
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get reliefs by category
 */
export function getReliefsByCategory(category: ReliefCategory): ReliefDefinition[] {
  return RELIEF_CATALOG.filter(r => r.category === category);
}

/**
 * Get relief by ID
 */
export function getReliefById(id: string): ReliefDefinition | undefined {
  return RELIEF_CATALOG.find(r => r.id === id);
}

/**
 * Get all reliefs in a shared cap group
 */
export function getReliefsBySharedCap(group: SharedCapGroup): ReliefDefinition[] {
  return RELIEF_CATALOG.filter(r => r.sharedCapGroup === group);
}

/**
 * Get all non-mandatory reliefs (excludes basic relief)
 */
export function getClaimableReliefs(): ReliefDefinition[] {
  return RELIEF_CATALOG.filter(r => !r.mandatory);
}

/**
 * Get category order for UI display
 */
export const CATEGORY_ORDER: ReliefCategory[] = [
  'insurance_savings',
  'family',
  'lifestyle',
  'medical',
  'education',
  'other',
];
