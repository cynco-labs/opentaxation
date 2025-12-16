import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App';
import './index.css';
import './i18n'; // Initialize i18n
import { initErrorTracking } from './lib/errorTracking';
import { initAnalytics } from './lib/analytics';

// Initialize custom error tracking
initErrorTracking();

// Initialize analytics
initAnalytics();

// Mobile-only PWA service worker registration
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

  if (isMobile) {
    // Register SW only on mobile
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' });
    });
  } else {
    // Unregister any existing SW on desktop to prevent caching issues
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
