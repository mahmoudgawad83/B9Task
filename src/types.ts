export interface Project {
  id: string;
  name: string;
  color: string;
}

export const PROJECTS: Project[] = [
  { id: 'program', name: 'Program', color: '#f59e0b' },
  { id: 'p1', name: 'Project Alpha', color: '#3b82f6' },
  { id: 'p2', name: 'Project Beta', color: '#8b5cf6' },
  { id: 'p3', name: 'Project Gamma', color: '#10b981' },
];

export type KPIDirection = 'higher-is-better' | 'lower-is-better';

export interface KPI {
  id: string;
  projectId: string;
  name: string;
  description: string;
  unit: string;
  target: number;
  direction: KPIDirection;
  category: string;
}

export interface KPIEntry {
  id: string;
  kpiId: string;
  date: string;
  value: number;
  note?: string;
}

export type ActionStatus = 'open' | 'in-progress' | 'closed';
export type ActionPriority = 'high' | 'medium' | 'low';

export interface ActionPlan {
  id: string;
  kpiId: string;
  projectId: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  status: ActionStatus;
  priority: ActionPriority;
  createdAt: string;
}

export interface AppState {
  kpis: KPI[];
  entries: KPIEntry[];
  actions: ActionPlan[];
}

export type AppAction =
  | { type: 'ADD_KPI'; kpi: KPI }
  | { type: 'UPDATE_KPI'; kpi: KPI }
  | { type: 'DELETE_KPI'; id: string }
  | { type: 'ADD_ENTRY'; entry: KPIEntry }
  | { type: 'DELETE_ENTRY'; id: string }
  | { type: 'ADD_ACTION'; action: ActionPlan }
  | { type: 'UPDATE_ACTION'; action: ActionPlan }
  | { type: 'DELETE_ACTION'; id: string }
  | { type: 'RESET'; state: AppState };
