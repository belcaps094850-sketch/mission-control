import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Board from './pages/Board';
import Goals from './pages/Goals';
import Team from './pages/Team';
import Backlog from './pages/Backlog';
import { seedIfEmpty } from './utils/store';

const layout = {
  marginLeft: '200px',
  padding: '24px 32px',
  minHeight: '100vh',
};

export default function App() {
  useEffect(() => { seedIfEmpty(); }, []);

  return (
    <BrowserRouter>
      <Sidebar />
      <main style={layout}>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/team" element={<Team />} />
          <Route path="/backlog" element={<Backlog />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
