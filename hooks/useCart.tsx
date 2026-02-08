import { cancelStockReservation, Product, reserveProductStock } from '@/constants/Api';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { useAuth } from './useAuth';

export type CartItem = { 
  product: Product; 
  quantity: number;
  reservedAt?: Date;
  expiresAt?: Date;
};

type CartContextType = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  update: (productId: string, quantity: number) => void;
  clear: () => void;
  clearAfterOrder: () => void;
  cancelCart: () => void;
  total: number;
  loading: boolean;
  checkExpiredItems: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Kullanıcı giriş yaptığında sepeti Firestore'dan yükle
  useEffect(() => {
    if (user) {
      loadCartFromFirestore();
    } else {
      // Giriş yapılmamışsa sepeti temizle
      setItems([]);
    }
  }, [user]);

  async function loadCartFromFirestore() {
    if (!user) return;
    
    setLoading(true);
    try {
      const cartDoc = await getDoc(doc(db, 'carts', user.id));
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        setItems(cartData.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveCartToFirestore(newItems: CartItem[]) {
    if (!user) return;
    
    try {
      await setDoc(doc(db, 'carts', user.id), {
        items: newItems,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  async function add(product: Product, quantity: number = 1) {
    if (!user) {
      Alert.alert('Hata', 'Sepete ürün eklemek için giriş yapmalısınız!');
      return;
    }

    // Stok kontrolü sadece ürün sayfasında yapılır, ana sayfada yapılmaz

    // Stok rezervasyonu yap
    const reservationSuccess = await reserveProductStock(product.id, quantity, user.id);
    if (!reservationSuccess) {
      Alert.alert('Stok Yetersiz', 'Bu ürün için yeterli stok bulunmuyor.');
      return;
    }

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      const currentQuantity = idx >= 0 ? prev[idx].quantity : 0;
      const newQuantity = currentQuantity + quantity;
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 dakika
      
      let newItems;
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { 
          ...clone[idx], 
          quantity: newQuantity,
          reservedAt: now,
          expiresAt: expiresAt
        };
        newItems = clone;
      } else {
        newItems = [...prev, { 
          product, 
          quantity,
          reservedAt: now,
          expiresAt: expiresAt
        }];
      }
      
      // Firestore'a kaydet
      saveCartToFirestore(newItems);
      return newItems;
    });
  }

  async function remove(productId: string) {
    if (!user) {
      Alert.alert('Hata', 'Sepetten ürün çıkarmak için giriş yapmalısınız!');
      return;
    }

    setItems((prev) => {
      const itemToRemove = prev.find((i) => i.product.id === productId);
      if (itemToRemove) {
        // Stokları geri ekle (async)
        cancelStockReservation(productId, itemToRemove.quantity).then(() => {
          console.log('Stock returned to inventory for removed item');
        });
      }
      
      const newItems = prev.filter((i) => i.product.id !== productId);
      saveCartToFirestore(newItems);
      return newItems;
    });
  }

  function update(productId: string, quantity: number) {
    if (!user) {
      Alert.alert('Hata', 'Sepeti güncellemek için giriş yapmalısınız!');
      return;
    }

    if (quantity < 0) {
      Alert.alert('Hata', 'Miktar 0\'dan küçük olamaz!');
      return;
    }

    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      
      // Sepetteki ürünler için stok kontrolü yapma - zaten rezerve edilmiş
      if (quantity === 0) {
        // Ürünü sepetten çıkar
        const newItems = prev.filter((i) => i.product.id !== productId);
        saveCartToFirestore(newItems);
        return newItems;
      }
      
      const newItems = prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
      saveCartToFirestore(newItems);
      return newItems;
    });
  }

  async function clear() {
    // Sadece sepeti temizle, stokları geri ekleme (sipariş verildi)
    setItems([]);
    if (user) {
      saveCartToFirestore([]);
    }
  }

  // Sadece sepeti temizle (sipariş verildiğinde)
  async function clearAfterOrder() {
    setItems([]);
    if (user) {
      saveCartToFirestore([]);
    }
  }

  // Sepeti iptal et (stokları geri ekle)
  async function cancelCart() {
    // Tüm ürünlerin stoklarını geri ekle (async)
    await Promise.all(
      items.map(item => 
        cancelStockReservation(item.product.id, item.quantity)
      )
    );
    
    setItems([]);
    if (user) {
      saveCartToFirestore([]);
    }
  }

  // Süresi dolmuş ürünleri kontrol et
  async function checkExpiredItems() {
    const now = new Date();
    setItems((prev) => {
      const expiredItems = prev.filter(item => 
        item.expiresAt && new Date(item.expiresAt) < now
      );
      
      // Süresi dolmuş ürünleri sepetten çıkar
      const validItems = prev.filter(item => 
        !item.expiresAt || new Date(item.expiresAt) >= now
      );
      
      if (expiredItems.length > 0) {
        // Süresi dolmuş ürünlerin stoklarını geri ekle (async)
        Promise.all(
          expiredItems.map(item => 
            cancelStockReservation(item.product.id, item.quantity)
          )
        ).then(() => {
          console.log('Expired items stock returned to inventory');
        });
        
        Alert.alert(
          'Rezervasyon Süresi Doldu',
          `${expiredItems.length} ürünün rezervasyon süresi doldu ve sepetten çıkarıldı.`
        );
        saveCartToFirestore(validItems);
      }
      
      return validItems;
    });
  }

  // Her 30 saniyede bir süresi dolmuş ürünleri kontrol et
  useEffect(() => {
    const interval = setInterval(checkExpiredItems, 30000); // 30 saniye
    return () => clearInterval(interval);
  }, [items]);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items]);
  const value = useMemo(() => ({ items, add, remove, update, clear, clearAfterOrder, cancelCart, total, loading, checkExpiredItems }), [items, total, loading]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}