// ── Dashboard.jsx ─────────────────────────────────────────────────────────────
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

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
 useEffect(() => {
  const fetch = () => {
    api.get('/bookings/incoming')
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  fetch();
  const interval = setInterval(fetch, 10000); // re-fetch every 10s
  return () => clearInterval(interval);
}, []);
 
  const updateStatus = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
  };
 
  const counts = {
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };
 
  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">🍽 <span>Kateryu</span></div>
        <div className="navbar-actions">
          <span className="navbar-user">Hi, {user?.name}</span>
          <button className="btn-ghost" onClick={() => navigate('/manage-menu')}>Menu</button>
          <button className="btn-ghost" onClick={() => navigate('/setup-profile')}>Profile</button>
          <button className="btn-ghost" onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
        </div>
      </nav>
 
      <div className="content-narrow">
        <div className="section-header fade-up">
          <h2>Dashboard</h2>
          <p>Manage your incoming booking requests</p>
        </div>
 
        {/* Summary cards */}
        <div style={dbStyles.summaryRow}>
          {[
            { label: 'Pending', count: counts.pending, color: '#B45309', bg: '#FEF3C7' },
            { label: 'Confirmed', count: counts.confirmed, color: '#065F46', bg: '#D1FAE5' },
            { label: 'Completed', count: counts.completed, color: '#1E40AF', bg: '#DBEAFE' },
          ].map(s => (
            <div key={s.label} style={{ ...dbStyles.summaryCard, background: s.bg }}>
              <span style={{ ...dbStyles.summaryN, color: s.color }}>{s.count}</span>
              <span style={{ ...dbStyles.summaryLabel, color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>
 
        {loading && <p style={{ color: '#8C7B72', textAlign: 'center', padding: 40 }}>Loading…</p>}
        {!loading && bookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>📭</p>
            <p style={{ color: '#8C7B72', marginBottom: 8 }}>No bookings yet.</p>
            <p style={{ fontSize: 13, color: '#B0A099' }}>Make sure your profile is set up so customers can find you.</p>
            <button className="btn-primary" style={{ width: 'auto', padding: '12px 28px', marginTop: 20 }}
              onClick={() => navigate('/setup-profile')}>Set up profile →</button>
          </div>
        )}
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(b => {
            const s = SC[b.status] || SC.pending;
            return (
              <div key={b._id} className="card" style={dbStyles.card}>
                <div style={dbStyles.cardHead}>
                  <div style={dbStyles.customerAvatar}>{b.customer?.name?.[0]?.toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={dbStyles.customerName}>{b.customer?.name}</h4>
                    <p style={dbStyles.customerEmail}>{b.customer?.email}</p>
                  </div>
                  <span style={{ ...mbStyles.badge, background: s.bg, color: s.color }}>
                    <span style={{ ...mbStyles.dot, background: s.dot }} />
                    {b.status}
                  </span>
                </div>
 
                <div style={dbStyles.detailGrid}>
                  <div style={dbStyles.detailItem}><span style={dbStyles.detailIcon}>📅</span><div><span style={dbStyles.detailLabel}>Date</span><span style={dbStyles.detailVal}>{new Date(b.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span></div></div>
                  <div style={dbStyles.detailItem}><span style={dbStyles.detailIcon}>🎉</span><div><span style={dbStyles.detailLabel}>Event</span><span style={dbStyles.detailVal}>{b.eventType}</span></div></div>
                  <div style={dbStyles.detailItem}><span style={dbStyles.detailIcon}>👥</span><div><span style={dbStyles.detailLabel}>Guests</span><span style={dbStyles.detailVal}>{b.guests}</span></div></div>
                </div>
 
                {b.message && <p style={mbStyles.msg}>💬 {b.message}</p>}
 
                {b.status === 'pending' && (
                  <div style={dbStyles.actions}>
                    <button style={dbStyles.acceptBtn} onClick={() => updateStatus(b._id, 'confirmed')}>✓ Accept</button>
                    <button style={dbStyles.declineBtn} onClick={() => updateStatus(b._id, 'declined')}>✕ Decline</button>
                  </div>
                )}
                {b.status === 'confirmed' && (
                  <button style={{ ...dbStyles.acceptBtn, marginTop: 14, width: '100%', justifyContent: 'center' }}
                    onClick={() => updateStatus(b._id, 'completed')}>
                    Mark as Completed ✓
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
 
const dbStyles = {
  summaryRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 },
  summaryCard: { borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 },
  summaryN: { fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700 },
  summaryLabel: { fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  card: { padding: '20px 24px' },
  cardHead: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  customerAvatar: {
    width: 40, height: 40, borderRadius: 10,
    background: 'linear-gradient(135deg, #C1440E, #E05C28)',
    color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  customerName: { fontSize: 15, fontWeight: 600, color: '#1C1917', marginBottom: 1 },
  customerEmail: { fontSize: 12, color: '#8C7B72' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 8 },
  detailItem: { display: 'flex', alignItems: 'flex-start', gap: 8, background: '#FAF7F2', borderRadius: 8, padding: '10px 12px' },
  detailIcon: { fontSize: 14, marginTop: 1 },
  detailLabel: { display: 'block', fontSize: 11, color: '#8C7B72', textTransform: 'uppercase', letterSpacing: '0.05em' },
  detailVal: { display: 'block', fontSize: 13, fontWeight: 600, color: '#1C1917', marginTop: 2 },
  actions: { display: 'flex', gap: 10, marginTop: 14 },
  acceptBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#10B981', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  declineBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};

const mbStyles = {
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0, textTransform: 'capitalize' },
  dot: { width: 6, height: 6, borderRadius: '50%', display: 'inline-block' },
  msg: { marginTop: 12, fontSize: 13, color: '#5C4F49', background: '#FAF7F2', padding: '10px 14px', borderRadius: 8 },
};