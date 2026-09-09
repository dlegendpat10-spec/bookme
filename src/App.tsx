import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';

// Pages
import { LandingPage } from './pages/LandingPage';
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
import { OnboardingWizard } from './pages/admin/OnboardingWizard';

// Customer
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyBookings } from './pages/customer/MyBookings';

// Auth
import { CustomerSignIn } from './pages/auth/CustomerSignIn';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public Marketing */}
            <Route path="/" element={<LandingPage />} />

            {/* Core Public Booking Engine */}
            <Route path="/business/:businessSlug" element={<BusinessBookingPage />} />
            <Route path="/business/:businessSlug/book/success" element={<BookingSuccessPage />} />

            {/* Business Onboarding Wizard */}
            <Route path="/admin/onboarding" element={<OnboardingWizard />} />

            {/* Business Admin Workspace */}
            <Route path="/admin" element={<AdminLayout />}>
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
            </Route>

            {/* Customer Portal */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<MyBookings />} />

            {/* Auth */}
            <Route path="/auth/customer/sign-in" element={<CustomerSignIn />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
