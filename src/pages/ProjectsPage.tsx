import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, MapPin, Calendar, DollarSign, FolderKanban } from 'lucide-react';
import { getProjects, addProject, updateProject, deleteProject, getUsers } from '@/lib/storage';
import { generateId, formatCurrency, formatDate, statusColor, statusLabel, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Card, Badge, Button, Input, Textarea, Select, ProgressBar, Modal, EmptyState } from '@/components/ui/Common';
import type { Project } from '@/types';

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
];

const emptyForm = (): Omit<Project, 'id' | 'createdAt'> => ({
  title: '', description: '', startDate: '', endDate: '',
  status: 'planning', progress: 0, assignedEngineers: [],
  budget: 0, spent: 0, location: '',
});

const ProjectsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('Admin', 'Engineer');

  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const users = useMemo(() => getUsers(), []);
  const engineers = users.filter(u => u.role === 'Engineer' || u.role === 'Admin');

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const refresh = () => setProjects(getProjects());

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditTarget(p);
    setForm({ ...p });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editTarget) {
      updateProject({ ...editTarget, ...form });
    } else {
      addProject({ ...form, id: generateId(), createdAt: new Date().toISOString().slice(0, 10) });
    }
    refresh();
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProject(deleteId);
    refresh();
    setDeleteId(null);
  };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = filterStatus === 'all' ? projects : projects.filter(p => p.status === filterStatus);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'ongoing', 'planning', 'completed', 'on-hold'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize',
                filterStatus === s
                  ? 'bg-yellow-400 text-black shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-yellow-400',
              )}
            >
              {s === 'all' ? 'All Projects' : s}
            </button>
          ))}
        </div>
        {canEdit && (
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        )}
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-12 h-12" />}
          title="No projects found"
          description="Create your first project to get started."
          action={canEdit ? <Button onClick={openCreate}><Plus className="w-4 h-4" /> New Project</Button> : undefined}
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black text-base leading-tight">{p.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {p.location}
                  </p>
                </div>
                <Badge label={statusLabel(p.status)} className={statusColor(p.status)} />
              </div>

              <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>

              <ProgressBar value={p.progress} />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-gray-400">Budget</p>
                  <p className="font-bold text-black">{formatCurrency(p.budget)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-gray-400">Spent</p>
                  <p className={cn('font-bold', p.spent > p.budget ? 'text-red-600' : 'text-black')}>
                    {formatCurrency(p.spent)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(p.startDate)} → {formatDate(p.endDate)}
                </span>
                {canEdit && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Project' : 'New Project'}>
        <div className="space-y-4">
          <Input label="Project Title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Skyline Tower Complex" />
          <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief project description..." />
          <Input label="Location" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Downtown, New York" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            <Input label="End Date" type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Budget ($)" type="number" value={form.budget} onChange={e => set('budget', Number(e.target.value))} />
            <Input label="Spent ($)" type="number" value={form.spent} onChange={e => set('spent', Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              value={form.status}
              onChange={e => set('status', e.target.value)}
              options={STATUS_OPTIONS}
            />
            <Input label="Progress (%)" type="number" min={0} max={100} value={form.progress} onChange={e => set('progress', Number(e.target.value))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1">
              {editTarget ? 'Save Changes' : 'Create Project'}
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project">
        <p className="text-gray-600 text-sm mb-6">This action cannot be undone. The project and all related data will be removed.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete Project</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
