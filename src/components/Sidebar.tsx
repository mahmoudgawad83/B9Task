import React from 'react';
import { BarChart2, Layers, FolderKanban, RefreshCw } from 'lucide-react';
import { PROJECTS } from '../types';
import { useStore } from '../store';
import { seedData } from '../seed';

interface Props {
  selectedProject: string;
  onSelectProject: (id: string) => void;
}

const projectIcons: Record<string, string> = {
  program: '🏛',
  p1: '🏗',
  p2: '💻',
  p3: '⚙️',
};

export default function Sidebar({ selectedProject, onSelectProject }: Props) {
  const { state, dispatch } = useStore();

  function handleReset() {
    if (confirm('Reset all data to demo defaults? This cannot be undone.')) {
      dispatch({ type: 'RESET', state: seedData });
    }
  }

  function projectHealth(projectId: string) {
    const kpis = state.kpis.filter(k => k.projectId === projectId);
    if (kpis.length === 0) return null;
    const counts = { red: 0, yellow: 0, green: 0 };
    for (const kpi of kpis) {
      const entry = state.entries
        .filter(e => e.kpiId === kpi.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      if (!entry) continue;
      const gap = kpi.direction === 'higher-is-better'
        ? Math.max(0, ((kpi.target - entry.value) / Math.abs(kpi.target)) * 100)
        : Math.max(0, ((entry.value - kpi.target) / Math.abs(kpi.target || 1)) * 100);
      if (gap <= 5) counts.green++;
      else if (gap <= 15) counts.yellow++;
      else counts.red++;
    }
    return counts;
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-blue-400" size={22} />
          <span className="text-white font-bold text-lg tracking-tight">KPI Dashboard</span>
        </div>
        <p className="text-slate-400 text-xs mt-1">Programme Management</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Views</p>
        {PROJECTS.map(project => {
          const health = projectHealth(project.id);
          const active = selectedProject === project.id;
          return (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                active ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-base">{projectIcons[project.id]}</span>
              <span className="flex-1 text-sm font-medium">{project.name}</span>
              {health && (
                <span className="flex items-center gap-0.5">
                  {health.red > 0 && <span className="w-2 h-2 rounded-full bg-red-500" title={`${health.red} critical`} />}
                  {health.yellow > 0 && <span className="w-2 h-2 rounded-full bg-yellow-400" title={`${health.yellow} warning`} />}
                  {health.green > 0 && <span className="w-2 h-2 rounded-full bg-green-500" title={`${health.green} on target`} />}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700 space-y-2">
        <div className="px-3 py-2 bg-slate-800 rounded-lg">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Layers size={12} />
            <span>{state.kpis.length} KPIs</span>
            <span className="mx-1">·</span>
            <FolderKanban size={12} />
            <span>{state.actions.length} Actions</span>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-300 text-xs rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={12} />
          Reset to demo data
        </button>
      </div>
    </aside>
  );
}
