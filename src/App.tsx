import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Loader2 } from 'lucide-react';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ServicesDirectoryPage } from './pages/public/ServicesDirectoryPage';
import { BusinessBookingPage } from './pages/public/BusinessBookingPage';
import { BookingSuccessPage } from './pages/public/BookingSuccessPage';

// Admin
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCalendar } from './pages/admin/Calendar';
import { BookingsList } from './pages/admin/BookingsList';
import { ServicesList } from './pages/admin/ServicesList';
import { Availability } from './pages/admin/Availability';
import { CustomersList } from './pages/admin/CustomersList';
import { PaymentsList } from './pages/admin/PaymentsList';
import { NotificationsList } from './pages/admin/NotificationsList';
import { Analytics } from './pages/admin/Analytics';
import { BusinessProfile } from './pages/admin/BusinessProfile';
import { AdCampaigns } from './pages/admin/AdCampaigns';
import { OnboardingWizard } from './pages/admin/OnboardingWizard';

// Customer
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyBookings } from './pages/customer/MyBookings';

// Auth Pages
import { CustomerSignIn } from './pages/auth/CustomerSignIn';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Protected Route Guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={28} className="animate-spin" color="var(--brand-primary)" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/customer/sign-in" state={{ from: location }} replace />;
  }

  if (!currentUser?.businessId && !location.pathname.startsWith('/admin/onboarding')) {
    return <Navigate to="/admin/onboarding" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Marketing & Directory */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesDirectoryPage />} />

            {/* Core Public Booking Engine */}
            <Route path="/business/:businessSlug" element={<BusinessBookingPage />} />
            <Route path="/business/:businessSlug/book/success" element={<BookingSuccessPage />} />

            {/* Auth Routes */}
            <Route path="/auth/customer/sign-in" element={<CustomerSignIn />} />
            <Route path="/login" element={<Navigate to="/auth/customer/sign-in" replace />} />
            <Route path="/auth/register" element={<SignUp />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />

            {/* Business Onboarding Wizard */}
            <Route
              path="/admin/onboarding"
              element={
                <ProtectedAdminRoute>
                  <OnboardingWizard />
                </ProtectedAdminRoute>
              }
            />

            {/* Business Admin Workspace */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="calendar" element={<AdminCalendar />} />
              <Route path="bookings" element={<BookingsList />} />
              <Route path="services" element={<ServicesList />} />
              <Route path="availability" element={<Availability />} />
              <Route path="customers" element={<CustomersList />} />
              <Route path="payments" element={<PaymentsList />} />
              <Route path="notifications" element={<NotificationsList />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="business" element={<BusinessProfile />} />
              <Route path="ads" element={<AdCampaigns />} />
            </Route>

            {/* Customer Portal */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<MyBookings />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
