import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', form);
      alert('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div style={styles.wrapper} className="fade-up">
        <div style={styles.header}>
          <div style={styles.brand}>🍽 Kateryu</div>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.sub}>Join thousands using Kateryu for their events</p>
        </div>

        {/* Role selector */}
        <div style={styles.roleRow}>
          {[
            { value: 'customer', icon: '🎉', label: 'I need a caterer', desc: 'Find & book catering services' },
            { value: 'caterer',  icon: '👨‍🍳', label: 'I am a caterer',  desc: 'List your services & get clients' },
          ].map(opt => (
            <div key={opt.value}
              style={{ ...styles.roleCard, ...(form.role === opt.value ? styles.roleCardActive : {}) }}
              onClick={() => setForm({ ...form, role: opt.value })}>
              <span style={styles.roleIcon}>{opt.icon}</span>
              <strong style={styles.roleLabel}>{opt.label}</strong>
              <span style={styles.roleDesc}>{opt.desc}</span>
              {form.role === opt.value && <span style={styles.roleCheck}>✓</span>}
            </div>
          ))}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div style={styles.grid}>
          <div className="field">
            <label>Full Name</label>
            <input placeholder="Your full name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Min. 6 characters"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account →'}
        </button>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#FFFFFF', borderRadius: 24, padding: 48,
    width: '100%', maxWidth: 560,
    boxShadow: '0 24px 80px rgba(28,25,23,0.14)',
  },
  header: { marginBottom: 28, textAlign: 'center' },
  brand: { fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#C1440E', marginBottom: 16 },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1C1917', marginBottom: 6 },
  sub: { fontSize: 14, color: '#8C7B72' },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
  roleCard: {
    padding: '16px 18px', borderRadius: 12, border: '1.5px solid #E8DDD5',
    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 3,
    position: 'relative', transition: 'border-color 0.2s, background 0.2s',
    background: '#FAF7F2',
  },
  roleCardActive: { borderColor: '#C1440E', background: '#FFF7F4' },
  roleIcon: { fontSize: 22, marginBottom: 4 },
  roleLabel: { fontSize: 14, fontWeight: 600, color: '#1C1917' },
  roleDesc: { fontSize: 12, color: '#8C7B72' },
  roleCheck: {
    position: 'absolute', top: 10, right: 12,
    background: '#C1440E', color: '#fff',
    borderRadius: '50%', width: 20, height: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700,
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#8C7B72' },
  link: { color: '#C1440E', fontWeight: 600, textDecoration: 'none' },
};