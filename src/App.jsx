import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import Roadmap from './pages/Roadmap';
import Goals from './pages/Goals';
import Ideas from './pages/Ideas';
import Team from './pages/Team';
import Backlog from './pages/Backlog';
import { syncFromFile } from './utils/store';

const layout = {
  marginLeft: '200px',
  padding: '24px 32px',
  minHeight: '100vh',
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    syncFromFile().finally(() => setReady(true));
    const interval = setInterval(async () => {
      const synced = await syncFromFile();
      if (synced) setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!ready) return <div style={{ padding: '40px', color: '#95a5a6' }}>Loading...</div>;

  return (
    <BrowserRouter>
      <Sidebar />
      <main style={layout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<Board />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/team" element={<Team />} />
          <Route path="/backlog" element={<Backlog />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
