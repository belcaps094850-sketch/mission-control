import { useState } from 'react';
import { getTasks, AGENTS } from '../utils/store';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { saveTask, deleteTask } from '../utils/store';

const agentMeta = {
  Alec: { emoji: '🤖', role: 'Main Assistant' },
  Atlas: { emoji: '🔧', role: 'SRE Ops Manager' },
  Sage: { emoji: '🎯', role: 'TPO / CX Strategist' },
  Pixel: { emoji: '🎨', role: 'UI Developer' },
  Nova: { emoji: '📊', role: 'Business Analyst' },
};

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' },
  agent: { border: '1px solid #ecf0f1', borderRadius: '6px', padding: '16px', backgroundColor: '#fafafa' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  emoji: { fontSize: '28px' },
  name: { fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' },
  role: { fontSize: '12px', color: '#7f8c8d' },
  count: { fontSize: '12px', color: '#95a5a6', marginBottom: '8px' },
};

export default function Team() {
  const [tasks, setTasks] = useState(getTasks);
  const [modal, setModal] = useState(null);
  const refresh = () => setTasks(getTasks());

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '16px' }}>👥 Team</h1>
      <div style={s.grid}>
        {AGENTS.map(agent => {
          const meta = agentMeta[agent];
          const mine = tasks.filter(t => t.assignee === agent && t.status !== 'done');
          return (
            <div key={agent} style={s.agent}>
              <div style={s.header}>
                <span style={s.emoji}>{meta.emoji}</span>
                <div>
                  <div style={s.name}>{agent}</div>
                  <div style={s.role}>{meta.role}</div>
                </div>
              </div>
              <div style={s.count}>{mine.length} active task{mine.length !== 1 ? 's' : ''}</div>
              {mine.map(t => <TaskCard key={t.id} task={t} onClick={() => setModal(t)} />)}
              {mine.length === 0 && <p style={{ fontSize: '13px', color: '#bdc3c7', fontStyle: 'italic' }}>No active tasks</p>}
            </div>
          );
        })}
      </div>
      {modal && <TaskModal task={modal} onSave={f => { saveTask(f); refresh(); setModal(null); }} onDelete={id => { deleteTask(id); refresh(); setModal(null); }} onClose={() => setModal(null)} />}
    </div>
  );
}
