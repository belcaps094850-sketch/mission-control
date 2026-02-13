import { useState } from 'react';
import { getTasks, saveTask, deleteTask, PRIORITIES } from '../utils/store';
import TaskModal from '../components/TaskModal';
import Filters from '../components/Filters';

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
const priorityColors = { critical: '#e74c3c', high: '#e67e22', medium: '#3498db', low: '#95a5a6' };
const agentEmoji = { Alec: '🤖', Atlas: '🔧', Sage: '🎯', Pixel: '🎨', Nova: '📊' };

const s = {
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#7f8c8d', borderBottom: '2px solid #ecf0f1', fontWeight: 'bold' },
  td: { padding: '10px 12px', fontSize: '14px', borderBottom: '1px solid #ecf0f1', cursor: 'pointer' },
  badge: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: color }),
  status: { display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', backgroundColor: '#ecf0f1', color: '#555' },
};

export default function Backlog() {
  const [tasks, setTasks] = useState(getTasks);
  const [filters, setFilters] = useState({});
  const [modal, setModal] = useState(null);
  const refresh = () => setTasks(getTasks());

  const filtered = tasks
    .filter(t => t.status === 'backlog')
    .filter(t => (!filters.assignee || t.assignee === filters.assignee) && (!filters.priority || t.priority === filters.priority))
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '16px' }}>📦 Backlog</h1>
      <Filters filters={filters} onChange={setFilters} onAdd={() => setModal({})} />

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Priority</th>
            <th style={s.th}>Title</th>
            <th style={s.th}>Assignee</th>
            <th style={s.th}>Due</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} onClick={() => setModal(t)} style={{ cursor: 'pointer' }}>
              <td style={s.td}><span style={s.badge(priorityColors[t.priority])}>{t.priority}</span></td>
              <td style={{ ...s.td, fontWeight: 'bold', color: '#2c3e50' }}>{t.title}</td>
              <td style={s.td}>{agentEmoji[t.assignee] || '👤'} {t.assignee || 'Unassigned'}</td>
              <td style={{ ...s.td, color: '#95a5a6', fontSize: '13px' }}>{t.dueDate || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <p style={{ color: '#95a5a6', fontStyle: 'italic', marginTop: '20px', textAlign: 'center' }}>No backlog items matching filters.</p>}
      {modal !== null && <TaskModal task={modal} onSave={f => { saveTask(f); refresh(); setModal(null); }} onDelete={id => { deleteTask(id); refresh(); setModal(null); }} onClose={() => setModal(null)} />}
    </div>
  );
}
