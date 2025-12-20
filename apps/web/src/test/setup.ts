import '@testing-library/jest-dom';
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

class LocalStorageMock {
  private store = new Map<string, string>();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}

beforeAll(() => {
  const needsMock =
    typeof window === 'undefined' ||
    !('localStorage' in window) ||
    typeof window.localStorage?.clear !== 'function';

  if (needsMock) {
    const mock = new LocalStorageMock();
    Object.defineProperty(window, 'localStorage', {
      value: mock,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'localStorage', {
      value: mock,
      writable: true,
      configurable: true,
    });
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
