import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const SC = {
  pending:   { bg: '#FEF3C7', color: '#B45309', dot: '#F59E0B' },
  confirmed: { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  declined:  { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
  completed: { bg: '#DBEAFE', color: '#1E40AF', dot: '#3B82F6' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = () => {
    api.get('/bookings/mine')
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const deleteBooking = async (id) => {
    if (!window.confirm('Cancel this booking request?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Could not delete booking');
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">🍽 <span>Kateryu</span></div>
        <div className="navbar-actions">
          <span className="navbar-user">Hi, {user?.name}</span>
          <button className="btn-ghost" onClick={() => navigate('/browse')}>Browse Caterers</button>
          <button className="btn-ghost" onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
        </div>
      </nav>

      <div className="content-narrow">
        <div className="section-header fade-up">
          <h2>My Bookings</h2>
          <p>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
        </div>

        {loading && <p style={{ color: '#8C7B72', textAlign: 'center', padding: 40 }}>Loading…</p>}

        {!loading && bookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📋</p>
            <p style={{ color: '#8C7B72', marginBottom: 20 }}>No bookings yet.</p>
            <button className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }}
              onClick={() => navigate('/browse')}>Browse Caterers →</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(b => {
            const s = SC[b.status] || SC.pending;
            return (
              <div key={b._id} className="card" style={styles.card}>
                {/* Header row */}
                <div style={styles.row}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.catName}>{b.caterer?.name || 'Caterer'}</h3>
                    <p style={styles.detail}>
                      📅 {new Date(b.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </p>
                    <p style={styles.detail}>🎉 {b.eventType} · 👥 {b.guests} guests</p>
                  </div>
                  <span style={{ ...styles.badge, background: s.bg, color: s.color }}>
                    <span style={{ ...styles.dot, background: s.dot }} />
                    {b.status}
                  </span>
                </div>

                {/* Status message */}
                {b.status === 'confirmed' && (
                  <div style={styles.infoBox('#D1FAE5', '#065F46')}>
                    ✅ Your booking has been confirmed by the caterer!
                  </div>
                )}
                {b.status === 'declined' && (
                  <div style={styles.infoBox('#FEE2E2', '#991B1B')}>
                    ❌ This booking was declined. You can browse other caterers.
                  </div>
                )}
                {b.status === 'completed' && (
                  <div style={styles.infoBox('#DBEAFE', '#1E40AF')}>
                    🎊 Event completed! Hope it went well.
                  </div>
                )}

                {b.message && b.message !== 'none' && (
                  <p style={styles.msg}>💬 {b.message}</p>
                )}

                {/* Delete button — only for pending */}
                {b.status === 'pending' && (
                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={styles.deleteBtn} onClick={() => deleteBooking(b._id)}>
                      🗑 Cancel Request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { padding: '20px 24px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 8 },
  catName: { fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 600, color: '#1C1917', marginBottom: 6 },
  detail: { fontSize: 13, color: '#8C7B72', marginBottom: 2 },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0, textTransform: 'capitalize' },
  dot: { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  msg: { fontSize: 13, color: '#5C4F49', background: '#FAF7F2', padding: '10px 14px', borderRadius: 8, marginTop: 8 },
  infoBox: (bg, color) => ({ background: bg, color, padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, marginTop: 8 }),
  deleteBtn: { background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};