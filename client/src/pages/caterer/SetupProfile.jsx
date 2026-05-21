import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function SetupProfile() {
  const [form, setForm] = useState({ bio: '', serviceArea: '', pricePerPlate: '', phone: '', cuisine: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    api.get('/caterers/my-profile')
      .then(res => {
        const p = res.data;
        setForm({
          bio: p.bio || '', serviceArea: p.serviceArea || '',
          pricePerPlate: p.pricePerPlate || '', phone: p.phone || '',
          cuisine: Array.isArray(p.cuisine) ? p.cuisine.join(', ') : '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = { ...form, pricePerPlate: Number(form.pricePerPlate), cuisine: form.cuisine.split(',').map(c => c.trim()).filter(Boolean) };
      await api.put('/caterers/profile', payload);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };
 
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8C7B72' }}>Loading profile…</p>
    </div>
  );
 
  return (
    <div className="auth-bg">
      <div style={spStyles.card} className="fade-up">
        <button style={bfStyles.back} onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
        <h2 style={spStyles.title}>Caterer Profile</h2>
        <p style={spStyles.sub}>This is what customers see when they browse caterers.</p>
        <hr className="divider" />
 
        <div className="field">
          <label>About Your Service</label>
          <textarea placeholder="Describe your catering style, specialties, experience…"
            style={{ minHeight: 100 }} value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })} />
        </div>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Service Area</label>
            <input placeholder="e.g. Bengaluru" value={form.serviceArea}
              onChange={e => setForm({ ...form, serviceArea: e.target.value })} />
          </div>
          <div className="field">
            <label>Price per Plate (₹)</label>
            <input type="number" placeholder="350" value={form.pricePerPlate}
              onChange={e => setForm({ ...form, pricePerPlate: e.target.value })} />
          </div>
        </div>
 
        <div className="field">
          <label>Phone Number</label>
          <input placeholder="e.g. 9876543210" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
 
        <div className="field">
          <label>Cuisine Types (comma separated)</label>
          <input placeholder="e.g. South Indian, Mughlai, Continental" value={form.cuisine}
            onChange={e => setForm({ ...form, cuisine: e.target.value })} />
        </div>
 
        {form.cuisine && (
          <div style={spStyles.tagPreview}>
            {form.cuisine.split(',').map(c => c.trim()).filter(Boolean).map(c => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>
        )}
 
        <button className="btn-primary" onClick={handleSubmit} disabled={saving}
          style={{ marginTop: 8 }}>
          {saving ? 'Saving…' : 'Save Profile →'}
        </button>
      </div>
    </div>
  );
}
 
const spStyles = {
  card: { background: '#FFFFFF', borderRadius: 24, padding: 48, width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(28,25,23,0.14)' },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1C1917', marginBottom: 6 },
  sub: { fontSize: 14, color: '#8C7B72', marginBottom: 20 },
  tagPreview: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
};
const bfStyles = {
  back: { background: 'none', border: 'none', color: '#8C7B72', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 20 },
};