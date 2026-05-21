import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function BrowseCaterers() {
  const [caterers, setCaterers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/caterers')
      .then(res => setCaterers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = caterers.filter(c =>
    !search ||
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.cuisine?.some(cu => cu.toLowerCase().includes(search.toLowerCase())) ||
    c.serviceArea?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">🍽 <span>Kateryu</span></div>
        <div className="navbar-actions">
          <span className="navbar-user">Hi, {user?.name}</span>
          <button className="btn-ghost" onClick={() => navigate('/my-bookings')}>My Bookings</button>
          <button className="btn-ghost" onClick={() => { logout(); navigate('/login'); }}>Sign out</button>
        </div>
      </nav>

      <div className="content">
        {/* Hero strip */}
        <div style={styles.heroStrip} className="fade-up">
          <div>
            <h2 style={styles.heroTitle}>Find Your Perfect Caterer</h2>
            <p style={styles.heroSub}>Browse verified caterers for every occasion</p>
          </div>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input style={styles.searchInput} placeholder="Search by name, cuisine or city…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { n: caterers.length, label: 'Caterers available' },
            { n: '⭐ 4.8', label: 'Avg. rating' },
            { n: '24h', label: 'Avg. response time' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <span style={styles.statN}>{s.n}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        {loading && <p style={{ color: '#8C7B72', textAlign: 'center', padding: 60 }}>Loading caterers…</p>}
        {!loading && filtered.length === 0 && (
          <div style={styles.empty}>
            <p style={{ fontSize: 40 }}>🍽</p>
            <p style={{ color: '#8C7B72' }}>{search ? 'No caterers match your search.' : 'No caterers listed yet.'}</p>
          </div>
        )}
        <div style={styles.grid}>
          {filtered.map((c, i) => (
            <div key={c._id} className="card" style={{ ...styles.catCard, animationDelay: `${i * 0.05}s` }}>
              <div style={styles.cardTop}>
                <div style={styles.avatar}>
                  {c.user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.catName}>{c.user?.name}</h3>
                  <p style={styles.catArea}>📍 {c.serviceArea || 'Location not set'}</p>
                </div>
                <div style={styles.priceTag}>
                  <span style={styles.priceNum}>₹{c.pricePerPlate || '—'}</span>
                  <span style={styles.priceSub}>/plate</span>
                </div>
              </div>

              {c.bio && <p style={styles.catBio}>{c.bio}</p>}

              <div style={styles.tagRow}>
                {c.cuisine?.slice(0, 4).map(cu => (
                  <span key={cu} className="tag">{cu}</span>
                ))}
              </div>

              <button className="btn-primary" style={{ marginTop: 16 }}
                onClick={() => navigate(`/book/${c._id}`)}>
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
  heroStrip: {
    background: 'linear-gradient(135deg, #1C1917 0%, #3D2B1F 100%)',
    borderRadius: 20, padding: '36px 40px', marginBottom: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
    flexWrap: 'wrap',
  },
  heroTitle: { fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#FAF7F2', marginBottom: 4 },
  heroSub: { fontSize: 14, color: 'rgba(250,247,242,0.60)' },
  searchWrap: {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.10)', borderRadius: 10,
    padding: '0 16px', gap: 10, minWidth: 300, flex: '0 0 auto',
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    background: 'transparent', border: 'none', outline: 'none',
    color: '#FAF7F2', fontSize: 14, padding: '12px 0', width: '100%',
    fontFamily: 'DM Sans, sans-serif',
  },
  statsRow: { display: 'flex', gap: 16, marginBottom: 32 },
  statCard: {
    flex: 1, background: '#FFFFFF', borderRadius: 12, padding: '16px 20px',
    border: '1px solid #E8DDD5', display: 'flex', flexDirection: 'column', gap: 3,
  },
  statN: { fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#1C1917' },
  statLabel: { fontSize: 12, color: '#8C7B72' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20,
  },
  catCard: { padding: 24, animation: 'fadeUp 0.4s ease both' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  avatar: {
    width: 48, height: 48, borderRadius: 14,
    background: 'linear-gradient(135deg, #C1440E, #E05C28)',
    color: '#fff', fontFamily: 'Playfair Display, serif',
    fontSize: 20, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  catName: { fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 600, color: '#1C1917', marginBottom: 2 },
  catArea: { fontSize: 13, color: '#8C7B72' },
  priceTag: { textAlign: 'right', flexShrink: 0 },
  priceNum: { fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#C1440E', display: 'block' },
  priceSub: { fontSize: 11, color: '#8C7B72' },
  catBio: { fontSize: 13, color: '#5C4F49', lineHeight: 1.6, marginBottom: 12 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  empty: { textAlign: 'center', padding: 80 },
};