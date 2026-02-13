import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '📋 Board', end: true },
  { to: '/goals', label: '🎯 Goals' },
  { to: '/team', label: '👥 Team' },
  { to: '/backlog', label: '📦 Backlog' },
];

const s = {
  sidebar: {
    width: '200px',
    minHeight: '100vh',
    borderRight: '1px solid #ecf0f1',
    padding: '20px 0',
    backgroundColor: '#fafafa',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  logo: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: '0 20px 20px',
    borderBottom: '1px solid #ecf0f1',
    marginBottom: '10px',
  },
  link: {
    display: 'block',
    padding: '10px 20px',
    color: '#555',
    textDecoration: 'none',
    fontSize: '14px',
    borderLeft: '3px solid transparent',
  },
  active: {
    color: '#3498db',
    borderLeftColor: '#3498db',
    backgroundColor: '#eaf4fc',
    fontWeight: 'bold',
  },
};

export default function Sidebar() {
  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>🚀 Mission Control</div>
      {navItems.map(n => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}
        >
          {n.label}
        </NavLink>
      ))}
    </aside>
  );
}
