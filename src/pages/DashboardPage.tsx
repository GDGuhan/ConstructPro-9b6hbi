import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area, CartesianGrid,
} from 'recharts';
import {
  FolderKanban, CheckSquare, Package, FileText,
  AlertTriangle, TrendingUp, DollarSign, Users,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getProjects, getTasks, getMaterials, getReports } from '@/lib/storage';
import { StatCard, Card, Badge, ProgressBar } from '@/components/ui/Common';
import { formatCurrency, formatDate, statusColor } from '@/lib/utils';

const COLORS = ['#FFC107', '#000000', '#3B82F6', '#10B981'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const DashboardPage: React.FC = () => {
  const { currentUser, hasRole } = useAuth();
  const projects = useMemo(() => getProjects(), []);
  const tasks = useMemo(() => getTasks(), []);
  const materials = useMemo(() => getMaterials(), []);
  const reports = useMemo(() => getReports(), []);

  // Derived stats
  const ongoingProjects = projects.filter(p => p.status === 'ongoing').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const tasksDone = tasks.filter(t => t.status === 'done').length;
  const tasksInProgress = tasks.filter(t => t.status === 'in-progress').length;
  const lowStockCount = materials.filter(m => m.quantity <= m.threshold).length;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);

  // Chart data
  const taskStatusData = [
    { name: 'Done', value: tasksDone },
    { name: 'In Progress', value: tasksInProgress },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
  ];

  const projectStatusData = [
    { name: 'Ongoing', value: projects.filter(p => p.status === 'ongoing').length },
    { name: 'Completed', value: completedProjects },
    { name: 'Planning', value: projects.filter(p => p.status === 'planning').length },
    { name: 'On Hold', value: projects.filter(p => p.status === 'on-hold').length },
  ];

  const progressData = MONTHS.map((m, i) => ({
    month: m,
    progress: Math.min(100, 28 + i * 12 + Math.floor(Math.random() * 5)),
    tasks: 4 + i * 2,
  }));

  const lowStockMaterials = materials.filter(m => m.quantity <= m.threshold);
  const recentReports = reports.slice(0, 4);
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-black text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">
            Good morning, {currentUser?.name.split(' ')[0]} 👋
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Here's what's happening across your construction sites today.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-xl">
            {currentUser?.role}
          </span>
          <span className="bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-xl">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={ongoingProjects}
          subtitle={`${completedProjects} completed`}
          icon={<FolderKanban className="w-5 h-5" />}
          accent
        />
        <StatCard
          title="Tasks Done"
          value={`${tasksDone}/${tasks.length}`}
          subtitle={`${tasksInProgress} in progress`}
          icon={<CheckSquare className="w-5 h-5" />}
          trend={{ label: '18% this week', up: true }}
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="materials need reorder"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
        />
        {hasRole('Admin', 'Engineer') && (
          <StatCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            subtitle={`of ${formatCurrency(totalBudget)} budget`}
            icon={<DollarSign className="w-5 h-5" />}
            trend={{ label: `${Math.round((totalSpent / totalBudget) * 100)}% utilized`, up: false }}
          />
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className="lg:col-span-2 p-5">
          <h3 className="text-sm font-bold text-black mb-4">Progress Overview (2026)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="progress" stroke="#FFC107" fill="url(#progressGrad)" strokeWidth={2} name="Avg Progress %" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Task pie */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-black mb-4">Task Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {taskStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Projects list */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-black mb-4">Active Projects</h3>
          <div className="space-y-4">
            {recentProjects.map(p => (
              <div key={p.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-black">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.location}</p>
                  </div>
                  <Badge label={p.status} className={statusColor(p.status)} />
                </div>
                <ProgressBar value={p.progress} />
                {hasRole('Admin', 'Engineer') && (
                  <p className="text-xs text-gray-400 mt-1">
                    {formatCurrency(p.spent)} / {formatCurrency(p.budget)} spent
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Low stock + recent reports */}
        <div className="space-y-4">
          {/* Low stock alerts */}
          {lowStockMaterials.length > 0 && (
            <Card className="p-5 border-l-4 border-l-red-500">
              <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Low Stock Alerts ({lowStockMaterials.length})
              </h3>
              <div className="space-y-2">
                {lowStockMaterials.map(m => (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium truncate">{m.name}</span>
                    <span className="text-red-600 font-bold ml-2 flex-shrink-0">
                      {m.quantity} {m.unit} left
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent reports */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-black mb-3">Recent Reports</h3>
            <div className="space-y-3">
              {recentReports.map(r => (
                <div key={r.id} className="flex items-start gap-3">
                  <Badge
                    label={r.category}
                    className={`${statusColor(r.category)} flex-shrink-0 mt-0.5`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{r.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bar chart — material usage */}
      {hasRole('Admin', 'Engineer') && (
        <Card className="p-5">
          <h3 className="text-sm font-bold text-black mb-4">Material Stock vs Threshold</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={materials.slice(0, 6).map(m => ({ name: m.name.slice(0, 18), qty: m.quantity, threshold: m.threshold }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="qty" fill="#FFC107" name="Current Stock" radius={[4, 4, 0, 0]} />
              <Bar dataKey="threshold" fill="#000" name="Min Threshold" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
