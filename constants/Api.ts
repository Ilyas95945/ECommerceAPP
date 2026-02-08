import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: any;
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: { product: Product; quantity: number }[];
  totalPrice: number;
  status: string;
  createdAt: any;
};

// Firestore functions
export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProduct(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  }
  return null;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: new Date()
  });
  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  return allOrders.filter(order => order.userId === userId);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Order;
  }
  return null;
}

// Generic JSON getter expected by app/(tabs)/index.tsx
export async function getJson<T>(path: string): Promise<T> {
  // Map known paths to Firestore-backed helpers
  if (path === '/api/products') {
    const products = await getProducts();
    return products as unknown as T;
  }
  if (path.startsWith('/api/orders/user/')) {
    const userId = path.replace('/api/orders/user/', '');
    const orders = await getUserOrders(userId);
    return orders as unknown as T;
  }
  throw new Error(`Unsupported API path: ${path}`);
}

// Stok güncelleme fonksiyonu
export async function updateProductStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return false;
    }
    
    const currentStock = productSnap.data().stock;
    const newStock = currentStock - quantity;
    
    if (newStock < 0) {
      return false; // Yetersiz stok
    }
    
    await updateDoc(productRef, {
      stock: newStock
    });
    
    return true;
  } catch (error) {
    console.error('Stok güncelleme hatası:', error);
    return false;
  }
}

// Stok kontrolü
export async function checkProductStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return false;
    }
    
    const currentStock = productSnap.data().stock;
    return currentStock >= quantity;
  } catch (error) {
    console.error('Stok kontrol hatası:', error);
    return false;
  }
}

// Stok rezervasyonu (sepete ekleme sırasında)
export async function reserveProductStock(productId: string, quantity: number, userId: string): Promise<boolean> {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return false;
    }
    
    const currentStock = productSnap.data().stock;
    if (currentStock < quantity) {
      return false; // Yetersiz stok
    }
    
    // Stoktan düş
    await updateDoc(productRef, {
      stock: currentStock - quantity
    });
    
    // Rezervasyon kaydı oluştur
    await addDoc(collection(db, 'stock_reservations'), {
      productId,
      userId,
      quantity,
      reservedAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 dakika
      status: 'active'
    });
    
    return true;
  } catch (error) {
    console.error('Stok rezervasyon hatası:', error);
    return false;
  }
}

// Rezervasyon iptal et (stokları geri ekle)
export async function cancelStockReservation(productId: string, quantity: number): Promise<boolean> {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return false;
    }
    
    const currentStock = productSnap.data().stock;
    
    // Stokları geri ekle
    await updateDoc(productRef, {
      stock: currentStock + quantity
    });
    
    return true;
  } catch (error) {
    console.error('Stok iptal hatası:', error);
    return false;
  }
}

// Süresi dolmuş rezervasyonları temizle
export async function cleanupExpiredReservations(): Promise<void> {
  try {
    const now = new Date();
    const q = query(
      collection(db, 'stock_reservations'),
      where('expiresAt', '<', now),
      where('status', '==', 'active')
    );
    
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(async (doc) => {
      const data = doc.data();
      // Stokları geri ekle
      await cancelStockReservation(data.productId, data.quantity);
      // Rezervasyonu iptal et
      batch.update(doc.ref, { status: 'expired' });
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Rezervasyon temizleme hatası:', error);
  }
}

// Gerçek zamanlı stok güncelleme - Firestore listener
export function onProductStockChange(productId: string, callback: (stock: number) => void) {
  const productRef = doc(db, 'products', productId);
  
  return onSnapshot(productRef, (doc) => {
    if (doc.exists()) {
      const stock = doc.data().stock;
      callback(stock);
    }
  });
}

// Tüm ürünlerin stok değişikliklerini dinle
export function onAllProductsStockChange(callback: (products: { [key: string]: number }) => void) {
  const productsRef = collection(db, 'products');
  
  return onSnapshot(productsRef, (snapshot) => {
    const stocks: { [key: string]: number } = {};
    snapshot.forEach((doc) => {
      stocks[doc.id] = doc.data().stock;
    });
    callback(stocks);
  });
}
