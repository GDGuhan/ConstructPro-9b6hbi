// ─── ConstructPro Type Definitions ───────────────────────────────────────────

export type Role = 'Admin' | 'Engineer' | 'Worker' | 'Client';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'on-hold';
  progress: number; // 0–100
  assignedEngineers: string[]; // user IDs
  budget: number;
  spent: number;
  location: string;
  createdAt: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string; // user ID
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  threshold: number; // low-stock alert level
  projectId: string;
  costPerUnit: number;
  supplier: string;
  lastUpdated: string;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: 'daily' | 'safety' | 'incident' | 'progress';
  imageUrl?: string;
  createdBy: string; // user ID
  date: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}
