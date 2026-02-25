import { Routes, Route } from 'react-router-dom';
import ClientLayout from '@/layouts/ClientLayout';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import LandingPage from '@/pages/public/Landing';
import VerifyOtp from '@/pages/auth/VerifyOtp';
import ResetPassword from '@/pages/auth/ResetPassword';
import ForgotPassword from '@/pages/auth/ForgotPassword';


const ClientRoutes = () => {
  return (
    <Routes>
        <Route element={<ClientLayout />}>
          {/* Public routes inside the layout */}
          <Route index element={<LandingPage />} />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/verify-otp"
            element={<VerifyOtp />}   
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}   
          />

          <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
          {/* Protected routes */}
          {/* <Route
            path="/home"
            element={
              <AuthRoute allowedRoles={["client"]} element={<LandingPage />} />
            }
          />
          <Route
            path="/profile"
            element={
              <AuthRoute allowedRoles={["client"]} element={<ProfileForm />} />
            }
          />
          <Route
            path="/alltrainers"
            element={
              <AuthRoute allowedRoles={["client"]} element={<TrainersPage />} />
            }
          /> */}


          {/* Catch-all route for unmatched client sub-routes */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
        {/* <Route
          path="/forgot-password"
          element={
            <NoAuthRoute
              element={<ForgotPassword role="client" signInPath="/" />}
            />
          }
        />
         */}
      </Routes>
  );
};

export default ClientRoutes;
