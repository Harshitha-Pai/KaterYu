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

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings/mine').then(res => setBookings(res.data)).catch(console.error);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={{ margin: 0 }}>🍽 Kateryu</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span>Hi, {user?.name}</span>
          <button style={styles.navBtn} onClick={() => navigate('/browse')}>Browse Caterers</button>
          <button style={styles.navBtn} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>
      <div style={styles.content}>
        <h3>My Bookings</h3>
        {bookings.length === 0 && <p style={{ color: '#888' }}>No bookings yet. <span style={{ color: '#4F46E5', cursor: 'pointer' }} onClick={() => navigate('/browse')}>Browse caterers →</span></p>}
        {bookings.map(b => {
          const sc = statusColors[b.status] || statusColors.pending;
          return (
            <div key={b._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h4 style={{ margin: 0 }}>{b.caterer?.name}</h4>
                <span style={{ ...styles.badge, background: sc.bg, color: sc.text }}>{b.status}</span>
              </div>
              <p style={styles.detail}>📅 {new Date(b.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              <p style={styles.detail}>🎉 {b.eventType} · {b.guests} guests</p>
              {b.message && <p style={styles.detail}>💬 {b.message}</p>}
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
  content: { maxWidth: 700, margin: '0 auto', padding: 32 },
  card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  detail: { fontSize: 14, color: '#555', margin: '4px 0' }
};