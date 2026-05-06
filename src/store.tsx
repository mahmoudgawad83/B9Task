import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction } from './types';
import { seedData } from './seed';

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_KPI':
      return { ...state, kpis: [...state.kpis, action.kpi] };
    case 'UPDATE_KPI':
      return { ...state, kpis: state.kpis.map(k => k.id === action.kpi.id ? action.kpi : k) };
    case 'DELETE_KPI':
      return {
        ...state,
        kpis: state.kpis.filter(k => k.id !== action.id),
        entries: state.entries.filter(e => e.kpiId !== action.id),
        actions: state.actions.filter(a => a.kpiId !== action.id),
      };
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.entry] };
    case 'DELETE_ENTRY':
      return { ...state, entries: state.entries.filter(e => e.id !== action.id) };
    case 'ADD_ACTION':
      return { ...state, actions: [...state.actions, action.action] };
    case 'UPDATE_ACTION':
      return { ...state, actions: state.actions.map(a => a.id === action.action.id ? action.action : a) };
    case 'DELETE_ACTION':
      return { ...state, actions: state.actions.filter(a => a.id !== action.id) };
    case 'RESET':
      return action.state;
    default:
      return state;
  }
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('kpi-dashboard-v1');
    if (saved) return JSON.parse(saved) as AppState;
  } catch { /* ignore */ }
  return seedData;
}

interface StoreContext {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const Ctx = createContext<StoreContext | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem('kpi-dashboard-v1', JSON.stringify(state));
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
