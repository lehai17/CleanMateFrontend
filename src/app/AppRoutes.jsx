import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrivateRoute from "../components/PrivateRoute";
import LandingPage from "../features/home/pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Policies from "../pages/Policies";
import Booking from "../pages/Booking";
import Services from "../pages/Services";
import Order from "../pages/Order";
import PaymentQR from "../pages/PaymentQR";
import AdminDashboard from "../pages/AdminDashboard";
import Profile from "../pages/Profile";
import CleanerJobs from "../pages/CleanerJobs";
import Notifications from "../pages/Notifications";
import Support from '../pages/Support';
import Security from '../pages/Security';
import Recovery from '../pages/Recovery';
import NotFound from '../pages/NotFound';
import { Ui, useUiPreferences } from '../ui/Preferences';
import { NotificationProvider } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

export default function AppRoutes({ shouldHideChrome }) {
  const { user } = useAuth();
  const { language } = useUiPreferences();
  return (
    <NotificationProvider>
      <Ui as="a" href="#main-content" className="sr-only focus:not-sr-only focus:block focus:bg-white focus:p-3 focus:text-emerald-800">{language === 'en' ? 'Skip to content' : 'Bỏ qua điều hướng'}</Ui>
      {!shouldHideChrome && <Header />}
      <Ui as="div" id="main-content" tabIndex={-1} className="scroll-mt-20">
      <Routes>
        <Route path="/forgot-password" element={<Recovery />} />
        <Route path="/security" element={<PrivateRoute><Security key={user?.id} /></PrivateRoute>} />
        <Route path="/support" element={<PrivateRoute><Support key={user?.id} /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications key={user?.id} /></PrivateRoute>} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/policies" element={<Policies />} />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowed={["Admin", "Staff"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/services" element={<Services />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/cleaner/jobs"
          element={
            <PrivateRoute requireCleaner>
              <CleanerJobs />
            </PrivateRoute>
          }
        />
        <Route path="/payment-qr" element={<PaymentQR />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Ui>
      {!shouldHideChrome && <Footer />}
    </NotificationProvider>
  );
}
