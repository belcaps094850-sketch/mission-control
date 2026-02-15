import { useState } from 'react';
import { getTasks, AGENTS } from '../utils/store';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { saveTask, deleteTask } from '../utils/store';

const agentMeta = {
  Alec: { emoji: '🦞', role: 'Main Assistant', model: 'Opus 4.6' },
  Atlas: { emoji: '🔧', role: 'SRE Ops Manager', model: 'Opus 4.6' },
  Sage: { emoji: '🎯', role: 'TPO / CX Strategist', model: 'Opus 4.6' },
  Pixel: { emoji: '🎨', role: 'UI Developer', model: 'Opus 4.6' },
  Nova: { emoji: '📊', role: 'Business Analyst (MSL)', model: 'Opus 4.6' },
  Mentor: { emoji: '🎓', role: 'Learning Coach', model: 'Opus 4.6' },
  Conductor: { emoji: '🎼', role: 'Workflow Orchestrator', model: 'Opus 4.6' },
  Scout: { emoji: '🔎', role: 'Research & Triage', model: 'Llama 3.1' },
  Radar: { emoji: '📡', role: 'AI News Scanner', model: 'Llama 3.1' },
  Scribe: { emoji: '✍️', role: 'Docs & Content Writer', model: 'Llama 3.1' },
  Sentinel: { emoji: '🛡️', role: 'Security Monitor', model: 'Llama 3.1' },
  Broker: { emoji: '💼', role: 'Industry Intelligence', model: 'Llama 3.1' },
};

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' },
  agent: { border: '1px solid #ecf0f1', borderRadius: '6px', padding: '16px', backgroundColor: '#fafafa' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  emoji: { fontSize: '28px' },
  name: { fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' },
  role: { fontSize: '12px', color: '#7f8c8d' },
  count: { fontSize: '12px', color: '#95a5a6', marginBottom: '8px' },
  model: { fontSize: '11px', color: '#fff', backgroundColor: '#95a5a6', borderRadius: '3px', padding: '1px 6px', display: 'inline-block', marginTop: '2px' },
  modelLocal: { fontSize: '11px', color: '#fff', backgroundColor: '#27ae60', borderRadius: '3px', padding: '1px 6px', display: 'inline-block', marginTop: '2px' },
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
                  <span style={meta.model === 'Llama 3.1' ? s.modelLocal : s.model}>{meta.model}</span>
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
