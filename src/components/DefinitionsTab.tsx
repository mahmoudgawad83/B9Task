import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { KPI, KPIDirection, PROJECTS } from '../types';
import { useStore } from '../store';
import { genId } from '../utils';

interface Props {
  projectId: string;
}

const CATEGORIES = ['Schedule', 'Cost', 'Quality', 'Safety', 'Delivery', 'Customer', 'Efficiency', 'Value', 'Governance', 'Other'];

const emptyForm = (): Omit<KPI, 'id'> => ({
  projectId: 'p1',
  name: '',
  description: '',
  unit: '',
  target: 0,
  direction: 'higher-is-better',
  category: 'Quality',
});

interface KPIModalProps {
  initial: Omit<KPI, 'id'> & { id?: string };
  projectId: string;
  onSave: (kpi: KPI) => void;
  onClose: () => void;
}

function KPIModal({ initial, projectId, onSave, onClose }: KPIModalProps) {
  const [form, setForm] = useState({ ...initial, projectId: initial.projectId || projectId });

  function set(field: string, value: string | number) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, id: initial.id ?? genId() } as KPI);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">{initial.id ? 'Edit KPI' : 'Add KPI'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">KPI Name *</label>
              <input required className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Schedule Performance Index" />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <input className="input" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of the KPI" />
            </div>
            <div>
              <label className="label">Unit *</label>
              <input required className="input" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="e.g. %, index, days" />
            </div>
            <div>
              <label className="label">Target *</label>
              <input required type="number" step="any" className="input" value={form.target} onChange={e => set('target', parseFloat(e.target.value))} />
            </div>
            <div>
              <label className="label">Direction *</label>
              <select className="select" value={form.direction} onChange={e => set('direction', e.target.value as KPIDirection)}>
                <option value="higher-is-better">Higher is Better</option>
                <option value="lower-is-better">Lower is Better</option>
              </select>
            </div>
            <div>
              <label className="label">Category *</label>
              <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Project</label>
              <select className="select" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save KPI</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DefinitionsTab({ projectId }: Props) {
  const { state, dispatch } = useStore();
  const [modal, setModal] = useState<'add' | KPI | null>(null);

  const kpis = projectId === 'program'
    ? state.kpis
    : state.kpis.filter(k => k.projectId === projectId);

  const projectMap = Object.fromEntries(PROJECTS.map(p => [p.id, p]));

  function handleSave(kpi: KPI) {
    if (state.kpis.find(k => k.id === kpi.id)) {
      dispatch({ type: 'UPDATE_KPI', kpi });
    } else {
      dispatch({ type: 'ADD_KPI', kpi });
    }
    setModal(null);
  }

  function handleDelete(id: string) {
    const entryCount = state.entries.filter(e => e.kpiId === id).length;
    const msg = entryCount > 0
      ? `This will also delete ${entryCount} history entries and all linked action plans. Continue?`
      : 'Delete this KPI and all linked action plans?';
    if (confirm(msg)) {
      dispatch({ type: 'DELETE_KPI', id });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{kpis.length} KPI{kpis.length !== 1 ? 's' : ''} defined</p>
        <button
          className="btn-primary"
          onClick={() => setModal('add')}
        >
          <Plus size={15} />
          Add KPI
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">KPI Name</th>
              {projectId === 'program' && (
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
              )}
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Direction</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kpis.map(kpi => (
              <tr key={kpi.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{kpi.name}</div>
                  {kpi.description && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{kpi.description}</div>}
                </td>
                {projectId === 'program' && (
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{ backgroundColor: projectMap[kpi.projectId]?.color + '20', color: projectMap[kpi.projectId]?.color }}
                    >
                      {projectMap[kpi.projectId]?.name}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-slate-600">{kpi.category}</td>
                <td className="px-4 py-3 text-slate-600">{kpi.unit}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-800">{kpi.target}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${kpi.direction === 'higher-is-better' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                    {kpi.direction === 'higher-is-better' ? '↑ Higher' : '↓ Lower'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setModal(kpi)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(kpi.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {kpis.length === 0 && (
              <tr>
                <td colSpan={projectId === 'program' ? 7 : 6} className="px-4 py-12 text-center text-slate-400 text-sm">
                  No KPIs defined. Click "Add KPI" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal === 'add' && (
        <KPIModal
          initial={{ ...emptyForm(), projectId }}
          projectId={projectId}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {modal && modal !== 'add' && (
        <KPIModal
          initial={modal}
          projectId={projectId}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
