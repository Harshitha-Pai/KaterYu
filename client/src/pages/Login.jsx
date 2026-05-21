import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login({ name: data.name, role: data.role, id: data.id }, data.token);
      navigate(data.role === 'caterer' ? '/dashboard' : '/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="auth-bg">
      <div style={styles.wrapper}>
        {/* Left panel */}
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.brand}>🍽 Kateryu</div>
            <h1 style={styles.heroTitle}>
              Exceptional catering,<br />effortlessly booked.
            </h1>
            <p style={styles.heroSub}>
              Connect with the finest caterers for your events. Weddings, corporate gatherings, celebrations — all in one place.
            </p>
            <div style={styles.pillRow}>
              {['Weddings', 'Corporate', 'Birthdays', 'Festivals'].map(t => (
                <span key={t} style={styles.pill}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={styles.formPanel} className="fade-up">
          <h2 style={styles.formTitle}>Welcome back</h2>
          <p style={styles.formSub}>Sign in to your account</p>

          {error && <div className="error-msg">{error}</div>}

          <div className="field">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKey} autoFocus />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKey} />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ marginTop: 8 }}>
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.switchLink}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex', borderRadius: 24,
    overflow: 'hidden', width: '100%', maxWidth: 880,
    boxShadow: '0 24px 80px rgba(28,25,23,0.18)',
    minHeight: 560,
  },
  hero: {
    flex: '1 1 55%',
    background: 'linear-gradient(145deg, #1C1917 0%, #3D2B1F 100%)',
    padding: 48, display: 'flex', alignItems: 'flex-end',
    position: 'relative', overflow: 'hidden',
  },
  heroInner: { position: 'relative', zIndex: 1 },
  brand: {
    fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700,
    color: '#C1440E', marginBottom: 32, letterSpacing: '-0.01em',
  },
  heroTitle: {
    fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700,
    color: '#FAF7F2', lineHeight: 1.25, marginBottom: 14, letterSpacing: '-0.02em',
  },
  heroSub: { fontSize: 14, color: 'rgba(250,247,242,0.60)', lineHeight: 1.7, marginBottom: 24 },
  pillRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  pill: {
    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
    background: 'rgba(193,68,14,0.25)', color: '#F9A87A', border: '1px solid rgba(193,68,14,0.35)',
  },
  formPanel: {
    flex: '1 1 45%', background: '#FFFFFF',
    padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  formTitle: { fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1C1917', marginBottom: 4 },
  formSub: { fontSize: 14, color: '#8C7B72', marginBottom: 28 },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8C7B72' },
  switchLink: { color: '#C1440E', fontWeight: 600, textDecoration: 'none' },
};