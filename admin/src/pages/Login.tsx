import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Firestore'dan adminusers koleksiyonunda kullanıcıyı ara
      const usersRef = collection(db, 'adminusers');
      const q = query(
        usersRef,
        where('username', '==', username),
        where('password', '==', password),
        where('role', '==', 'admin'),
        where('isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        console.log('Firestore user data:', userData); // Debug için
        console.log('Permissions from Firestore:', userData.permissions); // Debug için

        const adminUser = {
          id: userDoc.id,
          username: userData.username,
          role: userData.role,
          permissions: userData.permissions || ["products", "orders", "users"] // Geçici çözüm
        };

        console.log('Admin user object:', adminUser); // Debug için
        login(adminUser);
        navigate('/products');
      } else {
        console.log('No user found with these credentials'); // Debug için
        setError('Kullanıcı adı veya şifre hatalı!');
      }
    } catch (err: any) {
      console.error('Login error:', err); // Debug için
      setError('Giriş sırasında hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: '64px auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>Admin Giriş</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}