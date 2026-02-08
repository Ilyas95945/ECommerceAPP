import { useEffect, useState } from 'react';

interface AdminUser {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage'dan kullanıcı bilgilerini al
    const storedUser = localStorage.getItem('adminUser');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Stored user data:', userData); // Debug için
        
        // Eğer permissions boşsa, varsayılan değerleri ekle
        if (!userData.permissions || userData.permissions.length === 0) {
          userData.permissions = ["products", "orders", "users", "contact"];
          console.log('Added default permissions:', userData.permissions);
          // localStorage'ı güncelle
          localStorage.setItem('adminUser', JSON.stringify(userData));
        } else {
          // Mevcut permission'lara contact ekle (eğer yoksa)
          if (!userData.permissions.includes('contact')) {
            userData.permissions.push('contact');
            console.log('Added contact permission to existing user:', userData.permissions);
            // localStorage'ı güncelle
            localStorage.setItem('adminUser', JSON.stringify(userData));
          }
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Kullanıcı verisi parse edilemedi:', error);
        localStorage.removeItem('adminUser');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData: AdminUser) => {
    console.log('Login user data:', userData); // Debug için
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) return false;
    console.log('Checking permission:', permission, 'User permissions:', user.permissions); // Debug için
    return user.permissions.includes(permission);
  };

  const isAdmin = () => {
    console.log('Checking admin role:', user?.role); // Debug için
    return user?.role === 'admin';
  };

  return {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAdmin,
    isAuthenticated: !!user
  };
}