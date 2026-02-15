import { useState } from 'react';
import { getTasks } from '../utils/store';

const PROJECTS = ['MedStopLoss', 'Learning Lab', 'Infrastructure', 'Research'];
const projectColors = { MedStopLoss: '#3498db', 'Learning Lab': '#27ae60', Infrastructure: '#e67e22', Research: '#9b59b6' };
const statusColors = { backlog: '#bdc3c7', 'in-progress': '#3498db', done: '#27ae60' };
const statusLabels = { backlog: 'Backlog', 'in-progress': 'In Progress', done: 'Done' };

const agentEmoji = {
  Alec: '🤖', Atlas: '🔧', Sage: '🎯', Pixel: '🎨', Nova: '📊',
  Mentor: '🎓', Conductor: '🎼', Scout: '🔭', Radar: '📡', Scribe: '📝', Sentinel: '🛡️', Broker: '💼',
};

const c = {
  legend: { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555' },
  dot: (color) => ({ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: color }),
  swimlane: { marginBottom: '28px' },
  swimTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' },
  swimDot: (color) => ({ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: color, display: 'inline-block' }),
  timeline: { position: 'relative', borderLeft: '2px solid #ecf0f1', paddingLeft: '20px', marginLeft: '6px' },
  taskRow: { marginBottom: '8px', position: 'relative' },
  taskDot: (color) => ({
    position: 'absolute', left: '-26px', top: '8px',
    width: '10px', height: '10px', borderRadius: '50%',
    backgroundColor: color, border: '2px solid #fff',
    boxShadow: '0 0 0 2px ' + color,
  }),
  taskBar: (color, pct) => ({
    backgroundColor: color + '20',
    borderLeft: `3px solid ${color}`,
    borderRadius: '0 4px 4px 0',
    padding: '8px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  taskTitle: { fontSize: '14px', color: '#2c3e50', fontWeight: 'bold' },
  taskMeta: { display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px', color: '#7f8c8d' },
  badge: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: color }),
  filterBar: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  filterBtn: (active) => ({
    padding: '6px 14px', borderRadius: '16px', fontSize: '13px', border: '1px solid #ecf0f1',
    backgroundColor: active ? '#3498db' : '#fff', color: active ? '#fff' : '#555',
    cursor: 'pointer', fontWeight: active ? 'bold' : 'normal',
  }),
  summary: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' },
  summaryCard: (color) => ({ border: `1px solid ${color}30`, borderRadius: '6px', padding: '12px', borderLeft: `3px solid ${color}` }),
};

export default function Roadmap() {
  const [tasks] = useState(getTasks);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.project === filter);

  // Project summaries
  const summaries = PROJECTS.map(p => {
    const pts = tasks.filter(t => t.project === p);
    return {
      name: p,
      total: pts.length,
      done: pts.filter(t => t.status === 'done').length,
      active: pts.filter(t => t.status === 'in-progress').length,
      backlog: pts.filter(t => t.status === 'backlog').length,
      pct: pts.length ? Math.round((pts.filter(t => t.status === 'done').length / pts.length) * 100) : 0,
    };
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '6px' }}>🗺️ Roadmap</h1>
      <p style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '20px' }}>Strategy view — tasks grouped by project</p>

      {/* Project summaries */}
      <div style={c.summary}>
        {summaries.map(s => (
          <div key={s.name} style={c.summaryCard(projectColors[s.name])}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' }}>{s.name}</div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
              {s.done}/{s.total} done · {s.pct}%
            </div>
            <div style={{ height: '4px', backgroundColor: '#ecf0f1', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.pct}%`, backgroundColor: projectColors[s.name], borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={c.filterBar}>
        <button style={c.filterBtn(filter === 'all')} onClick={() => setFilter('all')}>All</button>
        {PROJECTS.map(p => (
          <button key={p} style={c.filterBtn(filter === p)} onClick={() => setFilter(p)}>{p}</button>
        ))}
      </div>

      {/* Legend */}
      <div style={c.legend}>
        {Object.entries(statusColors).map(([s, color]) => (
          <span key={s} style={c.legendItem}><span style={c.dot(color)} />{statusLabels[s]}</span>
        ))}
      </div>

      {/* Swimlanes */}
      {PROJECTS.filter(p => filter === 'all' || filter === p).map(project => {
        const pts = filtered.filter(t => t.project === project)
          .sort((a, b) => {
            const ss = { 'in-progress': 0, backlog: 1, done: 2 };
            if (ss[a.status] !== ss[b.status]) return ss[a.status] - ss[b.status];
            return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9);
          });
        if (pts.length === 0) return null;
        return (
          <div key={project} style={c.swimlane}>
            <div style={c.swimTitle}>
              <span style={c.swimDot(projectColors[project])} />
              <span style={{ color: '#2c3e50' }}>{project}</span>
              <span style={{ fontSize: '12px', color: '#95a5a6', fontWeight: 'normal' }}>({pts.length} tasks)</span>
            </div>
            <div style={c.timeline}>
              {pts.map(t => (
                <div key={t.id} style={c.taskRow}>
                  <div style={c.taskDot(statusColors[t.status])} />
                  <div style={c.taskBar(statusColors[t.status])}>
                    <div>
                      <div style={c.taskTitle}>{t.title}</div>
                      {t.description && <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '2px' }}>{t.description}</div>}
                    </div>
                    <div style={c.taskMeta}>
                      <span>{agentEmoji[t.assignee] || '👤'} {t.assignee}</span>
                      {t.dueDate && <span>Due {t.dueDate}</span>}
                      <span style={c.badge(statusColors[t.status])}>{t.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
