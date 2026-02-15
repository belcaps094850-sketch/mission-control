import { useState } from 'react';
import { getTasks, AGENTS } from '../utils/store';
import { Link } from 'react-router-dom';

const cronJobs = [
  { name: 'Sentinel — Security Scan', schedule: 'Daily 6:00 AM', agent: 'Sentinel' },
  { name: 'Scout — AI News Digest', schedule: 'Daily 7:00 AM', agent: 'Scout' },
  { name: 'Radar — React Radar', schedule: 'Daily 7:00 AM', agent: 'Radar' },
  { name: 'Scribe — Daily Changelog', schedule: 'Daily 11:00 PM', agent: 'Scribe' },
  { name: 'Broker — MSL Industry Digest', schedule: 'Monday 8:00 AM', agent: 'Broker' },
  { name: 'Conductor — Team Retrospective', schedule: 'Friday 5:00 PM', agent: 'Conductor' },
  { name: 'Mentor — Weekly Learning Prompt', schedule: 'Sunday 9:00 AM', agent: 'Mentor' },
];

const agentEmoji = {
  Alec: '🤖', Atlas: '🔧', Sage: '🎯', Pixel: '🎨', Nova: '📊',
  Mentor: '🎓', Conductor: '🎼', Scout: '🔭', Radar: '📡', Scribe: '📝', Sentinel: '🛡️', Broker: '💼',
};

const c = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '30px' },
  metric: { border: '1px solid #ecf0f1', borderRadius: '6px', padding: '16px', textAlign: 'center' },
  metricVal: { fontSize: '28px', fontWeight: 'bold', color: '#3498db' },
  metricLabel: { fontSize: '13px', color: '#7f8c8d', marginTop: '4px' },
  section: { marginBottom: '30px' },
  sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '12px', borderBottom: '1px solid #ecf0f1', paddingBottom: '6px' },
  row: { padding: '8px 12px', borderBottom: '1px solid #f5f5f5', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: (color) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', color: '#fff', backgroundColor: color }),
  healthDot: (color) => ({ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, marginRight: '8px' }),
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
};

function getWeekStart() {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
}

export default function Dashboard() {
  const [tasks] = useState(getTasks);
  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const weekStart = getWeekStart();

  const doneThisWeek = tasks.filter(t => t.status === 'done' && t.updatedAt >= weekStart).length;
  const active = tasks.filter(t => t.status === 'in-progress').length;
  const backlog = tasks.filter(t => t.status === 'backlog').length;
  const done = tasks.filter(t => t.status === 'done').length;

  // Recent activity (last 48hrs, sorted newest first)
  const recent = [...tasks]
    .filter(t => t.updatedAt > now - 48 * 3600000)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 10);

  // Active agents today
  const activeAgents = [...new Set(
    tasks.filter(t => t.updatedAt >= todayStart).map(t => t.assignee).filter(Boolean)
  )];

  // Health: green if active > 0 and no critical backlog, yellow if critical exists, red if no recent activity
  const hasCriticalBacklog = tasks.some(t => t.priority === 'critical' && t.status !== 'done');
  const hasRecentActivity = recent.length > 0;
  const healthColor = !hasRecentActivity ? '#e74c3c' : hasCriticalBacklog ? '#f39c12' : '#27ae60';
  const healthLabel = !hasRecentActivity ? 'No recent activity' : hasCriticalBacklog ? 'Critical items pending' : 'All systems nominal';

  const statusColors = { done: '#27ae60', 'in-progress': '#3498db', backlog: '#95a5a6' };

  function timeAgo(ts) {
    const mins = Math.floor((now - ts) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '20px' }}>🏠 Dashboard</h1>

      {/* Quick Health */}
      <div style={{ ...c.row, border: '1px solid #ecf0f1', borderRadius: '6px', marginBottom: '20px', padding: '12px 16px' }}>
        <span><span style={c.healthDot(healthColor)} /><strong>System Health:</strong> {healthLabel}</span>
        <span style={{ fontSize: '13px', color: '#7f8c8d' }}>{AGENTS.length} agents</span>
      </div>

      {/* Metrics */}
      <div style={c.grid}>
        <div style={c.metric}>
          <div style={c.metricVal}>{doneThisWeek}</div>
          <div style={c.metricLabel}>Completed this week</div>
        </div>
        <div style={c.metric}>
          <div style={{ ...c.metricVal, color: '#3498db' }}>{active}</div>
          <div style={c.metricLabel}>Active tasks</div>
        </div>
        <div style={c.metric}>
          <div style={{ ...c.metricVal, color: '#95a5a6' }}>{backlog}</div>
          <div style={c.metricLabel}>Backlog</div>
        </div>
        <div style={c.metric}>
          <div style={{ ...c.metricVal, color: '#27ae60' }}>{done}</div>
          <div style={c.metricLabel}>Total done</div>
        </div>
      </div>

      <div style={c.twoCol}>
        {/* Activity Feed */}
        <div style={c.section}>
          <div style={c.sectionTitle}>📰 Recent Activity</div>
          {recent.length === 0 && <div style={{ color: '#95a5a6', fontSize: '13px', fontStyle: 'italic' }}>No recent activity</div>}
          {recent.map(t => (
            <div key={t.id} style={c.row}>
              <span>
                <span style={{ marginRight: '6px' }}>{agentEmoji[t.assignee] || '👤'}</span>
                <span style={{ color: '#2c3e50' }}>{t.title}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={c.badge(statusColors[t.status] || '#95a5a6')}>{t.status}</span>
                <span style={{ fontSize: '11px', color: '#95a5a6', whiteSpace: 'nowrap' }}>{timeAgo(t.updatedAt)}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div>
          {/* Active Agents */}
          <div style={c.section}>
            <div style={c.sectionTitle}>👥 Active Today</div>
            {activeAgents.length === 0 && <div style={{ color: '#95a5a6', fontSize: '13px', fontStyle: 'italic' }}>No activity yet today</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activeAgents.map(a => (
                <span key={a} style={{ border: '1px solid #ecf0f1', borderRadius: '16px', padding: '4px 12px', fontSize: '13px', color: '#2c3e50' }}>
                  {agentEmoji[a] || '👤'} {a}
                </span>
              ))}
            </div>
          </div>

          {/* Cron Jobs */}
          <div style={c.section}>
            <div style={c.sectionTitle}>⏰ Scheduled Jobs</div>
            {cronJobs.map((j, i) => (
              <div key={i} style={{ ...c.row, padding: '6px 0' }}>
                <span style={{ fontSize: '13px' }}>{agentEmoji[j.agent] || '🔄'} {j.name}</span>
                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{j.schedule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <Link to="/board" style={{ padding: '8px 16px', border: '1px solid #ecf0f1', borderRadius: '4px', fontSize: '13px', color: '#3498db', textDecoration: 'none' }}>📋 Board</Link>
        <Link to="/goals" style={{ padding: '8px 16px', border: '1px solid #ecf0f1', borderRadius: '4px', fontSize: '13px', color: '#3498db', textDecoration: 'none' }}>🎯 Goals</Link>
        <Link to="/roadmap" style={{ padding: '8px 16px', border: '1px solid #ecf0f1', borderRadius: '4px', fontSize: '13px', color: '#3498db', textDecoration: 'none' }}>🗺️ Roadmap</Link>
      </div>
    </div>
  );
}
