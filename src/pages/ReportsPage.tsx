import React, { useState, useMemo, useRef } from 'react';
import { Plus, Trash2, FileText, Shield, AlertOctagon, TrendingUp, Image } from 'lucide-react';
import { getReports, addReport, deleteReport, getProjects, getUsers } from '@/lib/storage';
import { generateId, formatDate, statusColor, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Card, Badge, Button, Input, Textarea, Select, Modal, EmptyState } from '@/components/ui/Common';
import type { Report } from '@/types';

const CATEGORY_OPTS = [
  { value: 'daily', label: 'Daily Progress' },
  { value: 'safety', label: 'Safety Report' },
  { value: 'incident', label: 'Incident Report' },
  { value: 'progress', label: 'Progress Update' },
];
const SEVERITY_OPTS = [
  { value: '', label: 'N/A' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const categoryIcon: Record<string, React.ReactNode> = {
  daily: <FileText className="w-4 h-4" />,
  safety: <Shield className="w-4 h-4" />,
  incident: <AlertOctagon className="w-4 h-4" />,
  progress: <TrendingUp className="w-4 h-4" />,
};

const categoryBg: Record<string, string> = {
  daily: 'bg-blue-50 text-blue-600',
  safety: 'bg-red-50 text-red-600',
  incident: 'bg-orange-50 text-orange-600',
  progress: 'bg-green-50 text-green-600',
};

const emptyForm = (): Omit<Report, 'id'> => ({
  projectId: '', title: '', description: '',
  category: 'daily', imageUrl: '', createdBy: '', date: new Date().toISOString().slice(0, 10), severity: undefined,
});

const ReportsPage: React.FC = () => {
  const { hasRole, currentUser } = useAuth();
  const canDelete = hasRole('Admin', 'Engineer');
  const canCreate = hasRole('Admin', 'Engineer', 'Worker');

  const [reports, setReports] = useState<Report[]>(() => getReports());
  const projects = useMemo(() => getProjects(), []);
  const users = useMemo(() => getUsers(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Omit<Report, 'id'>>(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('all');
  const [imgPreview, setImgPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => setReports(getReports());
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => {
    setForm({ ...emptyForm(), createdBy: currentUser?.id ?? '' });
    setImgPreview('');
    setModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgPreview(url);
    set('imageUrl', url);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    addReport({ ...form, id: generateId() });
    refresh();
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteReport(deleteId);
    refresh();
    setDeleteId(null);
  };

  const getUserName = (id: string) => users.find(u => u.id === id)?.name ?? 'Unknown';
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.title ?? '—';

  const filtered = filterCat === 'all' ? reports : reports.filter(r => r.category === filterCat);

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {[{ k: 'all', label: 'All Reports' }, ...CATEGORY_OPTS.map(o => ({ k: o.value, label: o.label }))].map(f => (
            <button
              key={f.k}
              onClick={() => setFilterCat(f.k)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
                filterCat === f.k
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-yellow-400',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {canCreate && (
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4" /> New Report
          </Button>
        )}
      </div>

      {/* Reports list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12" />}
          title="No reports yet"
          description="Submit daily progress, safety, or incident reports."
          action={canCreate ? <Button onClick={openCreate}><Plus className="w-4 h-4" /> New Report</Button> : undefined}
        />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(r => (
            <Card key={r.id} className="overflow-hidden flex flex-col">
              {/* Image */}
              {r.imageUrl && (
                <div className="h-40 bg-gray-100 overflow-hidden">
                  <img src={r.imageUrl} alt="Report" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className={cn('p-2 rounded-xl flex-shrink-0', categoryBg[r.category] || 'bg-gray-100 text-gray-600')}>
                    {categoryIcon[r.category] ?? <FileText className="w-4 h-4" />}
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Badge label={r.category} className={statusColor(r.category)} />
                    {r.severity && (
                      <Badge label={r.severity} className={statusColor(r.severity)} />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-black text-sm leading-tight">{r.title}</h3>
                  <p className="text-xs text-yellow-600 font-medium mt-0.5 truncate">{getProjectName(r.projectId)}</p>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{r.description}</p>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-700">{getUserName(r.createdBy)}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.date)}</p>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => setDeleteId(r.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Report">
        <div className="space-y-4">
          <Input label="Report Title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Daily Progress Report – Apr 15" />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              options={CATEGORY_OPTS}
            />
            <Select
              label="Severity"
              value={form.severity ?? ''}
              onChange={e => set('severity', e.target.value || undefined)}
              options={SEVERITY_OPTS}
            />
          </div>
          <Select
            label="Project"
            value={form.projectId}
            onChange={e => set('projectId', e.target.value)}
            options={[{ value: '', label: 'Select project...' }, ...projects.map(p => ({ value: p.id, label: p.title }))]}
          />
          <Input label="Date" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          <Textarea
            label="Description"
            rows={4}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Detailed report description, observations, actions taken..."
          />

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Photo (optional)</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {imgPreview ? (
              <div className="relative h-40 rounded-xl overflow-hidden border border-gray-200">
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImgPreview(''); set('imageUrl', ''); }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-lg p-1 text-xs hover:bg-black/70"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-yellow-400 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-yellow-600 transition-colors"
              >
                <Image className="w-6 h-6" />
                <span className="text-xs font-medium">Upload site photo</span>
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1">Submit Report</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Report">
        <p className="text-gray-600 text-sm mb-6">This report will be permanently deleted.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete Report</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ReportsPage;
