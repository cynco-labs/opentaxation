import type { PersonalReliefs, ZakatCalculationMethod, SharedCapGroup } from '@tax-engine/config';

/**
 * Input types for tax calculations
 */

export type InputMode = 'profit' | 'target';

/**
 * Zakat input configuration
 */
export interface ZakatInput {
  /** Whether the user pays zakat */
  enabled: boolean;

  /** Annual zakat amount paid (if manually specified) */
  amountPaid?: number;

  /** Whether to auto-calculate zakat at 2.5% */
  autoCalculate?: boolean;

  /** Calculation method (gross_income by default) */
  method?: ZakatCalculationMethod;
}

// ============================================================================
// Relief Claim Types (for Extended Relief Optimizer)
// ============================================================================

/**
 * Single relief claim entry
 * For per-unit reliefs (children), quantity multiplies the amount
 */
export interface ReliefClaimEntry {
  /** Amount claimed for this relief */
  amount: number;
  /** For per-unit reliefs: number of units (e.g., children) */
  quantity?: number;
}

/**
 * All relief claims keyed by relief ID
 * Example: { 'lifestyle_books': { amount: 500 }, 'child_under18': { amount: 2000, quantity: 2 } }
 */
export type ReliefClaimValues = Record<string, ReliefClaimEntry>;

/**
 * Result of shared cap group calculation
 */
export interface SharedCapUsage {
  /** Shared cap group identifier */
  group: SharedCapGroup;
  /** Label for display */
  label: string;
  /** Total amount used across all reliefs in this group */
  used: number;
  /** Maximum allowed for this group */
  limit: number;
  /** Percentage used (0-100+) */
  percentUsed: number;
  /** Whether the cap has been exceeded */
  exceeded: boolean;
  /** Relief IDs contributing to this cap */
  reliefIds: string[];
}

/**
 * Item that was capped due to individual or shared limits
 */
export interface CappedItem {
  /** Relief ID */
  id: string;
  /** Relief name */
  name: string;
  /** Amount user tried to claim */
  claimed: number;
  /** Amount actually allowed after caps */
  allowed: number;
  /** Reason for capping */
  reason: 'individual_limit' | 'shared_cap';
}

/**
 * Result of relief optimization calculation
 */
export interface ReliefOptimizationResult {
  /** Total relief amount after all caps applied */
  total: number;
  /** Breakdown by relief ID: actual amount allowed */
  breakdown: Record<string, number>;
  /** Items that were capped */
  cappedItems: CappedItem[];
  /** Shared cap group usage for UI */
  groupUsage: SharedCapUsage[];
  /** Basic relief amount (always RM9,000) */
  basicRelief: number;
  /** Sum of all other reliefs after caps */
  additionalReliefs: number;
}

export interface TaxCalculationInputs {
  businessProfit: number;
  otherIncome: number;
  monthlySalary?: number; // For Sdn Bhd scenario
  complianceCosts?: number; // Annual Sdn Bhd compliance costs
  auditCost?: number; // Annual audit cost (if required)
  auditCriteria?: {
    revenue: number;
    totalAssets: number;
    employees: number;
  };
  paidUpCapital?: number;
  grossIncome?: number;
  relatedCompanyShare?: number;
  reliefs?: PersonalReliefs;
  /** Extended relief claims (for Relief Optimizer) */
  extendedReliefs?: ReliefClaimValues;
  applyYa2025DividendSurcharge?: boolean; // Whether to apply YA 2025 dividend surcharge
  dividendDistributionPercent?: number; // Percentage of post-tax profit to distribute as dividends (0-100, default 100)
  hasForeignOwnership?: boolean; // Whether company has ≥20% foreign ownership (disqualifies SME rates)
  // Input mode fields
  inputMode?: InputMode; // 'profit' (default) or 'target' (reverse calculation)
  targetNetIncome?: number; // If inputMode is 'target' - desired monthly take-home
  // Zakat configuration
  zakat?: ZakatInput; // Zakat payment settings
}

/**
 * Waterfall step for breakdown display
 * Used to show step-by-step calculation flow
 */
export interface WaterfallStep {
  label: string;
  amount: number;
  type: 'add' | 'subtract' | 'equals' | 'total';
  indent?: boolean;
  highlight?: boolean;
}

/**
 * Tax bracket breakdown showing how income is taxed tier by tier
 * Shows the progressive tax calculation transparently
 */
export interface TaxBracketBreakdown {
  bracketMin: number;       // Start of bracket (e.g., 0, 5000, 20000)
  bracketMax: number | null; // End of bracket (null = no limit)
  rate: number;             // Tax rate for this bracket (e.g., 0.01 = 1%)
  incomeInBracket: number;  // How much of user's income falls in this bracket
  taxForBracket: number;    // Tax amount for this bracket
}

/**
 * Zakat calculation result
 */
export interface ZakatResult {
  /** Whether zakat is enabled */
  enabled: boolean;
  /** Zakat amount paid/calculated */
  zakatAmount: number;
  /** Whether income meets nisab threshold */
  meetsNisab: boolean;
  /** Tax benefit from zakat (rebate for individual, deduction value for company) */
  taxBenefit: number;
  /** For Enterprise: Amount of zakat that exceeds tax (cannot be rebated) */
  excessZakat?: number;
}

export interface SolePropScenarioResult {
  personalTax: number;
  netCash: number;
  effectiveTaxRate: number;
  breakdown: {
    businessProfit: number;
    otherIncome: number;
    totalIncome: number;
    totalReliefs: number;
    taxableIncome: number;
  };
  waterfall: WaterfallStep[];
  insights: string[];
  taxBracketBreakdown: TaxBracketBreakdown[]; // Progressive tax tier breakdown
  // Zakat information
  zakat?: ZakatResult;
  /** Tax before zakat rebate (for display purposes) */
  taxBeforeZakatRebate?: number;
}

export interface SalaryAffordability {
  maxAffordableSalary: number;       // Maximum annual salary company can pay
  isAffordable: boolean;              // true if current salary <= max
  shortfall: number;                  // How much salary+EPF exceeds profit (0 if affordable)
  companyWouldBeInsolvent: boolean;   // true if salary + EPF > profit
}

export interface SdnBhdScenarioResult {
  corporateTax: number;
  personalTax: number;
  employerEPF: number;
  employeeEPF: number;
  employerSOCSO: number;
  employeeSOCSO: number;
  totalComplianceCost: number;
  netCash: number;
  salaryAffordability: SalaryAffordability;
  breakdown: {
    annualSalary: number;
    companyTaxableProfit: number;
    postTaxProfit: number;
    dividends: number;
    dividendTax: number;
    retainedEarnings: number;
    salaryAfterEPF: number;
    salaryAfterTax: number;
    otherIncome: number;
    businessProfit: number; // Original profit for waterfall display
  };
  companyWaterfall: WaterfallStep[];
  personalWaterfall: WaterfallStep[];
  insights: string[];
  epfSavings: number; // Total EPF (employer + employee) as forced retirement savings
  corporateTaxBracketBreakdown: TaxBracketBreakdown[]; // Corporate tax tier breakdown
  personalTaxBracketBreakdown: TaxBracketBreakdown[];  // Personal tax tier breakdown
  // Zakat information (for Sdn Bhd, zakat is a 2.5% deduction from aggregate income)
  zakat?: ZakatResult;
  /** Corporate tax before zakat deduction (for display purposes) */
  corporateTaxBeforeZakat?: number;
}

export interface ComparisonResult {
  whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar';
  difference: number; // Positive = Sdn Bhd better, Negative = Sole Prop better
  savingsIfSwitch: number; // Absolute value of difference
  crossoverPointProfit: number | null; // Profit level where both are equal
  recommendation: string;
  solePropResult: SolePropScenarioResult;
  sdnBhdResult: SdnBhdScenarioResult;
  hasAffordabilityIssue: boolean; // true if Sdn Bhd salary exceeds company capacity
  hasSmeQualificationIssue: boolean; // true if company may not qualify for SME rates
  warnings: string[]; // List of warnings about the comparison
}

