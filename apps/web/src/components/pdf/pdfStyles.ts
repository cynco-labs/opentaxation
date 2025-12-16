import { StyleSheet } from '@react-pdf/renderer';

// Elegant color palette
export const colors = {
  primary: '#0f172a',      // Slate 900
  secondary: '#475569',    // Slate 600
  muted: '#94a3b8',        // Slate 400
  accent: '#0ea5e9',       // Sky 500
  success: '#059669',      // Emerald 600
  warning: '#d97706',      // Amber 600
  danger: '#dc2626',       // Red 600
  background: '#f8fafc',   // Slate 50
  border: '#e2e8f0',       // Slate 200
  white: '#ffffff',
};

export const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: colors.white,
  },
  // Header section
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  headerBadge: {
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  headerBadgeText: {
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  // Content wrapper
  content: {
    padding: 40,
  },
  // Summary cards section
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCardHighlight: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 20,
  },
  summaryCardLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryCardLabelLight: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summaryCardValueLight: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  summaryCardSubtext: {
    fontSize: 9,
    color: colors.secondary,
    marginTop: 4,
  },
  summaryCardSubtextLight: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  // Section styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  sectionBadge: {
    marginLeft: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionBadgeText: {
    fontSize: 8,
    color: colors.secondary,
  },
  // Input summary
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  inputItem: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  inputLabel: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Comparison table
  comparisonTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 12,
  },
  comparisonHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  comparisonHeaderCellFirst: {
    flex: 1.5,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'left',
  },
  comparisonRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  comparisonRowAlt: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  comparisonRowHighlight: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f0f9ff',
  },
  comparisonCellLabel: {
    flex: 1.5,
    fontSize: 10,
    color: colors.secondary,
  },
  comparisonCellLabelBold: {
    flex: 1.5,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  comparisonCellValue: {
    flex: 1,
    fontSize: 10,
    color: colors.primary,
    textAlign: 'right',
  },
  comparisonCellValueBold: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
  },
  comparisonCellValueSuccess: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'right',
  },
  // Waterfall section
  waterfallSection: {
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  waterfallTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  waterfallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  waterfallRowIndent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingLeft: 16,
  },
  waterfallRowEquals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  waterfallRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    backgroundColor: colors.white,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: -16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  waterfallLabel: {
    fontSize: 9,
    color: colors.secondary,
  },
  waterfallLabelBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  waterfallValueAdd: {
    fontSize: 9,
    color: colors.success,
    fontWeight: 'bold',
  },
  waterfallValueSubtract: {
    fontSize: 9,
    color: colors.danger,
  },
  waterfallValueNeutral: {
    fontSize: 9,
    color: colors.secondary,
  },
  waterfallValueTotal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Tax bracket styles
  bracketSection: {
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  bracketHeader: {
    backgroundColor: colors.background,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bracketTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bracketTaxable: {
    fontSize: 9,
    color: colors.secondary,
  },
  bracketBody: {
    padding: 12,
  },
  bracketRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bracketRowLast: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  bracketLabel: {
    flex: 2,
    fontSize: 9,
    color: colors.secondary,
  },
  bracketRate: {
    width: 50,
    fontSize: 9,
    color: colors.primary,
    textAlign: 'center',
  },
  bracketRateZero: {
    width: 50,
    fontSize: 9,
    color: colors.success,
    textAlign: 'center',
  },
  bracketAmount: {
    width: 70,
    fontSize: 9,
    color: colors.primary,
    textAlign: 'right',
  },
  bracketAmountZero: {
    width: 70,
    fontSize: 9,
    color: colors.success,
    textAlign: 'right',
  },
  bracketFooter: {
    backgroundColor: colors.background,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bracketTotalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bracketTotalAmount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Recommendation box
  recommendationBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    marginBottom: 24,
  },
  recommendationLabel: {
    fontSize: 10,
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  recommendationSavings: {
    fontSize: 10,
    color: colors.secondary,
  },
  // Warning box
  warningBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: 6,
  },
  warningText: {
    fontSize: 9,
    color: '#92400e',
    lineHeight: 1.4,
  },
  // Insights
  insightsBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  insightBullet: {
    fontSize: 8,
    color: colors.accent,
    marginRight: 6,
    marginTop: 1,
  },
  insightText: {
    fontSize: 9,
    color: colors.secondary,
    flex: 1,
    lineHeight: 1.4,
  },
  // Non-tax factors table
  nonTaxTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nonTaxHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 10,
  },
  nonTaxHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
  },
  nonTaxHeaderCellFirst: {
    flex: 0.8,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
  },
  nonTaxRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nonTaxRowAlt: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nonTaxCellFactor: {
    flex: 0.8,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.primary,
  },
  nonTaxCellValue: {
    flex: 1,
    fontSize: 8,
    color: colors.secondary,
    paddingHorizontal: 4,
  },
  // Footer
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  footerBrand: {
    fontSize: 9,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  // Two columns for page 2
  twoColumns: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
});
