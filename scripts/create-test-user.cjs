// create-test-user.cjs
const admin = require('firebase-admin');
const serviceAccount = require('../admin/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createTestUser() {
  try {
    const testUser = {
      name: 'Test Kullanıcı',
      email: 'test@example.com',
      password: '123456',
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('users').add(testUser);

    console.log('✅ Test kullanıcısı başarıyla oluşturuldu!');
    console.log('📝 Kullanıcı ID:', docRef.id);
    console.log('📧 E-posta: test@example.com');
    console.log('🔑 Şifre: 123456');
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    process.exit();
  }
}

createTestUser();
