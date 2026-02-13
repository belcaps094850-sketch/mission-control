const priorityColors = { critical: '#e74c3c', high: '#e67e22', medium: '#3498db', low: '#95a5a6' };
const agentEmoji = { Alec: '🤖', Atlas: '🔧', Sage: '🎯', Pixel: '🎨', Nova: '📊' };

const s = {
  card: {
    border: '1px solid #ecf0f1',
    borderRadius: '5px',
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  title: { fontSize: '14px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '6px' },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#7f8c8d' },
  badge: (color) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: '10px',
    fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: color,
  }),
};

export default function TaskCard({ task, onClick }) {
  return (
    <div style={s.card} onClick={() => onClick(task)}>
      <div style={s.title}>{task.title}</div>
      <div style={s.meta}>
        <span>{agentEmoji[task.assignee] || '👤'} {task.assignee || 'Unassigned'}</span>
        <span style={s.badge(priorityColors[task.priority] || '#95a5a6')}>{task.priority}</span>
      </div>
      {task.dueDate && (
        <div style={{ fontSize: '11px', color: '#95a5a6', marginTop: '4px' }}>Due: {task.dueDate}</div>
      )}
    </div>
  );
}
