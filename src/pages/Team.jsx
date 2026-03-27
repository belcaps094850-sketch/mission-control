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

function CardView({ getActiveTasks, setModal }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
      {AGENTS.map(agent => {
        const meta = agentMeta[agent];
        const mine = getActiveTasks(agent);
        const isLocal = meta.model === 'Llama 3.1';
        return (
          <div key={agent} style={{
            border: '1px solid #e0e0e0', borderRadius: '6px',
            padding: '16px', backgroundColor: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <img
                src={`/avatars/${agent}.svg`}
                alt={agent}
                style={{
                  width: '56px', height: '56px',
                  borderRadius: '8px', flexShrink: 0,
                  backgroundColor: '#f8f8f8',
                  border: '1px solid #e0e0e0',
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#2c3e50' }}>{agent}</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '3px' }}>{meta.role}</div>
                <span style={{
                  fontSize: '11px', color: '#fff', borderRadius: '3px', padding: '1px 6px',
                  display: 'inline-block',
                  backgroundColor: isLocal ? '#27ae60' : '#95a5a6',
                }}>{meta.model}</span>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontSize: '20px', fontWeight: 'bold',
                  color: mine.length > 0 ? '#2c3e50' : '#ddd',
                }}>{mine.length}</div>
                <div style={{ fontSize: '11px', color: '#95a5a6' }}>task{mine.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            {mine.map(t => <TaskCard key={t.id} task={t} onClick={() => setModal(t)} />)}
            {mine.length === 0 && (
              <p style={{ fontSize: '13px', color: '#bdc3c7', fontStyle: 'italic', margin: '4px 0 0' }}>
                No active tasks
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BoardroomView({ getActiveTasks }) {
  const [hovered, setHovered] = useState(null);
  const [tick, setTick] = useState(0);

  // Animate the radar sweep
  useState(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  });

  const cx = 450, cy = 300;
  const ringRadii = [80, 140, 210];
  const seatR = 270;

  // Split agents: inner ring (Opus) and outer ring (Local)
  const opusAgents = AGENTS.filter(a => agentMeta[a].model === 'Opus 4.6');
  const localAgents = AGENTS.filter(a => agentMeta[a].model === 'Llama 3.1');

  const makeSeats = (agents, radius, offsetAngle = 0) =>
    agents.map((agent, i) => {
      const angle = offsetAngle + -Math.PI / 2 + i * (2 * Math.PI / agents.length);
      return { agent, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });

  const opusSeats = makeSeats(opusAgents, 200);
  const localSeats = makeSeats(localAgents, 310, Math.PI / localAgents.length);
  const allSeats = [...opusSeats, ...localSeats];

  const hoveredSeat = hovered ? allSeats.find(s => s.agent === hovered) : null;
  const hoveredMeta = hovered ? agentMeta[hovered] : null;
  const hoveredTaskCount = hovered ? getActiveTasks(hovered).length : 0;

  // Radar sweep angle
  const sweepAngle = (tick * 1.5) % 360;

  return (
    <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto' }}>
      {/* CSS animations */}
      <style>{`
        @keyframes mc-pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes mc-ring-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes mc-glow { 0%,100% { filter: drop-shadow(0 0 3px rgba(0,255,170,0.4)); } 50% { filter: drop-shadow(0 0 8px rgba(0,255,170,0.8)); } }
        .mc-active-node { animation: mc-glow 2s ease-in-out infinite; }
        .mc-sweep { animation: mc-ring-rotate 8s linear infinite; transform-origin: ${cx}px ${cy}px; }
      `}</style>

      <svg viewBox="0 0 900 640" style={{ width: '100%', display: 'block', borderRadius: '12px' }}>
        <defs>
          {/* Dark background gradient */}
          <radialGradient id="mc-bg" cx="50%" cy="47%" r="55%">
            <stop offset="0%" stopColor="#1a2332" />
            <stop offset="100%" stopColor="#0d1117" />
          </radialGradient>
          {/* Radar sweep cone */}
          <linearGradient id="mc-sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00ffaa" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00ffaa" stopOpacity="0" />
          </linearGradient>
          {/* Glow for center */}
          <radialGradient id="mc-center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffaa" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#00ffaa" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#00ffaa" stopOpacity="0" />
          </radialGradient>
          {/* Node glow */}
          <radialGradient id="mc-node-glow">
            <stop offset="0%" stopColor="#00ffaa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ffaa" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mc-node-glow-orange">
            <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
          </radialGradient>
          {/* Grid pattern */}
          <pattern id="mc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2d3d" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="900" height="640" fill="url(#mc-bg)" rx="12" />
        <rect width="900" height="640" fill="url(#mc-grid)" rx="12" opacity="0.4" />

        {/* Center glow */}
        <circle cx={cx} cy={cy} r="120" fill="url(#mc-center-glow)" />

        {/* Radar rings */}
        {ringRadii.map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity={0.15 + i * 0.05} />
        ))}
        {/* Outer ring for local agents */}
        <circle cx={cx} cy={cy} r={310} fill="none" stroke="#ffaa00" strokeWidth="0.5" opacity="0.12" strokeDasharray="4 8" />

        {/* Crosshair lines */}
        <line x1={cx - 340} y1={cy} x2={cx + 340} y2={cy} stroke="#00ffaa" strokeWidth="0.3" opacity="0.15" />
        <line x1={cx} y1={cy - 340} x2={cx} y2={cy + 340} stroke="#00ffaa" strokeWidth="0.3" opacity="0.15" />
        {/* Diagonal crosshairs */}
        <line x1={cx - 240} y1={cy - 240} x2={cx + 240} y2={cy + 240} stroke="#00ffaa" strokeWidth="0.2" opacity="0.08" />
        <line x1={cx - 240} y1={cy + 240} x2={cx + 240} y2={cy - 240} stroke="#00ffaa" strokeWidth="0.2" opacity="0.08" />

        {/* Radar sweep */}
        <g className="mc-sweep">
          <path
            d={`M ${cx} ${cy} L ${cx} ${cy - 340} A 340 340 0 0 1 ${cx + 340 * Math.sin(Math.PI / 6)} ${cy - 340 * Math.cos(Math.PI / 6)} Z`}
            fill="url(#mc-sweep-grad)"
          />
        </g>

        {/* Connection lines between Opus agents (collaboration network) */}
        {opusSeats.map((s1, i) => {
          const s2 = opusSeats[(i + 1) % opusSeats.length];
          return (
            <line key={`conn-${i}`}
              x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y}
              stroke="#00ffaa" strokeWidth="0.5" opacity="0.1"
              strokeDasharray="3 6"
            />
          );
        })}

        {/* Connection lines from local agents to nearest Opus */}
        {localSeats.map((ls, i) => {
          // Connect to closest opus agent
          let closest = opusSeats[0], minD = Infinity;
          opusSeats.forEach(os => {
            const d = Math.hypot(os.x - ls.x, os.y - ls.y);
            if (d < minD) { minD = d; closest = os; }
          });
          return (
            <line key={`lconn-${i}`}
              x1={ls.x} y1={ls.y} x2={closest.x} y2={closest.y}
              stroke="#ffaa00" strokeWidth="0.4" opacity="0.08"
              strokeDasharray="2 6"
            />
          );
        })}

        {/* Render agent nodes */}
        {allSeats.map(({ agent, x, y }) => {
          const meta = agentMeta[agent];
          const taskCount = getActiveTasks(agent).length;
          const isHovered = hovered === agent;
          const isOpus = meta.model === 'Opus 4.6';
          const accentColor = isOpus ? '#00ffaa' : '#ffaa00';
          const nodeR = isHovered ? 32 : 28;

          return (
            <g
              key={agent}
              onMouseEnter={() => setHovered(agent)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
              className={taskCount > 0 ? 'mc-active-node' : ''}
            >
              {/* Outer glow ring */}
              <circle cx={x} cy={y} r={nodeR + 8}
                fill={isOpus ? 'url(#mc-node-glow)' : 'url(#mc-node-glow-orange)'}
              />

              {/* Status ring */}
              <circle cx={x} cy={y} r={nodeR + 2}
                fill="none" stroke={accentColor}
                strokeWidth={isHovered ? 2 : 1}
                opacity={isHovered ? 0.9 : 0.4}
              />

              {/* Node background */}
              <circle cx={x} cy={y} r={nodeR}
                fill={isHovered ? '#1e2d3d' : '#141e2a'}
                stroke={isHovered ? accentColor : '#2a3a4a'}
                strokeWidth={isHovered ? 2 : 1}
              />

              {/* Avatar */}
              <clipPath id={`clip-${agent}`}>
                <circle cx={x} cy={y} r={nodeR - 3} />
              </clipPath>
              <image
                href={`/avatars/${agent}.svg`}
                x={x - nodeR + 3} y={y - nodeR + 3}
                width={(nodeR - 3) * 2} height={(nodeR - 3) * 2}
                clipPath={`url(#clip-${agent})`}
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Semi-transparent overlay on avatar for dark theme blend */}
              <circle cx={x} cy={y} r={nodeR - 3}
                fill="#0d1117" opacity="0.15"
              />

              {/* Name label with background */}
              <rect
                x={x - 28} y={y + nodeR + 4}
                width="56" height="16" rx="3"
                fill="#141e2a" stroke={accentColor} strokeWidth="0.5" opacity="0.9"
              />
              <text
                x={x} y={y + nodeR + 15}
                textAnchor="middle" fontSize="9" fill={accentColor}
                fontWeight="bold" fontFamily="Arial"
              >
                {agent}
              </text>

              {/* Task count badge */}
              {taskCount > 0 && (
                <>
                  <circle cx={x + nodeR - 4} cy={y - nodeR + 4} r={10}
                    fill="#ff4757" stroke="#0d1117" strokeWidth="2"
                  />
                  <text
                    x={x + nodeR - 4} y={y - nodeR + 4}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="9" fill="#fff" fontFamily="Arial" fontWeight="bold"
                  >
                    {taskCount}
                  </text>
                </>
              )}

              {/* Model indicator dot */}
              <circle cx={x - nodeR + 6} cy={y + nodeR - 6} r="4"
                fill={isOpus ? '#00ffaa' : '#ffaa00'}
                stroke="#0d1117" strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* Center emblem */}
        <circle cx={cx} cy={cy} r="36" fill="#141e2a" stroke="#00ffaa" strokeWidth="1" opacity="0.6" />
        <circle cx={cx} cy={cy} r="32" fill="#0d1117" stroke="#00ffaa" strokeWidth="0.5" opacity="0.4" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#00ffaa" fontFamily="Arial" fontWeight="bold" letterSpacing="2" opacity="0.8">MISSION</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fontSize="10" fill="#00ffaa" fontFamily="Arial" fontWeight="bold" letterSpacing="2" opacity="0.8">CONTROL</text>

        {/* Legend */}
        <g transform="translate(20, 590)">
          <circle cx="8" cy="8" r="4" fill="#00ffaa" />
          <text x="18" y="12" fontSize="10" fill="#5a6a7a" fontFamily="Arial">Opus 4.6</text>
          <circle cx="88" cy="8" r="4" fill="#ffaa00" />
          <text x="98" y="12" fontSize="10" fill="#5a6a7a" fontFamily="Arial">Llama 3.1</text>
          <circle cx="178" cy="8" r="6" fill="none" stroke="#ff4757" strokeWidth="1.5" />
          <text x="190" y="12" fontSize="10" fill="#5a6a7a" fontFamily="Arial">Active Tasks</text>
        </g>

        {/* Status bar */}
        <text x="880" y="628" textAnchor="end" fontSize="9" fill="#2a3a4a" fontFamily="monospace">
          {AGENTS.length} AGENTS ONLINE • {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </text>
      </svg>

      {/* Tooltip overlay */}
      {hoveredSeat && (() => {
        const leftPct = (hoveredSeat.x / 900) * 100;
        const isTopHalf = hoveredSeat.y < cy;
        const tooltipY = isTopHalf ? hoveredSeat.y + 50 : hoveredSeat.y - 50;
        const topPct = (tooltipY / 640) * 100;
        const isOpus = hoveredMeta.model === 'Opus 4.6';
        const accent = isOpus ? '#00ffaa' : '#ffaa00';
        return (
          <div style={{
            position: 'absolute',
            left: `${leftPct}%`,
            top: `${topPct}%`,
            transform: isTopHalf ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
            backgroundColor: '#141e2a',
            border: `1px solid ${accent}`,
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '12px',
            boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 15px ${accent}33`,
            pointerEvents: 'none',
            zIndex: 10,
            whiteSpace: 'nowrap',
            fontFamily: 'Arial, sans-serif',
          }}>
            <div style={{ fontWeight: 'bold', color: accent, marginBottom: '4px', fontSize: '13px' }}>
              {hoveredMeta.emoji} {hovered}
            </div>
            <div style={{ color: '#8a9ab0', marginBottom: '2px' }}>{hoveredMeta.role}</div>
            <div style={{ color: '#5a6a7a', fontSize: '11px' }}>
              {hoveredMeta.model} · {hoveredTaskCount} active task{hoveredTaskCount !== 1 ? 's' : ''}
            </div>
            {hoveredTaskCount > 0 && (
              <div style={{
                marginTop: '6px', paddingTop: '6px',
                borderTop: `1px solid ${accent}33`,
                color: '#ff4757', fontSize: '11px', fontWeight: 'bold',
              }}>
                ● ENGAGED
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default function Team() {
  const [tasks, setTasks] = useState(getTasks);
  const [modal, setModal] = useState(null);
  const [view, setView] = useState('cards');
  const refresh = () => setTasks(getTasks());

  const getActiveTasks = (agent) => tasks.filter(t => t.assignee === agent && t.status !== 'done');

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        <h1 style={{ fontSize: '22px', color: '#2c3e50', margin: 0 }}>Team</h1>
        <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
          <button
            onClick={() => setView('cards')}
            style={{
              padding: '6px 16px', fontSize: '13px', border: 'none', cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              backgroundColor: view === 'cards' ? '#2c3e50' : '#fff',
              color: view === 'cards' ? '#fff' : '#555',
            }}
          >
            Cards
          </button>
          <button
            onClick={() => setView('boardroom')}
            style={{
              padding: '6px 16px', fontSize: '13px', border: 'none', cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              borderLeft: '1px solid #ddd',
              backgroundColor: view === 'boardroom' ? '#2c3e50' : '#fff',
              color: view === 'boardroom' ? '#fff' : '#555',
            }}
          >
            Command Center
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <CardView getActiveTasks={getActiveTasks} setModal={setModal} />
      ) : (
        <BoardroomView getActiveTasks={getActiveTasks} />
      )}

      {modal && (
        <TaskModal
          task={modal}
          onSave={f => { saveTask(f); refresh(); setModal(null); }}
          onDelete={id => { deleteTask(id); refresh(); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
