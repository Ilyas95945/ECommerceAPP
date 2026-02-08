import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { getCardStyles, getTableStyles, theme } from '../styles/theme';

type User = { 
  id: string; 
  name: string; 
  email: string; 
  createdAt: any; 
  role: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  async function load() {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    setUsers(usersData);
  }

  useEffect(() => {
    load();
  }, []);

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
          Kullanıcı Yönetimi
        </h1>
        <p style={{
          color: theme.colors.gray[600],
          fontSize: theme.typography.fontSize.md,
          margin: 0
        }}>
          Kayıtlı kullanıcıları görüntüleyin ve yönetin
        </p>
      </div>

      {/* Users Stats */}
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
          <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>👥</div>
          <div style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.dark
          }}>
            {users.length}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray[600]
          }}>
            Toplam Kullanıcı
          </div>
        </div>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div style={{
          ...getCardStyles(),
          padding: theme.spacing.xxl,
          textAlign: 'center',
          color: theme.colors.gray[500]
        }}>
          <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg }}>👥</div>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.gray[700],
            margin: `0 0 ${theme.spacing.sm} 0`
          }}>
            Henüz kullanıcı bulunmuyor
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.md,
            margin: 0,
            color: theme.colors.gray[500]
          }}>
            Kullanıcılar kayıt olduğunda burada görünecek
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
              👥 Kullanıcı Listesi ({users.length})
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={getTableStyles()}>
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Avatar</th>
                  <th>Kullanıcı Bilgileri</th>
                  <th style={{ width: '120px' }}>Rol</th>
                  <th style={{ width: '140px' }}>Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: theme.borderRadius.full,
                        backgroundColor: u.role === 'admin' ? theme.colors.danger : theme.colors.info,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.colors.white,
                        fontSize: theme.typography.fontSize.lg,
                        fontWeight: theme.typography.fontWeight.bold
                      }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.dark,
                          fontSize: theme.typography.fontSize.md,
                          marginBottom: theme.spacing.xs
                        }}>
                          {u.name}
                        </div>
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.gray[500],
                          marginBottom: theme.spacing.xs
                        }}>
                          {u.email}
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.gray[400],
                          backgroundColor: theme.colors.gray[100],
                          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                          borderRadius: theme.borderRadius.sm,
                          display: 'inline-block'
                        }}>
                          ID: {u.id.slice(-8)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        backgroundColor: u.role === 'admin' ? theme.colors.danger : theme.colors.gray[500],
                        color: theme.colors.white,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: theme.spacing.xs
                      }}>
                        {u.role === 'admin' ? '👑' : '👤'} {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.gray[600],
                        marginBottom: theme.spacing.xs
                      }}>
                        {u.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'N/A'}
                      </div>
                      <div style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.gray[500]
                      }}>
                        {u.createdAt?.toDate?.()?.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) || ''}
                      </div>
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


