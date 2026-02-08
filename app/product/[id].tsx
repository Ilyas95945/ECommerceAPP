import { ProductImageGallery } from '@/components/ProductImageGallery';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Product, getProduct } from '@/constants/Api';
import { getButtonStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useCart } from '@/hooks/useCart';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { add, items } = useCart();

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((productData) => {
        setProduct(productData);
        setOriginalProduct(productData); // Orijinal stok bilgisini sakla
      })
      .catch((e) => setError(String(e)));
  }, [id]);

  // Sepet güncellemelerini dinle ve ürün bilgilerini yenile
  useEffect(() => {
    if (!id || !originalProduct) return;
    
    // Orijinal stok bilgisini koru, sadece gösterim için güncelle
    setProduct(originalProduct);
  }, [items, id, originalProduct]);

  // Stok 0 olduğunda miktarı 0'a ayarla
  useEffect(() => {
    if (maxQuantity === 0 && quantity > 0) {
      setQuantity(0);
    }
  }, [maxQuantity, quantity]);

  const handleAddToCart = () => {
    if (originalProduct) {
      add(originalProduct, quantity);
    }
  };

  // Sepetteki mevcut miktarı hesapla
  const getCurrentCartQuantity = () => {
    if (!originalProduct) return 0;
    const cartItem = items.find(item => item.product.id === originalProduct.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const currentCartQuantity = getCurrentCartQuantity();
  // Kullanılabilir stok = Gerçek stok - sepetteki miktar
  const availableStock = originalProduct ? originalProduct.stock - currentCartQuantity : 0;
  const maxQuantity = Math.max(0, availableStock);
  // Sepete ekleme butonu sadece gerçek stok 0 olduğunda kapanır
  const canAddToCart = originalProduct && originalProduct.stock > 0;

  if (error) {
    return (
      <ThemedView style={styles.errorContainer} lightColor={theme.colors.gray[50]}>
        <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView style={styles.loadingContainer} lightColor={theme.colors.gray[50]}>
        <ThemedText style={styles.loadingText}>Yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Back Button */}
      <SafeAreaView style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ThemedText style={styles.backButtonText}>← Geri</ThemedText>
        </Pressable>
      </SafeAreaView>

      {/* Product Image Gallery */}
      <View style={styles.imageContainer}>
        <ProductImageGallery 
          imageUrls={product.imageUrls || [product.imageUrl]} 
          style={styles.productImage}
          placeholderText="📦"
        />
        <View style={styles.imageBadge}>
          <ThemedText style={styles.badgeText}>YENİ</ThemedText>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
          <View style={styles.categoryContainer}>
            <ThemedText style={styles.categoryText}>{product.category}</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.description}>{product.description}</ThemedText>

        <View style={styles.priceContainer}>
          <ThemedText style={styles.price}>{product.price.toFixed(2)} ₺</ThemedText>
          <View style={styles.stockContainer}>
            <ThemedText style={[
              styles.stockText,
              { color: product.stock > 0 ? theme.colors.success : theme.colors.danger }
            ]}>
              {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
            </ThemedText>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <ThemedText style={styles.quantityLabel}>Miktar:</ThemedText>
          <View style={styles.quantitySelector}>
            <Pressable 
              style={[
                styles.quantityButton,
                (quantity <= 1 || availableStock === 0) && styles.quantityButtonDisabled
              ]}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || availableStock === 0}
            >
              <ThemedText style={styles.quantityButtonText}>-</ThemedText>
            </Pressable>
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                if (availableStock === 0) {
                  setQuantity(0);
                } else {
                  setQuantity(Math.max(1, Math.min(availableStock, num)));
                }
              }}
              keyboardType="numeric"
            />
            <Pressable 
              style={[
                styles.quantityButton,
                (quantity >= availableStock || availableStock === 0) && styles.quantityButtonDisabled
              ]}
              onPress={() => setQuantity(Math.min(availableStock, quantity + 1))}
              disabled={quantity >= availableStock || availableStock === 0}
            >
              <ThemedText style={[
                styles.quantityButtonText,
                (quantity >= availableStock || availableStock === 0) && styles.quantityButtonTextDisabled
              ]}>+</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Stock Info */}
        <View style={styles.stockInfo}>
          <ThemedText style={styles.stockLabel}>Stok Durumu:</ThemedText>
          <ThemedText style={[
            styles.stockValue,
            originalProduct && originalProduct.stock > 0 ? styles.stockAvailable : styles.stockUnavailable
          ]}>
            {originalProduct && originalProduct.stock > 0 ? `${originalProduct.stock} adet` : 'Stokta yok'}
          </ThemedText>
          {currentCartQuantity > 0 && (
            <ThemedText style={styles.cartInfo}>
              Sepetinizde: {currentCartQuantity} adet
            </ThemedText>
          )}
        </View>

        {/* Add to Cart Button */}
        <Pressable 
          style={[
            styles.addToCartButton,
            { 
              opacity: !canAddToCart ? 0.5 : 1,
              backgroundColor: !canAddToCart ? theme.colors.gray[300] : theme.colors.primary
            }
          ]}
          onPress={handleAddToCart}
          disabled={!canAddToCart}
        >
          <ThemedText style={[
            styles.addToCartText,
            !canAddToCart && styles.addToCartTextDisabled
          ]}>
            {!canAddToCart ? 
              (availableStock === 0 ? 'Stokta Yok' : 'Maksimum Stok') : 
              '🛒 Sepete Ekle'
            }
          </ThemedText>
        </Pressable>

        {/* Product Features */}
        <View style={styles.featuresContainer}>
          <ThemedText style={styles.featuresTitle}>✨ Özellikler</ThemedText>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>📦</ThemedText>
            <ThemedText style={styles.featureText}>Hızlı Kargo</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>🔄</ThemedText>
            <ThemedText style={styles.featureText}>Kolay İade</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>🛡️</ThemedText>
            <ThemedText style={styles.featureText}>Güvenli Alışveriş</ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ProductImage component artık ayrı dosyada

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.gray[50] 
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    ...getShadowStyles('sm'),
    marginBottom: theme.spacing.md
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
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden'
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.gray[100]
  },
  imageBadge: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md
  },
  badgeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  infoContainer: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...getShadowStyles('sm'),
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.lg
  },
  header: {
    marginBottom: theme.spacing.md
  },
  productName: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.sm
  },
  categoryContainer: {
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start'
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600],
    fontWeight: theme.typography.fontWeight.medium
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[700],
    lineHeight: 24,
    marginBottom: theme.spacing.lg
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm
  },
  price: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    lineHeight: theme.typography.fontSize.xxxl + 8
  },
  stockContainer: {
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm
  },
  stockText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg
  },
  quantityLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.dark
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...getShadowStyles('sm')
  },
  quantityButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark
  },
  quantityInput: {
    width: 60,
    height: 40,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.sm
  },
  addToCartButton: {
    ...getButtonStyles('primary'),
    marginBottom: theme.spacing.lg
  },
  addToCartText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  addToCartTextDisabled: {
    color: theme.colors.gray[500]
  },
  stockInfo: {
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg
  },
  stockLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs
  },
  stockValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold
  },
  stockAvailable: {
    color: theme.colors.success
  },
  stockUnavailable: {
    color: theme.colors.danger
  },
  cartInfo: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs
  },
  quantityButtonDisabled: {
    backgroundColor: theme.colors.gray[300]
  },
  quantityButtonTextDisabled: {
    color: theme.colors.gray[500]
  },
  featuresContainer: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md
  },
  featuresTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.md
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm
  },
  featureIcon: {
    fontSize: theme.typography.fontSize.lg,
    marginRight: theme.spacing.md,
    width: 24
  },
  featureText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[700]
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
  }
});


