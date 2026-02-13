import { useState, useCallback } from 'react';
import { getTasks, saveTask, deleteTask, moveTask, STATUSES } from '../utils/store';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Filters from '../components/Filters';

const colLabels = { backlog: '📦 Backlog', 'in-progress': '🔄 In Progress', done: '✅ Done' };

const s = {
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', minHeight: '60vh' },
  col: { backgroundColor: '#fafafa', borderRadius: '6px', padding: '12px', border: '1px solid #ecf0f1' },
  colHeader: { fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' },
  count: { fontSize: '12px', color: '#95a5a6', fontWeight: 'normal' },
  dropHint: { textAlign: 'center', padding: '20px', color: '#bdc3c7', fontSize: '13px', fontStyle: 'italic' },
};

export default function Board() {
  const [tasks, setTasks] = useState(getTasks);
  const [filters, setFilters] = useState({});
  const [modal, setModal] = useState(null); // null | {} (new) | task (edit)
  const [dragId, setDragId] = useState(null);

  const refresh = () => setTasks(getTasks());

  const filtered = tasks.filter(t =>
    (!filters.assignee || t.assignee === filters.assignee) &&
    (!filters.priority || t.priority === filters.priority)
  );

  const handleSave = (form) => { saveTask(form); refresh(); setModal(null); };
  const handleDelete = (id) => { deleteTask(id); refresh(); setModal(null); };

  const handleDrop = (status) => (e) => {
    e.preventDefault();
    if (dragId) { moveTask(dragId, status); refresh(); setDragId(null); }
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '16px' }}>📋 Task Board</h1>
      <Filters filters={filters} onChange={setFilters} onAdd={() => setModal({})} />
      <div style={s.board}>
        {STATUSES.map(status => {
          const col = filtered.filter(t => t.status === status);
          return (
            <div
              key={status}
              style={s.col}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop(status)}
            >
              <div style={s.colHeader}>
                {colLabels[status]} <span style={s.count}>{col.length}</span>
              </div>
              {col.length === 0 && <div style={s.dropHint}>Drop tasks here</div>}
              {col.map(t => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => setDragId(t.id)}
                  onDragEnd={() => setDragId(null)}
                >
                  <TaskCard task={t} onClick={() => setModal(t)} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {modal !== null && <TaskModal task={modal} onSave={handleSave} onDelete={handleDelete} onClose={() => setModal(null)} />}
    </div>
  );
}
