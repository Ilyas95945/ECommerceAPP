import { ProductImage } from '@/components/ProductImage';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getShadowStyles, theme } from '@/constants/Theme';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function DebugImagesScreen() {
  const [testUrl, setTestUrl] = useState('https://picsum.photos/300/200');
  const [testResults, setTestResults] = useState<string[]>([]);

  const testUrls = [
    'https://picsum.photos/300/200',
    'https://via.placeholder.com/300x200',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    'http://localhost:3000/test-image.jpg', // HTTP test
    'invalid-url', // Invalid URL test
    '', // Empty URL test
  ];

  const addTestResult = (url: string, success: boolean, error?: string) => {
    const result = `${success ? '✅' : '❌'} ${url} ${error ? `- ${error}` : ''}`;
    setTestResults(prev => [...prev, result]);
  };

  const testImageUrl = async (url: string) => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: {
          'Accept': 'image/*',
        }
      });
      addTestResult(url, response.ok, response.ok ? '' : `HTTP ${response.status}`);
    } catch (error) {
      addTestResult(url, false, String(error));
    }
  };

  const runAllTests = () => {
    setTestResults([]);
    testUrls.forEach(url => {
      if (url) {
        testImageUrl(url);
      } else {
        addTestResult('(empty)', false, 'Empty URL');
      }
    });
  };

  return (
    <ThemedView style={styles.container} lightColor={theme.colors.gray[50]}>
      <ScrollView style={styles.scrollView}>
        <ThemedText style={styles.title}>🔧 Görsel Debug Aracı</ThemedText>
        
        {/* Manual URL Test */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Manuel URL Testi</ThemedText>
          <TextInput
            style={styles.input}
            value={testUrl}
            onChangeText={setTestUrl}
            placeholder="Görsel URL'si girin..."
            placeholderTextColor={theme.colors.gray[500]}
          />
          <View style={styles.testContainer}>
            <ProductImage 
              imageUrl={testUrl} 
              style={styles.testImage}
              placeholderText="❌"
            />
          </View>
        </View>

        {/* Predefined Tests */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Önceden Tanımlı Testler</ThemedText>
          <Pressable style={styles.testButton} onPress={runAllTests}>
            <ThemedText style={styles.testButtonText}>Tüm Testleri Çalıştır</ThemedText>
          </Pressable>
          
          {testUrls.map((url, index) => (
            <View key={index} style={styles.urlTest}>
              <ThemedText style={styles.urlText}>
                {url || '(boş URL)'}
              </ThemedText>
              <ProductImage 
                imageUrl={url} 
                style={styles.smallImage}
                placeholderText="❌"
              />
            </View>
          ))}
        </View>

        {/* Test Results */}
        {testResults.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Test Sonuçları</ThemedText>
            {testResults.map((result, index) => (
              <ThemedText key={index} style={styles.resultText}>
                {result}
              </ThemedText>
            ))}
          </View>
        )}

        {/* Network Info */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Network Bilgileri</ThemedText>
          <ThemedText style={styles.infoText}>
            • HTTP trafiği: {theme.colors.primary}Android'de etkinleştirildi
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Network Security Config: Yapılandırıldı
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Cache: Force-cache aktif
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  section: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...getShadowStyles('sm'),
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.dark,
    marginBottom: theme.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.dark,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  testContainer: {
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray[100],
  },
  testImage: {
    width: '100%',
    height: '100%',
  },
  testButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  testButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  urlTest: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  urlText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600],
    marginRight: theme.spacing.md,
  },
  smallImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
  },
  resultText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.xs,
    fontFamily: 'monospace',
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.xs,
  },
});
