import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import AdminLogin from '@/pages/admin/AdminLogin';
import LandingPage from '@/pages/public/Landing';
import VerifyOtp from '@/pages/auth/VerifyOtp';
import ResetPassword from '@/pages/auth/ResetPassword';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import AuthRedirect from '@/components/common/AuthRedirect';
import PublicLayout from '@/layouts/PublicLayout';
import { RoleGuard } from '@/components/common/RoleGuard';
import { ProviderListingPage } from '@/pages/public/ProviderListingPage';
import { ProviderProfilePage } from '@/pages/public/ProviderProfilePage';
import NotFound from '@/pages/public/NotFound';

const PublicRoutes = () => {
  return (
    <Routes>
        <Route element={<PublicLayout />}>

          <Route index element={<RoleGuard><LandingPage /></RoleGuard>} />

          <Route
            path="/login"
            element={<AuthRedirect> <Login /> </AuthRedirect>}
          />
          <Route
            path="/login/admin"
            element={<AuthRedirect> <AdminLogin /> </AuthRedirect>}
          />
          <Route
            path="/register"
            element={<AuthRedirect> <Register /> </AuthRedirect>}
          />
          <Route
            path="/verify-otp"
            element={<AuthRedirect><VerifyOtp/></AuthRedirect>}   
          />

          <Route
            path="/forgot-password"
            element={<AuthRedirect> <ForgotPassword /> </AuthRedirect>}   
          />

          <Route
          path="/reset-password"
          element={<AuthRedirect> <ResetPassword /> </AuthRedirect>}
          />

          <Route
          path="/providers"
          element={<ProviderListingPage />}
          />

          <Route path="/providers/:providerId" element={<ProviderProfilePage />} />

        </Route>

        <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
