import { Task, Project, ViewType } from './types';
import { seedTasks, seedProjects } from './seed';

const STORAGE_KEY = 'gtd-app-state';

interface StoredState {
  tasks: Task[];
  projects: Project[];
  theme: 'light' | 'dark';
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
  return {
    tasks: seedTasks,
    projects: seedProjects,
    theme: 'light',
  };
}

function saveState(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function getInitialState(): StoredState {
  return loadState();
}

export function persistState(state: StoredState): void {
  saveState(state);
}

export function getTasksByStatus(tasks: Task[], status: Task['status']): Task[] {
  return tasks
    .filter((t) => t.status === status)
    .sort((a, b) => a.order - b.order);
}

export function getTasksByProject(tasks: Task[], projectId: string): Task[] {
  return tasks
    .filter((t) => t.projectId === projectId && t.status !== 'completed')
    .sort((a, b) => a.order - b.order);
}

export function getTasksByContext(tasks: Task[], context: Task['context']): Task[] {
  return tasks
    .filter((t) => t.context === context && t.status !== 'completed' && t.status !== 'inbox' && t.status !== 'someday_maybe')
    .sort((a, b) => a.order - b.order);
}

export function filterTasks(tasks: Task[], filters: {
  energy?: 'low' | 'high';
  time?: '5m' | '10m' | '30m';
  dueFilter?: 'overdue' | 'today' | 'upcoming';
}): Task[] {
  let filtered = [...tasks];
  const today = new Date().toISOString().split('T')[0];

  if (filters.energy) {
    filtered = filtered.filter((t) => t.energyLevel === filters.energy);
  }
  if (filters.time) {
    filtered = filtered.filter((t) => t.timeEstimate === filters.time);
  }
  if (filters.dueFilter) {
    if (filters.dueFilter === 'overdue') {
      filtered = filtered.filter((t) => t.dueDate && t.dueDate < today);
    } else if (filters.dueFilter === 'today') {
      filtered = filtered.filter((t) => t.dueDate === today);
    } else if (filters.dueFilter === 'upcoming') {
      filtered = filtered.filter((t) => t.dueDate && t.dueDate > today);
    }
  }

  return filtered;
}

export type { ViewType };
