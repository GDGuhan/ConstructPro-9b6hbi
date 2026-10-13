import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HardHat, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@constructpro.com', password: 'admin123', color: 'bg-yellow-400 text-black' },
  { role: 'Engineer', email: 'engineer@constructpro.com', password: 'eng123', color: 'bg-blue-500 text-white' },
  { role: 'Worker', email: 'worker@constructpro.com', password: 'worker123', color: 'bg-green-500 text-white' },
  { role: 'Client', email: 'client@constructpro.com', password: 'client123', color: 'bg-purple-500 text-white' },
];

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = login(email.trim(), password);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Try a demo account below.');
      }
      setLoading(false);
    }, 600);
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-yellow-400 p-12">
        <div className="flex items-center gap-2">
          <div className="bg-black p-1.5 rounded-lg">
            <HardHat className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-xl font-black text-black">ConstructPro</span>
        </div>
        <div>
          <h2 className="text-5xl font-black text-black leading-tight mb-4">
            Command your<br />construction sites<br />from anywhere.
          </h2>
          <p className="text-black/60 text-lg">Real-time tracking. Role-based access. Zero delays.</p>
        </div>
        <p className="text-black/40 text-sm">© 2026 ConstructPro</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <div className="bg-yellow-400 p-1.5 rounded-lg">
              <HardHat className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black text-white">ConstructPro</span>
          </div>

          <h1 className="text-2xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@constructpro.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            No account?{' '}
            <Link to="/register" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
              Register here
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs font-semibold text-white/30 mb-3 uppercase tracking-wide">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="text-xs font-bold px-3 py-2 rounded-lg transition-opacity hover:opacity-80 text-left"
                  style={{ background: acc.role === 'Admin' ? '#FFC107' : undefined }}
                >
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${acc.color}`}>
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
