import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';

// Web-safe color scheme hook
export function useColorScheme(): NonNullable<ColorSchemeName> {
  if (typeof window !== 'undefined') {
    // Web platform
    return useRNColorScheme() ?? 'light';
  }
  // Native platform
  return useRNColorScheme() ?? 'light';
}
