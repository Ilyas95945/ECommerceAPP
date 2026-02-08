import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export default function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasPermission, isAdmin } = useAdminAuth();

  // Yükleniyor durumunda loading göster
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

  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login'); // Debug için
    return <Navigate to="/login" replace />;
  }

  // Admin değilse erişimi reddet
  if (!isAdmin()) {
    console.log('Not admin, access denied'); // Debug için
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h2>Erişim Reddedildi</h2>
        <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        <button onClick={() => window.history.back()}>Geri Dön</button>
      </div>
    );
  }

  // Belirli bir izin gerekiyorsa kontrol et
  if (requiredPermission && !hasPermission(requiredPermission)) {
    console.log('Permission denied for:', requiredPermission); // Debug için
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h2>Yetki Yetersiz</h2>
        <p>Bu işlem için gerekli yetkiye sahip değilsiniz.</p>
        <button onClick={() => window.history.back()}>Geri Dön</button>
      </div>
    );
  }

  // Tüm kontroller geçildi, içeriği göster
  console.log('Access granted'); // Debug için
  return <>{children}</>;
}