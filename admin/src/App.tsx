import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAdminAuth } from './hooks/useAdminAuth';
import ContactMessages from './pages/ContactMessages';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';

export default function App() {
  const { loading, isAuthenticated } = useAdminAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/products" replace /> : <Login />} 
      />
      <Route 
        path="/products" 
        element={
          <ProtectedRoute requiredPermission="products">
            <AdminLayout>
              <Products />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute requiredPermission="orders">
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute requiredPermission="users">
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contact-messages" 
        element={
          <ProtectedRoute requiredPermission="contact">
            <AdminLayout>
              <ContactMessages />
            </AdminLayout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}