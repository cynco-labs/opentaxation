// If the difference between scenarios is less than this, they're considered "similar"
export const SIMILARITY_THRESHOLD = 3000;

export const DEFAULTS = {
  MONTHLY_SALARY: 5000,
  COMPLIANCE_COSTS: 5000,
} as const;

// Companies exceeding these limits pay standard 24% rate instead of SME rates (15-17%)
export const SME_THRESHOLDS = {
  MAX_REVENUE: 50_000_000,
  MAX_PAID_UP_CAPITAL: 2_500_000,
  MAX_RELATED_COMPANY_SHARE: 50,
} as const;

// Binary search parameters for finding the crossover profit level
export const CROSSOVER_CALCULATION = {
  MIN_PROFIT: 0 as number,
  MAX_PROFIT: 2_000_000 as number,
  TOLERANCE: 100,
  MAX_ITERATIONS: 50,
  EARLY_EXIT_THRESHOLD: 100,
};
