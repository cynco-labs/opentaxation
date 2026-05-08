interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000,
};

const rateLimits = new Map<string, number[]>();

export function checkRateLimit(
  action: string,
  config: Partial<RateLimitConfig> = {}
): boolean {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = rateLimits.get(action) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= maxRequests) {
    rateLimits.set(action, recent);
    return false;
  }

  recent.push(now);
  rateLimits.set(action, recent);
  return true;
}

export function getRemainingRequests(
  action: string,
  config: Partial<RateLimitConfig> = {}
): number {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = rateLimits.get(action) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  return Math.max(0, maxRequests - recent.length);
}

export function getResetTime(
  action: string,
  config: Partial<RateLimitConfig> = {}
): number {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const timestamps = rateLimits.get(action) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length < maxRequests) {
    return 0;
  }

  const oldest = Math.min(...recent);
  return Math.max(0, windowMs - (now - oldest));
}

export function resetRateLimit(action: string): void {
  rateLimits.delete(action);
}

export function clearAllRateLimits(): void {
  rateLimits.clear();
}

export const RATE_LIMITS = {
  SAVE_CALCULATION: { maxRequests: 10, windowMs: 60000 },
  ERROR_REPORT: { maxRequests: 10, windowMs: 60000 },
  SHARE_LINK: { maxRequests: 20, windowMs: 60000 },
  COMMENT: { maxRequests: 5, windowMs: 60000 },
  LEAD: { maxRequests: 3, windowMs: 60000 },
} as const;
