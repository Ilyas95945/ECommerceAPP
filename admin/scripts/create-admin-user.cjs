// create-admin-user.cjs
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createAdminUser() {
  try {
    const adminUser = {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      permissions: ['products', 'orders', 'users', 'analytics'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null
    };

    const docRef = await db.collection('adminusers').add(adminUser);

    console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!');
    console.log('📝 Kullanıcı ID:', docRef.id);
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    process.exit();
  }
}

createAdminUser();
