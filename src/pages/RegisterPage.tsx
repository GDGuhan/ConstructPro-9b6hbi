import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HardHat, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUsers, addUser } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { Role } from '@/types';

const ROLES: Role[] = ['Admin', 'Engineer', 'Worker', 'Client'];

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Worker' as Role });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const users = getUsers();
    if (users.find(u => u.email === form.email.trim())) {
      setError('An account with this email already exists.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: generateId(),
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addUser(newUser);
      login(form.email.trim(), form.password);
      navigate('/dashboard');
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-yellow-400 p-1.5 rounded-lg">
            <HardHat className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-black text-white">ConstructPro</span>
        </div>

        <h1 className="text-2xl font-black text-white mb-2 text-center">Create Account</h1>
        <p className="text-white/40 text-sm mb-8 text-center">Join your construction team</p>

        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Marcus Johnson', field: 'name' },
            { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com', field: 'email' },
            { id: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters', field: 'password' },
          ].map(f => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-medium text-white/60 mb-1.5">{f.label}</label>
              <input
                id={f.id}
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.field]}
                onChange={e => set(f.field, e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
              />
            </div>
          ))}

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-white/60 mb-1.5">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
            >
              {ROLES.map(r => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
