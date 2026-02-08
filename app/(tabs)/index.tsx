import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ProductImage } from '@/components/ProductImage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Product, getProducts, onAllProductsStockChange } from '@/constants/Api';
import { getFlexStyles, getShadowStyles, theme } from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { items: cartItems, add: addToCart } = useCart();


  useEffect(() => {
    console.log('Loading products...');
    getProducts()
      .then((res) => {
        console.log('Products loaded:', res.length);
        setProducts(res);
      })
      .catch((error) => {
        console.error('Error loading products:', error);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Real-time stok güncellemelerini dinle
  useEffect(() => {
    const unsubscribe = onAllProductsStockChange((stocks) => {
      setProducts(prev => {
        if (!prev) return prev;
        return prev.map(product => {
          const newStock = stocks[product.id] || product.stock;
          return {
            ...product,
            stock: newStock
          };
        });
      });
    });

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <ThemedText style={styles.logoText}>🛍️</ThemedText>
            <ThemedText style={styles.brandName}>E-Shop</ThemedText>
          </View>
          <Link href="/profile" asChild>
            <Pressable style={styles.profileButton}>
              <ThemedText style={styles.profileIcon}>👤</ThemedText>
            </Pressable>
          </Link>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Ürün veya kategori ara..."
            placeholderTextColor={theme.colors.gray[500]}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
          <View style={styles.searchIcon}>
            <ThemedText style={styles.searchIconText}>🔍</ThemedText>
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <ThemedText style={styles.heroTitle}>
          {user ? `Merhaba ${user.name}! 👋` : 'Hoş Geldiniz! 👋'}
        </ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          {user 
            ? 'En iyi ürünleri keşfedin ve alışverişinizi tamamlayın'
            : 'Alışverişe başlamak için giriş yapın veya hesap oluşturun'
          }
        </ThemedText>
        
        {!user && (
          <View style={styles.authButtons}>
            <Link href="/login" asChild>
              <Pressable style={styles.authButton}>
                <ThemedText style={styles.authButtonText}>Giriş Yap</ThemedText>
              </Pressable>
            </Link>
            <Link href="/register" asChild>
              <Pressable style={[styles.authButton, styles.registerButton]}>
                <ThemedText style={[styles.authButtonText, styles.registerButtonText]}>Kayıt Ol</ThemedText>
              </Pressable>
            </Link>
          </View>
        )}
      </View>

      {/* Products Section */}
      <View style={styles.productsSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>🔥 Popüler Ürünler</ThemedText>
          <Link href="/shop" asChild>
            <Pressable style={styles.viewAllButton}>
              <ThemedText style={styles.viewAllText}>Tümünü Gör</ThemedText>
              <ThemedText style={styles.arrowText}>→</ThemedText>
            </Pressable>
          </Link>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <ThemedText style={styles.loadingText}>Ürünler yükleniyor...</ThemedText>
          </View>
        ) : (
          <FlatList
            data={filtered.slice(0, 6)} // İlk 6 ürünü göster
            keyExtractor={(i) => String(i.id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productsList}
            renderItem={({ item }) => (
              <Link href={`/product/${item.id}`} asChild>
                <Pressable style={styles.productCard}>
                  <View style={styles.productImageContainer}>
                    <ProductImage 
                      imageUrl={item.imageUrls?.[0] || item.imageUrl} 
                      style={styles.productImage}
                      placeholderText="📦"
                    />
                    <View style={styles.productBadge}>
                      <ThemedText style={styles.badgeText}>YENİ</ThemedText>
                    </View>
                  </View>
                  <View style={styles.productInfo}>
                    <ThemedText style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={styles.productCategory}>
                      {item.category}
                    </ThemedText>
                    <View style={styles.productFooter}>
                      <ThemedText style={styles.productPrice}>
                        {Number(item.price).toFixed(2)} ₺
                      </ThemedText>
                      <Pressable 
                        style={[
                          styles.addToCartButton,
                          item.stock === 0 && styles.addToCartButtonDisabled
                        ]}
                        disabled={item.stock === 0}
                        onPress={() => addToCart(item, 1)}
                      >
                        <ThemedText style={[
                          styles.addToCartText,
                          item.stock === 0 && styles.addToCartTextDisabled
                        ]}>
                          {item.stock > 0 ? '+' : '✕'}
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              </Link>
            )}
          />
        )}
      </View>
    </ThemedView>
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
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    ...getShadowStyles('sm')
  },
  headerContent: {
    ...getFlexStyles('row'),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg
  },
  logoContainer: {
    ...getFlexStyles('row'),
    alignItems: 'center',
    gap: theme.spacing.sm
  },
  logoText: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.fontSize.xxl + 8,
    paddingVertical: 4
  },
  brandName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...getShadowStyles('sm')
  },
  profileIcon: {
    fontSize: 20,
    color: theme.colors.gray[600],
    lineHeight: 24,
    paddingVertical: 2
  },
  searchContainer: {
    ...getFlexStyles('row'),
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.dark,
    paddingVertical: theme.spacing.sm
  },
  searchIcon: {
    marginLeft: theme.spacing.sm
  },
  searchIconText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.gray[500]
  },
  heroSection: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center'
  },
  heroTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.xxl + 8,
    paddingVertical: 4
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: theme.spacing.lg
  },
  authButtons: {
    ...getFlexStyles('row'),
    gap: theme.spacing.md,
    justifyContent: 'center',
    marginTop: theme.spacing.lg
  },
  authButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...getShadowStyles('sm')
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.white
  },
  authButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center'
  },
  registerButtonText: {
    color: theme.colors.white
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg
  },
  sectionHeader: {
    ...getFlexStyles('row'),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark
  },
  viewAllButton: {
    ...getFlexStyles('row'),
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.md
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium
  },
  arrowText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  row: {
    gap: theme.spacing.md
  },
  productsList: {
    paddingBottom: theme.spacing.xxl
  },
  productCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...getShadowStyles('sm'),
    overflow: 'hidden'
  },
  productImageContainer: {
    position: 'relative',
    height: 140
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.gray[100]
  },
  productBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  productInfo: {
    padding: theme.spacing.md
  },
  productName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  productCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[500],
    marginBottom: theme.spacing.sm
  },
  productFooter: {
    ...getFlexStyles('row'),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success
  },
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addToCartText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white
  },
  addToCartButtonDisabled: {
    backgroundColor: theme.colors.gray[300]
  },
  addToCartTextDisabled: {
    color: theme.colors.gray[500]
  }
});

