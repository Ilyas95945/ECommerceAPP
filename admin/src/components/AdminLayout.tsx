import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { getButtonStyles, theme } from '../styles/theme';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/products', label: 'Ürünler', icon: '📦' },
    { path: '/orders', label: 'Siparişler', icon: '📋' },
    { path: '/users', label: 'Kullanıcılar', icon: '👥' },
    { path: '/contact-messages', label: 'Mesajlar', icon: '📧' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.colors.gray[50],
      fontFamily: theme.typography.fontFamily
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: theme.colors.white, 
        padding: `${theme.spacing.md} ${theme.spacing.lg}`, 
        borderBottom: `1px solid ${theme.colors.gray[200]}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: theme.shadows.sm,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.white,
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold
          }}>
            A
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: theme.typography.fontSize.xxl, 
              color: theme.colors.dark,
              fontWeight: theme.typography.fontWeight.bold
            }}>
              Admin Paneli
            </h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: theme.colors.gray[500],
              fontSize: theme.typography.fontSize.sm
            }}>
              Hoş geldin, {user?.username}! 👋
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
          <div style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            backgroundColor: theme.colors.gray[100],
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray[600]
          }}>
            <span style={{ fontWeight: theme.typography.fontWeight.medium }}>Rol:</span> {user?.role}
          </div>
          <button 
            onClick={handleLogout}
            style={{
              ...getButtonStyles('danger'),
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.typography.fontSize.sm
            }}
          >
            🚪 Çıkış Yap
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar Navigation */}
        <div style={{
          width: '280px',
          backgroundColor: theme.colors.white,
          borderRight: `1px solid ${theme.colors.gray[200]}`,
          padding: `${theme.spacing.lg} 0`,
          boxShadow: theme.shadows.sm
        }}>
          <nav style={{ padding: `0 ${theme.spacing.md}` }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                  border: 'none',
                  backgroundColor: isActive(item.path) ? theme.colors.primary : 'transparent',
                  color: isActive(item.path) ? theme.colors.white : theme.colors.gray[600],
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: isActive(item.path) ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  transition: 'all 0.2s ease',
                  borderRadius: theme.borderRadius.md,
                  marginBottom: theme.spacing.sm,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = theme.colors.gray[100];
                    e.currentTarget.style.color = theme.colors.gray[800];
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.gray[600];
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <span style={{ fontSize: theme.typography.fontSize.lg }}>{item.icon}</span>
                {item.label}
                {isActive(item.path) && (
                  <div style={{
                    position: 'absolute',
                    right: theme.spacing.md,
                    width: '4px',
                    height: '20px',
                    backgroundColor: theme.colors.white,
                    borderRadius: '2px'
                  }} />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.gray[50],
          minHeight: 'calc(100vh - 80px)'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
