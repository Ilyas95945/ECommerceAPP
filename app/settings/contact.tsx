import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getButtonStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { db } from '../../firebaseConfig';

export default function ContactScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState<'complaint' | 'suggestion' | 'question' | 'other'>('question');

  const contactTypes = [
    { key: 'complaint', label: 'Şikayet', icon: '😠' },
    { key: 'suggestion', label: 'Öneri', icon: '💡' },
    { key: 'question', label: 'Soru', icon: '❓' },
    { key: 'other', label: 'Diğer', icon: '📝' }
  ];

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Hata', 'Tüm alanları doldurun');
      return;
    }

    if (message.length < 10) {
      Alert.alert('Hata', 'Mesaj en az 10 karakter olmalı');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        type: selectedType,
        status: 'pending',
        createdAt: new Date(),
        userId: user?.id || null
      });

      Alert.alert(
        'Başarılı', 
        'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              setName(user?.name || '');
              setEmail(user?.email || '');
              setSubject('');
              setMessage('');
              setSelectedType('question');
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Hata', 'Mesaj gönderilirken bir hata oluştu');
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
        <ThemedText style={styles.headerTitle}>📧 İletişim</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* Contact Type Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Mesaj Türü</ThemedText>
          
          <View style={styles.typeGrid}>
            {contactTypes.map((type) => (
              <Pressable
                key={type.key}
                style={[
                  styles.typeItem,
                  selectedType === type.key && styles.typeItemSelected
                ]}
                onPress={() => setSelectedType(type.key as any)}
              >
                <ThemedText style={styles.typeIcon}>{type.icon}</ThemedText>
                <ThemedText style={[
                  styles.typeLabel,
                  selectedType === type.key && styles.typeLabelSelected
                ]}>
                  {type.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>İletişim Formu</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Ad Soyad *</ThemedText>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Adınızı girin"
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>E-posta *</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="E-posta adresinizi girin"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Konu *</ThemedText>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Mesaj konusunu girin"
              placeholderTextColor={theme.colors.gray[500]}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Mesaj *</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Mesajınızı detaylı olarak yazın..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={theme.colors.gray[500]}
            />
            <ThemedText style={styles.helpText}>
              En az 10 karakter olmalıdır ({message.length}/10)
            </ThemedText>
          </View>

          <Pressable 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <ThemedText style={styles.submitButtonText}>📤 Mesajı Gönder</ThemedText>
            )}
          </Pressable>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Alternatif İletişim</ThemedText>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <ThemedText style={styles.contactIcon}>📞</ThemedText>
              <View style={styles.contactTextContainer}>
                <ThemedText style={styles.contactTitle}>Telefon</ThemedText>
                <ThemedText style={styles.contactValue}>0850 123 45 67</ThemedText>
                <ThemedText style={styles.contactSubtitle}>Pazartesi - Cuma: 09:00 - 18:00</ThemedText>
              </View>
            </View>

            <View style={styles.contactItem}>
              <ThemedText style={styles.contactIcon}>📧</ThemedText>
              <View style={styles.contactTextContainer}>
                <ThemedText style={styles.contactTitle}>E-posta</ThemedText>
                <ThemedText style={styles.contactValue}>destek@ecommerceapp.com</ThemedText>
                <ThemedText style={styles.contactSubtitle}>24 saat içinde yanıtlanır</ThemedText>
              </View>
            </View>

            <View style={styles.contactItem}>
              <ThemedText style={styles.contactIcon}>💬</ThemedText>
              <View style={styles.contactTextContainer}>
                <ThemedText style={styles.contactTitle}>Canlı Destek</ThemedText>
                <ThemedText style={styles.contactValue}>Anında yardım</ThemedText>
                <ThemedText style={styles.contactSubtitle}>Çevrimiçi olduğumuzda</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Response Time Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Yanıt Süreleri</ThemedText>
          
          <View style={styles.responseTimeItem}>
            <ThemedText style={styles.responseTimeIcon}>⚡</ThemedText>
            <View style={styles.responseTimeTextContainer}>
              <ThemedText style={styles.responseTimeTitle}>Acil Durumlar</ThemedText>
              <ThemedText style={styles.responseTimeValue}>2-4 saat</ThemedText>
            </View>
          </View>

          <View style={styles.responseTimeItem}>
            <ThemedText style={styles.responseTimeIcon}>📋</ThemedText>
            <View style={styles.responseTimeTextContainer}>
              <ThemedText style={styles.responseTimeTitle}>Genel Sorular</ThemedText>
              <ThemedText style={styles.responseTimeValue}>24 saat</ThemedText>
            </View>
          </View>

          <View style={styles.responseTimeItem}>
            <ThemedText style={styles.responseTimeIcon}>🔧</ThemedText>
            <View style={styles.responseTimeTextContainer}>
              <ThemedText style={styles.responseTimeTitle}>Teknik Destek</ThemedText>
              <ThemedText style={styles.responseTimeValue}>1-2 gün</ThemedText>
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
    color: theme.colors.dark
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  typeItem: {
    width: '48%',
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  typeItemSelected: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
    lineHeight: 40,
    paddingVertical: 4
  },
  typeLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark
  },
  typeLabelSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold
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
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500],
    marginTop: theme.spacing.xs
  },
  submitButton: {
    ...getButtonStyles('primary'),
    paddingVertical: theme.spacing.lg
  },
  submitButtonDisabled: {
    opacity: 0.7
  },
  submitButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  contactInfo: {
    gap: theme.spacing.lg
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  contactIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.lg,
    width: 24
  },
  contactTextContainer: {
    flex: 1
  },
  contactTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs
  },
  contactValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  contactSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500]
  },
  responseTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
  },
  responseTimeIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.lg,
    width: 24
  },
  responseTimeTextContainer: {
    flex: 1
  },
  responseTimeTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  responseTimeValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600]
  }
});

