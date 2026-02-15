import { useState } from 'react';
import { getProblems, saveProblem, deleteProblem, PROBLEM_STATUSES, PRIORITIES, AGENTS } from '../utils/store';

const colMeta = {
  open: { label: '🔴 Open', color: '#e74c3c' },
  analyzing: { label: '🔍 Analyzing', color: '#e67e22' },
  'solution-found': { label: '💡 Solution Found', color: '#27ae60' },
  resolved: { label: '✅ Resolved', color: '#95a5a6' },
};
const scopeColors = { 'quick-fix': '#27ae60', analysis: '#e67e22', 'deep-dive': '#e74c3c' };
const priorityColors = { critical: '#e74c3c', high: '#e67e22', medium: '#3498db', low: '#95a5a6' };
const agentEmoji = { Alec: '🤖', Atlas: '🔧', Sage: '🎯', Pixel: '🎨', Nova: '📊', Mentor: '🎓', Conductor: '🎼', Scout: '🔭', Radar: '📡', Scribe: '📝', Sentinel: '🛡️', Broker: '💼' };

const SCOPES = ['quick-fix', 'analysis', 'deep-dive'];

const s = {
  board: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', minHeight: '50vh' },
  col: { backgroundColor: '#fafafa', borderRadius: '6px', padding: '12px', border: '1px solid #ecf0f1' },
  colHeader: (color) => ({ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${color}` }),
  card: { border: '1px solid #ecf0f1', borderRadius: '5px', padding: '12px', marginBottom: '8px', backgroundColor: '#fff', cursor: 'pointer' },
  title: { fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' },
  desc: { fontSize: '13px', color: '#555', marginBottom: '6px', lineHeight: '1.4' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#95a5a6' },
  badge: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: color }),
  toggle: { fontSize: '12px', color: '#3498db', cursor: 'pointer', marginTop: '6px', border: 'none', background: 'none', padding: 0 },
  analysisBox: { marginTop: '8px', padding: '8px 10px', backgroundColor: '#f9f9f9', borderRadius: '4px', fontSize: '12px', lineHeight: '1.5' },
  aLabel: { fontWeight: 'bold', color: '#2c3e50', fontSize: '11px', textTransform: 'uppercase', marginTop: '4px' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { backgroundColor: '#fff', borderRadius: '6px', padding: '24px', width: '500px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' },
  field: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', fontWeight: 'bold' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  btnRow: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' },
  btnSave: { padding: '8px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  btnCancel: { padding: '8px 20px', backgroundColor: '#ecf0f1', color: '#555', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnDelete: { padding: '8px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: 'auto' },
  addBtn: { padding: '8px 16px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px', marginBottom: '16px', cursor: 'pointer' },
};

const emptyProblem = { title: '', description: '', status: 'open', scope: 'analysis', assignee: '', priority: 'medium', analysis: { rootCause: '', impact: '', solution: '', nextSteps: '' } };

function ProblemCard({ problem, onClick }) {
  const [expanded, setExpanded] = useState(false);
  const a = problem.analysis;
  const hasAnalysis = a && (a.rootCause || a.impact || a.solution || a.nextSteps);
  const created = problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : '';

  return (
    <div style={s.card} onClick={() => onClick(problem)}>
      <div style={s.title}>{problem.title}</div>
      {problem.description && <div style={s.desc}>{problem.description}</div>}
      <div style={s.meta}>
        <span style={s.badge(scopeColors[problem.scope] || '#95a5a6')}>{problem.scope}</span>
        <span style={s.badge(priorityColors[problem.priority] || '#95a5a6')}>{problem.priority}</span>
        {problem.assignee && <span>{agentEmoji[problem.assignee] || '👤'} {problem.assignee}</span>}
        <span>{created}</span>
      </div>
      {hasAnalysis && (
        <>
          <button style={s.toggle} onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}>
            {expanded ? '▾ Hide Analysis' : '▸ Analysis'}
          </button>
          {expanded && (
            <div style={s.analysisBox} onClick={e => e.stopPropagation()}>
              {a.rootCause && <><div style={s.aLabel}>Root Cause</div><div>{a.rootCause}</div></>}
              {a.impact && <><div style={{ ...s.aLabel, marginTop: '6px' }}>Impact</div><div>{a.impact}</div></>}
              {a.solution && <><div style={{ ...s.aLabel, marginTop: '6px' }}>Proposed Solution</div><div>{a.solution}</div></>}
              {a.nextSteps && <><div style={{ ...s.aLabel, marginTop: '6px' }}>Next Steps</div><div>{a.nextSteps}</div></>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Problems() {
  const [problems, setProblems] = useState(getProblems);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyProblem);
  const [dragId, setDragId] = useState(null);
  const refresh = () => setProblems(getProblems());

  const openModal = (p) => {
    setForm(p?.id ? { ...emptyProblem, ...p, analysis: { ...emptyProblem.analysis, ...(p.analysis || {}) } } : { ...emptyProblem });
    setModal(p?.id ? 'edit' : 'new');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    saveProblem(form);
    refresh();
    setModal(null);
  };

  const handleDelete = () => {
    if (form.id) { deleteProblem(form.id); refresh(); }
    setModal(null);
  };

  const handleDrop = (status) => (e) => {
    e.preventDefault();
    if (dragId) {
      const p = problems.find(i => i.id === dragId);
      if (p) saveProblem({ ...p, status });
      refresh();
      setDragId(null);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setA = (k, v) => setForm(f => ({ ...f, analysis: { ...f.analysis, [k]: v } }));

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '6px' }}>🔴 Problems</h1>
      <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '16px' }}>Track issues from discovery to resolution</p>
      <button style={s.addBtn} onClick={() => openModal({})}>+ New Problem</button>

      <div style={s.board}>
        {PROBLEM_STATUSES.map(status => {
          const col = problems.filter(p => p.status === status);
          const meta = colMeta[status];
          return (
            <div key={status} style={s.col} onDragOver={e => e.preventDefault()} onDrop={handleDrop(status)}>
              <div style={s.colHeader(meta.color)}>{meta.label} <span style={{ fontWeight: 'normal', fontSize: '12px', color: '#95a5a6' }}>({col.length})</span></div>
              {col.map(p => (
                <div key={p.id} draggable onDragStart={() => setDragId(p.id)} onDragEnd={() => setDragId(null)}>
                  <ProblemCard problem={p} onClick={openModal} />
                </div>
              ))}
              {col.length === 0 && <div style={{ textAlign: 'center', color: '#bdc3c7', fontSize: '13px', fontStyle: 'italic', padding: '20px' }}>Drop problems here</div>}
            </div>
          );
        })}
      </div>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <form style={s.modal} onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <h3 style={{ marginBottom: '16px', color: '#2c3e50' }}>{modal === 'edit' ? 'Edit Problem' : 'New Problem'}</h3>
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
                  {PROBLEM_STATUSES.map(st => <option key={st} value={st}>{colMeta[st].label}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Scope</label>
                <select style={s.input} value={form.scope} onChange={e => set('scope', e.target.value)}>
                  {SCOPES.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Assignee</label>
                <select style={s.input} value={form.assignee} onChange={e => set('assignee', e.target.value)}>
                  <option value="">Unassigned</option>
                  {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
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
              <div style={{ ...s.label, marginBottom: '8px' }}>Analysis</div>
              <div style={s.field}>
                <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Root Cause</label>
                <textarea style={{ ...s.input, height: '50px', resize: 'vertical' }} value={form.analysis.rootCause} onChange={e => setA('rootCause', e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Impact</label>
                <textarea style={{ ...s.input, height: '50px', resize: 'vertical' }} value={form.analysis.impact} onChange={e => setA('impact', e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Proposed Solution</label>
                <textarea style={{ ...s.input, height: '50px', resize: 'vertical' }} value={form.analysis.solution} onChange={e => setA('solution', e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={{ ...s.label, fontSize: '12px', color: '#7f8c8d' }}>Next Steps</label>
                <textarea style={{ ...s.input, height: '50px', resize: 'vertical' }} value={form.analysis.nextSteps} onChange={e => setA('nextSteps', e.target.value)} />
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
