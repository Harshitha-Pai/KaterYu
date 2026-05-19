import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post('/auth/register', form);
      alert('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Full Name"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input style={styles.input} placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select style={styles.input} value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="customer">I want to hire a caterer</option>
          <option value="caterer">I am a caterer</option>
        </select>
        <button style={styles.button} onClick={handleSubmit}>Create Account</button>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: 360 },
  title: { marginBottom: 24, textAlign: 'center', color: '#333' },
  input: { width: '100%', padding: '10px 12px', marginBottom: 14, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' },
  button: { width: '100%', padding: 12, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' },
  error: { color: 'red', marginBottom: 12, fontSize: 13 },
  link: { textAlign: 'center', marginTop: 16, fontSize: 13 }
};