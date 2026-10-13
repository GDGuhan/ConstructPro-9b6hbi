import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Package,
  FileText, Users, Menu, X, HardHat, LogOut, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Engineer', 'Worker', 'Client'] },
  { path: '/projects', label: 'Projects', icon: FolderKanban, roles: ['Admin', 'Engineer', 'Client'] },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare, roles: ['Admin', 'Engineer', 'Worker'] },
  { path: '/materials', label: 'Materials', icon: Package, roles: ['Admin', 'Engineer'] },
  { path: '/reports', label: 'Reports', icon: FileText, roles: ['Admin', 'Engineer', 'Worker', 'Client'] },
  { path: '/users', label: 'Users', icon: Users, roles: ['Admin'] },
];

const roleColors: Record<string, string> = {
  Admin: 'bg-yellow-400 text-black',
  Engineer: 'bg-blue-500 text-white',
  Worker: 'bg-green-500 text-white',
  Client: 'bg-purple-500 text-white',
};

const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { currentUser, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(item =>
    currentUser ? item.roles.includes(currentUser.role) : false
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar panel */}
      <aside className={cn(
        'fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col z-40 transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:h-screen lg:flex',
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <div className="bg-yellow-400 p-1.5 rounded-lg">
            <HardHat className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            Construct<span className="text-yellow-400">Pro</span>
          </span>
          <button onClick={onClose} className="ml-auto lg:hidden text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        {currentUser && (
          <div className="mx-4 my-4 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{currentUser.name}</p>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', roleColors[currentUser.role])}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {filteredNav.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/20'
                    : 'text-white/60 hover:text-white hover:bg-white/8',
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const pageTitle = navItems.find(n => location.pathname.startsWith(n.path))?.label ?? 'ConstructPro';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-bold text-black">{pageTitle}</h1>

      <div className="ml-auto flex items-center gap-3">
        {currentUser && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <span className="hidden sm:block font-medium">{currentUser.name.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </header>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
