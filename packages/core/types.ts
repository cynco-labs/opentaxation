import type { PersonalReliefs, ZakatCalculationMethod, SharedCapGroup } from '@tax-engine/config';

export type InputMode = 'profit' | 'target';

export interface ZakatInput {
  enabled: boolean;
  amountPaid?: number;
  autoCalculate?: boolean;
  method?: ZakatCalculationMethod;
}

export interface ReliefClaimEntry {
  amount: number;
  // For per-unit reliefs (e.g. children): multiplies amount × quantity
  quantity?: number;
}

export type ReliefClaimValues = Record<string, ReliefClaimEntry>;

export interface SharedCapUsage {
  group: SharedCapGroup;
  label: string;
  used: number;
  limit: number;
  percentUsed: number;
  exceeded: boolean;
  reliefIds: string[];
}

export interface CappedItem {
  id: string;
  name: string;
  claimed: number;
  allowed: number;
  reason: 'individual_limit' | 'shared_cap';
}

export interface ReliefOptimizationResult {
  total: number;
  breakdown: Record<string, number>;
  cappedItems: CappedItem[];
  groupUsage: SharedCapUsage[];
  basicRelief: number;
  additionalReliefs: number;
}

export interface TaxCalculationInputs {
  businessProfit: number;
  otherIncome: number;
  monthlySalary?: number;
  complianceCosts?: number;
  auditCost?: number;
  auditCriteria?: {
    revenue: number;
    totalAssets: number;
    employees: number;
  };
  paidUpCapital?: number;
  grossIncome?: number;
  relatedCompanyShare?: number;
  reliefs?: PersonalReliefs;
  extendedReliefs?: ReliefClaimValues;
  applyYa2025DividendSurcharge?: boolean;
  dividendDistributionPercent?: number;
  // Company with ≥20% foreign ownership does not qualify for SME rates
  hasForeignOwnership?: boolean;
  inputMode?: InputMode;
  targetNetIncome?: number;
  zakat?: ZakatInput;
}

export interface WaterfallStep {
  label: string;
  amount: number;
  type: 'add' | 'subtract' | 'equals' | 'total';
  indent?: boolean;
  highlight?: boolean;
}

export interface TaxBracketBreakdown {
  bracketMin: number;
  bracketMax: number | null;
  rate: number;
  incomeInBracket: number;
  taxForBracket: number;
}

export interface ZakatResult {
  enabled: boolean;
  zakatAmount: number;
  meetsNisab: boolean;
  // Rebate for individual (s.6A(3)), deduction value for company (s.44(11A))
  taxBenefit: number;
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
  taxBracketBreakdown: TaxBracketBreakdown[];
  zakat?: ZakatResult;
  taxBeforeZakatRebate?: number;
}

export interface SalaryAffordability {
  maxAffordableSalary: number;
  isAffordable: boolean;
  shortfall: number;
  companyWouldBeInsolvent: boolean;
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
    businessProfit: number;
  };
  companyWaterfall: WaterfallStep[];
  personalWaterfall: WaterfallStep[];
  insights: string[];
  epfSavings: number;
  corporateTaxBracketBreakdown: TaxBracketBreakdown[];
  personalTaxBracketBreakdown: TaxBracketBreakdown[];
  zakat?: ZakatResult;
  corporateTaxBeforeZakat?: number;
}

export interface ComparisonResult {
  whichIsBetter: 'soleProp' | 'sdnBhd' | 'similar';
  difference: number;
  savingsIfSwitch: number;
  crossoverPointProfit: number | null;
  recommendation: string;
  solePropResult: SolePropScenarioResult;
  sdnBhdResult: SdnBhdScenarioResult;
  hasAffordabilityIssue: boolean;
  hasSmeQualificationIssue: boolean;
  warnings: string[];
}
