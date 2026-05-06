import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react';
import { ActionPlan, ActionStatus, ActionPriority, KPI, PROJECTS } from '../types';
import { useStore } from '../store';
import { genId, today, formatDate } from '../utils';

interface Props {
  projectId: string;
}

const STATUS_CONFIG: Record<ActionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  'open': { label: 'Open', color: 'bg-slate-100 text-slate-700', icon: <Circle size={12} /> },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: <Clock size={12} /> },
  'closed': { label: 'Closed', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} /> },
};

const PRIORITY_CONFIG: Record<ActionPriority, { label: string; color: string }> = {
  'high': { label: 'High', color: 'bg-red-100 text-red-700' },
  'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  'low': { label: 'Low', color: 'bg-slate-100 text-slate-600' },
};

const emptyForm = (projectId: string, kpiId: string): Omit<ActionPlan, 'id' | 'createdAt'> => ({
  kpiId,
  projectId,
  title: '',
  description: '',
  owner: '',
  dueDate: '',
  status: 'open',
  priority: 'medium',
});

interface ActionModalProps {
  initial: Omit<ActionPlan, 'id' | 'createdAt'> & { id?: string; createdAt?: string };
  kpis: KPI[];
  projectId: string;
  onSave: (action: ActionPlan) => void;
  onClose: () => void;
}

function ActionModal({ initial, kpis, projectId, onSave, onClose }: ActionModalProps) {
  const [form, setForm] = useState({ ...initial });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...form,
      id: initial.id ?? genId(),
      createdAt: initial.createdAt ?? today(),
    } as ActionPlan);
  }

  const relevantKpis = projectId === 'program'
    ? kpis
    : kpis.filter(k => k.projectId === projectId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">{initial.id ? 'Edit Action Plan' : 'New Action Plan'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input required className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Action plan title" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the actions to be taken..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Owner *</label>
              <input required className="input" value={form.owner} onChange={e => set('owner', e.target.value)} placeholder="Responsible person" />
            </div>
            <div>
              <label className="label">Due Date *</label>
              <input required type="date" className="input" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="select" value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Linked KPI</label>
            <select className="select" value={form.kpiId} onChange={e => set('kpiId', e.target.value)}>
              <option value="">— None —</option>
              {relevantKpis.map(k => (
                <option key={k.id} value={k.id}>
                  {projectId === 'program' ? `[${PROJECTS.find(p => p.id === k.projectId)?.name}] ` : ''}{k.name}
                </option>
              ))}
            </select>
          </div>
          {projectId === 'program' && (
            <div>
              <label className="label">Project</label>
              <select className="select" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function isOverdue(dueDate: string, status: ActionStatus) {
  return status !== 'closed' && new Date(dueDate) < new Date();
}

export default function ActionsTab({ projectId }: Props) {
  const { state, dispatch } = useStore();
  const [modal, setModal] = useState<'add' | ActionPlan | null>(null);
  const [statusFilter, setStatusFilter] = useState<ActionStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ActionPriority | 'all'>('all');

  const actions = (projectId === 'program'
    ? state.actions
    : state.actions.filter(a => a.projectId === projectId)
  ).filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
    return true;
  }).sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const kpiMap = Object.fromEntries(state.kpis.map(k => [k.id, k]));
  const projectMap = Object.fromEntries(PROJECTS.map(p => [p.id, p]));

  function handleSave(action: ActionPlan) {
    if (state.actions.find(a => a.id === action.id)) {
      dispatch({ type: 'UPDATE_ACTION', action });
    } else {
      dispatch({ type: 'ADD_ACTION', action });
    }
    setModal(null);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this action plan?')) dispatch({ type: 'DELETE_ACTION', id });
  }

  function cycleStatus(action: ActionPlan) {
    const next: ActionStatus = action.status === 'open' ? 'in-progress' : action.status === 'in-progress' ? 'closed' : 'open';
    dispatch({ type: 'UPDATE_ACTION', action: { ...action, status: next } });
  }

  const counts = {
    open: state.actions.filter(a => (projectId === 'program' || a.projectId === projectId) && a.status === 'open').length,
    'in-progress': state.actions.filter(a => (projectId === 'program' || a.projectId === projectId) && a.status === 'in-progress').length,
    closed: state.actions.filter(a => (projectId === 'program' || a.projectId === projectId) && a.status === 'closed').length,
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(['open', 'in-progress', 'closed'] as ActionStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`card p-4 text-left transition-all hover:shadow-md ${statusFilter === s ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{counts[s]}</div>
            </button>
          );
        })}
      </div>

      {/* Filters + Add */}
      <div className="flex items-center gap-3 flex-wrap">
        <select className="select w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value as ActionStatus | 'all')}>
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <select className="select w-auto" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as ActionPriority | 'all')}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div className="ml-auto">
          <button className="btn-primary" onClick={() => setModal('add')}>
            <Plus size={15} />
            New Action Plan
          </button>
        </div>
      </div>

      {/* Action cards */}
      <div className="space-y-3">
        {actions.map(action => {
          const linkedKpi = kpiMap[action.kpiId];
          const overdue = isOverdue(action.dueDate, action.status);
          const statusCfg = STATUS_CONFIG[action.status];
          const priorityCfg = PRIORITY_CONFIG[action.priority];
          const proj = projectMap[action.projectId];

          return (
            <div key={action.id} className={`card p-4 hover:shadow-md transition-shadow ${overdue ? 'border-red-200' : ''}`}>
              <div className="flex items-start gap-4">
                <button
                  onClick={() => cycleStatus(action)}
                  className={`mt-0.5 flex-shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:opacity-80 ${statusCfg.color}`}
                  title="Click to advance status"
                >
                  {statusCfg.icon}
                  {statusCfg.label}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{action.title}</h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityCfg.color}`}>
                        {priorityCfg.label}
                      </span>
                      <button onClick={() => setModal(action)} className="p-1 text-slate-400 hover:text-blue-600 rounded"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(action.id)} className="p-1 text-slate-400 hover:text-red-600 rounded"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  {action.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{action.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>👤 {action.owner}</span>
                    <span className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-medium' : ''}`}>
                      {overdue && <AlertCircle size={11} />}
                      📅 Due: {action.dueDate ? formatDate(action.dueDate) : '—'}
                      {overdue && ' · Overdue'}
                    </span>
                    {linkedKpi && (
                      <span className="flex items-center gap-1">
                        📊 {linkedKpi.name}
                      </span>
                    )}
                    {projectId === 'program' && proj && (
                      <span
                        className="px-1.5 py-0.5 rounded font-medium text-xs"
                        style={{ backgroundColor: proj.color + '20', color: proj.color }}
                      >
                        {proj.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {actions.length === 0 && (
          <div className="card p-12 text-center text-slate-400">
            <CheckCircle2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No action plans found</p>
            <p className="text-sm mt-1">Create one to track corrective actions for your KPIs.</p>
          </div>
        )}
      </div>

      {modal === 'add' && (
        <ActionModal
          initial={emptyForm(projectId, '')}
          kpis={state.kpis}
          projectId={projectId}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal && modal !== 'add' && (
        <ActionModal
          initial={modal}
          kpis={state.kpis}
          projectId={projectId}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
