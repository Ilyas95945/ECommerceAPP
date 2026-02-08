import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Order, getUserOrders } from '@/constants/Api';
import { getButtonStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function OrdersScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserOrders(user.id)
      .then(setOrders)
      .catch((e) => setError(String(e)));
  }, [user]);

  if (!user) {
    return (
      <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
          </Pressable>
          <ThemedText style={styles.headerTitle}>📋 Siparişlerim</ThemedText>
        </View>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>🔒</ThemedText>
          <ThemedText style={styles.emptyTitle}>Giriş Gerekli</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Sipariş geçmişinizi görüntülemek için giriş yapmalısınız!
          </ThemedText>
          <Pressable style={styles.loginButton} onPress={() => router.push('/login')}>
            <ThemedText style={styles.loginButtonText}>🔑 Giriş Yap</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>📋 Siparişlerim</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {orders ? `${orders.length} sipariş` : 'Sipariş geçmişiniz'}
        </ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
          </View>
        ) : !orders ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>Yükleniyor...</ThemedText>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyIcon}>📋</ThemedText>
            <ThemedText style={styles.emptyTitle}>Henüz Siparişiniz Yok</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              İlk siparişinizi vermek için alışverişe başlayın
            </ThemedText>
            <Pressable style={styles.shopButton} onPress={() => router.push('/shop')}>
              <ThemedText style={styles.shopButtonText}>🛍️ Alışverişe Başla</ThemedText>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable style={styles.orderCard} onPress={() => router.push(`/order-detail/${item.id}`)}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <ThemedText style={styles.orderNumber}>#{item.id.slice(-8)}</ThemedText>
                    <ThemedText style={styles.orderDate}>
                      {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <ThemedText style={styles.statusText}>{getStatusText(item.status)}</ThemedText>
                  </View>
                </View>
                
                <View style={styles.itemsContainer}>
                  {item.items.slice(0, 2).map((orderItem, index) => (
                    <View key={index} style={styles.itemRow}>
                      <OrderProductImage imageUrl={orderItem.product.imageUrls?.[0] || orderItem.product.imageUrl} />
                      <View style={styles.itemInfo}>
                        <ThemedText style={styles.productName} numberOfLines={1}>
                          {orderItem.product.name}
                        </ThemedText>
                        <ThemedText style={styles.quantityText}>
                          {orderItem.quantity} adet × {orderItem.product.price.toFixed(2)} ₺
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                  {item.items.length > 2 && (
                    <ThemedText style={styles.moreItemsText}>
                      +{item.items.length - 2} ürün daha
                    </ThemedText>
                  )}
                </View>
                
                <View style={styles.orderFooter}>
                  <ThemedText style={styles.totalLabel}>Toplam:</ThemedText>
                  <ThemedText style={styles.totalAmount}>
                    {item.totalPrice.toFixed(2)} ₺
                  </ThemedText>
                </View>
              </Pressable>
            )}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}

function OrderProductImage({ imageUrl }: { imageUrl: string }) {
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

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return theme.colors.warning;
    case 'processing':
      return theme.colors.info;
    case 'shipped':
      return theme.colors.primary;
    case 'delivered':
      return theme.colors.success;
    case 'cancelled':
      return theme.colors.danger;
    default:
      return theme.colors.gray[500];
  }
}

function getStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Beklemede';
    case 'processing':
      return 'İşleniyor';
    case 'shipped':
      return 'Kargoda';
    case 'delivered':
      return 'Teslim Edildi';
    case 'cancelled':
      return 'İptal';
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl
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
    marginBottom: theme.spacing.sm
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600],
    textAlign: 'center',
    marginBottom: theme.spacing.lg
  },
  loginButton: {
    ...getButtonStyles('primary'),
    paddingHorizontal: theme.spacing.xl
  },
  loginButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  shopButton: {
    ...getButtonStyles('primary'),
    paddingHorizontal: theme.spacing.xl
  },
  shopButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.danger,
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  orderCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...getShadowStyles('sm')
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  orderInfo: {
    flex: 1
  },
  orderNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  orderDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500]
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.white
  },
  itemsContainer: {
    marginBottom: theme.spacing.md
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.gray[400]
  },
  itemInfo: {
    flex: 1
  },
  productName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  quantityText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600]
  },
  moreItemsText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500],
    fontStyle: 'italic',
    marginTop: theme.spacing.sm
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    paddingTop: theme.spacing.md
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark
  },
  totalAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success
  }
});