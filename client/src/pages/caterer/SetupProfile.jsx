import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function SetupProfile() {
  const [form, setForm] = useState({
    bio: '', serviceArea: '', pricePerPlate: '', phone: '', cuisine: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/caterers/my-profile')
      .then(res => {
        const p = res.data;
        setForm({
          bio:           p.bio           || '',
          serviceArea:   p.serviceArea   || '',
          pricePerPlate: p.pricePerPlate || '',
          phone:         p.phone         || '',
          cuisine:       Array.isArray(p.cuisine) ? p.cuisine.join(', ') : ''
        });
      })
      .catch(() => {
        // no profile yet — fresh form, that's fine
      })
      .finally(() => {
        setLoading(false);   // ✅ always runs, even on 404
      });
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        pricePerPlate: Number(form.pricePerPlate),
        cuisine: form.cuisine.split(',').map(c => c.trim()).filter(Boolean)
      };
      await api.put('/caterers/profile', payload);
      alert('Profile saved!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Loading profile...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>My Caterer Profile</h2>

        <label style={styles.label}>Bio / About your service</label>
        <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }}
          placeholder="Tell customers about your catering service..."
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })} />

        <label style={styles.label}>Service Area</label>
        <input style={styles.input} placeholder="e.g. Bengaluru, HSR Layout"
          value={form.serviceArea}
          onChange={e => setForm({ ...form, serviceArea: e.target.value })} />

        <label style={styles.label}>Price per Plate (₹)</label>
        <input style={styles.input} type="number" placeholder="e.g. 350"
          value={form.pricePerPlate}
          onChange={e => setForm({ ...form, pricePerPlate: e.target.value })} />

        <label style={styles.label}>Phone Number</label>
        <input style={styles.input} placeholder="e.g. 9876543210"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })} />

        <label style={styles.label}>Cuisine Types (comma separated)</label>
        <input style={styles.input} placeholder="e.g. South Indian, Chinese, Continental"
          value={form.cuisine}
          onChange={e => setForm({ ...form, cuisine: e.target.value })} />

        <button style={{ ...styles.button, opacity: saving ? 0.7 : 1 }}
          onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>

        <button style={styles.back} onClick={() => navigate('/dashboard')}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const styles = {
  container:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card:       { background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: 440 },
  title:      { marginBottom: 20, color: '#333' },
  label:      { display: 'block', fontSize: 13, color: '#555', marginBottom: 4 },
  input:      { width: '100%', padding: '10px 12px', marginBottom: 14, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' },
  button:     { width: '100%', padding: 12, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  back:       { width: '100%', padding: 10, background: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }
};