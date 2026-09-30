import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  AlertTriangle,
  Users,
  FolderOpen,
  Upload,
  LogOut,
  Menu,
  X,
  Sparkles,
  Bot,
  UserCheck,
  Search,
  Activity,
  Layers,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRole = (user?.role || 'EMPLOYEE').toUpperCase();

  const getNavLinks = () => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { name: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard },
          { name: 'All Tickets', to: '/admin/tickets', icon: Ticket },
          { name: 'Escalated Tickets', to: '/admin/escalated', icon: AlertTriangle, badge: 'Escalated' },
          { name: 'Users Management', to: '/admin/users', icon: Users },
          { name: 'Knowledge Documents', to: '/admin/documents', icon: FolderOpen },
          { name: 'Upload Documents', to: '/admin/documents/upload', icon: Upload },
          { name: 'AI Assistant', to: '/admin/ai-assistant', icon: Bot },
        ];
      case 'AGENT':
        return [
          { name: 'Agent Dashboard', to: '/agent', icon: LayoutDashboard },
          { name: 'Assigned Tickets', to: '/agent/assigned', icon: UserCheck },
          { name: 'Escalated Tickets', to: '/agent/escalated', icon: AlertTriangle, badge: 'Urgent' },
        ];
      case 'EMPLOYEE':
      default:
        return [
          { name: 'Employee Dashboard', to: '/employee', icon: LayoutDashboard },
          { name: 'Create Ticket', to: '/employee/create-ticket', icon: PlusCircle, highlight: true },
          { name: 'My Tickets', to: '/employee/my-tickets', icon: Ticket },
          { name: 'AI Assistant', to: '/employee/ai-assistant', icon: Bot },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
            ResolveAI
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-xl focus:outline-none bg-slate-800/40"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`${
          mobileMenuOpen ? 'fixed inset-0 z-50 flex flex-col' : 'hidden md:flex'
        } w-full md:w-72 bg-slate-950/80 border-r border-white/5 md:min-h-screen flex-col justify-between shrink-0 backdrop-blur-2xl`}
      >
        <div>
          {/* Logo Branding */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 via-purple-500 to-indigo-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white border border-white/10 shadow-xl">
                  <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-white tracking-tight">
                    Resolve<span className="text-brand-400">AI</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Autonomous Incident Ops</p>
              </div>
            </div>

            {mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Role Card - Display Only */}
          <div className="px-5 pt-5 pb-2">
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Logged in as:</p>
                  <p className="text-xs font-semibold text-slate-200">{user?.name || 'User'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Role:</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border inline-block mt-0.5 ${
                    userRole === 'ADMIN'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : userRole === 'AGENT'
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 py-3 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              Workspace Menu
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/admin' || link.to === '/agent' || link.to === '/employee'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 border border-brand-400/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Live AI Cluster Status Widget */}
          <div className="px-5 py-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-brand-500/20 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-300">
                  <Bot className="w-4 h-4 text-brand-400" />
                  <span>AI Agent Cluster</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  5 ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Triage, Retrieval, Diagnosis, Resolution & Escalation agents synchronized.
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {['Triage', 'RAG', 'Diagnosis', 'Resolution', 'Escalate'].map((agent, i) => (
                  <span
                    key={agent}
                    title={agent}
                    className="h-1.5 flex-1 rounded-full bg-brand-500/40 animate-pulse"
                    style={{ animationDelay: `${i * 180}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Staff'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between h-18 px-8 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Agent Engine:</span>
              <span className="font-semibold text-emerald-400">Ready & Latency 142ms</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Session Role:
              </span>
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  userRole === 'ADMIN'
                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    : userRole === 'AGENT'
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {userRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {userRole === 'EMPLOYEE' && (
              <button
                onClick={() => navigate('/employee/create-ticket')}
                className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-500 via-indigo-600 to-purple-600 shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report New Incident</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
