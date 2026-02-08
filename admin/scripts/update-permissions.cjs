// Admin kullanıcılarının permission'larını güncellemek için script
const fs = require('fs');
const path = require('path');

console.log('🔄 Admin kullanıcı permission\'ları güncelleniyor...');

// localStorage'ı temizle (browser'da çalışacak)
console.log('📝 Not: Bu script browser\'da çalışmalıdır.');
console.log('🔧 Manuel olarak yapılacak işlemler:');
console.log('1. Admin paneline giriş yapın');
console.log('2. Browser console\'u açın (F12)');
console.log('3. Şu kodu çalıştırın:');
console.log(`
// Mevcut admin kullanıcısının permission'larını güncelle
const storedUser = localStorage.getItem('adminUser');
if (storedUser) {
  const userData = JSON.parse(storedUser);
  if (!userData.permissions.includes('contact')) {
    userData.permissions.push('contact');
    localStorage.setItem('adminUser', JSON.stringify(userData));
    console.log('✅ Contact permission eklendi:', userData.permissions);
    location.reload(); // Sayfayı yenile
  } else {
    console.log('✅ Contact permission zaten mevcut:', userData.permissions);
  }
} else {
  console.log('❌ Admin kullanıcı bulunamadı');
}
`);

console.log('🎯 Alternatif: Admin panelinden çıkış yapıp tekrar giriş yapın');




