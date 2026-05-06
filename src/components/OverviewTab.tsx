import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Plus, Target } from 'lucide-react';
import { KPI, KPIEntry, PROJECTS } from '../types';
import { useStore } from '../store';
import {
  getLatestEntry, getPrevEntry, getKPIStatus, statusColor, statusDot, statusLabel,
  formatValue, genId, today,
} from '../utils';

interface Props {
  projectId: string;
}

function TrendIcon({ kpi, entries }: { kpi: KPI; entries: KPIEntry[] }) {
  const latest = getLatestEntry(entries, kpi.id);
  const prev = getPrevEntry(entries, kpi.id);
  if (!latest || !prev) return <Minus size={14} className="text-slate-400" />;
  const diff = latest.value - prev.value;
  if (Math.abs(diff) < 0.001) return <Minus size={14} className="text-slate-400" />;
  const improving =
    (kpi.direction === 'higher-is-better' && diff > 0) ||
    (kpi.direction === 'lower-is-better' && diff < 0);
  return improving
    ? <TrendingUp size={14} className="text-green-500" />
    : <TrendingDown size={14} className="text-red-500" />;
}

interface UpdateModalProps {
  kpi: KPI;
  onClose: () => void;
}

function UpdateModal({ kpi, onClose }: UpdateModalProps) {
  const { dispatch } = useStore();
  const [value, setValue] = useState('');
  const [date, setDate] = useState(today());
  const [note, setNote] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(value);
    if (isNaN(num)) return;
    dispatch({
      type: 'ADD_ENTRY',
      entry: { id: genId(), kpiId: kpi.id, date, value: num, note: note || undefined },
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-1">Update KPI Value</h3>
        <p className="text-sm text-slate-500 mb-4">{kpi.name} · Target: {formatValue(kpi.target, kpi.unit)}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Value ({kpi.unit})</label>
            <input
              type="number"
              step="any"
              required
              className="input"
              placeholder={`e.g. ${kpi.target}`}
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" required className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Note (optional)</label>
            <input type="text" className="input" placeholder="Context or remarks..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OverviewTab({ projectId }: Props) {
  const { state } = useStore();
  const [updateKPI, setUpdateKPI] = useState<KPI | null>(null);

  const isProgram = projectId === 'program';
  const kpis = isProgram
    ? state.kpis
    : state.kpis.filter(k => k.projectId === projectId);

  const projectMap = Object.fromEntries(PROJECTS.map(p => [p.id, p]));

  const categories = [...new Set(kpis.map(k => k.category))].sort();
  const grouped = Object.fromEntries(
    categories.map(cat => [cat, kpis.filter(k => k.category === cat)])
  );

  const allLatest = kpis.map(k => {
    const e = getLatestEntry(state.entries, k.id);
    return { kpi: k, entry: e };
  });

  const statusCounts = {
    'on-target': allLatest.filter(({ kpi, entry }) => entry && getKPIStatus(kpi, entry.value) === 'on-target').length,
    'warning': allLatest.filter(({ kpi, entry }) => entry && getKPIStatus(kpi, entry.value) === 'warning').length,
    'critical': allLatest.filter(({ kpi, entry }) => entry && getKPIStatus(kpi, entry.value) === 'critical').length,
    'no-data': allLatest.filter(({ entry }) => !entry).length,
  };

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'On Target', count: statusCounts['on-target'], bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
          { label: 'Warning', count: statusCounts['warning'], bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
          { label: 'Critical', count: statusCounts['critical'], bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
          { label: 'No Data', count: statusCounts['no-data'], bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
        ].map(({ label, count, bg, text, border }) => (
          <div key={label} className={`card ${bg} border ${border} p-4 text-center`}>
            <div className={`text-3xl font-bold ${text}`}>{count}</div>
            <div className={`text-xs font-medium mt-1 ${text}`}>{label}</div>
          </div>
        ))}
      </div>

      {/* KPI cards by category */}
      {Object.entries(grouped).map(([category, catKpis]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catKpis.map(kpi => {
              const latest = getLatestEntry(state.entries, kpi.id);
              const prev = getPrevEntry(state.entries, kpi.id);
              const status = latest ? getKPIStatus(kpi, latest.value) : null;
              const diff = latest && prev ? latest.value - prev.value : null;

              return (
                <div key={kpi.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {status && <span className={`inline-block w-2 h-2 rounded-full ${statusDot(status)}`} />}
                        <h4 className="text-sm font-semibold text-slate-800 truncate">{kpi.name}</h4>
                      </div>
                      {isProgram && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: projectMap[kpi.projectId]?.color + '20', color: projectMap[kpi.projectId]?.color }}
                        >
                          {projectMap[kpi.projectId]?.name}
                        </span>
                      )}
                    </div>
                    {status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor(status)}`}>
                        {statusLabel(status)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {latest ? `${Math.round(latest.value * 100) / 100}` : '—'}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{kpi.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                        <Target size={11} />
                        <span>{kpi.target} {kpi.unit}</span>
                      </div>
                      {diff !== null && (
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <TrendIcon kpi={kpi} entries={state.entries} />
                          <span className="text-xs text-slate-500">
                            {diff > 0 ? '+' : ''}{Math.round(diff * 100) / 100}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {latest && (
                    <div className="mt-1">
                      {(() => {
                        const gap = kpi.direction === 'higher-is-better'
                          ? latest.value / kpi.target
                          : kpi.target / latest.value;
                        const pct = Math.min(100, Math.round(gap * 100));
                        const barColor = status === 'on-target' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500';
                        return (
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400">
                      {latest ? new Date(latest.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No readings'}
                    </span>
                    <button
                      onClick={() => setUpdateKPI(kpi)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Plus size={12} />
                      Update
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {kpis.length === 0 && (
        <div className="card p-12 text-center text-slate-400">
          <Target size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No KPIs defined yet</p>
          <p className="text-sm mt-1">Go to the KPI Definitions tab to add KPIs.</p>
        </div>
      )}

      {updateKPI && <UpdateModal kpi={updateKPI} onClose={() => setUpdateKPI(null)} />}
    </div>
  );
}
