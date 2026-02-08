import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getButtonStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
  const { user, userProfile, logout } = useAuth();
  
  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>👤 Profil</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Hesap bilgileriniz ve ayarlar
        </ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {user ? (
          <>
            {/* User Info Card */}
            <View style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <ThemedText style={styles.avatarText}>
                  {(userProfile?.name || user.email).charAt(0).toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>
                  {userProfile?.name || 'Kullanıcı'}
                </ThemedText>
                <ThemedText style={styles.userEmail}>
                  {user.email}
                </ThemedText>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <ThemedText style={styles.sectionTitle}>Hesap İşlemleri</ThemedText>
              
              <Link href="/cart" asChild>
                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <ThemedText style={styles.menuIcon}>🛒</ThemedText>
                    <View style={styles.menuTextContainer}>
                      <ThemedText style={styles.menuTitle}>Sepetim</ThemedText>
                      <ThemedText style={styles.menuSubtitle}>Sepetinizi görüntüleyin</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.menuArrow}>→</ThemedText>
                </Pressable>
              </Link>

              <Link href="/orders" asChild>
                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <ThemedText style={styles.menuIcon}>📋</ThemedText>
                    <View style={styles.menuTextContainer}>
                      <ThemedText style={styles.menuTitle}>Sipariş Geçmişi</ThemedText>
                      <ThemedText style={styles.menuSubtitle}>Geçmiş siparişlerinizi görün</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.menuArrow}>→</ThemedText>
                </Pressable>
              </Link>

              <Link href="/settings" asChild>
                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <ThemedText style={styles.menuIcon}>⚙️</ThemedText>
                    <View style={styles.menuTextContainer}>
                      <ThemedText style={styles.menuTitle}>Ayarlar</ThemedText>
                      <ThemedText style={styles.menuSubtitle}>Hesap ayarlarınız</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.menuArrow}>→</ThemedText>
                </Pressable>
              </Link>

              <Link href="/settings/help" asChild>
                <Pressable style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <ThemedText style={styles.menuIcon}>❓</ThemedText>
                    <View style={styles.menuTextContainer}>
                      <ThemedText style={styles.menuTitle}>Yardım & Destek</ThemedText>
                      <ThemedText style={styles.menuSubtitle}>Sık sorulan sorular</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.menuArrow}>→</ThemedText>
                </Pressable>
              </Link>
            </View>

            {/* Logout Button */}
            <View style={styles.logoutSection}>
              <Pressable style={styles.logoutButton} onPress={logout}>
                <ThemedText style={styles.logoutButtonText}>🚪 Çıkış Yap</ThemedText>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginIcon}>🔒</ThemedText>
            <ThemedText style={styles.loginTitle}>Giriş Yapın</ThemedText>
            <ThemedText style={styles.loginSubtitle}>
              Hesabınıza giriş yaparak alışverişe devam edin
            </ThemedText>
            <Link href="/login" asChild>
              <Pressable style={styles.loginButton}>
                <ThemedText style={styles.loginButtonText}>🔑 Giriş Yap</ThemedText>
              </Pressable>
            </Link>
            <Link href="/register" asChild>
              <Pressable style={styles.registerButton}>
                <ThemedText style={styles.registerButtonText}>📝 Kayıt Ol</ThemedText>
              </Pressable>
            </Link>
          </View>
        )}
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
    ...getShadowStyles('sm')
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.fontSize.xxl + 8,
    paddingVertical: 4
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg
  },
  userCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...getShadowStyles('sm')
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg
  },
  avatarText: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  userEmail: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.sm
  },
  menuSection: {
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
  logoutSection: {
    padding: theme.spacing.lg
  },
  logoutButton: {
    ...getButtonStyles('danger'),
    paddingVertical: theme.spacing.lg
  },
  logoutButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl
  },
  loginIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg
  },
  loginTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm
  },
  loginSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600],
    textAlign: 'center',
    marginBottom: theme.spacing.xl
  },
  loginButton: {
    ...getButtonStyles('primary'),
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md
  },
  loginButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  registerButton: {
    ...getButtonStyles('outline'),
    paddingHorizontal: theme.spacing.xl
  },
  registerButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary
  }
});


