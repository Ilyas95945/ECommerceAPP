import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { getCardStyles, getInputStyles, getTableStyles, theme } from '../styles/theme';

type OrderItem = { id: string; quantity: number; product: { id: string; name: string } };
type Order = { 
  id: string; 
  status: string; 
  totalPrice: number; 
  createdAt: any; 
  items: OrderItem[];
  userId: string;
  userName: string;
  userEmail: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      await load();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }

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
          Sipariş Yönetimi
        </h1>
        <p style={{
          color: theme.colors.gray[600],
          fontSize: theme.typography.fontSize.md,
          margin: 0
        }}>
          Siparişleri takip edin ve durumlarını güncelleyin
        </p>
      </div>

      {/* Orders Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl
      }}>
        <div style={{
          ...getCardStyles(),
          padding: theme.spacing.lg,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>📋</div>
          <div style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.dark
          }}>
            {orders.length}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray[600]
          }}>
            Toplam Sipariş
          </div>
        </div>
        
        <div style={{
          ...getCardStyles(),
          padding: theme.spacing.lg,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>⏳</div>
          <div style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.warning
          }}>
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray[600]
          }}>
            Bekleyen
          </div>
        </div>
        
        <div style={{
          ...getCardStyles(),
          padding: theme.spacing.lg,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>🚚</div>
          <div style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.info
          }}>
            {orders.filter(o => o.status === 'shipped').length}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray[600]
          }}>
            Kargoda
          </div>
        </div>
        
        <div style={{
          ...getCardStyles(),
          padding: theme.spacing.lg,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>✅</div>
          <div style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.success
          }}>
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray[600]
          }}>
            Teslim Edildi
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div style={{
          ...getCardStyles(),
          padding: theme.spacing.xxl,
          textAlign: 'center',
          color: theme.colors.gray[500]
        }}>
          <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg }}>📋</div>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.gray[700],
            margin: `0 0 ${theme.spacing.sm} 0`
          }}>
            Henüz sipariş bulunmuyor
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.md,
            margin: 0,
            color: theme.colors.gray[500]
          }}>
            Müşteriler sipariş verdiğinde burada görünecek
          </p>
        </div>
      ) : (
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
              📋 Sipariş Listesi ({orders.length})
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={getTableStyles()}>
        <thead>
          <tr>
                  <th style={{ width: '100px' }}>Sipariş No</th>
                  <th>Müşteri</th>
                  <th style={{ width: '120px' }}>Durum</th>
                  <th style={{ width: '100px' }}>Tutar</th>
                  <th style={{ width: '140px' }}>Tarih</th>
                  <th>Ürünler</th>
                  <th style={{ width: '150px' }}>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
                    <td>
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.gray[600],
                        backgroundColor: theme.colors.gray[100],
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        borderRadius: theme.borderRadius.sm,
                        textAlign: 'center'
                      }}>
                        #{o.id.slice(-8)}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.dark,
                          marginBottom: theme.spacing.xs
                        }}>
                          {o.userName || 'N/A'}
                        </div>
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.gray[500]
                        }}>
                          {o.userEmail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        borderRadius: theme.borderRadius.sm,
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.medium,
                        backgroundColor: getStatusColor(o.status),
                        color: theme.colors.white,
                        display: 'inline-block'
                      }}>
                        {getStatusText(o.status)}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.success,
                        fontSize: theme.typography.fontSize.md
                      }}>
                        {o.totalPrice.toFixed(2)} ₺
                      </div>
                    </td>
                    <td>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.gray[600]
                      }}>
                        {o.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'N/A'}
                      </div>
                      <div style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.gray[500]
                      }}>
                        {o.createdAt?.toDate?.()?.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) || ''}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px' }}>
                        {o.items?.slice(0, 2).map((it, idx) => (
                          <div key={idx} style={{
                            fontSize: theme.typography.fontSize.sm,
                            marginBottom: theme.spacing.xs,
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <span style={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              marginRight: theme.spacing.sm
                            }}>
                              {it.product.name}
                            </span>
                            <span style={{
                              color: theme.colors.gray[500],
                              fontSize: theme.typography.fontSize.xs
                            }}>
                              x{it.quantity}
                            </span>
                          </div>
                        ))}
                        {o.items && o.items.length > 2 && (
                          <div style={{ 
                            color: theme.colors.gray[500],
                            fontSize: theme.typography.fontSize.xs,
                            fontStyle: 'italic'
                          }}>
                            +{o.items.length - 2} ürün daha
                          </div>
                        )}
                      </div>
              </td>
              <td>
                      <select 
                        defaultValue={o.status} 
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        style={{
                          ...getInputStyles(),
                          fontSize: theme.typography.fontSize.sm,
                          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                          minWidth: '120px'
                        }}
                      >
                        <option value="pending">⏳ Beklemede</option>
                        <option value="processing">⚙️ İşleniyor</option>
                        <option value="shipped">🚚 Kargoda</option>
                        <option value="delivered">✅ Teslim Edildi</option>
                        <option value="cancelled">❌ İptal</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#ffc107';
    case 'processing':
      return '#17a2b8';
    case 'shipped':
      return '#007bff';
    case 'delivered':
      return '#28a745';
    case 'cancelled':
      return '#dc3545';
    default:
      return '#6c757d';
  }
}

function getStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Beklemede';
    case 'processing':
      return 'İşleniyor';
    case 'shipped':
      return 'Kargoda';
    case 'delivered':
      return 'Teslim Edildi';
    case 'cancelled':
      return 'İptal';
    default:
      return status;
  }
}


