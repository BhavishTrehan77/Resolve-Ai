import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { documentService } from '../../services/documentService';
import { incidentService } from '../../services/incidentService';
import {
  Users,
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Sparkles,
  Bot,
  RefreshCw,
  Brain,
  Layers,
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    escalatedTickets: 0,
    documents: 0,
    incidents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [adminStats, docs, incs] = await Promise.all([
        adminService.getStats().catch(() => null),
        documentService.getAllDocuments().catch(() => []),
        incidentService.getAllIncidents().catch(() => []),
      ]);

      if (adminStats) {
        setStats({
          users: adminStats.totalUsers || 0,
          totalTickets: adminStats.totalTickets || 0,
          openTickets: (adminStats.openTickets || 0) + (adminStats.inProgressTickets || 0),
          inProgressTickets: adminStats.inProgressTickets || 0,
          resolvedTickets: (adminStats.resolvedTickets || 0) + (adminStats.closedTickets || 0),
          escalatedTickets: adminStats.escalatedTickets || 0,
          documents: Array.isArray(docs) ? docs.length : 0,
          incidents: Array.isArray(incs) ? incs.length : 0,
        });
      }
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
      setError('Failed to fetch admin stats from /api/admin/stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative glass-panel rounded-3xl p-7 sm:p-10 border border-white/10 shadow-2xl overflow-hidden bg-gradient-to-r from-purple-950/60 via-slate-950 to-brand-950/40 backdrop-blur-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Brain className="w-3.5 h-3.5" />
              Administrative Telemetry & Control (GET /api/admin/stats)
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Platform Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
              Real-time monitoring across user privileges, vector database knowledge, multi-agent AI pipeline throughput, and incident postmortems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/admin/documents/upload')}
              className="px-5 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-xl transition-all cursor-pointer"
            >
              Vectorize Knowledge PDF
            </button>
            <button
              onClick={() => navigate('/admin/ai-assistant')}
              className="px-5 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-brand-400" />
              <span>Query RAG Base</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-2xl">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div
          onClick={() => navigate('/admin/users')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-white">{loading ? '...' : stats.users}</h3>
        </div>

        <div
          onClick={() => navigate('/admin/tickets')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-brand-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">All Tickets</span>
            <Ticket className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-white">{loading ? '...' : stats.totalTickets}</h3>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open & Active</span>
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-emerald-400">{loading ? '...' : stats.openTickets}</h3>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center justify-between text-teal-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-teal-400">{loading ? '...' : stats.resolvedTickets}</h3>
        </div>

        <div
          onClick={() => navigate('/agent/escalated')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Escalated</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-rose-400">{loading ? '...' : stats.escalatedTickets}</h3>
        </div>

        <div
          onClick={() => navigate('/admin/documents')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">RAG Manuals</span>
            <FolderOpen className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-blue-400">{loading ? '...' : stats.documents}</h3>
        </div>
      </div>

      {/* Multi-Agent Architecture Topology */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
        <div className="flex items-center justify-between pb-5 border-b border-white/5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-400" />
              Multi-Agent Neural Orchestration Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous micro-agents coordinated by agentOrchestra on incident creation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:border-brand-500/30 transition-all">
            <span className="text-[10px] font-mono font-bold text-brand-400 uppercase tracking-wider block mb-1">
              Agent 01
            </span>
            <h4 className="text-xs font-bold text-white">Triage Agent</h4>
            <p className="text-[11px] text-slate-400 mt-1">Classifies category, priority & intent extraction</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:border-brand-500/30 transition-all">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Agent 02
            </span>
            <h4 className="text-xs font-bold text-white">Retrieval Agent</h4>
            <p className="text-[11px] text-slate-400 mt-1">MongoDB Vector Search & cosine distance ranking</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:border-brand-500/30 transition-all">
            <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1">
              Agent 03
            </span>
            <h4 className="text-xs font-bold text-white">Diagnosis Agent</h4>
            <p className="text-[11px] text-slate-400 mt-1">Isolates technical root cause with deductive reasoning</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:border-brand-500/30 transition-all">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Agent 04
            </span>
            <h4 className="text-xs font-bold text-white">Resolution Agent</h4>
            <p className="text-[11px] text-slate-400 mt-1">Formulates actionable, verified step-by-step fix</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group hover:border-brand-500/30 transition-all">
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
              Agent 05
            </span>
            <h4 className="text-xs font-bold text-white">Escalation Agent</h4>
            <p className="text-[11px] text-slate-400 mt-1">Calculates confidence threshold and routes to human L2/L3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
