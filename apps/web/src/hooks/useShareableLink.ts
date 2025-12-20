import { useCallback, useEffect, useState } from 'react';
import type { StoredInputs } from './useLocalStorage';

/**
 * Encode inputs into a URL-safe base64 string
 * Uses a compact format to keep URLs shorter
 */
const SHARE_VERSION = 2;

function base64UrlEncode(value: string): string {
  return btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = padding ? normalized + '='.repeat(4 - padding) : normalized;
  return atob(padded);
}

function decodeEncodedPayload(encoded: string): string | null {
  try {
    return base64UrlDecode(encoded);
  } catch {
    try {
      return atob(encoded);
    } catch {
      return null;
    }
  }
}

function pickDefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  return Object.fromEntries(entries) as Partial<T>;
}

function encodeInputs(inputs: StoredInputs): string {
  // Create a compact object with short keys
  const compact = {
    v: SHARE_VERSION,
    bp: inputs.businessProfit,
    oi: inputs.otherIncome,
    ms: inputs.monthlySalary,
    cc: inputs.complianceCosts,
    ar: inputs.auditRevenue,
    aa: inputs.auditAssets,
    ae: inputs.auditEmployees,
    ac: inputs.auditCost,
    ds: inputs.applyYa2025DividendSurcharge ? 1 : 0,
    dp: inputs.dividendDistributionPercent,
    fo: inputs.hasForeignOwnership ? 1 : 0,
    im: inputs.inputMode === 'target' ? 1 : 0,
    tn: inputs.targetNetIncome,
    er: inputs.extendedReliefs,
    z: inputs.zakat,
  };

  try {
    const json = JSON.stringify(compact);
    return base64UrlEncode(json);
  } catch {
    return '';
  }
}

/**
 * Decode a URL-safe base64 string back to inputs
 */
function decodeInputs(encoded: string): Partial<StoredInputs> | null {
  try {
    const json = decodeEncodedPayload(encoded);
    if (!json) return null;

    const compact = JSON.parse(json) as {
      v?: number;
      bp?: number;
      oi?: number;
      ms?: number;
      cc?: number;
      ar?: number;
      aa?: number;
      ae?: number;
      ac?: number;
      ds?: number;
      dp?: number;
      fo?: number;
      im?: number;
      tn?: number;
      er?: StoredInputs['extendedReliefs'];
      z?: StoredInputs['zakat'];
    };

    if (!compact || typeof compact !== 'object') {
      return null;
    }

    const version = typeof compact.v === 'number' ? compact.v : 1;
    if (version !== 1 && version !== 2) {
      return null;
    }

    const decoded: Partial<StoredInputs> = {
      businessProfit: compact.bp,
      otherIncome: compact.oi,
      monthlySalary: compact.ms,
      complianceCosts: compact.cc,
      auditRevenue: compact.ar,
      auditAssets: compact.aa,
      auditEmployees: compact.ae,
      auditCost: compact.ac,
      applyYa2025DividendSurcharge: typeof compact.ds === 'number' ? compact.ds === 1 : undefined,
      dividendDistributionPercent: compact.dp,
      hasForeignOwnership: typeof compact.fo === 'number' ? compact.fo === 1 : undefined,
      inputMode: typeof compact.im === 'number' ? (compact.im === 1 ? 'target' : 'profit') : undefined,
      targetNetIncome: compact.tn,
    };

    if (version >= 2) {
      decoded.extendedReliefs = compact.er;
      decoded.zakat = compact.z;
    }

    return pickDefined(decoded);
  } catch {
    return null;
  }
}

const SHARE_PARAM = 'calc';

/**
 * Hook to handle shareable links with encoded inputs
 */
export function useShareableLink(
  inputs: StoredInputs,
  onLoadSharedInputs: (inputs: Partial<StoredInputs>) => void
) {
  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false);

  // Check URL for shared inputs on mount
  useEffect(() => {
    if (hasLoadedFromUrl) return;

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(SHARE_PARAM);

    if (encoded) {
      const decoded = decodeInputs(encoded);
      if (decoded) {
        onLoadSharedInputs(decoded);
        // Clear the URL parameter after loading to avoid re-loading on refresh
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete(SHARE_PARAM);
        window.history.replaceState({}, '', newUrl.toString());
      }
    }

    setHasLoadedFromUrl(true);
  }, [hasLoadedFromUrl, onLoadSharedInputs]);

  // Generate shareable link
  const generateShareableLink = useCallback((): string => {
    const encoded = encodeInputs(inputs);
    if (!encoded) return window.location.origin;

    const url = new URL(window.location.origin);
    url.searchParams.set(SHARE_PARAM, encoded);
    return url.toString();
  }, [inputs]);

  // Copy link to clipboard
  const copyShareableLink = useCallback(async (): Promise<boolean> => {
    const link = generateShareableLink();

    try {
      await navigator.clipboard.writeText(link);
      return true;
    } catch {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  }, [generateShareableLink]);

  return {
    generateShareableLink,
    copyShareableLink,
    hasLoadedFromUrl,
  };
}
