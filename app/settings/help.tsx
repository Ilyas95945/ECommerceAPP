import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getShadowStyles, theme } from '@/constants/Theme';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function HelpScreen() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "Siparişimi nasıl takip edebilirim?",
      answer: "Siparişlerinizi 'Sipariş Geçmişi' bölümünden takip edebilirsiniz. Her sipariş için detaylı bilgiler ve durum güncellemeleri bulunmaktadır."
    },
    {
      question: "Ürün iadesi nasıl yapılır?",
      answer: "Ürün iadesi için 14 gün içinde 'Sipariş Geçmişi' bölümünden iade talebi oluşturabilirsiniz. İade koşulları ürün sayfasında belirtilmiştir."
    },
    {
      question: "Ödeme yöntemleri nelerdir?",
      answer: "Kredi kartı, banka kartı ve mobil ödeme yöntemlerini kullanabilirsiniz. Tüm ödemeler güvenli SSL şifreleme ile korunmaktadır."
    },
    {
      question: "Kargo ücreti ne kadar?",
      answer: "150 TL ve üzeri alışverişlerde kargo ücretsizdir. Diğer durumlarda kargo ücreti 15 TL'dir. Kargo süresi 1-3 iş günüdür."
    },
    {
      question: "Hesabımı nasıl silerim?",
      answer: "Hesap silme işlemi için müşteri hizmetleri ile iletişime geçmeniz gerekmektedir. Bu işlem geri alınamaz."
    },
    {
      question: "Şifremi unuttum, ne yapmalıyım?",
      answer: "Giriş ekranında 'Şifremi Unuttum' seçeneğini kullanarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz."
    },
    {
      question: "Mobil uygulamada sorun yaşıyorum",
      answer: "Uygulamayı kapatıp yeniden açmayı deneyin. Sorun devam ederse cihazınızı yeniden başlatın. Hala çözülmezse bizimle iletişime geçin."
    },
    {
      question: "Kampanya kodları nasıl kullanılır?",
      answer: "Kampanya kodlarını sepet sayfasında 'İndirim Kodu' alanına girerek kullanabilirsiniz. Kodlar belirli tarihler arasında geçerlidir."
    }
  ];

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>❓ Yardım Merkezi</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* FAQ Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Sık Sorulan Sorular</ThemedText>
          
          {faqData.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Pressable 
                style={styles.faqQuestion}
                onPress={() => toggleExpanded(index)}
              >
                <ThemedText style={styles.faqQuestionText}>
                  {item.question}
                </ThemedText>
                <ThemedText style={styles.faqIcon}>
                  {expandedItems.includes(index) ? '−' : '+'}
                </ThemedText>
              </Pressable>
              
              {expandedItems.includes(index) && (
                <View style={styles.faqAnswer}>
                  <ThemedText style={styles.faqAnswerText}>
                    {item.answer}
                  </ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>İletişim Bilgileri</ThemedText>
          
          <View style={styles.contactItem}>
            <ThemedText style={styles.contactIcon}>📞</ThemedText>
            <View style={styles.contactTextContainer}>
              <ThemedText style={styles.contactTitle}>Telefon</ThemedText>
              <ThemedText style={styles.contactValue}>0850 123 45 67</ThemedText>
            </View>
          </View>

          <View style={styles.contactItem}>
            <ThemedText style={styles.contactIcon}>📧</ThemedText>
            <View style={styles.contactTextContainer}>
              <ThemedText style={styles.contactTitle}>E-posta</ThemedText>
              <ThemedText style={styles.contactValue}>destek@ecommerceapp.com</ThemedText>
            </View>
          </View>

          <View style={styles.contactItem}>
            <ThemedText style={styles.contactIcon}>⏰</ThemedText>
            <View style={styles.contactTextContainer}>
              <ThemedText style={styles.contactTitle}>Çalışma Saatleri</ThemedText>
              <ThemedText style={styles.contactValue}>Pazartesi - Cuma: 09:00 - 18:00</ThemedText>
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
  quickHelpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  quickHelpItem: {
    width: '48%',
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  quickHelpIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm
  },
  quickHelpText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
    marginBottom: theme.spacing.sm
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md
  },
  faqQuestionText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark,
    flex: 1,
    marginRight: theme.spacing.md
  },
  faqIcon: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold
  },
  faqAnswer: {
    paddingBottom: theme.spacing.md
  },
  faqAnswerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600],
    lineHeight: 20
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
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
    color: theme.colors.dark
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100]
  },
  helpIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.lg,
    width: 24
  },
  helpTextContainer: {
    flex: 1
  },
  helpTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  helpSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500]
  },
  helpArrow: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.gray[400]
  }
});

