export const theme = {
  colors: {
    primary: '#ff6b35', // Trendyol turuncu
    primaryDark: '#e55a2b',
    primaryLight: '#ff8a65',
    secondary: '#2c3e50', // Koyu mavi
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c',
    info: '#3498db',
    light: '#f8f9fa',
    dark: '#2c3e50',
    white: '#ffffff',
    gray: {
      50: '#f8f9fa',
      100: '#e9ecef',
      200: '#dee2e6',
      300: '#ced4da',
      400: '#adb5bd',
      500: '#6c757d',
      600: '#495057',
      700: '#343a40',
      800: '#212529',
      900: '#1a1a1a'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};

export const getButtonStyles = (variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' = 'primary') => {
  const baseStyles = {
    padding: '12px 24px',
    borderRadius: theme.borderRadius.md,
    border: 'none',
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    outline: 'none'
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        boxShadow: theme.shadows.sm,
        '&:hover': {
          backgroundColor: theme.colors.primaryDark,
          boxShadow: theme.shadows.md,
          transform: 'translateY(-1px)'
        }
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.secondary,
        color: theme.colors.white,
        boxShadow: theme.shadows.sm,
        '&:hover': {
          backgroundColor: theme.colors.gray[700],
          boxShadow: theme.shadows.md,
          transform: 'translateY(-1px)'
        }
      };
    case 'success':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.success,
        color: theme.colors.white,
        boxShadow: theme.shadows.sm,
        '&:hover': {
          backgroundColor: '#229954',
          boxShadow: theme.shadows.md,
          transform: 'translateY(-1px)'
        }
      };
    case 'danger':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.danger,
        color: theme.colors.white,
        boxShadow: theme.shadows.sm,
        '&:hover': {
          backgroundColor: '#c0392b',
          boxShadow: theme.shadows.md,
          transform: 'translateY(-1px)'
        }
      };
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: theme.colors.primary,
        border: `2px solid ${theme.colors.primary}`,
        '&:hover': {
          backgroundColor: theme.colors.primary,
          color: theme.colors.white,
          transform: 'translateY(-1px)'
        }
      };
    default:
      return baseStyles;
  }
};

export const getCardStyles = () => ({
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.lg,
  boxShadow: theme.shadows.sm,
  border: `1px solid ${theme.colors.gray[200]}`,
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows.md,
    transform: 'translateY(-2px)'
  }
});

export const getInputStyles = () => ({
  padding: '12px 16px',
  border: `2px solid ${theme.colors.gray[300]}`,
  borderRadius: theme.borderRadius.md,
  fontSize: theme.typography.fontSize.sm,
  fontFamily: theme.typography.fontFamily,
  transition: 'all 0.2s ease',
  outline: 'none',
  '&:focus': {
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primary}20`
  },
  '&:hover': {
    borderColor: theme.colors.gray[400]
  }
});

export const getTableStyles = () => ({
  width: '100%',
  borderCollapse: 'collapse' as const,
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.lg,
  overflow: 'hidden',
  boxShadow: theme.shadows.sm,
  '& thead': {
    backgroundColor: theme.colors.gray[50],
    '& th': {
      padding: '16px',
      textAlign: 'left' as const,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.gray[700],
      borderBottom: `2px solid ${theme.colors.gray[200]}`,
      fontSize: theme.typography.fontSize.sm
    }
  },
  '& tbody': {
    '& tr': {
      borderBottom: `1px solid ${theme.colors.gray[100]}`,
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: theme.colors.gray[50]
      },
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    '& td': {
      padding: '16px',
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.gray[700]
    }
  }
});






