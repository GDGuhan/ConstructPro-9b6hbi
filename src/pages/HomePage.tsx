import React from 'react';
import { Link } from 'react-router-dom';
import {
  HardHat, ShieldCheck, BarChart3, Package, Users,
  FileText, CheckSquare, ArrowRight, Star, Zap, Clock,
} from 'lucide-react';
import heroImg from '@/assets/hero-construction.jpg';

const features = [
  { icon: BarChart3, title: 'Real-Time Progress', desc: 'Live dashboards track project completion, budget burn, and milestones at a glance.' },
  { icon: ShieldCheck, title: 'Safety Management', desc: 'Log incidents, report hazards, and ensure every site stays compliant with safety standards.' },
  { icon: Package, title: 'Material Tracking', desc: 'Monitor stock levels with low-inventory alerts before shortages cause costly delays.' },
  { icon: CheckSquare, title: 'Task Assignment', desc: 'Assign work to engineers and workers with priority labels, deadlines, and status updates.' },
  { icon: FileText, title: 'Daily Reports', desc: 'Generate site reports with photos, descriptions, and category tagging for full traceability.' },
  { icon: Users, title: 'Role-Based Access', desc: 'Admins, Engineers, Workers, and Clients each see exactly what they need — nothing more.' },
];

const stats = [
  { value: '4,200+', label: 'Active Projects' },
  { value: '98%', label: 'On-Time Delivery' },
  { value: '62%', label: 'Cost Savings Avg.' },
  { value: '12k+', label: 'Site Workers Managed' },
];

const testimonials = [
  { name: 'James Thornton', role: 'Senior Project Manager', text: 'ConstructPro cut our reporting time by 70%. Every foreman now logs daily updates on their phone.', rating: 5 },
  { name: 'Amina Diallo', role: 'Chief Engineer', text: 'The material shortage alerts saved us from a 3-week concrete delay. This system pays for itself.', rating: 5 },
  { name: 'Carlos Vega', role: 'Site Supervisor', text: 'Finally a tool built for construction — not a generic project tool crammed into a hard hat.', rating: 5 },
];

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-white font-sans">
    {/* ── Nav ─────────────────────────────────────────────── */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-1.5 rounded-lg">
            <HardHat className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">
            Construct<span className="text-yellow-400">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/8">
            Sign In
          </Link>
          <Link to="/register" className="text-sm font-bold bg-yellow-400 text-black px-5 py-2 rounded-xl hover:bg-yellow-500 transition-colors shadow-yellow">
            Get Started
          </Link>
        </div>
      </div>
    </nav>

    {/* ── Hero ────────────────────────────────────────────── */}
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-black">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Construction site" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,193,7,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,193,7,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold tracking-wide uppercase">Construction Intelligence Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6">
            Build Smarter.
            <br />
            <span className="text-yellow-400">Deliver Faster.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            ConstructPro unifies project management, safety reporting, material tracking,
            and team coordination into one powerful platform built for the construction industry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-base px-8 py-4 rounded-2xl hover:bg-yellow-500 transition-all shadow-yellow group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-base px-8 py-4 rounded-2xl hover:bg-white/15 transition-all border border-white/20"
            >
              View Demo
            </Link>
          </div>

          {/* Quick demo credentials */}
          <div className="mt-8 inline-flex flex-wrap items-center gap-4 text-xs text-white/40">
            <Clock className="w-3.5 h-3.5" />
            <span>Demo: admin@constructpro.com / admin123</span>
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats ───────────────────────────────────────────── */}
    <section className="bg-yellow-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-black text-black">{stat.value}</p>
              <p className="text-sm font-semibold text-black/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features ────────────────────────────────────────── */}
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-black">Everything Your Site Needs</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Six integrated modules solving the six biggest problems in construction.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-yellow-400 hover:shadow-yellow transition-all duration-200"
            >
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                <f.icon className="w-6 h-6 text-yellow-600 group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Roles ───────────────────────────────────────────── */}
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white">Built for Every Role on Site</h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Role-based access ensures every team member sees exactly what matters to them.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: 'Admin', color: 'bg-yellow-400 text-black', desc: 'Full system control: manage users, all projects, budgets, and reports.' },
            { role: 'Engineer', color: 'bg-blue-500 text-white', desc: 'Manage project progress, assign tasks, track materials, and log reports.' },
            { role: 'Worker', color: 'bg-green-500 text-white', desc: 'View assigned tasks, update status, and submit daily progress reports.' },
            { role: 'Client', color: 'bg-purple-500 text-white', desc: 'Read-only access to project progress, milestones, and delivered reports.' },
          ].map(r => (
            <div key={r.role} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/40 transition-colors">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${r.color}`}>{r.role}</span>
              <p className="text-white/60 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Testimonials ─────────────────────────────────────── */}
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-black text-black text-center mb-16">Trusted on Real Sites</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ─────────────────────────────────────────────── */}
    <section className="bg-yellow-400 py-20">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-4xl font-black text-black mb-4">Ready to Take Control of Your Sites?</h2>
        <p className="text-black/60 mb-8 text-lg">Start your free trial — no credit card required.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-black text-white font-bold text-lg px-10 py-4 rounded-2xl hover:bg-gray-900 transition-colors"
        >
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>

    {/* ── Footer ──────────────────────────────────────────── */}
    <footer className="bg-black border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-1 rounded-lg">
            <HardHat className="w-4 h-4 text-black" />
          </div>
          <span className="text-white font-bold">Construct<span className="text-yellow-400">Pro</span></span>
        </div>
        <p className="text-white/30 text-xs">© 2026 ConstructPro. Built for the industry.</p>
      </div>
    </footer>
  </div>
);

export default HomePage;
