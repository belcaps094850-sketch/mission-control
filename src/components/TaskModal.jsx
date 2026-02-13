import { useState, useEffect } from 'react';
import { AGENTS, STATUSES, PRIORITIES } from '../utils/store';

const overlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 100,
};
const modal = {
  backgroundColor: '#fff', borderRadius: '6px', padding: '24px',
  width: '440px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
};
const field = { marginBottom: '14px' };
const label = { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', fontWeight: 'bold' };
const input = { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' };
const btnRow = { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' };
const btnSave = { padding: '8px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' };
const btnCancel = { padding: '8px 20px', backgroundColor: '#ecf0f1', color: '#555', border: 'none', borderRadius: '4px' };
const btnDelete = { padding: '8px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', marginRight: 'auto' };

const empty = { title: '', description: '', assignee: '', priority: 'medium', status: 'backlog', dueDate: '' };

export default function TaskModal({ task, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(empty);
  useEffect(() => { setForm(task ? { ...empty, ...task } : empty); }, [task]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = e => { e.preventDefault(); if (!form.title.trim()) return; onSave(form); };

  return (
    <div style={overlay} onClick={onClose}>
      <form style={modal} onClick={e => e.stopPropagation()} onSubmit={submit}>
        <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>{task?.id ? 'Edit Task' : 'New Task'}</h3>

        <div style={field}>
          <label style={label}>Title *</label>
          <input style={input} value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div style={field}>
          <label style={label}>Description</label>
          <textarea style={{ ...input, height: '70px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={field}>
            <label style={label}>Assignee</label>
            <select style={input} value={form.assignee} onChange={e => set('assignee', e.target.value)}>
              <option value="">Unassigned</option>
              {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={field}>
            <label style={label}>Priority</label>
            <select style={input} value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={field}>
            <label style={label}>Status</label>
            <select style={input} value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
            </select>
          </div>
          <div style={field}>
            <label style={label}>Due Date</label>
            <input style={input} type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </div>
        </div>

        <div style={btnRow}>
          {task?.id && <button type="button" style={btnDelete} onClick={() => onDelete(task.id)}>Delete</button>}
          <button type="button" style={btnCancel} onClick={onClose}>Cancel</button>
          <button type="submit" style={btnSave}>Save</button>
        </div>
      </form>
    </div>
  );
}
