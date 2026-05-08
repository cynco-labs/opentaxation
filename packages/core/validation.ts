import type { TaxCalculationInputs } from './types';
import { isValidNumber, isNonNegative } from './utils/rounding';
import { getReliefLimits } from '@tax-engine/config';

export interface ValidationError {
  field: string;
  message: string;
}

function validateNumericField(
  value: number | undefined,
  fieldName: string,
  errors: ValidationError[],
  required: boolean = false
): void {
  if (value === undefined) {
    if (required) {
      errors.push({
        field: fieldName,
        message: `${fieldName} is required`,
      });
    }
    return;
  }

  if (!isValidNumber(value)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be a valid number`,
    });
    return;
  }

  if (!isNonNegative(value)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} cannot be negative`,
    });
  }
}

export function validateInputs(inputs: TaxCalculationInputs): ValidationError[] {
  const errors: ValidationError[] = [];
  const reliefLimits = getReliefLimits();

  // Business profit must be a valid non-negative number
  validateNumericField(inputs.businessProfit, 'businessProfit', errors, true);

  // Other income must be a valid non-negative number
  validateNumericField(inputs.otherIncome, 'otherIncome', errors, true);

  // Monthly salary validation (if provided)
  validateNumericField(inputs.monthlySalary, 'monthlySalary', errors, false);
  // Note: Salary can exceed business profit - this results in company loss
  // which is a valid scenario to model (e.g., during business downturn)

  // Compliance costs validation
  validateNumericField(inputs.complianceCosts, 'complianceCosts', errors, false);

  // Audit cost validation
  validateNumericField(inputs.auditCost, 'auditCost', errors, false);

  // Audit criteria validation
  if (inputs.auditCriteria) {
    validateNumericField(inputs.auditCriteria.revenue, 'auditCriteria.revenue', errors, false);
    validateNumericField(inputs.auditCriteria.totalAssets, 'auditCriteria.totalAssets', errors, false);
    
    // Employees must be a non-negative integer
    if (inputs.auditCriteria.employees !== undefined) {
      if (!isValidNumber(inputs.auditCriteria.employees)) {
        errors.push({
          field: 'auditCriteria.employees',
          message: 'Number of employees must be a valid number',
        });
      } else if (inputs.auditCriteria.employees < 0) {
        errors.push({
          field: 'auditCriteria.employees',
          message: 'Number of employees cannot be negative',
        });
      } else if (!Number.isInteger(inputs.auditCriteria.employees)) {
        errors.push({
          field: 'auditCriteria.employees',
          message: 'Number of employees must be an integer',
        });
      }
    }
  }

  // Dividend distribution percentage validation
  if (inputs.dividendDistributionPercent !== undefined) {
    if (!isValidNumber(inputs.dividendDistributionPercent)) {
      errors.push({
        field: 'dividendDistributionPercent',
        message: 'Dividend distribution percentage must be a valid number',
      });
    } else if (inputs.dividendDistributionPercent < 0 || inputs.dividendDistributionPercent > 100) {
      errors.push({
        field: 'dividendDistributionPercent',
        message: 'Dividend distribution percentage must be between 0 and 100',
      });
    }
  }

  // SME qualifiers
  validateNumericField(inputs.paidUpCapital, 'paidUpCapital', errors, false);
  validateNumericField(inputs.grossIncome, 'grossIncome', errors, false);
  if (inputs.relatedCompanyShare !== undefined) {
    if (!isValidNumber(inputs.relatedCompanyShare)) {
      errors.push({
        field: 'relatedCompanyShare',
        message: 'Related company share must be a valid number',
      });
    } else if (inputs.relatedCompanyShare < 0 || inputs.relatedCompanyShare > 100) {
      errors.push({
        field: 'relatedCompanyShare',
        message: 'Related company share must be between 0 and 100',
      });
    }
  }

  // Zakat validation
  if (inputs.zakat) {
    validateNumericField(inputs.zakat.amountPaid, 'zakat.amountPaid', errors, false);
  }

  // Relief caps (if reliefs provided)
  if (inputs.reliefs) {
    const r = inputs.reliefs;
    const checkCap = (field: keyof typeof reliefLimits, label: string) => {
      const val = r[field];
      if (val !== undefined && val > reliefLimits[field]) {
        errors.push({
          field: `reliefs.${field}`,
          message: `${label} cannot exceed RM${reliefLimits[field].toLocaleString('en-MY')}`,
        });
      }
    };
    checkCap('epfAndLifeInsurance', 'EPF + Life Insurance relief');
    checkCap('medical', 'Medical relief');
    checkCap('spouse', 'Spouse relief');
    checkCap('children', 'Children relief (per child)');
    checkCap('education', 'Education relief');
    checkCap('lifestyle', 'Lifestyle relief');
    checkCap('lifestyleAdditional', 'Lifestyle (additional) relief');
    checkCap('prs', 'PRS relief');
    checkCap('sspn', 'SSPN relief');
  }

  return errors;
}

function sanitizeNumeric(value: number | undefined, defaultValue: number = 0): number {
  if (value === undefined) return defaultValue;
  if (!isValidNumber(value)) return defaultValue;
  return Math.max(0, value);
}

export function sanitizeInputs(inputs: Partial<TaxCalculationInputs>): TaxCalculationInputs {
  const reliefLimits = getReliefLimits();

  const clampRelief = (value: number | undefined, cap: number | undefined) => {
    if (value === undefined) return undefined;
    if (!isValidNumber(value)) return undefined;
    if (cap === undefined) return Math.max(0, value);
    return Math.max(0, Math.min(cap, value));
  };

  return {
    businessProfit: sanitizeNumeric(inputs.businessProfit, 0),
    otherIncome: sanitizeNumeric(inputs.otherIncome, 0),
    monthlySalary: inputs.monthlySalary !== undefined 
      ? sanitizeNumeric(inputs.monthlySalary, 0)
      : undefined,
    complianceCosts: inputs.complianceCosts !== undefined
      ? sanitizeNumeric(inputs.complianceCosts, 0)
      : undefined,
    auditCost: inputs.auditCost !== undefined
      ? sanitizeNumeric(inputs.auditCost, 0)
      : undefined,
    auditCriteria: inputs.auditCriteria
      ? {
          revenue: sanitizeNumeric(inputs.auditCriteria.revenue, 0),
          totalAssets: sanitizeNumeric(inputs.auditCriteria.totalAssets, 0),
          employees: Math.max(0, Math.round(sanitizeNumeric(inputs.auditCriteria.employees, 0))),
        }
      : undefined,
    reliefs: inputs.reliefs
      ? {
          ...inputs.reliefs,
          basic: clampRelief(inputs.reliefs.basic ?? reliefLimits.basic, reliefLimits.basic) ?? reliefLimits.basic,
          epfAndLifeInsurance: clampRelief(inputs.reliefs.epfAndLifeInsurance ?? reliefLimits.epfAndLifeInsurance, reliefLimits.epfAndLifeInsurance) ?? reliefLimits.epfAndLifeInsurance,
          medical: clampRelief(inputs.reliefs.medical ?? reliefLimits.medical, reliefLimits.medical) ?? reliefLimits.medical,
          spouse: clampRelief(inputs.reliefs.spouse, reliefLimits.spouse),
          children: clampRelief(inputs.reliefs.children, reliefLimits.children),
          education: clampRelief(inputs.reliefs.education, reliefLimits.education),
          lifestyle: clampRelief(inputs.reliefs.lifestyle as number | undefined, reliefLimits.lifestyle),
          lifestyleAdditional: clampRelief(inputs.reliefs.lifestyleAdditional as number | undefined, reliefLimits.lifestyleAdditional),
          prs: clampRelief(inputs.reliefs.prs as number | undefined, reliefLimits.prs),
          sspn: clampRelief(inputs.reliefs.sspn as number | undefined, reliefLimits.sspn),
        }
      : inputs.reliefs,
    dividendDistributionPercent: inputs.dividendDistributionPercent !== undefined
      ? (() => {
          const raw = inputs.dividendDistributionPercent;
          let pct: number;
          if (!isValidNumber(raw)) {
            pct = raw === Infinity ? 100 : 0;
          } else {
            pct = raw;
          }
          return Math.max(0, Math.min(100, pct));
        })()
      : undefined,
    extendedReliefs: inputs.extendedReliefs,
    applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge,
    hasForeignOwnership: inputs.hasForeignOwnership,
    paidUpCapital: sanitizeNumeric(inputs.paidUpCapital, 0),
    grossIncome: sanitizeNumeric(inputs.grossIncome, 0),
    relatedCompanyShare: inputs.relatedCompanyShare !== undefined
      ? Math.max(0, Math.min(100, sanitizeNumeric(inputs.relatedCompanyShare, 0)))
      : undefined,
    inputMode: inputs.inputMode,
    targetNetIncome: inputs.targetNetIncome !== undefined
      ? sanitizeNumeric(inputs.targetNetIncome, 0)
      : undefined,
    // Zakat sanitization
    zakat: inputs.zakat
      ? {
          enabled: inputs.zakat.enabled ?? false,
          amountPaid: inputs.zakat.amountPaid !== undefined
            ? sanitizeNumeric(inputs.zakat.amountPaid, 0)
            : undefined,
          autoCalculate: inputs.zakat.autoCalculate ?? true,
          method: inputs.zakat.method,
        }
      : undefined,
  };
}

