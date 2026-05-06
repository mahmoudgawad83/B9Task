import React, { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { PROJECTS } from '../types';
import { useStore } from '../store';
import { computeParetoData } from '../utils';

interface Props {
  projectId: string;
}

const PROJECT_COLORS: Record<string, string> = {
  program: '#f59e0b',
  p1: '#3b82f6',
  p2: '#8b5cf6',
  p3: '#10b981',
};

const BAR_COLOR_DEFAULT = '#3b82f6';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs space-y-1 max-w-56">
      <p className="font-semibold text-slate-800 mb-2 leading-tight">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-slate-500">{p.name}</span>
          <span className="font-mono font-medium" style={{ color: p.color }}>
            {p.name === 'Cumulative %' ? `${p.value}%` : `${p.value}%`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ParetoTab({ projectId }: Props) {
  const { state } = useStore();
  const [topN, setTopN] = useState(10);

  const isProgram = projectId === 'program';

  const kpis = isProgram
    ? state.kpis
    : state.kpis.filter(k => k.projectId === projectId);

  const allParetoData = computeParetoData(kpis, state.entries);
  const paretoData = allParetoData.slice(0, topN);

  const hasData = paretoData.length > 0;
  const top80Idx = paretoData.findIndex(d => d.cumulative >= 80);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="card flex-1 p-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">How to read this chart</p>
          <p className="text-xs text-blue-700">
            Bars show each KPI's gap from target (as % of target), sorted largest to smallest.
            The line shows cumulative % of total gap. KPIs left of the 80% line drive most of your programme's underperformance.
          </p>
        </div>
        <div className="min-w-32">
          <label className="label">Show top</label>
          <select className="select" value={topN} onChange={e => setTopN(parseInt(e.target.value))}>
            <option value={5}>5 KPIs</option>
            <option value={10}>10 KPIs</option>
            <option value={15}>15 KPIs</option>
            <option value={999}>All</option>
          </select>
        </div>
      </div>

      {hasData ? (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-slate-700">
              Pareto Analysis — KPI Gap (% of Target)
            </h3>
            {isProgram && <span className="text-xs text-slate-400 ml-auto">All projects combined</span>}
          </div>
          {top80Idx >= 0 && (
            <p className="text-xs text-slate-500 mb-4">
              Top {top80Idx + 1} KPI{top80Idx !== 0 ? 's' : ''} account for ≥80% of total gap
            </p>
          )}
          <ResponsiveContainer width="100%" height={380}>
            <ComposedChart
              data={paretoData}
              margin={{ top: 10, right: 60, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#64748b' }}
                angle={-40}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={v => `${v}%`}
                label={{ value: 'Gap %', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: '#94a3b8' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={v => `${v}%`}
                label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 11, fill: '#94a3b8' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                verticalAlign="top"
              />
              <ReferenceLine
                yAxisId="right"
                y={80}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                label={{ value: '80%', position: 'right', fontSize: 11, fill: '#ef4444' }}
              />
              <Bar yAxisId="left" dataKey="gap" name="Gap %" radius={[4, 4, 0, 0]}>
                {paretoData.map((entry, index) => (
                  <Cell
                    key={entry.kpiId}
                    fill={isProgram ? (PROJECT_COLORS[entry.projectId] ?? BAR_COLOR_DEFAULT) : (PROJECT_COLORS[projectId] ?? BAR_COLOR_DEFAULT)}
                    opacity={index <= (top80Idx >= 0 ? top80Idx : paretoData.length) ? 1 : 0.5}
                  />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                name="Cumulative %"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ fill: '#f97316', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {isProgram && (
            <div className="flex flex-wrap gap-3 mt-4">
              {PROJECTS.filter(p => p.id !== 'program').map(p => (
                <div key={p.id} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card p-12 text-center text-slate-400">
          <AlertTriangle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No gaps to display</p>
          <p className="text-sm mt-1">All KPIs are on target, or no readings have been entered yet.</p>
        </div>
      )}

      {/* Summary table */}
      {hasData && (
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Gap Summary</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">KPI</th>
                {isProgram && <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>}
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gap %</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cumulative %</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">80% Cut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allParetoData.map((row, i) => {
                const in80 = row.cumulative <= 80 || (i > 0 && allParetoData[i - 1].cumulative < 80);
                return (
                  <tr key={row.kpiId} className={`hover:bg-slate-50 ${in80 ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">{i + 1}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.name}</td>
                    {isProgram && (
                      <td className="px-4 py-2.5">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-medium"
                          style={{
                            backgroundColor: (PROJECT_COLORS[row.projectId] ?? '#3b82f6') + '20',
                            color: PROJECT_COLORS[row.projectId] ?? '#3b82f6',
                          }}
                        >
                          {PROJECTS.find(p => p.id === row.projectId)?.name}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-2.5 text-right font-mono text-red-700 font-medium">{row.gap}%</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-600">{row.cumulative}%</td>
                    <td className="px-4 py-2.5">
                      {in80 && <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded font-medium">Top 80%</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
