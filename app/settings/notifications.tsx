import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getShadowStyles, theme } from '@/constants/Theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    security: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>🔔 Bildirimler</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* Simple Notification Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Bildirim Ayarları</ThemedText>
          
          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <ThemedText style={styles.notificationIcon}>📦</ThemedText>
              <View style={styles.notificationTextContainer}>
                <ThemedText style={styles.notificationTitle}>Sipariş Güncellemeleri</ThemedText>
                <ThemedText style={styles.notificationDescription}>
                  Sipariş durumu değişiklikleri
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notifications.orderUpdates}
              onValueChange={() => toggleNotification('orderUpdates')}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary }}
              thumbColor={notifications.orderUpdates ? theme.colors.white : theme.colors.gray[500]}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <ThemedText style={styles.notificationIcon}>🎉</ThemedText>
              <View style={styles.notificationTextContainer}>
                <ThemedText style={styles.notificationTitle}>Kampanyalar</ThemedText>
                <ThemedText style={styles.notificationDescription}>
                  Özel indirimler ve kampanyalar
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={() => toggleNotification('promotions')}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary }}
              thumbColor={notifications.promotions ? theme.colors.white : theme.colors.gray[500]}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <ThemedText style={styles.notificationIcon}>🔒</ThemedText>
              <View style={styles.notificationTextContainer}>
                <ThemedText style={styles.notificationTitle}>Güvenlik</ThemedText>
                <ThemedText style={styles.notificationDescription}>
                  Hesap güvenliği uyarıları
                </ThemedText>
              </View>
            </View>
            <Switch
              value={notifications.security}
              onValueChange={() => toggleNotification('security')}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary }}
              thumbColor={notifications.security ? theme.colors.white : theme.colors.gray[500]}
            />
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100]
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  notificationIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.lg,
    lineHeight: theme.typography.fontSize.xl + 8,
    paddingVertical: 2
  },
  notificationTextContainer: {
    flex: 1
  },
  notificationTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  notificationDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600]
  }
});