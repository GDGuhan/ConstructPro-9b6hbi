import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Users, Shield, HardHat, User, Briefcase } from 'lucide-react';
import { getUsers, addUser, updateUser, deleteUser } from '@/lib/storage';
import { generateId, formatDate, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Card, Button, Input, Select, Modal, EmptyState, Badge } from '@/components/ui/Common';
import type { User as UserType, Role } from '@/types';

const ROLE_OPTS: { value: Role; label: string }[] = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Worker', label: 'Worker' },
  { value: 'Client', label: 'Client' },
];

const roleIcons: Record<Role, React.ReactNode> = {
  Admin: <Shield className="w-4 h-4" />,
  Engineer: <HardHat className="w-4 h-4" />,
  Worker: <Briefcase className="w-4 h-4" />,
  Client: <User className="w-4 h-4" />,
};

const roleColors: Record<Role, string> = {
  Admin: 'bg-yellow-100 text-yellow-800',
  Engineer: 'bg-blue-100 text-blue-700',
  Worker: 'bg-green-100 text-green-700',
  Client: 'bg-purple-100 text-purple-700',
};

const emptyForm = () => ({ name: '', email: '', password: '', role: 'Worker' as Role });

const UsersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserType[]>(() => getUsers());
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserType | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');

  const refresh = () => setUsers(getUsers());
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (u: UserType) => { setEditTarget(u); setForm({ name: u.name, email: u.email, password: u.password, role: u.role }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editTarget) {
      updateUser({ ...editTarget, ...form });
    } else {
      addUser({ ...form, id: generateId(), createdAt: new Date().toISOString().slice(0, 10) });
    }
    refresh();
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId || deleteId === currentUser?.id) return;
    deleteUser(deleteId);
    refresh();
    setDeleteId(null);
  };

  const roleCounts = ROLE_OPTS.reduce((acc, r) => {
    acc[r.value] = users.filter(u => u.role === r.value).length;
    return acc;
  }, {} as Record<Role, number>);

  const filtered = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);

  return (
    <div className="space-y-5">
      {/* Role summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ROLE_OPTS.map(r => (
          <Card key={r.value} className="p-4 flex items-center gap-3">
            <div className={cn('p-2.5 rounded-xl', roleColors[r.value])}>
              {roleIcons[r.value]}
            </div>
            <div>
              <p className="text-xs text-gray-500">{r.label}s</p>
              <p className="text-2xl font-black text-black">{roleCounts[r.value]}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {[{ v: 'all', l: 'All Users' }, ...ROLE_OPTS.map(r => ({ v: r.value, l: r.label }))].map(f => (
            <button
              key={f.v}
              onClick={() => setFilterRole(f.v)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors',
                filterRole === f.v
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-yellow-400',
              )}
            >
              {f.l}
            </button>
          ))}
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add User
        </Button>
      </div>

      {/* Users table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="No users found"
          action={<Button onClick={openCreate}><Plus className="w-4 h-4" /> Add User</Button>}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <tr key={u.id} className={cn('hover:bg-gray-50 transition-colors', u.id === currentUser?.id && 'bg-yellow-50/50')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-black">{u.name}</p>
                          {u.id === currentUser?.id && (
                            <p className="text-xs text-yellow-600 font-medium">You</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge label={u.role} className={roleColors[u.role]} />
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== currentUser?.id && (
                          <button onClick={() => setDeleteId(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit User' : 'Add User'}>
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Marcus Johnson" />
          <Input label="Email Address" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="user@constructpro.com" />
          <Input label="Password" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder={editTarget ? 'Leave blank to keep current' : 'Set password'} />
          <Select label="Role" value={form.role} onChange={e => set('role', e.target.value)} options={ROLE_OPTS} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1">{editTarget ? 'Save Changes' : 'Add User'}</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove User">
        <p className="text-gray-600 text-sm mb-6">This user will be permanently removed from the system.</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Remove User</Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
