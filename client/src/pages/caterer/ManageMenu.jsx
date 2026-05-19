import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'main', isVeg: true });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/menus/mine').then(res => setItems(res.data)).catch(console.error);
  }, []);
  
  const addItem = async () => {
    try {
      const { data } = await api.post('/menus', form);
      setItems(prev => [...prev, data]);
      setForm({ name: '', description: '', price: '', category: 'main', isVeg: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add item');
    }
  };

  const deleteItem = async (id) => {
    await api.delete(`/menus/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={{ margin: 0 }}>🍽 Kateryu — Menu</h2>
        <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>
      <div style={styles.content}>
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>Add Menu Item</h3>
          <input style={styles.input} placeholder="Dish name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input style={styles.input} placeholder="Description"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input style={styles.input} type="number" placeholder="Price (₹)"
            value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <select style={styles.input} value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="starter">Starter</option>
            <option value="main">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
          </select>
          <label style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.isVeg}
              onChange={e => setForm({ ...form, isVeg: e.target.checked })} />
            Vegetarian
          </label>
          <button style={styles.button} onClick={addItem}>+ Add Item</button>
        </div>

        <div style={{ marginTop: 32 }}>
          <h3>Your Menu ({items.length} items)</h3>
          {items.map(item => (
            <div key={item._id} style={styles.itemCard}>
              <div>
                <span style={item.isVeg ? styles.veg : styles.nonveg}>{item.isVeg ? '🟢' : '🔴'}</span>
                <strong style={{ marginLeft: 8 }}>{item.name}</strong>
                <span style={styles.category}>{item.category}</span>
                <p style={styles.desc}>{item.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={styles.price}>₹{item.price}</p>
                <button style={styles.deleteBtn} onClick={() => deleteItem(item._id)}>Delete</button>
              </div>
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
  content: { maxWidth: 700, margin: '0 auto', padding: 32 },
  formCard: { background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '10px 12px', marginBottom: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' },
  button: { width: '100%', padding: 12, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', marginTop: 8 },
  itemCard: { background: '#fff', borderRadius: 10, padding: '16px 20px', marginBottom: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  category: { marginLeft: 8, fontSize: 11, background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: 10 },
  desc: { fontSize: 13, color: '#888', margin: '4px 0 0' },
  price: { fontWeight: 700, color: '#333', fontSize: 16 },
  deleteBtn: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 13 }
};