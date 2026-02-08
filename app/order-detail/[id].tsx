import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Order, getOrderById } from '@/constants/Api';
import { theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    getOrderById(id)
      .then((orderData) => {
        if (!orderData) {
          setError('Sipariş bulunamadı');
          return;
        }
        
        // Check if the order belongs to the current user
        if (user && orderData.userId !== user.id) {
          setError('Bu siparişe erişim yetkiniz yok');
          return;
        }
        
        setOrder(orderData);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id, user]);

  if (!user) {
    return (
      <ThemedView style={styles.container} lightColor="#ffffff">
        <ThemedText type="title">Sipariş Detayı</ThemedText>
        <ThemedText>Sipariş detaylarını görüntülemek için giriş yapmalısınız!</ThemedText>
        <Pressable style={styles.button} onPress={() => router.push('/login')}>
          <ThemedText style={{ color: '#fff' }}>Giriş Yap</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.container} lightColor="#ffffff">
        <ThemedText>Yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !order) {
    return (
      <ThemedView style={styles.container} lightColor="#ffffff">
        <ThemedText type="title">Sipariş Detayı</ThemedText>
        <ThemedText>{error || 'Sipariş bulunamadı'}</ThemedText>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <ThemedText style={{ color: '#fff' }}>Geri Dön</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const orderDate = new Date(order.createdAt?.toDate?.() || order.createdAt);

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      <SafeAreaView style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>📋 Sipariş Detayı</ThemedText>
      </SafeAreaView>
      
      <ScrollView style={styles.content}>
      
      {/* Order Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <ThemedText type="defaultSemiBold">Sipariş #{order.id.slice(-8)}</ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <ThemedText style={styles.statusText}>{getStatusText(order.status)}</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.dateText}>
          {orderDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </ThemedText>
      </View>

      {/* Customer Info */}
      <View style={styles.infoCard}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Müşteri Bilgileri</ThemedText>
        <ThemedText style={styles.infoText}>Ad: {order.userName}</ThemedText>
        <ThemedText style={styles.infoText}>E-posta: {order.userEmail}</ThemedText>
      </View>

      {/* Order Items */}
      <View style={styles.infoCard}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Sipariş Ürünleri</ThemedText>
         {order.items.map((item, index) => (
           <View key={index} style={styles.itemCard}>
             <OrderDetailProductImage imageUrl={item.product.imageUrls?.[0] || item.product.imageUrl} />
             <View style={styles.itemDetails}>
              <ThemedText type="defaultSemiBold" style={styles.productName}>
                {item.product.name}
              </ThemedText>
              <ThemedText style={styles.productDescription} numberOfLines={2}>
                {item.product.description}
              </ThemedText>
              <View style={styles.itemFooter}>
                <ThemedText style={styles.quantityText}>
                  Adet: {item.quantity}
                </ThemedText>
                <ThemedText style={styles.priceText}>
                  {item.product.price.toFixed(2)} ₺
                </ThemedText>
              </View>
              <ThemedText type="defaultSemiBold" style={styles.itemTotal}>
                Toplam: {(item.product.price * item.quantity).toFixed(2)} ₺
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>Sipariş Özeti</ThemedText>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Ürün Sayısı:</ThemedText>
          <ThemedText style={styles.summaryValue}>{order.items.length} ürün</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryLabel}>Toplam Tutar:</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.totalAmount}>
            {order.totalPrice.toFixed(2)} ₺
          </ThemedText>
        </View>
      </View>

      </ScrollView>
    </ThemedView>
  );
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#ffc107';
    case 'processing':
      return '#17a2b8';
    case 'shipped':
      return '#007bff';
    case 'delivered':
      return '#28a745';
    case 'cancelled':
      return '#dc3545';
    default:
      return '#6c757d';
  }
}

function getStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Beklemede';
    case 'processing':
      return 'Hazırlanıyor';
    case 'shipped':
      return 'Kargoya Verildi';
    case 'delivered':
      return 'Teslim Edildi';
    case 'cancelled':
      return 'İptal Edildi';
    default:
      return status;
  }
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
  headerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    color: '#6c757d',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  cardTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  infoText: {
    marginBottom: 4,
    fontSize: 14,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#6c757d',
  },
  priceText: {
    fontSize: 12,
    color: '#6c757d',
  },
  itemTotal: {
    fontSize: 14,
    color: '#28a745',
  },
  summaryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    color: '#28a745',
  },
});

function OrderDetailProductImage({ imageUrl }: { imageUrl: string }) {
  const [imageError, setImageError] = useState(false);
  
  if (imageError || !imageUrl) {
    return (
      <View style={styles.productImagePlaceholder}>
        <ThemedText style={styles.placeholderText}>?</ThemedText>
      </View>
    );
  }
  
  return (
    <Image 
      source={{ uri: imageUrl }} 
      style={styles.productImage}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  );
}
