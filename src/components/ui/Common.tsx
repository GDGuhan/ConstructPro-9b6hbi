import React from 'react';
import { cn } from '@/lib/utils';

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('bg-white rounded-2xl border border-gray-200 shadow-sm', className)}>
    {children}
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge: React.FC<{ label: string; className?: string }> = ({ label, className }) => (
  <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize', className)}>
    {label}
  </span>
);

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading = false, children, className, disabled, ...rest
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  const variants = {
    primary: 'bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-400 shadow-sm',
    secondary: 'bg-black text-white hover:bg-gray-800 focus:ring-black',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-black hover:bg-gray-100 focus:ring-gray-300',
  };
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2', lg: 'text-base px-6 py-3' };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...rest}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, id, ...rest }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      id={id}
      className={cn(
        'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors',
        error && 'border-red-500 focus:ring-red-400',
        className,
      )}
      {...rest}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, id, ...rest }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      id={id}
      className={cn(
        'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white',
        'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors',
        error && 'border-red-500',
        className,
      )}
      {...rest}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, id, ...rest }) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      id={id}
      rows={3}
      className={cn(
        'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white placeholder-gray-400 resize-none',
        'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors',
        error && 'border-red-500',
        className,
      )}
      {...rest}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar: React.FC<{ value: number; className?: string; showLabel?: boolean }> = ({
  value, className, showLabel = true,
}) => (
  <div className={cn('w-full', className)}>
    {showLabel && (
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className="text-gray-600">Progress</span>
        <span className="text-black">{value}%</span>
      </div>
    )}
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { label: string; up: boolean };
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, accent }) => (
  <Card className={cn('p-5', accent && 'bg-yellow-400 border-yellow-500')}>
    <div className="flex items-start justify-between">
      <div>
        <p className={cn('text-sm font-medium', accent ? 'text-black/70' : 'text-gray-500')}>{title}</p>
        <p className={cn('text-2xl font-bold mt-1', accent ? 'text-black' : 'text-black')}>{value}</p>
        {subtitle && <p className={cn('text-xs mt-0.5', accent ? 'text-black/60' : 'text-gray-400')}>{subtitle}</p>}
        {trend && (
          <span className={cn('text-xs font-semibold mt-1 inline-block', trend.up ? 'text-green-600' : 'text-red-500')}>
            {trend.up ? '↑' : '↓'} {trend.label}
          </span>
        )}
      </div>
      <div className={cn('p-2.5 rounded-xl', accent ? 'bg-black/10' : 'bg-yellow-50 text-yellow-600')}>
        {icon}
      </div>
    </div>
  </Card>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode }> = ({
  icon, title, description, action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-gray-300 mb-4 scale-150">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-700 mt-2">{title}</h3>
    {description && <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({
  open, onClose, title, children,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-base font-bold text-black">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
