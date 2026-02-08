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
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 50
  },
  shadows: {
    sm: {},
    md: {},
    lg: {}
  },
  typography: {
    fontFamily: 'System',
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const
    }
  }
};

export const getButtonStyles = (variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' = 'primary') => {
  const baseStyles = {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    gap: theme.spacing.sm,
    ...getShadowStyles('sm')
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.primary,
      };
    case 'secondary':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.secondary,
      };
    case 'success':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.success,
      };
    case 'danger':
      return {
        ...baseStyles,
        backgroundColor: theme.colors.danger,
      };
    case 'outline':
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      };
    default:
      return baseStyles;
  }
};

export const getCardStyles = () => ({
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  ...getShadowStyles('sm'),
  borderWidth: 1,
  borderColor: theme.colors.gray[200]
});

export const getInputStyles = () => ({
  paddingVertical: theme.spacing.md,
  paddingHorizontal: theme.spacing.lg,
  borderWidth: 2,
  borderColor: theme.colors.gray[300],
  borderRadius: theme.borderRadius.md,
  fontSize: theme.typography.fontSize.md,
  backgroundColor: theme.colors.white,
  color: theme.colors.dark
});

// Platform-specific shadow helper
export const getShadowStyles = (size: 'sm' | 'md' | 'lg' = 'sm') => {
  // Tüm platformlarda shadow'ları kullanma
  return theme.shadows[size];
};

// Platform-specific flex helper
export const getFlexStyles = (direction: 'row' | 'column' = 'row') => {
  // Web'de CSS style hatalarını önlemek için sadece gerekli property'leri kullan
  if (typeof window !== 'undefined') {
    // Web platform - sadece flexDirection
    return {
      flexDirection: direction
    };
  }
  
  // Native platform
  return {
    flexDirection: direction
  };
};

// Web-safe style wrapper
export const createWebSafeStyle = (styleObj: any, componentName?: string) => {
  if (typeof window === 'undefined') {
    return styleObj; // Native platform
  }
  
  // Web platform - style'ları temizle
  if (!styleObj) return styleObj;
  
  if (Array.isArray(styleObj)) {
    // Array içindeki her style'ı temizle
    return styleObj
      .filter(style => style && typeof style === 'object' && !Array.isArray(style))
      .map(style => createWebSafeStyle(style, componentName));
  }
  
  if (typeof styleObj === 'object') {
    const cleaned: any = {};
    Object.keys(styleObj).forEach(key => {
      const value = styleObj[key];
      
      // Array değerleri filtrele
      if (Array.isArray(value)) {
        console.warn(`[WebStyleDebugger] ${componentName || 'Unknown'}: Array value for '${key}' filtered out`);
        return;
      }
      
      // String değerleri kontrol et
      if (typeof value === 'string' && value.includes('[')) {
        console.warn(`[WebStyleDebugger] ${componentName || 'Unknown'}: Suspicious string value for '${key}': ${value}`);
        return;
      }
      
      cleaned[key] = value;
    });
    return cleaned;
  }
  
  return styleObj;
};

