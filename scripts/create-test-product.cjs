// create-test-product.cjs
const admin = require('firebase-admin');
const serviceAccount = require('../admin/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createTestProduct() {
  try {
    const testProduct = {
      name: 'Test Ürün',
      description: 'Bu bir test ürünüdür',
      price: 99.99,
      category: 'Test Kategori',
      imageUrl: 'https://picsum.photos/300/200',
      stock: 10,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('products').add(testProduct);

    console.log('✅ Test ürünü başarıyla oluşturuldu!');
    console.log('📝 Ürün ID:', docRef.id);
    console.log('🖼️ Görsel URL:', testProduct.imageUrl);
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    process.exit();
  }
}

createTestProduct();
