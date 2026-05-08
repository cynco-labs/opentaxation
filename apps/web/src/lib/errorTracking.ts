import { checkRateLimit, RATE_LIMITS } from './rateLimiter';

interface ErrorLog {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  errorType: string;
  componentStack?: string;
}

export function logError(
  error: Error,
  errorInfo?: {
    componentStack?: string;
    userId?: string;
  }
) {
  if (!checkRateLimit('error-report', RATE_LIMITS.ERROR_REPORT)) {
    console.warn('Error rate limit exceeded, not reporting additional errors');
    return;
  }

  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    userId: errorInfo?.userId,
    errorType: error.name || 'Error',
    componentStack: errorInfo?.componentStack,
  };

  console.error('Error occurred:', errorLog);

  if (import.meta.env.MODE === 'production' && import.meta.env.VITE_ERROR_TRACKING_ENABLED === 'true') {
    sendErrorToBackend(errorLog).catch((err) => {
      console.error('Failed to send error to backend:', err);
    });
  }

  storeErrorLocally(errorLog);
}

async function sendErrorToBackend(errorLog: ErrorLog): Promise<void> {
  const endpoint = import.meta.env.VITE_ERROR_TRACKING_ENDPOINT || '/api/errors';

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog),
    });
  } catch (err) {
    console.warn('Error tracking failed:', err);
  }
}

function storeErrorLocally(errorLog: ErrorLog): void {
  try {
    const stored = localStorage.getItem('app_errors');
    const errors: ErrorLog[] = stored ? JSON.parse(stored) : [];
    errors.unshift(errorLog);
    if (errors.length > 10) {
      errors.pop();
    }
    localStorage.setItem('app_errors', JSON.stringify(errors));
  } catch {
    // Ignore localStorage errors
  }
}

export function getStoredErrors(): ErrorLog[] {
  try {
    const stored = localStorage.getItem('app_errors');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearStoredErrors(): void {
  localStorage.removeItem('app_errors');
}

export function initErrorTracking() {
  window.addEventListener('error', (event) => {
    logError(new Error(event.message), {
      componentStack: event.filename ? `${event.filename}:${event.lineno}` : undefined,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
    logError(error);
  });
}
