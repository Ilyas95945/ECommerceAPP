import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getButtonStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function SettingsScreen() {
  const { user, userProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await logout();
            router.replace('/');
            setLoading(false);
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>⚙️ Ayarlar</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* Account Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Hesap Ayarları</ThemedText>
          
          <Link href="/settings/account" asChild>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <ThemedText style={styles.menuIcon}>👤</ThemedText>
                <View style={styles.menuTextContainer}>
                  <ThemedText style={styles.menuTitle}>Hesap Bilgileri</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>Ad, e-posta ve şifre değiştir</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.menuArrow}>→</ThemedText>
            </Pressable>
          </Link>

          <Link href="/settings/notifications" asChild>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <ThemedText style={styles.menuIcon}>🔔</ThemedText>
                <View style={styles.menuTextContainer}>
                  <ThemedText style={styles.menuTitle}>Bildirimler</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>Bildirim ayarlarınız</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.menuArrow}>→</ThemedText>
            </Pressable>
          </Link>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Yardım & Destek</ThemedText>
          
          <Link href="/settings/help" asChild>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <ThemedText style={styles.menuIcon}>❓</ThemedText>
                <View style={styles.menuTextContainer}>
                  <ThemedText style={styles.menuTitle}>Yardım Merkezi</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>SSS ve destek</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.menuArrow}>→</ThemedText>
            </Pressable>
          </Link>

          <Link href="/settings/contact" asChild>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <ThemedText style={styles.menuIcon}>📧</ThemedText>
                <View style={styles.menuTextContainer}>
                  <ThemedText style={styles.menuTitle}>İletişim</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>Şikayet ve öneriler</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.menuArrow}>→</ThemedText>
            </Pressable>
          </Link>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Uygulama Bilgileri</ThemedText>
          
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Uygulama Versiyonu</ThemedText>
            <ThemedText style={styles.infoValue}>1.1.8</ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <ThemedText style={styles.infoLabel}>Son Güncelleme</ThemedText>
            <ThemedText style={styles.infoValue}>Eylül 2025</ThemedText>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Pressable 
            style={[styles.logoutButton, loading && styles.logoutButtonDisabled]} 
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <ThemedText style={styles.logoutButtonText}>🚪 Çıkış Yap</ThemedText>
            )}
          </Pressable>
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
  header: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...getShadowStyles('sm')
  },
  backButton: {
    marginRight: theme.spacing.md
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    lineHeight: theme.typography.fontSize.xl + 8,
    paddingVertical: 4
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...getShadowStyles('sm')
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200]
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100]
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  menuIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.lg,
    width: 24
  },
  menuTextContainer: {
    flex: 1
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  menuSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500]
  },
  menuArrow: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.gray[400]
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100]
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark
  },
  logoutSection: {
    padding: theme.spacing.lg
  },
  logoutButton: {
    ...getButtonStyles('danger'),
    paddingVertical: theme.spacing.lg
  },
  logoutButtonDisabled: {
    opacity: 0.7
  },
  logoutButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  }
});

