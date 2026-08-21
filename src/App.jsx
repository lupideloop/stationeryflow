import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import AppLayout from '@/components/layout/AppLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import RequisitionForm from '@/pages/RequisitionForm';
// Add page imports here

// Authenticated pages are lazy-loaded so the initial bundle only includes
// the auth shell + layout; each route's code downloads on first visit.
const Settings = lazy(() => import('@/pages/Settings'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MasterStock = lazy(() => import('@/pages/MasterStock'));
const Purchases = lazy(() => import('@/pages/Purchases'));
const Transfers = lazy(() => import('@/pages/Transfers'));
const MonthlySummary = lazy(() => import('@/pages/MonthlySummary'));
const StockTakePage = lazy(() => import('@/pages/StockTake'));
const ImportData = lazy(() => import('@/pages/ImportData'));
const Connect = lazy(() => import('@/pages/Connect'));
const Reports = lazy(() => import('@/pages/Reports'));
const Configuration = lazy(() => import('@/pages/Configuration'));
const Requisitions = lazy(() => import('@/pages/Requisitions'));
const Elara = lazy(() => import('@/pages/Elara'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/requisition" element={<RequisitionForm />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={withSuspense(Dashboard)} />
        <Route path="/master-stock" element={withSuspense(MasterStock)} />
        <Route path="/purchases" element={withSuspense(Purchases)} />
        <Route path="/transfers" element={withSuspense(Transfers)} />
        <Route path="/monthly-summary" element={withSuspense(MonthlySummary)} />
        <Route path="/stock-take" element={withSuspense(StockTakePage)} />
        <Route path="/import" element={withSuspense(ImportData)} />
        <Route path="/connect" element={withSuspense(Connect)} />
        <Route path="/reports" element={withSuspense(Reports)} />
        <Route path="/configuration" element={withSuspense(Configuration)} />
        <Route path="/requisitions" element={withSuspense(Requisitions)} />
        <Route path="/elara" element={withSuspense(Elara)} />
        <Route path="/settings" element={withSuspense(Settings)} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App