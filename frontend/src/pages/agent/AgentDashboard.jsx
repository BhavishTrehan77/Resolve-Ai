import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import {
  UserCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
} from 'lucide-react';

export const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    escalated: 0,
    totalTickets: 0,
  });
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [escalatedTickets, setEscalatedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [agentStats, assigned, escalated] = await Promise.all([
        ticketService.getAgentStats().catch(() => null),
        ticketService.getAssignedTickets().catch(() => []),
        ticketService.getEscalatedTickets().catch(() => []),
      ]);

      if (agentStats) {
        setStats(agentStats);
      } else {
        setStats({
          assigned: assigned.length,
          inProgress: assigned.filter((t) => t.status === 'IN_PROGRESS').length,
          resolved: assigned.filter((t) => t.status === 'RESOLVED').length,
          escalated: escalated.length,
          totalTickets: assigned.length + escalated.length,
        });
      }

      setAssignedTickets(assigned || []);
      setEscalatedTickets(escalated || []);
    } catch (err) {
      console.error('Failed to load agent dashboard data:', err);
      setError('Could not synchronize agent queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-9 border border-white/10 shadow-2xl overflow-hidden bg-gradient-to-r from-blue-950/70 via-slate-950 to-indigo-950/40 backdrop-blur-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              IT Support Agent Operations Deck
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Agent Console: <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-200 bg-clip-text text-transparent">{user?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect AI root cause diagnosis, review step-by-step resolution scripts, and intervene on confidence-escalated incidents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-2xl text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/agent/escalated')}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-rose-600/20 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Review Escalated ({stats.escalated})</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => navigate('/agent/assigned')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-brand-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned To Me</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-white">{loading ? '...' : stats.assigned}</h3>
        </div>

        <div
          onClick={() => navigate('/agent/assigned')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Progress</span>
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-amber-400">{loading ? '...' : stats.inProgress}</h3>
        </div>

        <div
          onClick={() => navigate('/agent/escalated')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Escalated</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-rose-400">{loading ? '...' : stats.escalated}</h3>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center justify-between text-teal-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolved by Me</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-teal-400">{loading ? '...' : stats.resolved}</h3>
        </div>

        <div
          onClick={() => navigate('/agent/all-tickets')}
          className="glass-panel-interactive rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total System Queue</span>
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-white">{loading ? '...' : stats.totalTickets}</h3>
        </div>
      </div>

      {/* Escalated & Urgent Queue */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Human Escalation Priority Queue
            </h2>
            <p className="text-xs text-slate-400">
              Low AI confidence threshold (&lt;50%) or explicit routing triggers
            </p>
          </div>
          <button
            onClick={() => navigate('/agent/escalated')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({escalatedTickets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {escalatedTickets.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No escalated tickets at this time. All incidents handled autonomously!
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04] mt-2">
            {escalatedTickets.slice(0, 5).map((t) => (
              <div
                key={t._id}
                onClick={() => navigate(`/ticket/${t._id}`)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-200">{t.title}</span>
                    <PriorityBadge priority={t.priority} />
                    <CategoryBadge category={t.category} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{t.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 font-medium">
                    Human Review Required
                  </span>
                  <span className="text-xs text-brand-400 font-medium">Investigate →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tickets Assigned to Agent */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-400" />
              Assigned Directly to You
            </h2>
            <p className="text-xs text-slate-400">Tickets assigned to your handle for active resolution</p>
          </div>
          <button
            onClick={() => navigate('/agent/assigned')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({assignedTickets.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {assignedTickets.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            You do not currently have any assigned tickets. Grab one from the active queue!
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04] mt-2">
            {assignedTickets.map((t) => (
              <div
                key={t._id}
                onClick={() => navigate(`/ticket/${t._id}`)}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-200">{t.title}</span>
                    <StatusBadge status={t.status} />
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{t.description}</p>
                </div>

                <span className="text-xs text-brand-400 font-medium shrink-0">Manage Incident →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
