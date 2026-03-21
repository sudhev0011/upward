import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import LandingPage from '@/pages/public/Landing';
import VerifyOtp from '@/pages/auth/VerifyOtp';
import ResetPassword from '@/pages/auth/ResetPassword';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import AuthRedirect from '@/components/common/AuthRedirect';
import PublicLayout from '@/layouts/PublicLayout';
import { RoleGuard } from '@/components/common/RoleGuard';

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

        </Route>
    </Routes>
  );
};

export default PublicRoutes;
