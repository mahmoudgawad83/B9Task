import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, TrendingUp, BarChart3, ListChecks } from 'lucide-react';
import { PROJECTS } from './types';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import DefinitionsTab from './components/DefinitionsTab';
import HistoryTab from './components/HistoryTab';
import ParetoTab from './components/ParetoTab';
import ActionsTab from './components/ActionsTab';

type Tab = 'overview' | 'definitions' | 'history' | 'pareto' | 'actions';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
  { id: 'definitions', label: 'KPI Definitions', icon: <BookOpen size={15} /> },
  { id: 'history', label: 'History', icon: <TrendingUp size={15} /> },
  { id: 'pareto', label: 'Pareto', icon: <BarChart3 size={15} /> },
  { id: 'actions', label: 'Action Plans', icon: <ListChecks size={15} /> },
];

export default function App() {
  const [selectedProject, setSelectedProject] = useState<string>('program');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const project = PROJECTS.find(p => p.id === selectedProject)!;

  return (
    <div className="flex min-h-screen">
      <Sidebar selectedProject={selectedProject} onSelectProject={id => { setSelectedProject(id); setActiveTab('overview'); }} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
              <h1 className="text-lg font-bold text-slate-900">{project.name}</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedProject === 'program'
                ? 'Aggregated view across all projects'
                : 'Project-level KPI management'}
            </p>
          </div>

          {/* Tab bar */}
          <nav className="ml-auto flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn flex items-center gap-1.5 ${activeTab === tab.id ? 'tab-btn-active' : 'tab-btn-inactive'}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && <OverviewTab projectId={selectedProject} />}
          {activeTab === 'definitions' && <DefinitionsTab projectId={selectedProject} />}
          {activeTab === 'history' && <HistoryTab projectId={selectedProject} />}
          {activeTab === 'pareto' && <ParetoTab projectId={selectedProject} />}
          {activeTab === 'actions' && <ActionsTab projectId={selectedProject} />}
        </div>
      </main>
    </div>
  );
}
