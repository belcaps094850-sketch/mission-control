import { useState } from 'react';
import { getIdeas, saveIdea, deleteIdea, IDEA_STATUSES, PRIORITIES } from '../utils/store';

const colMeta = {
  spark: { label: '💡 Spark', color: '#f39c12' },
  exploring: { label: '🔍 Exploring', color: '#3498db' },
  validated: { label: '✅ Validated', color: '#27ae60' },
  building: { label: '🚀 Building', color: '#9b59b6' },
};
const priorityColors = { critical: '#e74c3c', high: '#e67e22', medium: '#3498db', low: '#95a5a6' };

const s = {
  board: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', minHeight: '50vh' },
  col: { backgroundColor: '#fafafa', borderRadius: '6px', padding: '12px', border: '1px solid #ecf0f1' },
  colHeader: (color) => ({ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${color}` }),
  card: { border: '1px solid #ecf0f1', borderRadius: '5px', padding: '12px', marginBottom: '8px', backgroundColor: '#fff', cursor: 'pointer' },
  title: { fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' },
  desc: { fontSize: '13px', color: '#555', marginBottom: '6px', lineHeight: '1.4' },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#95a5a6' },
  badge: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: color }),
  vpToggle: { fontSize: '12px', color: '#3498db', cursor: 'pointer', marginTop: '6px', border: 'none', background: 'none', padding: 0 },
  vpBox: { marginTop: '8px', padding: '8px 10px', backgroundColor: '#f9f9f9', borderRadius: '4px', fontSize: '12px', lineHeight: '1.5' },
  vpLabel: { fontWeight: 'bold', color: '#2c3e50', fontSize: '11px', textTransform: 'uppercase', marginTop: '4px' },
  // Modal
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { backgroundColor: '#fff', borderRadius: '6px', padding: '24px', width: '480px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  field: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', fontWeight: 'bold' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  btnRow: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' },
  btnSave: { padding: '8px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  btnCancel: { padding: '8px 20px', backgroundColor: '#ecf0f1', color: '#555', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnDelete: { padding: '8px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: 'auto' },
  addBtn: { padding: '8px 16px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', marginBottom: '16px', cursor: 'pointer' },
};

const emptyIdea = { title: '', description: '', status: 'spark', priority: 'medium', valueProp: { problem: '', solution: '', audience: '', whyNow: '' } };

function IdeaCard({ idea, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const vp = idea.valueProp;
  const hasVP = vp && (vp.problem || vp.solution || vp.audience || vp.whyNow);
  const created = idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : '';

  return (
    <div style={s.card} onClick={() => onClick(idea)}>
      <div style={s.title}>{idea.title}</div>
      {idea.description && <div style={s.desc}>{idea.description}</div>}
      <div style={s.meta}>
        <span>{created}</span>
        <span style={s.badge(priorityColors[idea.priority] || '#95a5a6')}>{idea.priority}</span>
      </div>
      {hasVP && (
        <>
          <button style={s.vpToggle} onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}>
            {expanded ? '▾ Hide Value Prop' : '▸ Value Prop'}
          </button>
          {expanded && (
            <div style={s.vpBox} onClick={e => e.stopPropagation()}>
              {vp.problem && <><div style={s.vpLabel}>Problem</div><div>{vp.problem}</div></>}
              {vp.solution && <><div style={{ ...s.vpLabel, marginTop: '6px' }}>Solution</div><div>{vp.solution}</div></>}
              {vp.audience && <><div style={{ ...s.vpLabel, marginTop: '6px' }}>Audience</div><div>{vp.audience}</div></>}
              {vp.whyNow && <><div style={{ ...s.vpLabel, marginTop: '6px' }}>Why Now</div><div>{vp.whyNow}</div></>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Ideas() {
  const [ideas, setIdeas] = useState(getIdeas);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyIdea);
  const [dragId, setDragId] = useState(null);
  const refresh = () => setIdeas(getIdeas());

  const openModal = (idea) => {
    setForm(idea?.id ? { ...emptyIdea, ...idea, valueProp: { ...emptyIdea.valueProp, ...(idea.valueProp || {}) } } : { ...emptyIdea });
    setModal(idea?.id ? 'edit' : 'new');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    saveIdea(form);
    refresh();
    setModal(null);
  };

  const handleDelete = () => {
    if (form.id) { deleteIdea(form.id); refresh(); }
    setModal(null);
  };

  const handleDrop = (status) => (e) => {
    e.preventDefault();
    if (dragId) {
      const idea = ideas.find(i => i.id === dragId);
      if (idea) saveIdea({ ...idea, status });
      refresh();
      setDragId(null);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setVP = (k, v) => setForm(f => ({ ...f, valueProp: { ...f.valueProp, [k]: v } }));

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '6px' }}>💡 Ideas</h1>
      <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '16px' }}>Pipeline from spark to project</p>
      <button style={s.addBtn} onClick={() => openModal({})}>+ New Idea</button>

      <div style={s.board}>
        {IDEA_STATUSES.map(status => {
          const col = ideas.filter(i => i.status === status);
          const meta = colMeta[status];
          return (
            <div key={status} style={s.col} onDragOver={e => e.preventDefault()} onDrop={handleDrop(status)}>
              <div style={s.colHeader(meta.color)}>{meta.label} <span style={{ fontWeight: 'normal', fontSize: '12px', color: '#95a5a6' }}>({col.length})</span></div>
              {col.map(idea => (
                <div key={idea.id} draggable onDragStart={() => setDragId(idea.id)} onDragEnd={() => setDragId(null)}>
                  <IdeaCard idea={idea} onClick={openModal} />
                </div>
              ))}
              {col.length === 0 && <div style={{ textAlign: 'center', color: '#bdc3c7', fontSize: '13px', fontStyle: 'italic', padding: '20px' }}>Drop ideas here</div>}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <form style={s.modal} onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>{modal === 'edit' ? 'Edit Idea' : 'New Idea'}</h3>
            <div style={s.field}>
              <label style={s.label}>Title *</label>
              <input style={s.input} value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Description</label>
              <textarea style={{ ...s.input, height: '60px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={s.field}>
                <label style={s.label}>Status</label>
                <select style={s.input} value={form.status} onChange={e => set('status', e.target.value)}>
                  {IDEA_STATUSES.map(st => <option key={st} value={st}>{colMeta[st].label}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Priority</label>
                <select style={s.input} value={form.priority} onChange={e => set('priority', e.target.value)}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '12px', marginTop: '4px' }}>
              <div style={{ ...s.label, marginBottom: '8px' }}>Value Proposition</div>
              <div style={s.field}>
                <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Problem</label>
                <textarea style={{ ...s.input, height: '50px', resize: 'vertical' }} value={form.valueProp.problem} onChange={e => setVP('problem', e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Solution</label>
                <textarea style={{ ...s.input, height: '50px', resize: 'vertical' }} value={form.valueProp.solution} onChange={e => setVP('solution', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={s.field}>
                  <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Audience</label>
                  <input style={s.input} value={form.valueProp.audience} onChange={e => setVP('audience', e.target.value)} />
                </div>
                <div style={s.field}>
                  <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Why Now</label>
                  <input style={s.input} value={form.valueProp.whyNow} onChange={e => setVP('whyNow', e.target.value)} />
                </div>
              </div>
            </div>
            <div style={s.btnRow}>
              {modal === 'edit' && <button type="button" style={s.btnDelete} onClick={handleDelete}>Delete</button>}
              <button type="button" style={s.btnCancel} onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" style={s.btnSave}>Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
