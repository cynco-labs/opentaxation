import {
  Document,
  Page,
  Text,
  View,
} from '@react-pdf/renderer';
import type { TaxCalculationInputs, ComparisonResult, WaterfallStep, TaxBracketBreakdown } from '@tax-engine/core';
import { styles } from './pdf/pdfStyles';

interface PDFReportProps {
  inputs: TaxCalculationInputs;
  comparison: ComparisonResult;
}

// Format currency
function formatCurrency(amount: number): string {
  return `RM ${Math.abs(amount).toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatCurrencyPrecise(amount: number): string {
  return `RM ${Math.abs(amount).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper component for waterfall rows
function WaterfallRow({ step }: { step: WaterfallStep }) {
  const getPrefix = (type: WaterfallStep['type']) => {
    switch (type) {
      case 'add': return '+ ';
      case 'subtract': return '− ';
      default: return '';
    }
  };

  const getRowStyle = (step: WaterfallStep) => {
    if (step.type === 'total') return styles.waterfallRowTotal;
    if (step.type === 'equals') return styles.waterfallRowEquals;
    if (step.indent) return styles.waterfallRowIndent;
    return styles.waterfallRow;
  };

  const getValueStyle = (type: WaterfallStep['type']) => {
    switch (type) {
      case 'add': return styles.waterfallValueAdd;
      case 'subtract': return styles.waterfallValueSubtract;
      case 'total': return styles.waterfallValueTotal;
      default: return styles.waterfallValueNeutral;
    }
  };

  return (
    <View style={getRowStyle(step)}>
      <Text style={step.highlight ? styles.waterfallLabelBold : styles.waterfallLabel}>
        {step.label}
      </Text>
      <Text style={getValueStyle(step.type)}>
        {getPrefix(step.type)}{formatCurrencyPrecise(step.amount)}
      </Text>
    </View>
  );
}

// Helper component for tax bracket breakdown
function TaxBracketSection({
  breakdown,
  title,
  taxableAmount,
  isCorporate = false,
}: {
  breakdown: TaxBracketBreakdown[];
  title: string;
  taxableAmount?: number;
  isCorporate?: boolean;
}) {
  if (!breakdown || breakdown.length === 0) {
    return null;
  }

  const formatBracketLabel = (min: number, max: number | null, isFirst: boolean): string => {
    if (isFirst && min === 0) {
      if (max !== null) {
        return `First RM${max.toLocaleString('en-MY')}`;
      }
      return 'All income';
    }
    if (max === null) {
      return `Above RM${min.toLocaleString('en-MY')}`;
    }
    const bracketSize = max - min;
    return `Next RM${bracketSize.toLocaleString('en-MY')}`;
  };

  const totalTax = breakdown.reduce((sum, b) => sum + b.taxForBracket, 0);

  return (
    <View style={styles.bracketSection}>
      <View style={styles.bracketHeader}>
        <Text style={styles.bracketTitle}>{title}</Text>
        {taxableAmount !== undefined && (
          <Text style={styles.bracketTaxable}>
            Taxable: {formatCurrency(taxableAmount)}
          </Text>
        )}
      </View>

      <View style={styles.bracketBody}>
        {breakdown.map((bracket, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === breakdown.length - 1;
          const label = formatBracketLabel(bracket.bracketMin, bracket.bracketMax, isFirst);
          const ratePercent = (bracket.rate * 100).toFixed(0);
          const isZeroRate = bracket.rate === 0;

          return (
            <View key={idx} style={isLast ? styles.bracketRowLast : styles.bracketRow}>
              <Text style={styles.bracketLabel}>{label}</Text>
              <Text style={isZeroRate ? styles.bracketRateZero : styles.bracketRate}>
                × {ratePercent}%
              </Text>
              <Text style={isZeroRate ? styles.bracketAmountZero : styles.bracketAmount}>
                = {formatCurrencyPrecise(bracket.taxForBracket)}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.bracketFooter}>
        <Text style={styles.bracketTotalLabel}>
          Total {isCorporate ? 'Corporate' : 'Personal'} Tax
        </Text>
        <Text style={styles.bracketTotalAmount}>{formatCurrencyPrecise(totalTax)}</Text>
      </View>
    </View>
  );
}

export default function PDFReport({ inputs, comparison }: PDFReportProps) {
  const { solePropResult, sdnBhdResult } = comparison;

  const enterpriseTax = solePropResult.personalTax;
  const sdnBhdTax = sdnBhdResult.corporateTax + sdnBhdResult.personalTax + sdnBhdResult.breakdown.dividendTax;
  const winner = comparison.difference > 0 ? 'Sdn Bhd' : 'Enterprise';
  const savings = Math.abs(comparison.difference);

  const nonTaxFactors = [
    { factor: 'Liability', enterprise: 'Unlimited personal', sdnBhd: 'Limited to capital' },
    { factor: 'Banking', enterprise: 'Harder to get loans', sdnBhd: 'Banks prefer companies' },
    { factor: 'Credibility', enterprise: 'Less professional', sdnBhd: 'More client trust' },
    { factor: 'Funding', enterprise: 'Cannot issue shares', sdnBhd: 'Can raise capital' },
    { factor: 'Continuity', enterprise: 'Dies with owner', sdnBhd: 'Perpetual existence' },
    { factor: 'Compliance', enterprise: '~RM60/year', sdnBhd: 'RM3,000-10,000/year' },
    { factor: 'Setup', enterprise: '~RM60', sdnBhd: '~RM1,000+' },
  ];

  return (
    <Document>
      {/* Page 1: Summary & Comparison */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tax Comparison Report</Text>
          <Text style={styles.headerSubtitle}>Enterprise vs Sdn Bhd Analysis</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              Generated {new Date().toLocaleDateString('en-MY', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardLabel}>Business Profit</Text>
              <Text style={styles.summaryCardValue}>{formatCurrency(inputs.businessProfit)}</Text>
              <Text style={styles.summaryCardSubtext}>Annual gross income</Text>
            </View>
            <View style={styles.summaryCardHighlight}>
              <Text style={styles.summaryCardLabelLight}>Recommended</Text>
              <Text style={styles.summaryCardValueLight}>{winner}</Text>
              <Text style={styles.summaryCardSubtextLight}>Saves {formatCurrency(savings)}/year</Text>
            </View>
          </View>

          {/* Quick Comparison Table */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Side-by-Side Comparison</Text>
            </View>

            <View style={styles.comparisonTable}>
              <View style={styles.comparisonHeader}>
                <Text style={styles.comparisonHeaderCellFirst}>Metric</Text>
                <Text style={styles.comparisonHeaderCell}>Enterprise</Text>
                <Text style={styles.comparisonHeaderCell}>Sdn Bhd</Text>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonCellLabel}>Total Tax</Text>
                <Text style={styles.comparisonCellValue}>{formatCurrencyPrecise(enterpriseTax)}</Text>
                <Text style={styles.comparisonCellValue}>{formatCurrencyPrecise(sdnBhdTax)}</Text>
              </View>

              <View style={styles.comparisonRowAlt}>
                <Text style={styles.comparisonCellLabel}>Effective Tax Rate</Text>
                <Text style={styles.comparisonCellValue}>{(solePropResult.effectiveTaxRate * 100).toFixed(1)}%</Text>
                <Text style={styles.comparisonCellValue}>
                  {inputs.businessProfit > 0 ? ((sdnBhdTax / inputs.businessProfit) * 100).toFixed(1) : 0}%
                </Text>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonCellLabel}>EPF Savings</Text>
                <Text style={styles.comparisonCellValue}>—</Text>
                <Text style={styles.comparisonCellValue}>{formatCurrency(sdnBhdResult.epfSavings)}</Text>
              </View>

              <View style={styles.comparisonRowHighlight}>
                <Text style={styles.comparisonCellLabelBold}>Net Cash to You</Text>
                <Text style={comparison.difference <= 0 ? styles.comparisonCellValueSuccess : styles.comparisonCellValueBold}>
                  {formatCurrencyPrecise(solePropResult.netCash)}
                </Text>
                <Text style={comparison.difference > 0 ? styles.comparisonCellValueSuccess : styles.comparisonCellValueBold}>
                  {formatCurrencyPrecise(sdnBhdResult.netCash)}
                </Text>
              </View>
            </View>
          </View>

          {/* Recommendation */}
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationLabel}>Recommendation</Text>
            <Text style={styles.recommendationText}>{comparison.recommendation}</Text>
            <Text style={styles.recommendationSavings}>
              Annual savings: {formatCurrencyPrecise(savings)} • Difference: {(Math.abs(comparison.difference) / inputs.businessProfit * 100).toFixed(1)}% of profit
            </Text>
          </View>

          {/* Warnings */}
          {comparison.warnings.length > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>Important Considerations</Text>
              {comparison.warnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>• {warning}</Text>
              ))}
            </View>
          )}

          {/* Your Inputs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Inputs</Text>
            </View>
            <View style={styles.inputGrid}>
              <View style={styles.inputItem}>
                <Text style={styles.inputLabel}>Business Profit</Text>
                <Text style={styles.inputValue}>{formatCurrency(inputs.businessProfit)}</Text>
              </View>
              <View style={styles.inputItem}>
                <Text style={styles.inputLabel}>Other Income</Text>
                <Text style={styles.inputValue}>{formatCurrency(inputs.otherIncome || 0)}</Text>
              </View>
              {inputs.monthlySalary && (
                <View style={styles.inputItem}>
                  <Text style={styles.inputLabel}>Monthly Salary (Sdn Bhd)</Text>
                  <Text style={styles.inputValue}>{formatCurrency(inputs.monthlySalary)}/mo</Text>
                </View>
              )}
              {inputs.complianceCosts && (
                <View style={styles.inputItem}>
                  <Text style={styles.inputLabel}>Compliance Costs</Text>
                  <Text style={styles.inputValue}>{formatCurrency(inputs.complianceCosts)}/yr</Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This report is for informational purposes only. Tax rates based on Malaysia YA 2024/2025.
              Always consult a qualified tax advisor for your specific situation.
            </Text>
            <Text style={styles.footerBrand}>OpenTaxation.my</Text>
          </View>
        </View>
      </Page>

      {/* Page 2: Detailed Breakdowns */}
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.header, paddingTop: 30, paddingBottom: 20 }}>
          <Text style={{ ...styles.headerTitle, fontSize: 20 }}>Detailed Breakdown</Text>
          <Text style={styles.headerSubtitle}>Cash flow and tax calculation details</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.twoColumns}>
            {/* Enterprise Column */}
            <View style={styles.column}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Enterprise</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>Sole Proprietorship</Text>
                  </View>
                </View>

                {/* Enterprise Waterfall */}
                {solePropResult.waterfall && (
                  <View style={styles.waterfallSection}>
                    <Text style={styles.waterfallTitle}>Cash Flow</Text>
                    {solePropResult.waterfall.map((step, index) => (
                      <WaterfallRow key={index} step={step} />
                    ))}
                  </View>
                )}

                {/* Enterprise Tax Brackets */}
                {solePropResult.taxBracketBreakdown && solePropResult.taxBracketBreakdown.length > 0 && (
                  <TaxBracketSection
                    breakdown={solePropResult.taxBracketBreakdown}
                    title="Tax Calculation"
                    taxableAmount={solePropResult.breakdown.taxableIncome}
                  />
                )}

                {/* Enterprise Insights */}
                {solePropResult.insights && solePropResult.insights.length > 0 && (
                  <View style={styles.insightsBox}>
                    <Text style={styles.insightsTitle}>Key Insights</Text>
                    {solePropResult.insights.map((insight, index) => (
                      <View key={index} style={styles.insightItem}>
                        <Text style={styles.insightBullet}>●</Text>
                        <Text style={styles.insightText}>{insight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Sdn Bhd Column */}
            <View style={styles.column}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Sdn Bhd</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>Private Limited</Text>
                  </View>
                </View>

                {/* Company Waterfall */}
                {sdnBhdResult.companyWaterfall && (
                  <View style={styles.waterfallSection}>
                    <Text style={styles.waterfallTitle}>Company Level</Text>
                    {sdnBhdResult.companyWaterfall.map((step, index) => (
                      <WaterfallRow key={index} step={step} />
                    ))}
                  </View>
                )}

                {/* Personal Waterfall */}
                {sdnBhdResult.personalWaterfall && (
                  <View style={styles.waterfallSection}>
                    <Text style={styles.waterfallTitle}>Personal Level</Text>
                    {sdnBhdResult.personalWaterfall.map((step, index) => (
                      <WaterfallRow key={index} step={step} />
                    ))}
                  </View>
                )}

                {/* Sdn Bhd Insights */}
                {sdnBhdResult.insights && sdnBhdResult.insights.length > 0 && (
                  <View style={styles.insightsBox}>
                    <Text style={styles.insightsTitle}>Key Insights</Text>
                    {sdnBhdResult.insights.map((insight, index) => (
                      <View key={index} style={styles.insightItem}>
                        <Text style={styles.insightBullet}>●</Text>
                        <Text style={styles.insightText}>{insight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* Page 3: Tax Brackets & Non-Tax Factors */}
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.header, paddingTop: 30, paddingBottom: 20 }}>
          <Text style={{ ...styles.headerTitle, fontSize: 20 }}>Tax Brackets & Considerations</Text>
          <Text style={styles.headerSubtitle}>Detailed calculations and non-tax factors</Text>
        </View>

        <View style={styles.content}>
          {/* Sdn Bhd Tax Brackets */}
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              {sdnBhdResult.corporateTaxBracketBreakdown && sdnBhdResult.corporateTaxBracketBreakdown.length > 0 && (
                <TaxBracketSection
                  breakdown={sdnBhdResult.corporateTaxBracketBreakdown}
                  title="Corporate Tax"
                  taxableAmount={sdnBhdResult.breakdown.companyTaxableProfit}
                  isCorporate
                />
              )}
            </View>
            <View style={styles.column}>
              {sdnBhdResult.personalTaxBracketBreakdown && sdnBhdResult.personalTaxBracketBreakdown.length > 0 && (
                <TaxBracketSection
                  breakdown={sdnBhdResult.personalTaxBracketBreakdown}
                  title="Personal Tax (Director)"
                  taxableAmount={sdnBhdResult.breakdown.annualSalary}
                />
              )}
            </View>
          </View>

          {/* Non-Tax Factors */}
          <View style={{ ...styles.section, marginTop: 24 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Beyond Tax: Business Considerations</Text>
            </View>

            <View style={styles.nonTaxTable}>
              <View style={styles.nonTaxHeader}>
                <Text style={styles.nonTaxHeaderCellFirst}>Factor</Text>
                <Text style={styles.nonTaxHeaderCell}>Enterprise</Text>
                <Text style={styles.nonTaxHeaderCell}>Sdn Bhd</Text>
              </View>
              {nonTaxFactors.map((row, index) => (
                <View key={index} style={index % 2 === 0 ? styles.nonTaxRow : styles.nonTaxRowAlt}>
                  <Text style={styles.nonTaxCellFactor}>{row.factor}</Text>
                  <Text style={styles.nonTaxCellValue}>{row.enterprise}</Text>
                  <Text style={styles.nonTaxCellValue}>{row.sdnBhd}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={{ ...styles.footer, marginTop: 40 }}>
            <Text style={styles.footerText}>
              Tax decisions should consider both financial and non-financial factors.
              This analysis is based on standard rates and may vary based on your specific circumstances.
            </Text>
            <Text style={styles.footerBrand}>OpenTaxation.my • opentaxation.my</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
