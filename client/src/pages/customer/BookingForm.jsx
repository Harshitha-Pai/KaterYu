import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function BookingForm() {
  const { catererId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ eventDate: '', eventType: '', guests: '', message: '' });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/bookings', { ...form, caterer: catererId });
      alert('Booking request sent successfully!');
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Book Catering Service</h2>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>Event Date</label>
        <input style={styles.input} type="date"
          value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} />
        <label style={styles.label}>Event Type</label>
        <input style={styles.input} placeholder="e.g. Wedding, Birthday, Corporate"
          value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })} />
        <label style={styles.label}>Number of Guests</label>
        <input style={styles.input} type="number" placeholder="e.g. 100"
          value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} />
        <label style={styles.label}>Message to Caterer</label>
        <textarea style={{ ...styles.input, height: 100, resize: 'vertical' }}
          placeholder="Any special requirements?"
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
        <button style={styles.button} onClick={handleSubmit}>Send Booking Request</button>
        <button style={styles.back} onClick={() => navigate('/browse')}>← Back</button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.1)', width: 420 },
  title: { marginBottom: 24, color: '#333' },
  label: { display: 'block', fontSize: 13, color: '#555', marginBottom: 4 },
  input: { width: '100%', padding: '10px 12px', marginBottom: 16, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' },
  button: { width: '100%', padding: 12, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  back: { width: '100%', padding: 10, background: 'transparent', color: '#4F46E5', border: '1px solid #4F46E5', borderRadius: 8, cursor: 'pointer' },
  error: { color: 'red', marginBottom: 12, fontSize: 13 }
};