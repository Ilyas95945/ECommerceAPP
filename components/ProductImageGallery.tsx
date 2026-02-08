import { theme } from '@/constants/Theme';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface ProductImageGalleryProps {
  imageUrls: string[];
  style?: any;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

export function ProductImageGallery({ 
  imageUrls, 
  style, 
  showPlaceholder = true,
  placeholderText = "Görsel Yok"
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);

  // URL validasyonu ve düzeltme
  const getValidImageUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;
    
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return `https://${trimmedUrl}`;
    }
    
    return trimmedUrl;
  };

  // Geçerli URL'leri filtrele
  const validUrls = imageUrls
    .map(url => getValidImageUrl(url))
    .filter((url): url is string => url !== null);

  // Eğer geçerli URL yoksa placeholder göster
  if (validUrls.length === 0) {
    if (!showPlaceholder) return null;
    
    return (
      <View style={[styles.placeholder, style]}>
        <ThemedText style={styles.placeholderText}>
          {placeholderText}
        </ThemedText>
      </View>
    );
  }

  const handleImageError = (index: number) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  const handleImageLoad = (index: number) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = false;
      return newErrors;
    });
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = false;
      return newLoading;
    });
  };

  const handleImageLoadStart = (index: number) => {
    setImageLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = true;
      return newLoading;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validUrls.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + validUrls.length) % validUrls.length);
  };


  return (
    <View style={[styles.container, style]}>
      {/* Tam Ekran Modal */}
      <Modal
        visible={isZoomed}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsZoomed(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalCloseButton}
            onPress={() => setIsZoomed(false)}
          >
            <ThemedText style={styles.modalCloseText}>✕</ThemedText>
          </Pressable>
          
          <View style={styles.modalImageContainer}>
            <Image 
              source={{ uri: validUrls[currentIndex] }} 
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
          {validUrls.length > 1 && (
            <View style={styles.modalNavigation}>
              <Pressable 
                style={styles.modalNavButton}
                onPress={goToPrevious}
              >
                <ThemedText style={styles.modalNavText}>‹</ThemedText>
              </Pressable>
              <Pressable 
                style={styles.modalNavButton}
                onPress={goToNext}
              >
                <ThemedText style={styles.modalNavText}>›</ThemedText>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>

      {/* Ana Görsel */}
      <View style={styles.mainImageContainer}>
        {imageLoading[currentIndex] && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        
        {!imageErrors[currentIndex] ? (
          <Pressable 
            onPress={() => setIsZoomed(!isZoomed)}
            style={styles.imagePressable}
          >
            <Image 
              source={{ uri: validUrls[currentIndex] }} 
              style={[
                styles.mainImage, 
                imageLoading[currentIndex] && styles.hidden
              ]}
              onError={() => handleImageError(currentIndex)}
              onLoad={() => handleImageLoad(currentIndex)}
              onLoadStart={() => handleImageLoadStart(currentIndex)}
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>Görsel Yüklenemedi</ThemedText>
          </View>
        )}

        {/* Navigasyon Butonları */}
        {validUrls.length > 1 && (
          <>
            <Pressable 
              style={[styles.navButton, styles.prevButton]}
              onPress={goToPrevious}
            >
              <ThemedText style={styles.navButtonText}>‹</ThemedText>
            </Pressable>
            <Pressable 
              style={[styles.navButton, styles.nextButton]}
              onPress={goToNext}
            >
              <ThemedText style={styles.navButtonText}>›</ThemedText>
            </Pressable>
          </>
        )}

        {/* Görsel Sayacı */}
        {validUrls.length > 1 && (
          <View style={styles.counter}>
            <ThemedText style={styles.counterText}>
              {currentIndex + 1} / {validUrls.length}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Thumbnail Listesi */}
      {validUrls.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
          contentContainerStyle={styles.thumbnailContent}
        >
          {validUrls.map((url, index) => (
            <Pressable
              key={index}
              style={[
                styles.thumbnail,
                currentIndex === index && styles.activeThumbnail
              ]}
              onPress={() => setCurrentIndex(index)}
            >
              <Image 
                source={{ uri: url }} 
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray[100],
  },
  mainImageContainer: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: theme.colors.gray[100],
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePressable: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalCloseText: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalImageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    maxWidth: 400,
    maxHeight: 600,
  },
  modalNavigation: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  modalNavButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalNavText: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  hidden: {
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[100],
    zIndex: 1,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[100],
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.gray[400],
    textAlign: 'center',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  navButtonText: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  thumbnailContainer: {
    maxHeight: 80,
    paddingVertical: 10,
  },
  thumbnailContent: {
    paddingHorizontal: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: theme.colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.gray[400],
    textAlign: 'center',
  },
});
