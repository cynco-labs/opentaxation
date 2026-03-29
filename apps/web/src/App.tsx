import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TooltipProvider } from './components/ui/tooltip';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { trackPageView } from './lib/analytics';

// Layout
import AppShell from './components/layout/AppShell';

// Main pages (not lazy - core experience)
import LandingHub from './pages/LandingHub';
import CalculatorPage from './pages/CalculatorPage';

// Dashboard (lazy loaded)
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const DashboardCalendar = lazy(() => import('./pages/dashboard/DashboardCalendar'));
const SavedCalculations = lazy(() => import('./pages/dashboard/SavedCalculations'));
const DashboardSettings = lazy(() => import('./pages/dashboard/DashboardSettings'));

// Auth pages
const AuthPage = lazy(() => import('./pages/AuthPage'));

// Legal pages
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/pages/TermsOfService'));
const Disclaimer = lazy(() => import('./components/pages/Disclaimer'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));

// Tools (public, in AppShell)
const EInvoicingHub = lazy(() => import('./pages/einvoicing/EInvoicingHub'));

// Blog (public)
const BlogListPage = lazy(() => import('./pages/blog/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/blog/BlogPostPage'));

// Blog admin (inside dashboard)
const BlogAdminList = lazy(() => import('./pages/dashboard/blog/BlogAdminList'));
const BlogAdminEdit = lazy(() => import('./pages/dashboard/blog/BlogAdminEdit'));

// Special microsites
const YearEnd2025Page = lazy(() => import('./pages/yearend2025/YearEnd2025Page'));


// Loading fallback for lazy routes
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        {/* Public pages with persistent navigation */}
        <Route element={<AppShell />}>
          <Route index element={<LandingHub />} />
          <Route path="calendar" element={<DashboardCalendar />} />
          <Route path="e-invoicing" element={<EInvoicingHub />} />
        </Route>

        {/* Dashboard (auth-protected, has its own layout with sidebar) */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="calendar" element={<DashboardCalendar />} />
          <Route path="calculations" element={<SavedCalculations />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="blog" element={<BlogAdminList />} />
          <Route path="blog/:id" element={<BlogAdminEdit />} />
        </Route>

        {/* Calculator has its own optimized layout */}
        <Route path="calculator" element={<CalculatorPage />} />

        {/* Year End 2025 - standalone microsite (hidden, direct link only) */}
        <Route path="yearend2025" element={<YearEnd2025Page />} />

        {/* Auth pages (outside AppShell) */}
        <Route path="login" element={<AuthPage />} />
        <Route path="signup" element={<AuthPage />} />

        {/* Legal & info pages */}
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="docs" element={<DocsPage />} />

        {/* Partners page */}
        <Route path="partners" element={<PartnersPage />} />

        {/* Blog (public) */}
        <Route path="blog" element={<BlogListPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />

        {/* Legacy redirects */}
        <Route path="saved" element={<Navigate to="/dashboard/calculations" replace />} />
        <Route path="settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="admin/blog" element={<Navigate to="/dashboard/blog" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <TooltipProvider>
          <AppRoutes />
          <PWAInstallPrompt />
        </TooltipProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
