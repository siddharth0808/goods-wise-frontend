import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { AuthenticatedRoute } from './AuthenticatedRoute';
import { BusinessSetupRoute } from './BusinessSetupRoute';
import { AppLayout } from '../../components/layout/AppLayout';
import LoginPage from '../../features/auth/pages/LoginPage';
import SignupPage from '../../features/auth/pages/SignupPage';
import EmailVerificationPage from '../../features/auth/pages/EmailVerificationPage';
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage';
import BusinessSetupPage from '../../features/business/pages/BusinessSetupPage';
import InventoryListPage from '../../features/inventory/pages/InventoryListPage';
import AddProductPage from '../../features/inventory/pages/AddProductPage';
import ProductDetailsPage from '../../features/inventory/pages/ProductDetailsPage';
import EditProductPage from '../../features/inventory/pages/EditProductPage';
import AdjustStockPage from '../../features/inventory/pages/AdjustStockPage';
import InventoryHistoryPage from '../../features/inventory/pages/InventoryHistoryPage';
import ImportWizardPage from '../../features/import/pages/ImportWizardPage';
import ImportHistoryPage from '../../features/import/pages/ImportHistoryPage';
import SalesListPage from '../../features/sales/pages/SalesListPage';
import CreateSalePage from '../../features/sales/pages/CreateSalePage';
import CheckoutPage from '../../features/sales/pages/CheckoutPage';
import SaleDetailsPage from '../../features/sales/pages/SaleDetailsPage';
import ProfilePage from '../../features/profile/pages/ProfilePage';
import { useAppSelector } from '../store/hooks';

/** Sends "/" to the right authenticated destination once we know it. */
function RootRedirect() {
  const business = useAppSelector((state) => state.business.business);
  return <Navigate to={business ? '/inventory' : '/business-setup'} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public-only routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <EmailVerificationPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Authenticated, business-setup-not-required */}
      <Route
        path="/business-setup"
        element={
          <AuthenticatedRoute>
            <BusinessSetupPage />
          </AuthenticatedRoute>
        }
      />

      {/* Authenticated + business-setup-required, inside the app shell */}
      <Route
        path="/inventory"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <InventoryListPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/products/new"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <AddProductPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/products/:productId"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <ProductDetailsPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/products/:productId/edit"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <EditProductPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/products/:productId/adjust-stock"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <AdjustStockPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/products/:productId/history"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <InventoryHistoryPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/import"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <ImportWizardPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/import/history"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <ImportHistoryPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <SalesListPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/sales/new"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <CreateSalePage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/sales/checkout"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <CheckoutPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />
      <Route
        path="/sales/:saleId"
        element={
          <BusinessSetupRoute>
            <AppLayout>
              <SaleDetailsPage />
            </AppLayout>
          </BusinessSetupRoute>
        }
      />

      <Route
        path="/"
        element={
          <AuthenticatedRoute>
            <RootRedirect />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
