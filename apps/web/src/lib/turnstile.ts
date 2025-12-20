const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          size: 'invisible' | 'normal' | 'compact';
          action?: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        }
      ) => string;
      execute: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }

    if (document.querySelector(`script[src="${TURNSTILE_SCRIPT_SRC}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile.'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function getTurnstileToken(
  siteKey: string,
  action: string = 'submit'
): Promise<string | null> {
  if (!siteKey || typeof window === 'undefined') {
    return null;
  }

  try {
    await loadTurnstileScript();
  } catch {
    return null;
  }

  if (!window.turnstile?.render) {
    return null;
  }

  return new Promise((resolve) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    let widgetId: string | null = null;

    const cleanup = () => {
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
      container.remove();
    };

    if (!window.turnstile) {
      cleanup();
      resolve(null);
      return;
    }

    widgetId = window.turnstile.render(container, {
      sitekey: siteKey,
      size: 'invisible',
      action,
      callback: (token: string) => {
        cleanup();
        resolve(token);
      },
      'error-callback': () => {
        cleanup();
        resolve(null);
      },
      'expired-callback': () => {
        cleanup();
        resolve(null);
      },
    });

    try {
      window.turnstile?.execute(widgetId);
    } catch {
      cleanup();
      resolve(null);
    }
  });
}
