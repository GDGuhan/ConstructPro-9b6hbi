// ─── ConstructPro localStorage helpers ───────────────────────────────────────
import { SEED_USERS, SEED_PROJECTS, SEED_TASKS, SEED_MATERIALS, SEED_REPORTS } from './data';
import type { User, Project, Task, Material, Report } from '@/types';

const KEYS = {
  users: 'cp_users',
  projects: 'cp_projects',
  tasks: 'cp_tasks',
  materials: 'cp_materials',
  reports: 'cp_reports',
  currentUser: 'cp_current_user',
};

function get<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as T[];
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = (): User[] => get<User>(KEYS.users, SEED_USERS);
export const saveUsers = (users: User[]) => set(KEYS.users, users);
export const addUser = (user: User) => saveUsers([...getUsers(), user]);
export const updateUser = (updated: User) =>
  saveUsers(getUsers().map(u => (u.id === updated.id ? updated : u)));
export const deleteUser = (id: string) =>
  saveUsers(getUsers().filter(u => u.id !== id));

// ── Auth ──────────────────────────────────────────────────────────────────────
export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem(KEYS.currentUser);
  return raw ? (JSON.parse(raw) as User) : null;
};
export const setCurrentUser = (user: User | null) => {
  if (user) localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  else localStorage.removeItem(KEYS.currentUser);
};
export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) setCurrentUser(user);
  return user ?? null;
};
export const logout = () => setCurrentUser(null);

// ── Projects ──────────────────────────────────────────────────────────────────
export const getProjects = (): Project[] => get<Project>(KEYS.projects, SEED_PROJECTS);
export const saveProjects = (p: Project[]) => set(KEYS.projects, p);
export const addProject = (p: Project) => saveProjects([...getProjects(), p]);
export const updateProject = (updated: Project) =>
  saveProjects(getProjects().map(p => (p.id === updated.id ? updated : p)));
export const deleteProject = (id: string) =>
  saveProjects(getProjects().filter(p => p.id !== id));

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const getTasks = (): Task[] => get<Task>(KEYS.tasks, SEED_TASKS);
export const saveTasks = (t: Task[]) => set(KEYS.tasks, t);
export const addTask = (t: Task) => saveTasks([...getTasks(), t]);
export const updateTask = (updated: Task) =>
  saveTasks(getTasks().map(t => (t.id === updated.id ? updated : t)));
export const deleteTask = (id: string) =>
  saveTasks(getTasks().filter(t => t.id !== id));

// ── Materials ─────────────────────────────────────────────────────────────────
export const getMaterials = (): Material[] => get<Material>(KEYS.materials, SEED_MATERIALS);
export const saveMaterials = (m: Material[]) => set(KEYS.materials, m);
export const addMaterial = (m: Material) => saveMaterials([...getMaterials(), m]);
export const updateMaterial = (updated: Material) =>
  saveMaterials(getMaterials().map(m => (m.id === updated.id ? updated : m)));
export const deleteMaterial = (id: string) =>
  saveMaterials(getMaterials().filter(m => m.id !== id));

// ── Reports ───────────────────────────────────────────────────────────────────
export const getReports = (): Report[] => get<Report>(KEYS.reports, SEED_REPORTS);
export const saveReports = (r: Report[]) => set(KEYS.reports, r);
export const addReport = (r: Report) => saveReports([...getReports(), r]);
export const deleteReport = (id: string) =>
  saveReports(getReports().filter(r => r.id !== id));
