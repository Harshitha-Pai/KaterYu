import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { data } = await api.post('/auth/login', form);
      login({ name: data.name, role: data.role }, data.token);
      navigate(data.role === 'caterer' ? '/dashboard' : '/browse');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} type="password" placeholder="Password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={styles.button} onClick={handleSubmit}>Login</button>
        <p style={styles.link}>No account? <Link to="/register">Register here</Link></p>
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