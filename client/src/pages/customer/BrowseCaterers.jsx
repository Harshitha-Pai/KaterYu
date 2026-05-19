import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function BrowseCaterers() {
  const [caterers, setCaterers] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/caterers').then(res => setCaterers(res.data)).catch(console.error);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={{ margin: 0 }}>🍽 Kateryu</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>Hi, {user?.name}</span>
          <button style={styles.navBtn} onClick={() => navigate('/my-bookings')}>My Bookings</button>
          <button style={styles.navBtn} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>
      <div style={styles.content}>
        <h3>Available Caterers</h3>
        {caterers.length === 0 && <p style={{ color: '#888' }}>No caterers available yet.</p>}
        <div style={styles.grid}>
          {caterers.map(c => (
            <div key={c._id} style={styles.card}>
              <h3 style={styles.name}>{c.user?.name}</h3>
              <p style={styles.bio}>{c.bio || 'No bio provided'}</p>
              <div style={styles.tags}>
                {c.cuisine?.map(cu => <span key={cu} style={styles.tag}>{cu}</span>)}
              </div>
              <p style={styles.detail}>📍 {c.serviceArea || 'Location not set'}</p>
              <p style={styles.detail}>💰 ₹{c.pricePerPlate || '—'} per plate</p>
              <button style={styles.button} onClick={() => navigate(`/book/${c._id}`)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f9f9f9' },
  navbar: { background: '#4F46E5', color: '#fff', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' },
  content: { maxWidth: 1100, margin: '0 auto', padding: 32 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginTop: 16 },
  card: { background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  name: { margin: '0 0 8px', color: '#333' },
  bio: { color: '#666', fontSize: 14, marginBottom: 12 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { background: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: 20, fontSize: 12 },
  detail: { fontSize: 13, color: '#555', margin: '4px 0' },
  button: { width: '100%', marginTop: 16, padding: 10, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }
};