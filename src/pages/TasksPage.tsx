import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Calendar, User, CheckSquare } from 'lucide-react';
import { getTasks, addTask, updateTask, deleteTask, getUsers, getProjects } from '@/lib/storage';
import { generateId, formatDate, statusColor, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Card, Badge, Button, Input, Textarea, Select, Modal, EmptyState } from '@/components/ui/Common';
import type { Task, TaskStatus } from '@/types';

const STATUS_OPTS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];
const PRIORITY_OPTS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const COLS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'pending', label: 'Pending', color: 'border-t-gray-400' },
  { key: 'in-progress', label: 'In Progress', color: 'border-t-blue-500' },
  { key: 'done', label: 'Done', color: 'border-t-green-500' },
];

const emptyForm = () => ({
  title: '', description: '', projectId: '', assignedTo: '',
  status: 'pending' as TaskStatus, priority: 'medium' as Task['priority'], deadline: '',
});

const TasksPage: React.FC = () => {
  const { hasRole, currentUser } = useAuth();
  const canEdit = hasRole('Admin', 'Engineer');
  const isWorker = hasRole('Worker');

  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const users = useMemo(() => getUsers(), []);
  const projects = useMemo(() => getProjects(), []);
  const workers = users.filter(u => u.role === 'Worker' || u.role === 'Engineer');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setTasks(getTasks());

  // Workers only see their assigned tasks
  const visibleTasks = isWorker
    ? tasks.filter(t => t.assignedTo === currentUser?.id)
    : tasks;

  const tasksByStatus = (status: TaskStatus) => visibleTasks.filter(t => t.status === status);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (t: Task) => { setEditTarget(t); setForm({ ...t }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editTarget) {
      updateTask({ ...editTarget, ...form });
    } else {
      addTask({ ...form, id: generateId(), createdAt: new Date().toISOString().slice(0, 10) });
    }
    refresh();
    setModalOpen(false);
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    updateTask({ ...task, status: newStatus });
    refresh();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteTask(deleteId);
    refresh();
    setDeleteId(null);
  };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const getUserName = (id: string) => users.find(u => u.id === id)?.name ?? 'Unassigned';
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.title ?? 'Unknown';

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''} total
        </p>
        {canEdit && (
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        )}
      </div>

      {/* Kanban board */}
      {visibleTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-12 h-12" />}
          title="No tasks yet"
          description="Create your first task and assign it to a worker."
          action={canEdit ? <Button onClick={openCreate}><Plus className="w-4 h-4" /> New Task</Button> : undefined}
        />
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {COLS.map(col => {
            const colTasks = tasksByStatus(col.key);
            return (
              <div key={col.key} className="flex flex-col gap-3">
                {/* Column header */}
                <div className={cn('bg-white rounded-xl border-t-4 px-4 py-3 flex items-center justify-between shadow-sm', col.color)}>
                  <h3 className="text-sm font-bold text-black">{col.label}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task cards */}
                <div className="space-y-3">
                  {colTasks.map(task => (
                    <Card key={task.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-black leading-tight flex-1">{task.title}</h4>
                        <Badge
                          label={task.priority}
                          className={cn(
                            'flex-shrink-0 text-[10px]',
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-700',
                          )}
                        />
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>

                      <div className="text-xs space-y-1 text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {getUserName(task.assignedTo)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {formatDate(task.deadline)}
                        </div>
                      </div>

                      {/* Status update (workers can update their own tasks) */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task, e.target.value as TaskStatus)}
                          disabled={!canEdit && task.assignedTo !== currentUser?.id}
                          className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-400 flex-1"
                        >
                          {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        {canEdit && (
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(task)} className="p-1 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors">
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button onClick={() => setDeleteId(task.id)} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Task' : 'New Task'}>
        <div className="space-y-4">
          <Input label="Task Title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Foundation Concrete Pour" />
          <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Task details and instructions..." />
          <Select
            label="Project"
            value={form.projectId}
            onChange={e => set('projectId', e.target.value)}
            options={[{ value: '', label: 'Select project...' }, ...projects.map(p => ({ value: p.id, label: p.title }))]}
          />
          <Select
            label="Assign To"
            value={form.assignedTo}
            onChange={e => set('assignedTo', e.target.value)}
            options={[{ value: '', label: 'Select worker...' }, ...workers.map(w => ({ value: w.id, label: `${w.name} (${w.role})` }))]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Priority" value={form.priority} onChange={e => set('priority', e.target.value)} options={PRIORITY_OPTS} />
            <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTS} />
          </div>
          <Input label="Deadline" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1">{editTarget ? 'Save Changes' : 'Create Task'}</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Task">
        <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this task?</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete Task</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;
