export type TaskStatus = 'inbox' | 'next_action' | 'waiting_for' | 'someday_maybe' | 'completed';
export type Context = '@home' | '@phone' | '@computer' | '@work' | '@errands';
export type TimeEstimate = '5m' | '10m' | '30m';
export type EnergyLevel = 'low' | 'high';

export interface Task {
  id: string;
  title: string;
  notes: string;
  status: TaskStatus;
  projectId: string | null;
  context: Context | null;
  timeEstimate: TimeEstimate | null;
  energyLevel: EnergyLevel | null;
  dueDate: string | null;
  delegatedTo: string | null;
  createdAt: string;
  completedAt: string | null;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  archived: boolean;
}

export type ViewType = 'inbox' | 'next' | 'projects' | 'waiting' | 'someday' | 'contexts';

export interface AppState {
  tasks: Task[];
  projects: Project[];
  currentView: ViewType;
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}
