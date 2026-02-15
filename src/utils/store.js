// Hybrid store: reads from public/data.json (agent-writable) + localStorage for UI edits
const TASKS_KEY = 'mc_tasks';
const GOALS_KEY = 'mc_goals';
const SYNC_KEY = 'mc_last_sync';
const DATA_URL = '/data.json';

const AGENTS = ['Alec', 'Atlas', 'Sage', 'Pixel', 'Nova', 'Mentor', 'Conductor', 'Scout', 'Radar', 'Scribe', 'Sentinel', 'Broker'];
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

// --- Sync from data.json ---
// Merges file data with localStorage. File is source of truth for agent-created items.
// UI edits (localStorage) override file data for matching IDs.
export async function syncFromFile() {
  try {
    const res = await fetch(DATA_URL + '?t=' + Date.now());
    if (!res.ok) return false;
    const data = await res.json();

    const fileTs = data.lastUpdated || 0;
    const lastSync = parseInt(localStorage.getItem(SYNC_KEY) || '0');

    // Only sync if file is newer (or first load with no local data)
    const hasLocalData = load(TASKS_KEY, []).length > 0;
    if (fileTs <= lastSync && hasLocalData) return false;

    // Merge tasks: file tasks are base, localStorage overrides by ID
    const localTasks = load(TASKS_KEY, []);
    const localIds = new Set(localTasks.filter(t => t._local).map(t => t.id));
    const fileTasks = (data.tasks || []).map(t => ({ ...t, _file: true }));

    // Keep local-only tasks + merge file tasks (file wins for non-local items)
    const merged = [
      ...fileTasks,
      ...localTasks.filter(t => localIds.has(t.id) && !fileTasks.find(f => f.id === t.id)),
    ];
    save(TASKS_KEY, merged);

    // Goals: file always wins
    if (data.goals) save(GOALS_KEY, data.goals);

    localStorage.setItem(SYNC_KEY, String(fileTs));
    return true;
  } catch (e) {
    console.warn('Sync failed:', e);
    return false;
  }
}

// --- Tasks ---
export function getTasks() { return load(TASKS_KEY, []); }

export function saveTask(task) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = { ...tasks[idx], ...task, updatedAt: Date.now(), _local: true };
  else tasks.push({ ...task, id: uid(), createdAt: Date.now(), updatedAt: Date.now(), _local: true });
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

// --- Seed: now handled by syncFromFile ---
export function seedIfEmpty() {
  // Initial sync from file replaces old localStorage seed
  syncFromFile().then(synced => {
    if (!synced && getTasks().length === 0) {
      // Fallback: trigger a reload from file ignoring timestamp
      localStorage.removeItem(SYNC_KEY);
      syncFromFile();
    }
  });
}

export { AGENTS, STATUSES, PRIORITIES };
