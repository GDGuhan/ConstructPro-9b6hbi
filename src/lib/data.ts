// ─── ConstructPro Seed / Demo Data ───────────────────────────────────────────
import type { User, Project, Task, Material, Report } from '@/types';

export const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Marcus Johnson',
    email: 'admin@constructpro.com',
    password: 'admin123',
    role: 'Admin',
    createdAt: '2025-01-01',
  },
  {
    id: 'u2',
    name: 'Sarah Chen',
    email: 'engineer@constructpro.com',
    password: 'eng123',
    role: 'Engineer',
    createdAt: '2025-01-15',
  },
  {
    id: 'u3',
    name: 'David Osei',
    email: 'worker@constructpro.com',
    password: 'worker123',
    role: 'Worker',
    createdAt: '2025-02-01',
  },
  {
    id: 'u4',
    name: 'Emily Rodriguez',
    email: 'client@constructpro.com',
    password: 'client123',
    role: 'Client',
    createdAt: '2025-02-10',
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Skyline Tower Complex',
    description: 'A 40-floor mixed-use residential and commercial tower in the city center.',
    startDate: '2025-02-01',
    endDate: '2026-08-31',
    status: 'ongoing',
    progress: 62,
    assignedEngineers: ['u2'],
    budget: 18500000,
    spent: 11470000,
    location: 'Downtown, New York',
    createdAt: '2025-01-15',
  },
  {
    id: 'p2',
    title: 'Harbor Bridge Renovation',
    description: 'Structural reinforcement and surface restoration of the east harbor bridge.',
    startDate: '2025-04-01',
    endDate: '2025-12-15',
    status: 'ongoing',
    progress: 38,
    assignedEngineers: ['u2'],
    budget: 4200000,
    spent: 1596000,
    location: 'Harbor District, Brooklyn',
    createdAt: '2025-03-10',
  },
  {
    id: 'p3',
    title: 'Greenfield Industrial Park',
    description: 'Construction of a 12-unit industrial warehouse complex on cleared land.',
    startDate: '2024-10-01',
    endDate: '2025-06-30',
    status: 'completed',
    progress: 100,
    assignedEngineers: ['u2'],
    budget: 7800000,
    spent: 7650000,
    location: 'Queens, New York',
    createdAt: '2024-09-01',
  },
  {
    id: 'p4',
    title: 'Riverside Residential Estate',
    description: 'A 200-unit residential estate development along the river frontage.',
    startDate: '2026-01-15',
    endDate: '2027-06-30',
    status: 'planning',
    progress: 8,
    assignedEngineers: ['u2'],
    budget: 32000000,
    spent: 2560000,
    location: 'Riverside, New Jersey',
    createdAt: '2025-12-01',
  },
];

export const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Foundation Concrete Pour – Block A', description: 'Complete the concrete pour for Block A foundation as per engineering specs.', projectId: 'p1', assignedTo: 'u3', status: 'done', priority: 'high', deadline: '2025-03-20', createdAt: '2025-02-10' },
  { id: 't2', title: 'Electrical Wiring – Floors 1–10', description: 'Install primary electrical conduit and wiring from floors 1 to 10.', projectId: 'p1', assignedTo: 'u3', status: 'in-progress', priority: 'high', deadline: '2026-04-15', createdAt: '2025-09-01' },
  { id: 't3', title: 'Install HVAC Ducting – Level 5', description: 'Fit HVAC ducting system on the 5th level per mechanical drawings.', projectId: 'p1', assignedTo: 'u3', status: 'in-progress', priority: 'medium', deadline: '2026-05-01', createdAt: '2025-10-01' },
  { id: 't4', title: 'Safety Inspection – Scaffolding West Side', description: 'Perform full safety audit of west scaffolding structure.', projectId: 'p1', assignedTo: 'u3', status: 'pending', priority: 'high', deadline: '2026-03-30', createdAt: '2026-01-10' },
  { id: 't5', title: 'Bridge Deck Surface Survey', description: 'Survey and document all surface cracks and deformations on bridge deck.', projectId: 'p2', assignedTo: 'u3', status: 'done', priority: 'high', deadline: '2025-05-10', createdAt: '2025-04-05' },
  { id: 't6', title: 'Rebar Placement – Support Pillars', description: 'Place and tie rebar in the four main support pillars.', projectId: 'p2', assignedTo: 'u3', status: 'in-progress', priority: 'high', deadline: '2025-09-01', createdAt: '2025-06-01' },
  { id: 't7', title: 'Warehouse Unit 3 – Roof Truss', description: 'Assemble and install roof truss system for warehouse unit 3.', projectId: 'p3', assignedTo: 'u3', status: 'done', priority: 'medium', deadline: '2025-04-15', createdAt: '2025-03-01' },
  { id: 't8', title: 'Site Soil Testing – Riverside', description: 'Conduct geotechnical soil analysis across the 15-acre estate site.', projectId: 'p4', assignedTo: 'u3', status: 'pending', priority: 'medium', deadline: '2026-02-28', createdAt: '2026-01-20' },
];

export const SEED_MATERIALS: Material[] = [
  { id: 'm1', name: 'Reinforced Steel Bars (12mm)', unit: 'tons', quantity: 42, threshold: 20, projectId: 'p1', costPerUnit: 850, supplier: 'SteelCo Inc.', lastUpdated: '2026-04-10' },
  { id: 'm2', name: 'Concrete Mix (Grade 40)', unit: 'cubic m', quantity: 8, threshold: 30, projectId: 'p1', costPerUnit: 120, supplier: 'CementWorld', lastUpdated: '2026-04-14' },
  { id: 'm3', name: 'Electrical Cable (3-core 2.5mm)', unit: 'meters', quantity: 2400, threshold: 500, projectId: 'p1', costPerUnit: 4.5, supplier: 'ElectraSupply', lastUpdated: '2026-04-08' },
  { id: 'm4', name: 'Plywood Formwork Sheets', unit: 'sheets', quantity: 14, threshold: 50, projectId: 'p1', costPerUnit: 65, supplier: 'TimberMax', lastUpdated: '2026-04-12' },
  { id: 'm5', name: 'Epoxy Resin (Bridge Grade)', unit: 'liters', quantity: 180, threshold: 40, projectId: 'p2', costPerUnit: 28, supplier: 'ChemiTech', lastUpdated: '2026-04-11' },
  { id: 'm6', name: 'Structural Steel Plates (20mm)', unit: 'tons', quantity: 12, threshold: 5, projectId: 'p2', costPerUnit: 1200, supplier: 'SteelCo Inc.', lastUpdated: '2026-04-09' },
  { id: 'm7', name: 'Roofing Sheets (Corrugated)', unit: 'sheets', quantity: 340, threshold: 100, projectId: 'p3', costPerUnit: 32, supplier: 'RoofMasters', lastUpdated: '2025-06-01' },
  { id: 'm8', name: 'Portland Cement (50kg bags)', unit: 'bags', quantity: 22, threshold: 50, projectId: 'p4', costPerUnit: 18, supplier: 'CementWorld', lastUpdated: '2026-04-13' },
];

export const SEED_REPORTS: Report[] = [
  { id: 'r1', projectId: 'p1', title: 'Daily Progress Report – Apr 14', description: 'Floors 22–24 concrete columns poured successfully. No delays reported. Crew of 48 on site. Weather conditions favorable.', category: 'daily', createdBy: 'u2', date: '2026-04-14', severity: undefined },
  { id: 'r2', projectId: 'p1', title: 'Safety Incident – West Scaffold', description: 'A worker reported loose guardrail on the west scaffold Level 18. Area cordoned off. Inspection scheduled for tomorrow morning.', category: 'safety', createdBy: 'u2', date: '2026-04-13', severity: 'high' },
  { id: 'r3', projectId: 'p2', title: 'Crack Survey Complete', description: 'Surface crack mapping completed on bridge deck sections B3 through B7. 14 major cracks identified, all marked for repair priority.', category: 'progress', createdBy: 'u2', date: '2026-04-12', severity: undefined },
  { id: 'r4', projectId: 'p1', title: 'Material Shortage Alert – Concrete', description: 'Concrete mix stock dropped below critical threshold. Emergency order placed with CementWorld for 60 cubic meters delivery Friday.', category: 'incident', createdBy: 'u3', date: '2026-04-14', severity: 'medium' },
  { id: 'r5', projectId: 'p4', title: 'Site Preparation – Riverside', description: 'Initial site clearance and boundary marking completed. Soil test boring commenced at 6 locations across the estate footprint.', category: 'daily', createdBy: 'u2', date: '2026-04-11', severity: undefined },
];
