import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    ongoing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    planning: 'bg-yellow-100 text-yellow-800',
    'on-hold': 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-600',
    'in-progress': 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-700',
    daily: 'bg-blue-100 text-blue-700',
    safety: 'bg-red-100 text-red-700',
    incident: 'bg-orange-100 text-orange-700',
    progress: 'bg-green-100 text-green-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    ongoing: 'Ongoing',
    completed: 'Completed',
    planning: 'Planning',
    'on-hold': 'On Hold',
    pending: 'Pending',
    'in-progress': 'In Progress',
    done: 'Done',
  };
  return map[status] ?? status;
}
