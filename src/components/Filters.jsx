import { AGENTS, PRIORITIES } from '../utils/store';

const s = {
  bar: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' },
  select: { padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' },
  btn: { padding: '8px 16px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' },
};

export default function Filters({ filters, onChange, onAdd }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });
  return (
    <div style={s.bar}>
      <select style={s.select} value={filters.assignee || ''} onChange={e => set('assignee', e.target.value)}>
        <option value="">All Agents</option>
        {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      <select style={s.select} value={filters.priority || ''} onChange={e => set('priority', e.target.value)}>
        <option value="">All Priorities</option>
        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      {onAdd && <button style={s.btn} onClick={onAdd}>+ New Task</button>}
    </div>
  );
}
