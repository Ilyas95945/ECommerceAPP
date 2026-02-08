import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { getCardStyles, getTableStyles, theme } from '../styles/theme';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  type: 'complaint' | 'suggestion' | 'question' | 'other';
  message: string;
  createdAt: Timestamp;
  status: 'new' | 'read' | 'replied';
};

const typeLabels = {
  complaint: 'Şikayet',
  suggestion: 'Öneri',
  question: 'Soru',
  other: 'Diğer'
};

const typeIcons = {
  complaint: '😠',
  suggestion: '💡',
  question: '❓',
  other: '📝'
};

const statusLabels = {
  new: 'Yeni',
  read: 'Okundu',
  replied: 'Yanıtlandı'
};

const statusColors = {
  new: theme.colors.danger,
  read: theme.colors.warning,
  replied: theme.colors.success
};

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);
      setError(null);
      
      const messagesRef = collection(db, 'contact_messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
      
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading contact messages:', error);
      setError('Mesajlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: theme.spacing.md
      }}>
        <div style={{ fontSize: '32px' }}>⏳</div>
        <div style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.gray[600]
        }}>
          Mesajlar yükleniyor...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: theme.spacing.md
      }}>
        <div style={{ fontSize: '32px' }}>❌</div>
        <div style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.danger
        }}>
          {error}
        </div>
        <button
          onClick={loadMessages}
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            border: 'none',
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            fontSize: theme.typography.fontSize.md
          }}
        >
          🔄 Tekrar Dene
        </button>
      </div>
    );
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
          📧 Kullanıcı Mesajları
        </h1>
        <p style={{
          color: theme.colors.gray[600],
          fontSize: theme.typography.fontSize.md,
          margin: 0
        }}>
          Kullanıcılardan gelen şikayet, öneri ve sorular
        </p>
      </div>

      {/* Messages Stats */}
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
          <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>📧</div>
          <div style={{
            fontSize: theme.typography.fontSize.xxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.dark
          }}>
            {messages.length}
          </div>
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.gray[600]
          }}>
            Toplam Mesaj
          </div>
        </div>
        
      </div>

      {/* Messages Table */}
      {messages.length === 0 ? (
        <div style={{
          ...getCardStyles(),
          padding: theme.spacing.xxl,
          textAlign: 'center',
          color: theme.colors.gray[500]
        }}>
          <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg }}>📧</div>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.gray[700],
            margin: `0 0 ${theme.spacing.sm} 0`
          }}>
            Henüz mesaj bulunmuyor
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.md,
            margin: 0,
            color: theme.colors.gray[500]
          }}>
            Kullanıcılar iletişim formu ile mesaj gönderdiğinde burada görünecek
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
              📧 Mesaj Listesi ({messages.length})
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={getTableStyles()}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Tür</th>
                  <th>Gönderen</th>
                  <th style={{ width: '200px' }}>Mesaj</th>
                  <th style={{ width: '100px' }}>Durum</th>
                  <th style={{ width: '140px' }}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: theme.typography.fontSize.lg
                      }}>
                        {typeIcons[message.type]}
                      </div>
                      <div style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.gray[500],
                        textAlign: 'center',
                        marginTop: theme.spacing.xs
                      }}>
                        {typeLabels[message.type]}
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
                          {message.name}
                        </div>
                        <div style={{
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.gray[500],
                          marginBottom: theme.spacing.xs
                        }}>
                          {message.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.gray[700],
                        lineHeight: 1.4,
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {message.message}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        backgroundColor: statusColors[message.status] + '20',
                        color: statusColors[message.status],
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: theme.spacing.xs
                      }}>
                        {message.status === 'new' && '🆕'}
                        {message.status === 'read' && '👁️'}
                        {message.status === 'replied' && '✅'}
                        {statusLabels[message.status]}
                      </span>
                    </td>
                    <td>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.gray[600],
                        marginBottom: theme.spacing.xs
                      }}>
                        {message.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'N/A'}
                      </div>
                      <div style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.gray[500]
                      }}>
                        {message.createdAt?.toDate?.()?.toLocaleTimeString('tr-TR', { 
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
