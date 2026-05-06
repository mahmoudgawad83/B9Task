import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';
import { KPI, PROJECTS } from '../types';
import { useStore } from '../store';
import { genId, today, formatDate } from '../utils';

interface Props {
  projectId: string;
}

function AddEntryModal({ kpi, onClose }: { kpi: KPI; onClose: () => void }) {
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
        <h3 className="text-base font-semibold text-slate-900 mb-1">Add History Entry</h3>
        <p className="text-sm text-slate-500 mb-4">{kpi.name}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Value ({kpi.unit})</label>
            <input type="number" step="any" required className="input" autoFocus value={value} onChange={e => setValue(e.target.value)} />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" required className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Note (optional)</label>
            <input type="text" className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Context..." />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const PROJECT_COLORS: Record<string, string> = {
  program: '#f59e0b',
  p1: '#3b82f6',
  p2: '#8b5cf6',
  p3: '#10b981',
};

export default function HistoryTab({ projectId }: Props) {
  const { state, dispatch } = useStore();
  const [selectedKpiId, setSelectedKpiId] = useState<string>('');
  const [addModal, setAddModal] = useState(false);

  const kpis = projectId === 'program'
    ? state.kpis
    : state.kpis.filter(k => k.projectId === projectId);

  const selectedKpi: KPI | undefined = kpis.find(k => k.id === selectedKpiId) ?? kpis[0];

  const entries = selectedKpi
    ? state.entries
        .filter(e => e.kpiId === selectedKpi.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const chartData = entries.map(e => ({
    date: e.date,
    value: e.value,
    target: selectedKpi?.target,
  }));

  const color = selectedKpi ? PROJECT_COLORS[selectedKpi.projectId] ?? '#3b82f6' : '#3b82f6';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-48">
          <label className="label">Select KPI</label>
          <select
            className="select"
            value={selectedKpi?.id ?? ''}
            onChange={e => setSelectedKpiId(e.target.value)}
          >
            {kpis.map(k => (
              <option key={k.id} value={k.id}>
                {projectId === 'program' ? `[${PROJECTS.find(p => p.id === k.projectId)?.name}] ` : ''}{k.name}
              </option>
            ))}
          </select>
        </div>
        {selectedKpi && (
          <div className="mt-5">
            <button className="btn-primary" onClick={() => setAddModal(true)}>
              <Plus size={15} />
              Add Entry
            </button>
          </div>
        )}
      </div>

      {selectedKpi && (
        <>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">{selectedKpi.name} — Trend</h3>
              <span className="ml-auto text-xs text-slate-400">Target: {selectedKpi.target} {selectedKpi.unit}</span>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickFormatter={d => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} width={50} />
                  <Tooltip
                    formatter={(v: number) => [`${v} ${selectedKpi.unit}`, 'Value']}
                    labelFormatter={l => formatDate(l)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <ReferenceLine y={selectedKpi.target} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Target', position: 'right', fontSize: 11, fill: '#94a3b8' }} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={selectedKpi.name}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ fill: color, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No history entries yet.</div>
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">History Entries</h3>
              <span className="text-xs text-slate-400">{entries.length} records</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">vs Target</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...entries].reverse().map(entry => {
                  const gap = selectedKpi.direction === 'higher-is-better'
                    ? entry.value - selectedKpi.target
                    : selectedKpi.target - entry.value;
                  const gapColor = gap >= 0 ? 'text-green-600' : 'text-red-600';
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-700">{formatDate(entry.date)}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-medium text-slate-900">
                        {entry.value} {selectedKpi.unit}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-mono text-sm ${gapColor}`}>
                        {gap >= 0 ? '+' : ''}{Math.round(gap * 100) / 100}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{entry.note ?? '—'}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => {
                            if (confirm('Delete this entry?')) dispatch({ type: 'DELETE_ENTRY', id: entry.id });
                          }}
                          className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No entries yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {addModal && selectedKpi && (
        <AddEntryModal kpi={selectedKpi} onClose={() => setAddModal(false)} />
      )}
    </div>
  );
}
