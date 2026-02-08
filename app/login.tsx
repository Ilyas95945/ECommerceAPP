import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getFlexStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('E-posta ve şifre gerekli');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.replace('/');
    } catch (e) {
      console.error('Login error:', e);
      setError(e instanceof Error ? e.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Hoş Geldiniz! 👋</ThemedText>
          <ThemedText style={styles.subtitle}>Hesabınıza giriş yapın</ThemedText>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>E-posta</ThemedText>
            <TextInput 
              placeholder="ornek@email.com" 
              autoCapitalize="none" 
              keyboardType="email-address" 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail}
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Şifre</ThemedText>
            <TextInput 
              placeholder="Şifrenizi girin" 
              secureTextEntry 
              style={styles.input} 
              value={password} 
              onChangeText={setPassword}
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
            </View>
          )}

          <Pressable 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={onSubmit} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <ThemedText style={styles.buttonText}>Giriş Yap</ThemedText>
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Hesabınız yok mu? </ThemedText>
          <Link href="/register" asChild>
            <Pressable>
              <ThemedText style={styles.linkText}>Kayıt Ol</ThemedText>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.gray[50] 
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    minHeight: '100%'
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600],
    textAlign: 'center'
  },
  form: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    ...getShadowStyles('sm'),
    marginBottom: theme.spacing.lg
  },
  inputContainer: {
    marginBottom: theme.spacing.lg
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.sm
  },
  input: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.dark,
    borderWidth: 1,
    borderColor: theme.colors.gray[200]
  },
  errorContainer: {
    backgroundColor: theme.colors.danger + '10',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center'
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...getFlexStyles('row'),
    gap: theme.spacing.sm,
    ...getShadowStyles('sm')
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold
  },
  footer: {
    ...getFlexStyles('row'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600]
  },
  linkText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold
  }
});




