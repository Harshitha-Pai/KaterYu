import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'main', isVeg: true });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    api.get('/menus/mine').then(res => setItems(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);
 
  const addItem = async () => {
    if (!form.name || !form.price) return alert('Name and price are required');
    try {
      const { data } = await api.post('/menus', form);
      setItems(prev => [...prev, data]);
      setForm({ name: '', description: '', price: '', category: 'main', isVeg: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add item');
    }
  };
 
  const deleteItem = async id => {
    if (!window.confirm('Delete this item?')) return;
    await api.delete(`/menus/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
  };
 
  const catOrder = ['starter', 'main', 'dessert', 'beverage'];
  const grouped = catOrder.reduce((acc, cat) => {
    const list = items.filter(i => i.category === cat);
    if (list.length) acc[cat] = list;
    return acc;
  }, {});
 
  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-brand">🍽 <span>Kateryu</span></div>
        <div className="navbar-actions">
          <button className="btn-ghost" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        </div>
      </nav>
 
      <div className="content" style={{ maxWidth: 900 }}>
        <div className="section-header fade-up">
          <h2>Manage Menu</h2>
          <p>{items.length} item{items.length !== 1 ? 's' : ''} on your menu</p>
        </div>
 
        <div style={mmStyles.layout}>
          {/* Add form */}
          <div className="card" style={mmStyles.formCard}>
            <h3 style={mmStyles.formTitle}>Add New Item</h3>
            <div className="field">
              <label>Dish Name *</label>
              <input placeholder="e.g. Paneer Butter Masala" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Description</label>
              <input placeholder="Brief description…" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Price (₹) *</label>
                <input type="number" placeholder="0" value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="starter">Starter</option>
                  <option value="main">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>
              </div>
            </div>
            <label style={mmStyles.vegToggle}>
              <input type="checkbox" checked={form.isVeg}
                onChange={e => setForm({ ...form, isVeg: e.target.checked })} />
              <span style={mmStyles.vegDot}>{form.isVeg ? '🟢' : '🔴'}</span>
              {form.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            </label>
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={addItem}>+ Add to Menu</button>
          </div>
 
          {/* Menu list */}
          <div style={{ flex: 1 }}>
            {loading && <p style={{ color: '#8C7B72', textAlign: 'center', padding: 40 }}>Loading…</p>}
            {!loading && items.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1px dashed #E8DDD5' }}>
                <p style={{ fontSize: 40 }}>🍽</p>
                <p style={{ color: '#8C7B72', marginTop: 8 }}>Your menu is empty. Add your first dish!</p>
              </div>
            )}
            {Object.entries(grouped).map(([cat, list]) => (
              <div key={cat} style={{ marginBottom: 24 }}>
                <h4 style={mmStyles.catHeader}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
                {list.map(item => (
                  <div key={item._id} className="card" style={mmStyles.itemCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{item.isVeg ? '🟢' : '🔴'}</span>
                      <div style={{ flex: 1 }}>
                        <p style={mmStyles.itemName}>{item.name}</p>
                        {item.description && <p style={mmStyles.itemDesc}>{item.description}</p>}
                      </div>
                      <span style={mmStyles.itemPrice}>₹{item.price}</span>
                      <button style={mmStyles.deleteBtn} onClick={() => deleteItem(item._id)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
const mmStyles = {
  layout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28, alignItems: 'start' },
  formCard: { padding: 28, position: 'sticky', top: 84 },
  formTitle: { fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600, color: '#1C1917', marginBottom: 20 },
  vegToggle: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#3D3530', marginTop: 4 },
  vegDot: { fontSize: 14 },
  catHeader: { fontSize: 11, fontWeight: 700, color: '#8C7B72', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 4 },
  itemCard: { padding: '14px 18px', marginBottom: 8 },
  itemName: { fontWeight: 600, fontSize: 14, color: '#1C1917', marginBottom: 2 },
  itemDesc: { fontSize: 12, color: '#8C7B72' },
  itemPrice: { fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 16, color: '#C1440E', minWidth: 60, textAlign: 'right' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: '0 4px', opacity: 0.6 },
};