import { KPI, KPIEntry } from './types';

export function genId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function getLatestEntry(entries: KPIEntry[], kpiId: string): KPIEntry | null {
  const kpiEntries = entries
    .filter(e => e.kpiId === kpiId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return kpiEntries[0] ?? null;
}

export function getPrevEntry(entries: KPIEntry[], kpiId: string): KPIEntry | null {
  const kpiEntries = entries
    .filter(e => e.kpiId === kpiId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return kpiEntries[1] ?? null;
}

export function computeGapPct(kpi: KPI, value: number): number {
  if (kpi.direction === 'higher-is-better') {
    if (kpi.target === 0) return 0;
    return Math.max(0, ((kpi.target - value) / Math.abs(kpi.target)) * 100);
  } else {
    if (kpi.target === 0) return value > 0 ? 100 : 0;
    return Math.max(0, ((value - kpi.target) / Math.abs(kpi.target)) * 100);
  }
}

export type KPIStatus = 'on-target' | 'warning' | 'critical';

export function getKPIStatus(kpi: KPI, value: number): KPIStatus {
  const gap = computeGapPct(kpi, value);
  if (gap <= 5) return 'on-target';
  if (gap <= 15) return 'warning';
  return 'critical';
}

export function statusColor(status: KPIStatus): string {
  switch (status) {
    case 'on-target': return 'text-green-700 bg-green-100';
    case 'warning': return 'text-yellow-700 bg-yellow-100';
    case 'critical': return 'text-red-700 bg-red-100';
  }
}

export function statusDot(status: KPIStatus): string {
  switch (status) {
    case 'on-target': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'critical': return 'bg-red-500';
  }
}

export function statusLabel(status: KPIStatus): string {
  switch (status) {
    case 'on-target': return 'On Target';
    case 'warning': return 'Warning';
    case 'critical': return 'Critical';
  }
}

export function formatValue(value: number, unit: string): string {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded} ${unit}`;
}

export function computeParetoData(kpis: KPI[], entries: KPIEntry[]) {
  const items = kpis
    .map(kpi => {
      const latest = getLatestEntry(entries, kpi.id);
      const gap = latest != null ? computeGapPct(kpi, latest.value) : 0;
      return { kpi, gap, currentValue: latest?.value };
    })
    .filter(d => d.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  const total = items.reduce((s, d) => s + d.gap, 0);
  let cumulative = 0;

  return items.map(d => {
    cumulative += d.gap;
    return {
      name: d.kpi.name,
      projectId: d.kpi.projectId,
      kpiId: d.kpi.id,
      gap: Math.round(d.gap * 10) / 10,
      cumulative: total > 0 ? Math.round((cumulative / total) * 1000) / 10 : 0,
    };
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function today(): string {
  return new Date().toISOString().split('T')[0];
}
