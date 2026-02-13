// localStorage-backed store for tasks and goals
const TASKS_KEY = 'mc_tasks';
const GOALS_KEY = 'mc_goals';

const AGENTS = ['Alec', 'Atlas', 'Sage', 'Pixel', 'Nova'];
const STATUSES = ['backlog', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function load(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Tasks ---
export function getTasks() { return load(TASKS_KEY, []); }

export function saveTask(task) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = { ...tasks[idx], ...task, updatedAt: Date.now() };
  else tasks.push({ ...task, id: uid(), createdAt: Date.now(), updatedAt: Date.now() });
  save(TASKS_KEY, tasks);
  return tasks;
}

export function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  save(TASKS_KEY, tasks);
  return tasks;
}

export function moveTask(id, status) {
  return saveTask({ id, status });
}

// --- Goals ---
export function getGoals() { return load(GOALS_KEY, []); }

export function saveGoal(goal) {
  const goals = getGoals();
  const idx = goals.findIndex(g => g.id === goal.id);
  if (idx >= 0) goals[idx] = { ...goals[idx], ...goal };
  else goals.push({ ...goal, id: uid() });
  save(GOALS_KEY, goals);
  return goals;
}

export function deleteGoal(id) {
  const goals = getGoals().filter(g => g.id !== id);
  save(GOALS_KEY, goals);
  return goals;
}

// --- Seed data ---
export function seedIfEmpty() {
  if (getTasks().length > 0) return;
  const seed = [
    { title: 'Set up React Radar cron job', description: 'Daily Reddit scan for React topics', assignee: 'Pixel', priority: 'high', status: 'done', dueDate: '2026-02-12' },
    { title: 'Build MedStopLoss marketing site', description: 'React marketing pages from Nova\'s copy', assignee: 'Pixel', priority: 'high', status: 'in-progress', dueDate: '2026-02-14' },
    { title: 'SRE daily digest automation', description: 'Automated daily SRE digest scanning and page updates', assignee: 'Atlas', priority: 'high', status: 'in-progress', dueDate: '2026-02-15' },
    { title: 'MedStopLoss market research', description: 'Research stop loss market, competitors, and positioning', assignee: 'Nova', priority: 'high', status: 'done', dueDate: '2026-02-12' },
    { title: 'Learning Hub AI buddy improvements', description: 'Enhance the AI study buddy in learning-hub.html', assignee: 'Pixel', priority: 'medium', status: 'backlog', dueDate: '2026-02-20' },
    { title: 'Coordinate agent workflows', description: 'Manage cross-agent task handoffs and priorities', assignee: 'Alec', priority: 'medium', status: 'in-progress', dueDate: '' },
    { title: 'User experience audit', description: 'Review all pages for UX consistency and accessibility', assignee: 'Sage', priority: 'medium', status: 'backlog', dueDate: '2026-02-18' },
  ];
  seed.forEach(t => saveTask(t));

  const goalSeed = [
    { title: 'Launch MedStopLoss website', progress: 40, description: 'Complete marketing site with all pages' },
    { title: 'Automate daily content updates', progress: 75, description: 'React Radar + SRE Digest running daily' },
    { title: 'Mission Control MVP', progress: 10, description: 'Team dashboard for task tracking' },
  ];
  goalSeed.forEach(g => saveGoal(g));
}

export { AGENTS, STATUSES, PRIORITIES };
