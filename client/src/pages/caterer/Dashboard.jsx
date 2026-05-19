import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const statusColors = {
  pending:   { bg: '#FEF3C7', text: '#92400E' },
  confirmed: { bg: '#D1FAE5', text: '#065F46' },
  declined:  { bg: '#FEE2E2', text: '#991B1B' },
  completed: { bg: '#DBEAFE', text: '#1E40AF' }
};

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings/incoming').then(res => setBookings(res.data)).catch(console.error);
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={{ margin: 0 }}>🍽 Kateryu — Caterer</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>Hi, {user?.name}</span>
          <button style={styles.navBtn} onClick={() => navigate('/manage-menu')}>Manage Menu</button>
          <button style={styles.navBtn} onClick={() => navigate('/setup-profile')}>My Profile</button>
          <button style={styles.navBtn} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>
      <div style={styles.content}>
        <h3>Incoming Bookings</h3>
        {bookings.length === 0 && <p style={{ color: '#888' }}>No bookings yet.</p>}
        {bookings.map(b => {
          const sc = statusColors[b.status] || statusColors.pending;
          return (
            <div key={b._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h4 style={{ margin: 0 }}>{b.customer?.name} <span style={styles.email}>({b.customer?.email})</span></h4>
                <span style={{ ...styles.badge, background: sc.bg, color: sc.text }}>{b.status}</span>
              </div>
              <p style={styles.detail}>📅 {new Date(b.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              <p style={styles.detail}>🎉 {b.eventType} · {b.guests} guests</p>
              {b.message && <p style={styles.detail}>💬 {b.message}</p>}
              {b.status === 'pending' && (
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button style={styles.accept} onClick={() => updateStatus(b._id, 'confirmed')}>✓ Accept</button>
                  <button style={styles.decline} onClick={() => updateStatus(b._id, 'declined')}>✕ Decline</button>
                </div>
              )}
              {b.status === 'confirmed' && (
                <button style={{ ...styles.accept, marginTop: 14 }} onClick={() => updateStatus(b._id, 'completed')}>
                  Mark as Completed
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f9f9f9' },
  navbar: { background: '#4F46E5', color: '#fff', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' },
  content: { maxWidth: 750, margin: '0 auto', padding: 32 },
  card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  detail: { fontSize: 14, color: '#555', margin: '4px 0' },
  email: { fontWeight: 400, color: '#888', fontSize: 13 },
  accept: { padding: '8px 20px', background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' },
  decline: { padding: '8px 20px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }
};