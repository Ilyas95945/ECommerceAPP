import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getButtonStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function AccountSettingsScreen() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    if (!name.trim()) {
      Alert.alert('Hata', 'Ad alanı boş olamaz');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        name: name.trim()
      });
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      // Şifre değiştirme işlemi
      await updateDoc(doc(db, 'users', user.id), {
        password: newPassword
      });
      
      Alert.alert('Başarılı', 'Şifreniz güncellendi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Hata', 'Şifre değiştirilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>👤 Hesap Ayarları</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Profil Bilgileri</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Ad Soyad</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Adınızı girin"
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>E-posta</ThemedText>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholderTextColor={theme.colors.gray[500]}
            />
            <ThemedText style={styles.helpText}>
              E-posta adresi değiştirilemez
            </ThemedText>
          </View>

          <Pressable 
            style={[styles.updateButton, loading && styles.updateButtonDisabled]} 
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <ThemedText style={styles.updateButtonText}>💾 Profili Güncelle</ThemedText>
            )}
          </Pressable>
        </View>

        {/* Password Change */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Şifre Değiştir</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Mevcut Şifre</ThemedText>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mevcut şifrenizi girin"
              secureTextEntry
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Yeni Şifre</ThemedText>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Yeni şifrenizi girin"
              secureTextEntry
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Yeni Şifre (Tekrar)</ThemedText>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Yeni şifrenizi tekrar girin"
              secureTextEntry
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <Pressable 
            style={[styles.changePasswordButton, loading && styles.changePasswordButtonDisabled]} 
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <ThemedText style={styles.changePasswordButtonText}>🔒 Şifreyi Değiştir</ThemedText>
            )}
          </Pressable>
        </View>

        {/* Security Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Güvenlik Bilgileri</ThemedText>
          
          <View style={styles.securityItem}>
            <ThemedText style={styles.securityIcon}>🔐</ThemedText>
            <View style={styles.securityTextContainer}>
              <ThemedText style={styles.securityTitle}>Hesap Güvenliği</ThemedText>
              <ThemedText style={styles.securityDescription}>
                Şifrenizi düzenli olarak güncelleyin ve güvenli bir şifre kullanın
              </ThemedText>
            </View>
          </View>

          <View style={styles.securityItem}>
            <ThemedText style={styles.securityIcon}>📱</ThemedText>
            <View style={styles.securityTextContainer}>
              <ThemedText style={styles.securityTitle}>Cihaz Bilgileri</ThemedText>
              <ThemedText style={styles.securityDescription}>
                Hesabınıza giriş yapılan cihazları kontrol edin
              </ThemedText>
            </View>
          </View>
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
    padding: theme.spacing.lg,
    ...getShadowStyles('sm')
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
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
  disabledInput: {
    backgroundColor: theme.colors.gray[100],
    color: theme.colors.gray[500]
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500],
    marginTop: theme.spacing.xs
  },
  updateButton: {
    ...getButtonStyles('primary'),
    paddingVertical: theme.spacing.md
  },
  updateButtonDisabled: {
    opacity: 0.7
  },
  updateButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white
  },
  changePasswordButton: {
    ...getButtonStyles('secondary'),
    paddingVertical: theme.spacing.md
  },
  changePasswordButtonDisabled: {
    opacity: 0.7
  },
  changePasswordButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
  },
  securityIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.lg,
    width: 24
  },
  securityTextContainer: {
    flex: 1
  },
  securityTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  securityDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600]
  }
});

