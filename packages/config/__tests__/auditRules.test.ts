/**
 * Audit Exemption Rules — comprehensive tests
 *
 * Tests the phased SSM PD 10/2024 audit exemption thresholds
 * and the "any 2 of 3" logic for post-2025 years.
 */
import { describe, it, expect } from 'vitest';
import {
  isAuditExempt,
  getAuditExemptionThresholds,
  AUDIT_EXEMPTION_THRESHOLDS,
} from '../auditRules';

// ─── getAuditExemptionThresholds ──────────────────────────────────────

describe('getAuditExemptionThresholds', () => {
  it('returns Phase 1 thresholds for 2025', () => {
    const t = getAuditExemptionThresholds(2025);
    expect(t.revenue).toBe(1_000_000);
    expect(t.totalAssets).toBe(1_000_000);
    expect(t.employees).toBe(10);
  });

  it('returns Phase 2 thresholds for 2026', () => {
    const t = getAuditExemptionThresholds(2026);
    expect(t.revenue).toBe(2_000_000);
    expect(t.totalAssets).toBe(2_000_000);
    expect(t.employees).toBe(20);
  });

  it('returns Phase 3 thresholds for 2027', () => {
    const t = getAuditExemptionThresholds(2027);
    expect(t.revenue).toBe(3_000_000);
    expect(t.totalAssets).toBe(3_000_000);
    expect(t.employees).toBe(30);
  });

  it('returns Phase 3 for years beyond 2027', () => {
    const t = getAuditExemptionThresholds(2030);
    expect(t.revenue).toBe(3_000_000);
  });

  it('returns legacy thresholds for pre-2025', () => {
    const t = getAuditExemptionThresholds(2024);
    expect(t.revenue).toBe(100_000);
    expect(t.totalAssets).toBe(300_000);
    expect(t.employees).toBe(5);
  });

  it('exported AUDIT_EXEMPTION_THRESHOLDS uses current year', () => {
    // Should match the current year's thresholds
    const t = getAuditExemptionThresholds();
    expect(AUDIT_EXEMPTION_THRESHOLDS).toEqual(t);
  });
});

// ─── isAuditExempt — post-2025 (any 2 of 3) ──────────────────────────

describe('isAuditExempt post-2025', () => {
  it('exempt when all 3 criteria met', () => {
    expect(isAuditExempt(
      { revenue: 500_000, totalAssets: 500_000, employees: 5 },
      2025,
    )).toBe(true);
  });

  it('exempt when exactly 2 criteria met (revenue + assets)', () => {
    expect(isAuditExempt(
      { revenue: 500_000, totalAssets: 500_000, employees: 50 },
      2025,
    )).toBe(true);
  });

  it('exempt when exactly 2 criteria met (revenue + employees)', () => {
    expect(isAuditExempt(
      { revenue: 500_000, totalAssets: 5_000_000, employees: 5 },
      2025,
    )).toBe(true);
  });

  it('exempt when exactly 2 criteria met (assets + employees)', () => {
    expect(isAuditExempt(
      { revenue: 5_000_000, totalAssets: 500_000, employees: 5 },
      2025,
    )).toBe(true);
  });

  it('NOT exempt when only 1 criterion met', () => {
    expect(isAuditExempt(
      { revenue: 500_000, totalAssets: 5_000_000, employees: 50 },
      2025,
    )).toBe(false);
  });

  it('NOT exempt when 0 criteria met', () => {
    expect(isAuditExempt(
      { revenue: 5_000_000, totalAssets: 5_000_000, employees: 50 },
      2025,
    )).toBe(false);
  });

  it('exempt at exact threshold boundaries (<=)', () => {
    expect(isAuditExempt(
      { revenue: 1_000_000, totalAssets: 1_000_000, employees: 10 },
      2025,
    )).toBe(true);
  });

  it('NOT exempt just above threshold (>)', () => {
    expect(isAuditExempt(
      { revenue: 1_000_001, totalAssets: 1_000_001, employees: 11 },
      2025,
    )).toBe(false);
  });
});

// ─── isAuditExempt — pre-2025 legacy (all 3 required) ────────────────

describe('isAuditExempt pre-2025 legacy', () => {
  it('exempt when all 3 criteria met', () => {
    expect(isAuditExempt(
      { revenue: 50_000, totalAssets: 100_000, employees: 3 },
      2024,
    )).toBe(true);
  });

  it('NOT exempt when only 2 criteria met (legacy requires all 3)', () => {
    expect(isAuditExempt(
      { revenue: 50_000, totalAssets: 100_000, employees: 10 },
      2024,
    )).toBe(false);
  });

  it('NOT exempt with high revenue even if others qualify', () => {
    expect(isAuditExempt(
      { revenue: 200_000, totalAssets: 100_000, employees: 3 },
      2024,
    )).toBe(false);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────

describe('isAuditExempt edge cases', () => {
  it('handles zero values (all zeros = exempt)', () => {
    expect(isAuditExempt(
      { revenue: 0, totalAssets: 0, employees: 0 },
      2025,
    )).toBe(true);
  });

  it('handles very large values (never exempt)', () => {
    expect(isAuditExempt(
      { revenue: 1_000_000_000, totalAssets: 1_000_000_000, employees: 10000 },
      2027,
    )).toBe(false);
  });

  it('Phase 2 (2026) uses RM2M thresholds, not RM1M', () => {
    // RM1.5M revenue would fail Phase 1 (2025) but pass Phase 2 (2026)
    expect(isAuditExempt(
      { revenue: 1_500_000, totalAssets: 1_500_000, employees: 15 },
      2025,
    )).toBe(false);
    expect(isAuditExempt(
      { revenue: 1_500_000, totalAssets: 1_500_000, employees: 15 },
      2026,
    )).toBe(true);
  });
});
