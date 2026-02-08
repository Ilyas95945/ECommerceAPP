import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { getButtonStyles, getCardStyles, getInputStyles, getTableStyles, theme } from '../styles/theme';

type Product = { 
  id?: string; 
  name: string; 
  description: string; 
  price: number; 
  category: string; 
  imageUrls: string[]; 
  stock: number;
  createdAt?: any;
};

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({ name: '', description: '', price: 0, category: '', imageUrls: [], stock: 0 });
  // Yalnızca URL kullanılacak; dosya yükleme yok
  const [submitting, setSubmitting] = useState(false);
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`${label} zaman aşımına uğradı (${ms}ms)`)), ms);
      promise
        .then((v) => { clearTimeout(t); resolve(v); })
        .catch((e) => { clearTimeout(t); reject(e); });
    });
  }

  async function load() {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    setItems(products);
  }

  useEffect(() => {
    load();
  }, []);

  // Dosya yükleme kaldırıldı

  async function create() {
    try {
      if (submitting) return;
      setSubmitting(true);
      // Basit validasyonlar
      const name = (form.name || '').trim();
      const description = (form.description || '').trim();
      const category = (form.category || '').trim();
      const priceRaw = Number(form.price ?? 0);
      const stockRaw = Number(form.stock ?? 0);
      if (!Number.isFinite(priceRaw)) {
        alert('Fiyat geçerli bir sayı olmalıdır.');
        setSubmitting(false);
        return;
      }
      if (!Number.isFinite(stockRaw)) {
        alert('Stok geçerli bir sayı olmalıdır.');
        setSubmitting(false);
        return;
      }
      const price = Math.max(0, priceRaw);
      const stock = Math.max(0, stockRaw); // negatif stok engeli

      if (!name || !category) {
        alert('İsim ve kategori zorunludur.');
        setSubmitting(false);
        return;
      }
      if (price <= 0) {
        alert('Fiyat 0’dan büyük olmalıdır.');
        setSubmitting(false);
        return;
      }
      // Çoklu görsel URL kontrolü
      const imageUrls = (form.imageUrls || []).filter(url => url.trim()).map(url => url.trim());
      if (imageUrls.length === 0) {
        alert('En az bir görsel URL\'si girin.');
        setSubmitting(false);
        return;
      }
      if (imageUrls.some(url => !/^https?:\/\//i.test(url))) {
        alert('Tüm görsel URL\'leri geçerli olmalıdır (http/https).');
        setSubmitting(false);
        return;
      }
      
      console.log('[CREATE] Firestore kaydı oluşturuluyor...');
      const docRef = await withTimeout(addDoc(collection(db, 'products'), {
        name,
        description,
        category,
        price,
        stock,
        imageUrls,
        createdAt: new Date()
      }), 15000, 'Ürün kaydı');
      console.log('[CREATE] Firestore kaydı oluşturuldu:', docRef.id);
      if (docRef && docRef.id) {
        alert('Ürün başarıyla eklendi.');
      }
      
      setForm({ name: '', description: '', price: 0, category: '', imageUrls: [], stock: 0 });
      await load();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Ürün eklenirken bir hata oluştu. Konsolu kontrol edin.');
    }
    finally {
      setSubmitting(false);
    }
  }

  async function update(p: Product) {
    if (!p.id) return;
    try {
      // Clamp values
      const price = Math.max(0, Number(p.price));
      const stock = Math.max(0, Number(p.stock));
      const imageUrls = p.imageUrls || [];
      
      await updateDoc(doc(db, 'products', p.id), {
        ...p,
        price,
        stock,
        imageUrls
      });
      await load();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  async function remove(id: string) {
    try {
      await deleteDoc(doc(db, 'products', id));
      await load();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: theme.spacing.xl }}>
        <h1 style={{
          fontSize: theme.typography.fontSize.xxxl,
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.dark,
          margin: 0,
          marginBottom: theme.spacing.sm
        }}>
          Ürün Yönetimi
        </h1>
        <p style={{
          color: theme.colors.gray[600],
          fontSize: theme.typography.fontSize.md,
          margin: 0
        }}>
          Ürünlerinizi ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Add Product Form */}
      <div style={{
        ...getCardStyles(),
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.xl
      }}>
        <h2 style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.dark,
          margin: `0 0 ${theme.spacing.lg} 0`,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm
        }}>
          ➕ Yeni Ürün Ekle
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gap: theme.spacing.md,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray[700],
              marginBottom: theme.spacing.sm
            }}>
              Ürün Adı *
            </label>
            <input 
              placeholder="Ürün adını girin" 
              value={form.name || ''} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={getInputStyles()}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray[700],
              marginBottom: theme.spacing.sm
            }}>
              Kategori *
            </label>
            <input 
              placeholder="Kategori girin" 
              value={form.category || ''} 
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={getInputStyles()}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray[700],
              marginBottom: theme.spacing.sm
            }}>
              Fiyat (₺) *
            </label>
            <input 
              placeholder="0.00" 
              type="number" 
              min={0} 
              step="0.01" 
              value={form.price as number} 
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              style={getInputStyles()}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray[700],
              marginBottom: theme.spacing.sm
            }}>
              Stok Miktarı *
            </label>
            <input 
              placeholder="0" 
              type="number" 
              min={0} 
              step="1" 
              value={form.stock as number} 
              onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value)) })}
              style={getInputStyles()}
            />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray[700],
              marginBottom: theme.spacing.sm
            }}>
              Açıklama
            </label>
            <textarea 
              placeholder="Ürün açıklaması girin" 
              value={form.description || ''} 
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{
                ...getInputStyles(),
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray[700],
              marginBottom: theme.spacing.sm
            }}>
              Görsel URL'leri (Maksimum 10) *
            </label>
            <div style={{ marginBottom: theme.spacing.sm }}>
              {form.imageUrls?.map((url, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  gap: theme.spacing.sm, 
                  marginBottom: theme.spacing.sm,
                  alignItems: 'center'
                }}>
                  <input 
                    placeholder={`Görsel ${index + 1} URL`}
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...(form.imageUrls || [])];
                      newUrls[index] = e.target.value;
                      setForm({ ...form, imageUrls: newUrls });
                    }}
                    style={getInputStyles()}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newUrls = [...(form.imageUrls || [])];
                      newUrls.splice(index, 1);
                      setForm({ ...form, imageUrls: newUrls });
                    }}
                    style={{
                      ...getButtonStyles('danger'),
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                      fontSize: theme.typography.fontSize.sm
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if ((form.imageUrls?.length || 0) < 10) {
                  setForm({ 
                    ...form, 
                    imageUrls: [...(form.imageUrls || []), ''] 
                  });
                }
              }}
              disabled={(form.imageUrls?.length || 0) >= 10}
              style={{
                ...getButtonStyles('secondary'),
                opacity: (form.imageUrls?.length || 0) >= 10 ? 0.5 : 1,
                cursor: (form.imageUrls?.length || 0) >= 10 ? 'not-allowed' : 'pointer',
                marginBottom: theme.spacing.sm
              }}
            >
              ➕ Görsel Ekle ({(form.imageUrls?.length || 0)}/10)
            </button>
          </div>
        </div>
        
        <div style={{ 
          marginTop: theme.spacing.lg,
          display: 'flex',
          gap: theme.spacing.md,
          justifyContent: 'flex-end'
        }}>
          <button 
            onClick={create} 
            disabled={submitting}
            style={{
              ...getButtonStyles('primary'),
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? '⏳ Ekleniyor...' : '✅ Ürün Ekle'}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        ...getCardStyles(),
        padding: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray[200]}`,
          backgroundColor: theme.colors.gray[50]
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.dark,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            📦 Mevcut Ürünler ({items.length})
          </h2>
        </div>
        
        {items.length === 0 ? (
          <div style={{
            padding: theme.spacing.xxl,
            textAlign: 'center',
            color: theme.colors.gray[500]
          }}>
            <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>📦</div>
            <p style={{ fontSize: theme.typography.fontSize.lg, margin: 0 }}>
              Henüz ürün eklenmemiş
            </p>
            <p style={{ fontSize: theme.typography.fontSize.sm, margin: `${theme.spacing.sm} 0 0 0` }}>
              Yukarıdaki formu kullanarak ilk ürününüzü ekleyin
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={getTableStyles()}>
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Görsel</th>
                  <th>Ürün Bilgileri</th>
                  <th style={{ width: '120px' }}>Fiyat</th>
                  <th style={{ width: '100px' }}>Stok</th>
                  <th style={{ width: '150px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.gray[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {p.imageUrls && p.imageUrls.length > 0 ? (
                          <img 
                            src={p.imageUrls[0]} 
                            alt={p.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                              ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div style={{
                          display: (p.imageUrls && p.imageUrls.length > 0) ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          color: theme.colors.gray[400]
                        }}>
                          📦
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <input 
                          value={p.name} 
                          onChange={(e) => setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)))}
                          style={{
                            ...getInputStyles(),
                            fontWeight: theme.typography.fontWeight.semibold,
                            fontSize: theme.typography.fontSize.md,
                            border: 'none',
                            backgroundColor: 'transparent',
                            padding: '4px 8px',
                            marginBottom: theme.spacing.sm
                          }}
                        />
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.gray[500],
                          marginTop: theme.spacing.xs
                        }}>
                          ID: {p.id?.slice(-8)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={p.price} 
                        onChange={(e) => setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, price: Number(e.target.value) } : x)))}
                        style={{
                          ...getInputStyles(),
                          textAlign: 'right',
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.success,
                          border: 'none',
                          backgroundColor: 'transparent',
                          padding: '4px 8px'
                        }}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        value={p.stock} 
                        onChange={(e) => setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: Number(e.target.value) } : x)))}
                        style={{
                          ...getInputStyles(),
                          textAlign: 'center',
                          border: 'none',
                          backgroundColor: 'transparent',
                          padding: '4px 8px',
                          color: p.stock === 0 ? theme.colors.danger : theme.colors.gray[700]
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                        <button 
                          onClick={() => update(p)}
                          style={{
                            ...getButtonStyles('success'),
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            fontSize: theme.typography.fontSize.xs
                          }}
                        >
                          💾 Kaydet
                        </button>
                        <button 
                          onClick={() => remove(p.id!)}
                          style={{
                            ...getButtonStyles('danger'),
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            fontSize: theme.typography.fontSize.xs
                          }}
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


