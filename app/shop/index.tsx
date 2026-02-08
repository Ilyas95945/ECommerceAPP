import { ProductImage } from '@/components/ProductImage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Product, getProducts } from '@/constants/Api';
import { getShadowStyles, theme } from '@/constants/Theme';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function ShopScreen() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((e) => setError(String(e)));
  }, []);

  const categories = ['Tümü', ...Array.from(new Set(products?.map(p => p.category) || []))];
  
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (error) {
    return (
      <ThemedView style={styles.errorContainer} lightColor={theme.colors.gray[50]}> 
        <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
      </ThemedView>
    );
  }

  if (!products) {
    return (
      <ThemedView style={styles.loadingContainer} lightColor={theme.colors.gray[50]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <ThemedText style={styles.loadingText}>Ürünler yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>🛍️ Mağaza</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {filteredProducts.length} ürün bulundu
        </ThemedText>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholder="Ürün ara..."
            placeholderTextColor={theme.colors.gray[500]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <View style={styles.searchIcon}>
            <ThemedText style={styles.searchIconText}>🔍</ThemedText>
          </View>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <ThemedText style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
              ]}>
                {item}
              </ThemedText>
            </Pressable>
          )}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
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
                    {item.price.toFixed(2)} ₺
                  </ThemedText>
                  <View style={styles.stockIndicator}>
                    <ThemedText style={styles.stockText}>
                      {item.stock > 0 ? `${item.stock} adet` : 'Stokta yok'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
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
    padding: theme.spacing.lg,
    ...getShadowStyles('sm')
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  searchContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200]
  },
  searchInputContainer: {
    flexDirection: 'row',
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
  categoryContainer: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200]
  },
  categoryList: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray[600]
  },
  categoryTextActive: {
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
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray[600]
  },
  productRow: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg
  },
  productsList: {
    paddingVertical: theme.spacing.lg,
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
    height: 160
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success
  },
  stockIndicator: {
    backgroundColor: theme.colors.gray[100],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm
  },
  stockText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray[600],
    fontWeight: theme.typography.fontWeight.medium
  }
});


