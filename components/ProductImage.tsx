import { theme } from '@/constants/Theme';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface ProductImageProps {
  imageUrl: string;
  style?: any;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

export function ProductImage({ 
  imageUrl, 
  style, 
  showPlaceholder = true,
  placeholderText = "Görsel Yok"
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // URL validasyonu ve düzeltme
  const getValidImageUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') return null;
    
    // Boş string kontrolü
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;
    
    // HTTP/HTTPS kontrolü ve düzeltme
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return `https://${trimmedUrl}`;
    }
    
    return trimmedUrl;
  };

  const validUrl = getValidImageUrl(imageUrl);

  // URL geçersizse placeholder göster
  if (!validUrl || imageError) {
    if (!showPlaceholder) return null;
    
    return (
      <View style={[styles.placeholder, style]}>
        <ThemedText style={styles.placeholderText}>
          {placeholderText}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {imageLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}
      
      <Image 
        source={{ uri: validUrl }} 
        style={[styles.image, imageLoading && styles.hidden]}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        onLoad={() => {
          setImageError(false);
          setImageLoading(false);
        }}
        onLoadStart={() => setImageLoading(true)}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: theme.colors.gray[100],
  },
  image: {
    width: '100%',
    height: '100%',
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
