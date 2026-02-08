import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createOrder } from '@/constants/Api';
import { getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function CheckoutScreen() {
  const { items, total, clearAfterOrder } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function placeOrder() {
    if (!user) {
      alert('Sipariş vermek için giriş yapmalısınız!');
      router.push('/login');
      return;
    }
    
    if (items.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }
    
    setLoading(true);
    try {
      // Stoklar zaten sepete eklenirken rezerve edildiği için burada tekrar güncellemeye gerek yok.
      // Sadece siparişi oluştur.
      await createOrder({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        totalPrice: total,
        status: 'pending'
      });
      
      clearAfterOrder(); // Sepeti temizle (stokları geri ekleme)
      router.replace('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Sipariş oluşturulurken hata oluştu!');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
          </Pressable>
          <ThemedText style={styles.headerTitle}>💳 Ödeme</ThemedText>
        </View>
        
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>🛒</ThemedText>
          <ThemedText style={styles.emptyTitle}>Sepetiniz Boş!</ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Ödeme yapmak için önce sepetinize ürün ekleyin.
          </ThemedText>
          <Pressable style={styles.shopButton} onPress={() => router.push('/shop')}>
            <ThemedText style={styles.shopButtonText}>🛍️ Alışverişe Devam Et</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>💳 Ödeme</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Sipariş Özeti */}
        <View style={styles.orderSummary}>
          <ThemedText style={styles.sectionTitle}>📋 Sipariş Özeti</ThemedText>
          
          {items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <ThemedText style={styles.itemName}>{item.product.name}</ThemedText>
                <ThemedText style={styles.itemCategory}>{item.product.category}</ThemedText>
                <ThemedText style={styles.itemQuantity}>Miktar: {item.quantity}</ThemedText>
              </View>
              <ThemedText style={styles.itemPrice}>
                {(item.product.price * item.quantity).toFixed(2)} ₺
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Ödeme Bilgileri */}
        <View style={styles.paymentInfo}>
          <ThemedText style={styles.sectionTitle}>💳 Ödeme Bilgileri</ThemedText>
          
          <View style={styles.paymentMethod}>
            <ThemedText style={styles.paymentMethodTitle}>Ödeme Yöntemi</ThemedText>
            <ThemedText style={styles.paymentMethodValue}>💳 Kredi Kartı</ThemedText>
          </View>
          
          <View style={styles.paymentMethod}>
            <ThemedText style={styles.paymentMethodTitle}>Teslimat Adresi</ThemedText>
            <ThemedText style={styles.paymentMethodValue} numberOfLines={1}>🏠 {user?.name} - Varsayılan</ThemedText>
          </View>
        </View>

        {/* Toplam */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Ara Toplam:</ThemedText>
            <ThemedText style={styles.totalValue}>{total.toFixed(2)} ₺</ThemedText>
          </View>
          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Kargo:</ThemedText>
            <ThemedText style={styles.totalValue}>Ücretsiz</ThemedText>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <ThemedText style={styles.finalTotalLabel}>Toplam:</ThemedText>
            <ThemedText style={styles.finalTotalValue}>{total.toFixed(2)} ₺</ThemedText>
          </View>
        </View>
      </ScrollView>
      
      {/* Ödeme Butonu */}
      <View style={styles.footer}>
        <Pressable 
          style={[styles.orderButton, loading && styles.orderButtonDisabled]}
          onPress={placeOrder}
          disabled={loading}
        >
          <ThemedText style={styles.orderButtonText}>
            {loading ? '⏳ Sipariş Veriliyor...' : '✅ Siparişi Tamamla'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50]
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200]
  },
  backButton: {
    marginRight: theme.spacing.md
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    lineHeight: theme.typography.fontSize.xxl + 8,
    paddingVertical: 4
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
    lineHeight: 72,
    paddingVertical: 4
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm,
    textAlign: 'center'
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...getShadowStyles('sm')
  },
  shopButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  orderSummary: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...getShadowStyles('sm')
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.fontSize.lg + 4,
    paddingVertical: 2
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100]
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  itemCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs
  },
  itemQuantity: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500]
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success
  },
  paymentInfo: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...getShadowStyles('sm')
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm
  },
  paymentMethodTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  paymentMethodValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark
  },
  totalSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...getShadowStyles('sm')
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  totalValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md
  },
  finalTotalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark
  },
  finalTotalValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success
  },
  footer: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200]
  },
  orderButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...getShadowStyles('md')
  },
  orderButtonDisabled: {
    backgroundColor: theme.colors.gray[300],
    opacity: 0.7
  },
  orderButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  }
});