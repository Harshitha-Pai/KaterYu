import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function BookingForm() {
  const { catererId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ eventDate: '', eventType: '', guests: '', message: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async () => {
    if (!form.eventDate || !form.eventType || !form.guests)
      return setError('Please fill all required fields.');
    setLoading(true); setError('');
    try {
      await api.post('/bookings', { ...form, caterer: catererId });
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="auth-bg">
      <div style={bfStyles.card} className="fade-up">
        <button style={bfStyles.back} onClick={() => navigate('/browse')}>← Back to caterers</button>
        <h2 style={bfStyles.title}>Request a Booking</h2>
        <p style={bfStyles.sub}>Fill in your event details and send a request to the caterer.</p>
        <hr className="divider" />
        {error && <div className="error-msg">{error}</div>}
 
        <div style={bfStyles.grid}>
          <div className="field">
            <label>Event Date *</label>
            <input type="date" value={form.eventDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm({ ...form, eventDate: e.target.value })} />
          </div>
          <div className="field">
            <label>Number of Guests *</label>
            <input type="number" placeholder="e.g. 150" value={form.guests}
              onChange={e => setForm({ ...form, guests: e.target.value })} />
          </div>
        </div>
 
        <div className="field">
          <label>Event Type *</label>
          <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}>
            <option value="">Select event type…</option>
            {['Wedding', 'Birthday Party', 'Corporate Event', 'Festival', 'Engagement', 'Baby Shower', 'Anniversary', 'Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
 
        <div className="field">
          <label>Message to Caterer</label>
          <textarea placeholder="Any special requirements, dietary restrictions, themes…"
            value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        </div>
 
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Sending request…' : 'Send Booking Request →'}
        </button>
      </div>
    </div>
  );
}
 
const bfStyles = {
  card: { background: '#FFFFFF', borderRadius: 24, padding: 48, width: '100%', maxWidth: 540, boxShadow: '0 24px 80px rgba(28,25,23,0.14)' },
  back: { background: 'none', border: 'none', color: '#8C7B72', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 20 },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#1C1917', marginBottom: 6 },
  sub: { fontSize: 14, color: '#8C7B72', marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
};