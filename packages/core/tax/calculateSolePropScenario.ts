import { calculateReliefOptimization } from './calculateReliefOptimization';
import {
  getPersonalTaxBracketBreakdown,
  calculateZakatGrossIncome,
  calculateIndividualZakatRebate,
  meetsNisabThreshold,
  calculatePersonalTaxFromBrackets,
} from '@tax-engine/config';
import type { TaxCalculationInputs, SolePropScenarioResult, WaterfallStep, TaxBracketBreakdown, ZakatResult } from '../types';
import { roundCurrency, roundPercentage } from '../utils/rounding';

// Net Cash = (Business Profit + Other Income) - Personal Tax - Zakat Paid
// Zakat is a 100% tax rebate capped at tax payable (s.6A(3) ITA 1967)
export function calculateSolePropScenario(
  inputs: Pick<TaxCalculationInputs, 'businessProfit' | 'otherIncome' | 'reliefs' | 'extendedReliefs' | 'zakat'>
): SolePropScenarioResult {
  const { businessProfit, otherIncome = 0, reliefs, extendedReliefs, zakat } = inputs;

  if (!isFinite(businessProfit) || businessProfit < 0) {
    throw new Error('Business profit must be a valid non-negative number');
  }
  if (!isFinite(otherIncome) || otherIncome < 0) {
    throw new Error('Other income must be a valid non-negative number');
  }

  const totalIncome = businessProfit + otherIncome;

  const hasExtendedReliefs = extendedReliefs && Object.keys(extendedReliefs).length > 0;
  let totalReliefsAmount: number;

  if (hasExtendedReliefs) {
    const optimizationResult = calculateReliefOptimization(extendedReliefs);
    totalReliefsAmount = optimizationResult.total;
  } else {
    totalReliefsAmount = reliefs
      ? Object.values(reliefs).reduce((sum: number, v) => sum + (typeof v === 'number' ? v : 0), 0)
      : 24000; // Default: basic (9000) + EPF (7000) + medical (8000)
  }

  const taxableIncome = Math.max(0, totalIncome - totalReliefsAmount);
  const taxAmount = calculatePersonalTaxFromBrackets(taxableIncome);
  const personalTaxResult = {
    tax: taxAmount,
    totalReliefs: totalReliefsAmount,
    taxableIncome,
    effectiveRate: totalIncome > 0 ? taxAmount / totalIncome : 0,
  };

  const taxBeforeZakat = personalTaxResult.tax;

  let zakatResult: ZakatResult | undefined;
  let zakatRebate = 0;
  let excessZakat = 0;
  let zakatAmount = 0;

  if (zakat?.enabled) {
    if (zakat.autoCalculate !== false && zakat.amountPaid === undefined) {
      zakatAmount = calculateZakatGrossIncome(totalIncome);
    } else {
      zakatAmount = zakat.amountPaid ?? 0;
    }

    const rebateResult = calculateIndividualZakatRebate(zakatAmount, taxBeforeZakat);
    zakatRebate = rebateResult.rebate;
    excessZakat = rebateResult.excessZakat;

    zakatResult = {
      enabled: true,
      zakatAmount: roundCurrency(zakatAmount),
      meetsNisab: meetsNisabThreshold(totalIncome),
      taxBenefit: roundCurrency(zakatRebate),
      excessZakat: roundCurrency(excessZakat),
    };
  }

  const finalPersonalTax = Math.max(0, taxBeforeZakat - zakatRebate);
  const netCash = totalIncome - finalPersonalTax - zakatAmount;

  const waterfall: WaterfallStep[] = [
    { label: 'Business Profit', amount: businessProfit, type: 'add' },
  ];

  if (otherIncome > 0) {
    waterfall.push({ label: 'Other Income', amount: otherIncome, type: 'add' });
  }

  waterfall.push(
    { label: 'Gross Income', amount: totalIncome, type: 'equals' },
    { label: 'Personal Reliefs', amount: personalTaxResult.totalReliefs, type: 'subtract' },
    { label: 'Taxable Income', amount: personalTaxResult.taxableIncome, type: 'equals' },
  );

  if (zakat?.enabled && zakatAmount > 0) {
    waterfall.push(
      { label: 'Income Tax (before zakat)', amount: taxBeforeZakat, type: 'subtract' },
      { label: 'Zakat Rebate (100%)', amount: zakatRebate, type: 'add', indent: true },
      { label: 'Net Tax After Zakat', amount: finalPersonalTax, type: 'equals' },
      { label: 'Zakat Paid', amount: zakatAmount, type: 'subtract' },
    );
  } else {
    waterfall.push(
      { label: 'Personal Tax', amount: finalPersonalTax, type: 'subtract' },
    );
  }

  waterfall.push(
    { label: 'Net Cash to You', amount: netCash, type: 'total', highlight: true }
  );

  const insights: string[] = [
    'No liability protection - personal assets at risk',
    'No forced savings (EPF) - you manage your own retirement',
    'Minimal compliance costs (~RM60/year)',
  ];

  if (zakat?.enabled && zakatAmount > 0) {
    if (zakatRebate > 0) {
      insights.unshift(`Zakat rebate saves you RM${Math.round(zakatRebate).toLocaleString('en-MY')} in tax`);
    }
    if (excessZakat > 0) {
      insights.unshift(`RM${Math.round(excessZakat).toLocaleString('en-MY')} zakat exceeds tax (spiritual benefit only)`);
    }
  }

  const bracketBreakdownRaw = getPersonalTaxBracketBreakdown(personalTaxResult.taxableIncome);
  const taxBracketBreakdown: TaxBracketBreakdown[] = bracketBreakdownRaw.map(b => ({
    bracketMin: b.bracketMin,
    bracketMax: b.bracketMax,
    rate: b.rate,
    incomeInBracket: b.incomeInBracket,
    taxForBracket: b.taxForBracket,
  }));

  const effectiveTaxRate = totalIncome > 0 ? finalPersonalTax / totalIncome : 0;

  return {
    personalTax: roundCurrency(finalPersonalTax),
    netCash: roundCurrency(netCash),
    effectiveTaxRate: roundPercentage(effectiveTaxRate),
    breakdown: {
      businessProfit: roundCurrency(businessProfit),
      otherIncome: roundCurrency(otherIncome),
      totalIncome: roundCurrency(totalIncome),
      totalReliefs: personalTaxResult.totalReliefs,
      taxableIncome: personalTaxResult.taxableIncome,
    },
    waterfall,
    insights,
    taxBracketBreakdown,
    zakat: zakatResult,
    taxBeforeZakatRebate: zakat?.enabled ? roundCurrency(taxBeforeZakat) : undefined,
  };
}

