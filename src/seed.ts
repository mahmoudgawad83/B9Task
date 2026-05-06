import { AppState } from './types';

const DATES = ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30', '2026-05-05'];

export const seedData: AppState = {
  kpis: [
    // Project Alpha (Construction)
    { id: 'kpi-p1-1', projectId: 'p1', name: 'Schedule Performance Index', description: 'Ratio of earned value to planned value', unit: 'index', target: 1.0, direction: 'higher-is-better', category: 'Schedule' },
    { id: 'kpi-p1-2', projectId: 'p1', name: 'Cost Performance Index', description: 'Ratio of earned value to actual cost', unit: 'index', target: 1.0, direction: 'higher-is-better', category: 'Cost' },
    { id: 'kpi-p1-3', projectId: 'p1', name: 'Safety Incidents', description: 'Recordable safety incidents per month', unit: 'incidents', target: 0, direction: 'lower-is-better', category: 'Safety' },
    { id: 'kpi-p1-4', projectId: 'p1', name: 'Quality Audit Score', description: 'Monthly quality audit score', unit: '%', target: 95, direction: 'higher-is-better', category: 'Quality' },
    { id: 'kpi-p1-5', projectId: 'p1', name: 'Milestone Completion Rate', description: 'Milestones completed on time', unit: '%', target: 100, direction: 'higher-is-better', category: 'Schedule' },

    // Project Beta (Software)
    { id: 'kpi-p2-1', projectId: 'p2', name: 'Sprint Velocity', description: 'Story points completed per sprint', unit: 'pts', target: 80, direction: 'higher-is-better', category: 'Delivery' },
    { id: 'kpi-p2-2', projectId: 'p2', name: 'Bug Escape Rate', description: 'Defects found in production vs total', unit: '%', target: 2, direction: 'lower-is-better', category: 'Quality' },
    { id: 'kpi-p2-3', projectId: 'p2', name: 'Code Coverage', description: 'Percentage of code covered by tests', unit: '%', target: 80, direction: 'higher-is-better', category: 'Quality' },
    { id: 'kpi-p2-4', projectId: 'p2', name: 'Deployment Frequency', description: 'Number of deployments per month', unit: '/month', target: 8, direction: 'higher-is-better', category: 'Delivery' },
    { id: 'kpi-p2-5', projectId: 'p2', name: 'Customer Satisfaction', description: 'End-user satisfaction score', unit: '/5', target: 4.5, direction: 'higher-is-better', category: 'Customer' },

    // Project Gamma (Operations)
    { id: 'kpi-p3-1', projectId: 'p3', name: 'On-Time Delivery Rate', description: 'Orders delivered on or before due date', unit: '%', target: 95, direction: 'higher-is-better', category: 'Delivery' },
    { id: 'kpi-p3-2', projectId: 'p3', name: 'First Pass Yield', description: 'Units passing quality check on first attempt', unit: '%', target: 95, direction: 'higher-is-better', category: 'Quality' },
    { id: 'kpi-p3-3', projectId: 'p3', name: 'Mean Cycle Time', description: 'Average time from order to delivery', unit: 'days', target: 3, direction: 'lower-is-better', category: 'Efficiency' },
    { id: 'kpi-p3-4', projectId: 'p3', name: 'Defect Rate', description: 'Defective units as % of total production', unit: '%', target: 1, direction: 'lower-is-better', category: 'Quality' },
    { id: 'kpi-p3-5', projectId: 'p3', name: 'Staff Utilization', description: 'Productive hours vs available hours', unit: '%', target: 85, direction: 'higher-is-better', category: 'Efficiency' },

    // Program Level
    { id: 'kpi-pg-1', projectId: 'program', name: 'Program SPI', description: 'Aggregate schedule performance across all projects', unit: 'index', target: 1.0, direction: 'higher-is-better', category: 'Schedule' },
    { id: 'kpi-pg-2', projectId: 'program', name: 'Program CPI', description: 'Aggregate cost performance across all projects', unit: 'index', target: 1.0, direction: 'higher-is-better', category: 'Cost' },
    { id: 'kpi-pg-3', projectId: 'program', name: 'Benefits Realization', description: 'Realized benefits vs planned benefits', unit: '%', target: 90, direction: 'higher-is-better', category: 'Value' },
    { id: 'kpi-pg-4', projectId: 'program', name: 'Stakeholder Satisfaction', description: 'Stakeholder survey satisfaction score', unit: '%', target: 80, direction: 'higher-is-better', category: 'Governance' },
  ],

  entries: [
    // Alpha - SPI
    { id: 'e-p1-1-1', kpiId: 'kpi-p1-1', date: DATES[0], value: 0.82, note: 'Subcontractor delays in Q1' },
    { id: 'e-p1-1-2', kpiId: 'kpi-p1-1', date: DATES[1], value: 0.85 },
    { id: 'e-p1-1-3', kpiId: 'kpi-p1-1', date: DATES[2], value: 0.88 },
    { id: 'e-p1-1-4', kpiId: 'kpi-p1-1', date: DATES[3], value: 0.90 },
    { id: 'e-p1-1-5', kpiId: 'kpi-p1-1', date: DATES[4], value: 0.92, note: 'Recovery actions showing results' },

    // Alpha - CPI
    { id: 'e-p1-2-1', kpiId: 'kpi-p1-2', date: DATES[0], value: 0.91 },
    { id: 'e-p1-2-2', kpiId: 'kpi-p1-2', date: DATES[1], value: 0.90, note: 'Material cost overrun' },
    { id: 'e-p1-2-3', kpiId: 'kpi-p1-2', date: DATES[2], value: 0.92 },
    { id: 'e-p1-2-4', kpiId: 'kpi-p1-2', date: DATES[3], value: 0.93 },
    { id: 'e-p1-2-5', kpiId: 'kpi-p1-2', date: DATES[4], value: 0.94 },

    // Alpha - Safety
    { id: 'e-p1-3-1', kpiId: 'kpi-p1-3', date: DATES[0], value: 3, note: 'Two near-misses, one recordable' },
    { id: 'e-p1-3-2', kpiId: 'kpi-p1-3', date: DATES[1], value: 2 },
    { id: 'e-p1-3-3', kpiId: 'kpi-p1-3', date: DATES[2], value: 1 },
    { id: 'e-p1-3-4', kpiId: 'kpi-p1-3', date: DATES[3], value: 2, note: 'Incident on new site area' },
    { id: 'e-p1-3-5', kpiId: 'kpi-p1-3', date: DATES[4], value: 1 },

    // Alpha - Quality
    { id: 'e-p1-4-1', kpiId: 'kpi-p1-4', date: DATES[0], value: 88 },
    { id: 'e-p1-4-2', kpiId: 'kpi-p1-4', date: DATES[1], value: 89 },
    { id: 'e-p1-4-3', kpiId: 'kpi-p1-4', date: DATES[2], value: 91 },
    { id: 'e-p1-4-4', kpiId: 'kpi-p1-4', date: DATES[3], value: 92 },
    { id: 'e-p1-4-5', kpiId: 'kpi-p1-4', date: DATES[4], value: 93 },

    // Alpha - Milestone
    { id: 'e-p1-5-1', kpiId: 'kpi-p1-5', date: DATES[0], value: 75 },
    { id: 'e-p1-5-2', kpiId: 'kpi-p1-5', date: DATES[1], value: 78 },
    { id: 'e-p1-5-3', kpiId: 'kpi-p1-5', date: DATES[2], value: 80 },
    { id: 'e-p1-5-4', kpiId: 'kpi-p1-5', date: DATES[3], value: 83 },
    { id: 'e-p1-5-5', kpiId: 'kpi-p1-5', date: DATES[4], value: 85 },

    // Beta - Velocity
    { id: 'e-p2-1-1', kpiId: 'kpi-p2-1', date: DATES[0], value: 65 },
    { id: 'e-p2-1-2', kpiId: 'kpi-p2-1', date: DATES[1], value: 68 },
    { id: 'e-p2-1-3', kpiId: 'kpi-p2-1', date: DATES[2], value: 72 },
    { id: 'e-p2-1-4', kpiId: 'kpi-p2-1', date: DATES[3], value: 75 },
    { id: 'e-p2-1-5', kpiId: 'kpi-p2-1', date: DATES[4], value: 78 },

    // Beta - Bug Escape
    { id: 'e-p2-2-1', kpiId: 'kpi-p2-2', date: DATES[0], value: 4.2, note: 'High escape rate after major release' },
    { id: 'e-p2-2-2', kpiId: 'kpi-p2-2', date: DATES[1], value: 3.8 },
    { id: 'e-p2-2-3', kpiId: 'kpi-p2-2', date: DATES[2], value: 3.5 },
    { id: 'e-p2-2-4', kpiId: 'kpi-p2-2', date: DATES[3], value: 3.0 },
    { id: 'e-p2-2-5', kpiId: 'kpi-p2-2', date: DATES[4], value: 2.8 },

    // Beta - Coverage
    { id: 'e-p2-3-1', kpiId: 'kpi-p2-3', date: DATES[0], value: 72 },
    { id: 'e-p2-3-2', kpiId: 'kpi-p2-3', date: DATES[1], value: 74 },
    { id: 'e-p2-3-3', kpiId: 'kpi-p2-3', date: DATES[2], value: 75 },
    { id: 'e-p2-3-4', kpiId: 'kpi-p2-3', date: DATES[3], value: 77 },
    { id: 'e-p2-3-5', kpiId: 'kpi-p2-3', date: DATES[4], value: 78 },

    // Beta - Deploy Freq
    { id: 'e-p2-4-1', kpiId: 'kpi-p2-4', date: DATES[0], value: 5 },
    { id: 'e-p2-4-2', kpiId: 'kpi-p2-4', date: DATES[1], value: 6 },
    { id: 'e-p2-4-3', kpiId: 'kpi-p2-4', date: DATES[2], value: 6 },
    { id: 'e-p2-4-4', kpiId: 'kpi-p2-4', date: DATES[3], value: 7 },
    { id: 'e-p2-4-5', kpiId: 'kpi-p2-4', date: DATES[4], value: 7 },

    // Beta - Cust Sat
    { id: 'e-p2-5-1', kpiId: 'kpi-p2-5', date: DATES[0], value: 3.8 },
    { id: 'e-p2-5-2', kpiId: 'kpi-p2-5', date: DATES[1], value: 3.9 },
    { id: 'e-p2-5-3', kpiId: 'kpi-p2-5', date: DATES[2], value: 4.0 },
    { id: 'e-p2-5-4', kpiId: 'kpi-p2-5', date: DATES[3], value: 4.1 },
    { id: 'e-p2-5-5', kpiId: 'kpi-p2-5', date: DATES[4], value: 4.2 },

    // Gamma - OTD
    { id: 'e-p3-1-1', kpiId: 'kpi-p3-1', date: DATES[0], value: 88 },
    { id: 'e-p3-1-2', kpiId: 'kpi-p3-1', date: DATES[1], value: 89 },
    { id: 'e-p3-1-3', kpiId: 'kpi-p3-1', date: DATES[2], value: 91 },
    { id: 'e-p3-1-4', kpiId: 'kpi-p3-1', date: DATES[3], value: 92 },
    { id: 'e-p3-1-5', kpiId: 'kpi-p3-1', date: DATES[4], value: 93 },

    // Gamma - FPY
    { id: 'e-p3-2-1', kpiId: 'kpi-p3-2', date: DATES[0], value: 91 },
    { id: 'e-p3-2-2', kpiId: 'kpi-p3-2', date: DATES[1], value: 92 },
    { id: 'e-p3-2-3', kpiId: 'kpi-p3-2', date: DATES[2], value: 93 },
    { id: 'e-p3-2-4', kpiId: 'kpi-p3-2', date: DATES[3], value: 94 },
    { id: 'e-p3-2-5', kpiId: 'kpi-p3-2', date: DATES[4], value: 94 },

    // Gamma - Cycle Time
    { id: 'e-p3-3-1', kpiId: 'kpi-p3-3', date: DATES[0], value: 5.0, note: 'Bottleneck at inspection step' },
    { id: 'e-p3-3-2', kpiId: 'kpi-p3-3', date: DATES[1], value: 4.5 },
    { id: 'e-p3-3-3', kpiId: 'kpi-p3-3', date: DATES[2], value: 4.0 },
    { id: 'e-p3-3-4', kpiId: 'kpi-p3-3', date: DATES[3], value: 3.8 },
    { id: 'e-p3-3-5', kpiId: 'kpi-p3-3', date: DATES[4], value: 3.5 },

    // Gamma - Defect Rate
    { id: 'e-p3-4-1', kpiId: 'kpi-p3-4', date: DATES[0], value: 2.5 },
    { id: 'e-p3-4-2', kpiId: 'kpi-p3-4', date: DATES[1], value: 2.2 },
    { id: 'e-p3-4-3', kpiId: 'kpi-p3-4', date: DATES[2], value: 2.0 },
    { id: 'e-p3-4-4', kpiId: 'kpi-p3-4', date: DATES[3], value: 1.8 },
    { id: 'e-p3-4-5', kpiId: 'kpi-p3-4', date: DATES[4], value: 1.5 },

    // Gamma - Utilization
    { id: 'e-p3-5-1', kpiId: 'kpi-p3-5', date: DATES[0], value: 78 },
    { id: 'e-p3-5-2', kpiId: 'kpi-p3-5', date: DATES[1], value: 79 },
    { id: 'e-p3-5-3', kpiId: 'kpi-p3-5', date: DATES[2], value: 80 },
    { id: 'e-p3-5-4', kpiId: 'kpi-p3-5', date: DATES[3], value: 82 },
    { id: 'e-p3-5-5', kpiId: 'kpi-p3-5', date: DATES[4], value: 83 },

    // Program SPI
    { id: 'e-pg-1-1', kpiId: 'kpi-pg-1', date: DATES[0], value: 0.84 },
    { id: 'e-pg-1-2', kpiId: 'kpi-pg-1', date: DATES[1], value: 0.86 },
    { id: 'e-pg-1-3', kpiId: 'kpi-pg-1', date: DATES[2], value: 0.88 },
    { id: 'e-pg-1-4', kpiId: 'kpi-pg-1', date: DATES[3], value: 0.89 },
    { id: 'e-pg-1-5', kpiId: 'kpi-pg-1', date: DATES[4], value: 0.91 },

    // Program CPI
    { id: 'e-pg-2-1', kpiId: 'kpi-pg-2', date: DATES[0], value: 0.90 },
    { id: 'e-pg-2-2', kpiId: 'kpi-pg-2', date: DATES[1], value: 0.91 },
    { id: 'e-pg-2-3', kpiId: 'kpi-pg-2', date: DATES[2], value: 0.92 },
    { id: 'e-pg-2-4', kpiId: 'kpi-pg-2', date: DATES[3], value: 0.92 },
    { id: 'e-pg-2-5', kpiId: 'kpi-pg-2', date: DATES[4], value: 0.93 },

    // Program Benefits
    { id: 'e-pg-3-1', kpiId: 'kpi-pg-3', date: DATES[0], value: 70 },
    { id: 'e-pg-3-2', kpiId: 'kpi-pg-3', date: DATES[1], value: 72 },
    { id: 'e-pg-3-3', kpiId: 'kpi-pg-3', date: DATES[2], value: 75 },
    { id: 'e-pg-3-4', kpiId: 'kpi-pg-3', date: DATES[3], value: 78 },
    { id: 'e-pg-3-5', kpiId: 'kpi-pg-3', date: DATES[4], value: 80 },

    // Program Stakeholder
    { id: 'e-pg-4-1', kpiId: 'kpi-pg-4', date: DATES[0], value: 72 },
    { id: 'e-pg-4-2', kpiId: 'kpi-pg-4', date: DATES[1], value: 74 },
    { id: 'e-pg-4-3', kpiId: 'kpi-pg-4', date: DATES[2], value: 75 },
    { id: 'e-pg-4-4', kpiId: 'kpi-pg-4', date: DATES[3], value: 77 },
    { id: 'e-pg-4-5', kpiId: 'kpi-pg-4', date: DATES[4], value: 78 },
  ],

  actions: [
    {
      id: 'act-1',
      kpiId: 'kpi-p1-1',
      projectId: 'p1',
      title: 'Schedule Recovery Plan',
      description: 'Engage additional subcontractors for critical path activities. Weekly acceleration meetings with site managers.',
      owner: 'John Smith',
      dueDate: '2026-06-30',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2026-02-01',
    },
    {
      id: 'act-2',
      kpiId: 'kpi-p1-3',
      projectId: 'p1',
      title: 'Safety Training Programme',
      description: 'Mandatory toolbox talks for all site personnel. Review and update JSA for high-risk activities.',
      owner: 'Maria Garcia',
      dueDate: '2026-05-31',
      status: 'open',
      priority: 'high',
      createdAt: '2026-03-15',
    },
    {
      id: 'act-3',
      kpiId: 'kpi-p1-5',
      projectId: 'p1',
      title: 'Milestone Acceleration Initiative',
      description: 'Identify float activities that can be compressed. Authorize overtime for critical deliverables.',
      owner: 'John Smith',
      dueDate: '2026-07-31',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2026-03-01',
    },
    {
      id: 'act-4',
      kpiId: 'kpi-p2-2',
      projectId: 'p2',
      title: 'Bug Prevention Workshop',
      description: 'Introduce shift-left testing practices. Implement automated regression suite before each release.',
      owner: 'Alice Chen',
      dueDate: '2026-06-15',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2026-02-10',
    },
    {
      id: 'act-5',
      kpiId: 'kpi-p2-3',
      projectId: 'p2',
      title: 'Coverage Sprint',
      description: 'Dedicate one sprint per quarter to writing unit tests for legacy modules.',
      owner: 'Bob Johnson',
      dueDate: '2026-05-31',
      status: 'open',
      priority: 'medium',
      createdAt: '2026-04-01',
    },
    {
      id: 'act-6',
      kpiId: 'kpi-p2-4',
      projectId: 'p2',
      title: 'CI/CD Pipeline Enhancement',
      description: 'Automate deployment pipeline to enable feature-flag-based releases. Target 2x deploy frequency.',
      owner: 'Alice Chen',
      dueDate: '2026-07-31',
      status: 'open',
      priority: 'medium',
      createdAt: '2026-04-15',
    },
    {
      id: 'act-7',
      kpiId: 'kpi-p3-3',
      projectId: 'p3',
      title: 'Cycle Time Reduction Initiative',
      description: 'Value stream mapping exercise to identify and eliminate waste at inspection bottleneck.',
      owner: 'Carlos Martinez',
      dueDate: '2026-06-30',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2026-02-20',
    },
    {
      id: 'act-8',
      kpiId: 'kpi-p3-4',
      projectId: 'p3',
      title: 'Quality Control Enhancement',
      description: 'Implement statistical process control charts. Train operators on defect detection techniques.',
      owner: 'Sarah Wilson',
      dueDate: '2026-05-31',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2026-03-05',
    },
    {
      id: 'act-9',
      kpiId: 'kpi-pg-1',
      projectId: 'program',
      title: 'Program Schedule Recovery',
      description: 'Bi-weekly program-level schedule reviews. Escalation process for projects deviating beyond SPI < 0.85.',
      owner: 'Programme Manager',
      dueDate: '2026-07-31',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2026-02-01',
    },
    {
      id: 'act-10',
      kpiId: 'kpi-pg-3',
      projectId: 'program',
      title: 'Benefits Tracking System',
      description: 'Implement benefits register and monthly reporting cadence. Assign benefits owners per workstream.',
      owner: 'PMO',
      dueDate: '2026-06-30',
      status: 'open',
      priority: 'medium',
      createdAt: '2026-03-01',
    },
  ],
};
