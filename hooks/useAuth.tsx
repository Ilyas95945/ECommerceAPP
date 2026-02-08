import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../firebaseConfig';
import { deleteItemAsync, getItemAsync, setItemAsync } from './storage';

type AppUser = { id: string; name: string; email: string; role: string } | null;
type AuthContextType = {
  user: AppUser;
  userProfile: { name: string; email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Firestore-only oturum: AsyncStorage'dan yükle
    const loadStoredUser = async () => {
      try {
        const stored = await getItemAsync('appUser');
        if (stored) {
          const parsed = JSON.parse(stored) as AppUser;
          setUser(parsed);
          if (parsed) {
            setUserProfile({ name: parsed.name, email: parsed.email, role: parsed.role });
          }
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        await deleteItemAsync('appUser');
      }
    };
    
    loadStoredUser();
  }, []);

  async function login(email: string, password: string) {
    // Firestore: users koleksiyonunda email+password eşleşmesini ara
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('E-posta veya şifre hatalı');
    const docSnap = snap.docs[0];
    const data = docSnap.data() as { name: string; email: string; role: string };
    const appUser = { id: docSnap.id, name: data.name, email: data.email, role: data.role };
    setUser(appUser);
    setUserProfile({ name: data.name, email: data.email, role: data.role });
    await setItemAsync('appUser', JSON.stringify(appUser));
  }

  async function register(name: string, email: string, password: string) {
    // Firestore: e-posta benzersiz mi kontrol et
    const usersRef = collection(db, 'users');
    const existsQ = query(usersRef, where('email', '==', email));
    const existsSnap = await getDocs(existsQ);
    if (!existsSnap.empty) throw new Error('Bu e-posta ile kayıt mevcut');

    const newDoc = await addDoc(usersRef, {
      name,
      email,
      password, // DİKKAT: Prod için hash kullanın
      role: 'user',
      createdAt: new Date()
    });

    const appUser = { id: newDoc.id, name, email, role: 'user' };
    setUser(appUser);
    setUserProfile({ name, email, role: 'user' });
    await setItemAsync('appUser', JSON.stringify(appUser));
  }

  async function logout() {
    await deleteItemAsync('appUser');
    setUser(null);
    setUserProfile(null);
  }

  const value = useMemo(() => ({ user, userProfile, login, register, logout }), [user, userProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


