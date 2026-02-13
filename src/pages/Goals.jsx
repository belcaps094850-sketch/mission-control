import { useState } from 'react';
import { getGoals, saveGoal, deleteGoal } from '../utils/store';

const s = {
  card: { border: '1px solid #ecf0f1', borderRadius: '6px', padding: '16px', marginBottom: '12px', backgroundColor: '#fff' },
  title: { fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' },
  desc: { fontSize: '13px', color: '#7f8c8d', marginBottom: '10px' },
  barOuter: { height: '8px', backgroundColor: '#ecf0f1', borderRadius: '4px', overflow: 'hidden' },
  barInner: (pct) => ({ height: '100%', width: `${pct}%`, backgroundColor: pct >= 100 ? '#27ae60' : '#3498db', borderRadius: '4px', transition: 'width 0.3s' }),
  pct: { fontSize: '12px', color: '#95a5a6', marginTop: '4px' },
  actions: { display: 'flex', gap: '8px', marginTop: '10px' },
  btn: { padding: '4px 12px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' },
  btnDel: { padding: '4px 12px', fontSize: '12px', border: 'none', borderRadius: '4px', backgroundColor: '#e74c3c', color: '#fff', cursor: 'pointer' },
  input: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '8px' },
  addBtn: { padding: '8px 16px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', marginBottom: '20px' },
};

export default function Goals() {
  const [goals, setGoals] = useState(getGoals);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', progress: 0 });

  const refresh = () => setGoals(getGoals());

  const handleAdd = () => {
    if (!form.title.trim()) return;
    saveGoal(form);
    refresh();
    setForm({ title: '', description: '', progress: 0 });
    setAdding(false);
  };

  const updateProgress = (goal, delta) => {
    const p = Math.max(0, Math.min(100, (goal.progress || 0) + delta));
    saveGoal({ ...goal, progress: p });
    refresh();
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '16px' }}>🎯 Goals</h1>
      <button style={s.addBtn} onClick={() => setAdding(!adding)}>+ New Goal</button>

      {adding && (
        <div style={{ ...s.card, marginBottom: '20px' }}>
          <input style={s.input} placeholder="Goal title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input style={s.input} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...s.addBtn, marginBottom: 0 }} onClick={handleAdd}>Save</button>
            <button style={{ ...s.btn }} onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      {goals.map(g => (
        <div key={g.id} style={s.card}>
          <div style={s.title}>{g.title}</div>
          <div style={s.desc}>{g.description}</div>
          <div style={s.barOuter}><div style={s.barInner(g.progress || 0)} /></div>
          <div style={s.pct}>{g.progress || 0}% complete</div>
          <div style={s.actions}>
            <button style={s.btn} onClick={() => updateProgress(g, -10)}>−10%</button>
            <button style={s.btn} onClick={() => updateProgress(g, 10)}>+10%</button>
            <button style={s.btnDel} onClick={() => { deleteGoal(g.id); refresh(); }}>Delete</button>
          </div>
        </div>
      ))}

      {goals.length === 0 && <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>No goals yet. Add one above.</p>}
    </div>
  );
}
