import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { getMaterials, addMaterial, updateMaterial, deleteMaterial, getProjects } from '@/lib/storage';
import { generateId, formatCurrency, formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Card, Badge, Button, Input, Select, Modal, EmptyState, StatCard } from '@/components/ui/Common';
import type { Material } from '@/types';

const emptyForm = (): Omit<Material, 'id'> => ({
  name: '', unit: 'units', quantity: 0, threshold: 10,
  projectId: '', costPerUnit: 0, supplier: '', lastUpdated: new Date().toISOString().slice(0, 10),
});

const MaterialsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const canEdit = hasRole('Admin', 'Engineer');

  const [materials, setMaterials] = useState<Material[]>(() => getMaterials());
  const projects = useMemo(() => getProjects(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Material | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'low'>('all');

  const refresh = () => setMaterials(getMaterials());
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (m: Material) => { setEditTarget(m); setForm({ ...m }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editTarget) {
      updateMaterial({ ...editTarget, ...form, lastUpdated: new Date().toISOString().slice(0, 10) });
    } else {
      addMaterial({ ...form, id: generateId() });
    }
    refresh();
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMaterial(deleteId);
    refresh();
    setDeleteId(null);
  };

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.title ?? '—';
  const isLow = (m: Material) => m.quantity <= m.threshold;

  const lowStock = materials.filter(isLow);
  const totalValue = materials.reduce((s, m) => s + m.quantity * m.costPerUnit, 0);
  const filtered = filter === 'low' ? lowStock : materials;

  const UNIT_OPTS = ['units', 'tons', 'kg', 'bags', 'cubic m', 'liters', 'meters', 'sheets', 'rolls'].map(u => ({ value: u, label: u }));

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Materials"
          value={materials.length}
          subtitle="tracked items"
          icon={<Package className="w-5 h-5" />}
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStock.length}
          subtitle="need reordering"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          accent={lowStock.length > 0}
        />
        <StatCard
          title="Stock Value"
          value={formatCurrency(totalValue)}
          subtitle="current inventory"
          icon={<TrendingDown className="w-5 h-5" />}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          {[{ k: 'all', label: 'All Materials' }, { k: 'low', label: `Low Stock (${lowStock.length})` }].map(f => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k as any)}
              className={cn(
                'px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors',
                filter === f.k
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-yellow-400',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {canEdit && (
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4" /> Add Material
          </Button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="No materials found"
          description="Start tracking materials to avoid costly shortages."
          action={canEdit ? <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Material</Button> : undefined}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Material', 'Project', 'Stock', 'Min. Stock', 'Unit Cost', 'Total Value', 'Supplier', 'Updated', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(m => (
                  <tr key={m.id} className={cn('hover:bg-gray-50 transition-colors', isLow(m) && 'bg-red-50/50')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isLow(m) && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                        <div>
                          <p className="font-semibold text-black">{m.name}</p>
                          {isLow(m) && <p className="text-xs text-red-500 font-medium">Low stock alert</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">{getProjectName(m.projectId)}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'font-bold',
                        isLow(m) ? 'text-red-600' : 'text-black',
                      )}>
                        {m.quantity}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">{m.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{m.threshold} {m.unit}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(m.costPerUnit)}</td>
                    <td className="px-4 py-3 font-semibold text-black">{formatCurrency(m.quantity * m.costPerUnit)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{m.supplier}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(m.lastUpdated)}</td>
                    <td className="px-4 py-3">
                      {canEdit && (
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Material' : 'Add Material'}>
        <div className="space-y-4">
          <Input label="Material Name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Reinforced Steel Bars (12mm)" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantity" type="number" min={0} value={form.quantity} onChange={e => set('quantity', Number(e.target.value))} />
            <Select label="Unit" value={form.unit} onChange={e => set('unit', e.target.value)} options={UNIT_OPTS} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min. Threshold" type="number" min={0} value={form.threshold} onChange={e => set('threshold', Number(e.target.value))} />
            <Input label="Cost Per Unit ($)" type="number" min={0} step={0.01} value={form.costPerUnit} onChange={e => set('costPerUnit', Number(e.target.value))} />
          </div>
          <Input label="Supplier" value={form.supplier} onChange={e => set('supplier', e.target.value)} placeholder="e.g. SteelCo Inc." />
          <Select
            label="Project"
            value={form.projectId}
            onChange={e => set('projectId', e.target.value)}
            options={[{ value: '', label: 'Select project...' }, ...projects.map(p => ({ value: p.id, label: p.title }))]}
          />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1">{editTarget ? 'Save Changes' : 'Add Material'}</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Material">
        <p className="text-gray-600 text-sm mb-6">This will remove the material record permanently.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Remove Material</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default MaterialsPage;
