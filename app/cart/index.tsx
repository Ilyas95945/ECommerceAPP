import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getButtonStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function CartScreen() {
  const { items, remove, update, total, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
          </Pressable>
          <ThemedText style={styles.headerTitle}>🛒 Sepet</ThemedText>
        </View>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>🔒</ThemedText>
          <ThemedText style={styles.emptyTitle}>Giriş Gerekli</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Sepeti görüntülemek için giriş yapmalısınız!
          </ThemedText>
          <Link href="/login" asChild>
            <Pressable style={styles.loginButton}>
              <ThemedText style={styles.loginButtonText}>🔑 Giriş Yap</ThemedText>
            </Pressable>
          </Link>
        </View>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
          </Pressable>
          <ThemedText style={styles.headerTitle}>🛒 Sepet</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Sepet yükleniyor...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>🛒 Sepet</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {items.length} ürün
        </ThemedText>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>🛒</ThemedText>
          <ThemedText style={styles.emptyTitle}>Sepet Boş</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Henüz sepetinize ürün eklemediniz
          </ThemedText>
          <Link href="/shop" asChild>
            <Pressable style={styles.shopButton}>
              <ThemedText style={styles.shopButtonText}>🛍️ Alışverişe Başla</ThemedText>
            </Pressable>
          </Link>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                  <CartItemImage imageUrl={item.product.imageUrls?.[0] || item.product.imageUrl} />
                </View>
                <View style={styles.itemInfo}>
                  <ThemedText style={styles.itemName} numberOfLines={2}>
                    {item.product.name}
                  </ThemedText>
                  <ThemedText style={styles.itemCategory}>
                    {item.product.category}
                  </ThemedText>
                  <View style={styles.itemFooter}>
                    <ThemedText style={styles.itemPrice}>
                      {item.product.price.toFixed(2)} ₺
                    </ThemedText>
                  </View>
                  
                  {/* Stok ve Rezervasyon Bilgileri */}
                  <View style={styles.stockInfo}>
                    <ThemedText style={[
                      styles.stockText,
                      item.product.stock > 0 ? styles.stockAvailable : styles.stockUnavailable
                    ]}>
                      Stok: {item.product.stock} adet
                    </ThemedText>
                    {item.expiresAt && (
                      <ThemedText style={styles.reservationInfo}>
                        ⏰ Rezervasyon: {Math.ceil((new Date(item.expiresAt).getTime() - new Date().getTime()) / 60000)} dk
                      </ThemedText>
                    )}
                  </View>
                  
                  {/* Miktar Kontrolü */}
                  <View style={styles.quantityContainer}>
                    <Pressable 
                      style={styles.quantityButton}
                      onPress={() => update(item.product.id, item.quantity - 1)}
                    >
                      <ThemedText style={styles.quantityButtonText}>-</ThemedText>
                    </Pressable>
                    <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                    <Pressable 
                      style={[
                        styles.quantityButton,
                        item.quantity >= item.product.stock && styles.quantityButtonDisabled
                      ]}
                      onPress={() => update(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <ThemedText style={[
                        styles.quantityButtonText,
                        item.quantity >= item.product.stock && styles.quantityButtonTextDisabled
                      ]}>+</ThemedText>
                    </Pressable>
                  </View>
                </View>
                <Pressable 
                  style={styles.removeButton}
                  onPress={() => remove(item.product.id)}
                >
                  <ThemedText style={styles.removeButtonText}>🗑️</ThemedText>
                </Pressable>
              </View>
            )}
          />
        </ScrollView>
      )}

      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <ThemedText style={styles.totalLabel}>Toplam:</ThemedText>
            <ThemedText style={styles.totalAmount}>
              {total.toFixed(2)} ₺
            </ThemedText>
          </View>
          <Link href="/checkout" asChild>
            <Pressable style={styles.checkoutButton}>
              <ThemedText style={styles.checkoutButtonText}>
                💳 Ödemeye Geç
              </ThemedText>
            </Pressable>
          </Link>
        </View>
      )}
    </ThemedView>
  );
}

function CartItemImage({ imageUrl }: { imageUrl: string }) {
  const [imageError, setImageError] = useState(false);
  
  if (imageError || !imageUrl) {
    return (
      <View style={styles.imagePlaceholder}>
        <ThemedText style={styles.placeholderText}>📦</ThemedText>
      </View>
    );
  }
  
  return (
    <Image 
      source={{ uri: imageUrl }} 
      style={styles.itemImage}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
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
  cartItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...getShadowStyles('sm')
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray[100],
    marginRight: theme.spacing.md
  },
  itemImage: {
    width: '100%',
    height: '100%'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[100]
  },
  placeholderText: {
    fontSize: 24,
    color: theme.colors.gray[400]
  },
  itemInfo: {
    flex: 1,
    marginRight: theme.spacing.sm
  },
  itemName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  itemCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.sm
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    justifyContent: 'center'
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...getShadowStyles('sm')
  },
  quantityButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark
  },
  quantityText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginHorizontal: theme.spacing.md,
    minWidth: 24,
    textAlign: 'center'
  },
  removeButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeButtonText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.white
  },
  stockInfo: {
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm
  },
  stockText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium
  },
  stockAvailable: {
    color: theme.colors.success
  },
  stockUnavailable: {
    color: theme.colors.danger
  },
  quantityButtonDisabled: {
    backgroundColor: theme.colors.gray[300]
  },
  quantityButtonTextDisabled: {
    color: theme.colors.gray[500]
  },
  reservationInfo: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.warning,
    fontWeight: theme.typography.fontWeight.medium,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200]
  },
  footer: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    ...getShadowStyles('sm')
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark
  },
  totalAmount: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success
  },
  checkoutButton: {
    ...getButtonStyles('primary'),
    paddingVertical: theme.spacing.lg
  },
  checkoutButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  }
});