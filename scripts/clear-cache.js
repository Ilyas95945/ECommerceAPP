// clear-cache.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Metro cache temizleniyor...');

try {
  // Metro cache'i temizle
  execSync('npx expo start --clear', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Cache temizleme hatası:', error.message);
}

console.log('✅ Cache temizlendi!');
