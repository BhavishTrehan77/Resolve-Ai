import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../context/useAuth';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import {
  Ticket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

const QUICK_TEMPLATES = [
  { label: 'VPN Disconnect', title: 'VPN connection times out intermittently on Cisco AnyConnect', cat: 'NETWORK' },
  { label: 'Git SSH Key Denied', title: 'Permission denied (publickey) when pushing to GitHub enterprise', cat: 'ACCESS' },
  { label: 'Postgres DB Pool Error', title: 'Database connection pool exhausted: ECONNREFUSED', cat: 'DATABASE' },
  { label: 'AWS S3 Access 403', title: 'Access Denied 403 when writing to private S3 bucket', cat: 'CLOUD' },
];

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    escalated: 0,
    resolved: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, myTicketsData] = await Promise.all([
        ticketService.getMyStats().catch(() => null),
        ticketService.getMyTickets().catch(() => []),
      ]);

      if (statsData) {
        setStats({
          total: statsData.total || 0,
          open: statsData.open || 0,
          inProgress: statsData.inProgress || 0,
          escalated: statsData.escalated || 0,
          resolved: statsData.resolved || 0,
          closed: statsData.closed || 0,
        });
      } else {
        const list = Array.isArray(myTicketsData) ? myTicketsData : [];
        setStats({
          total: list.length,
          open: list.filter((t) => t.status === 'OPEN').length,
          inProgress: list.filter((t) => t.status === 'IN_PROGRESS').length,
          escalated: list.filter((t) => t.status === 'ESCALATED' || t.aiEscalated).length,
          resolved: list.filter((t) => t.status === 'RESOLVED').length,
          closed: list.filter((t) => t.status === 'CLOSED').length,
        });
      }

      setTickets(Array.isArray(myTicketsData) ? myTicketsData : []);
    } catch (err) {
      console.error('Error fetching employee dashboard:', err);
      const msg = err.response?.data?.message || (!err.response ? 'Could not connect to backend server. Make sure backend is running on port 3000.' : 'Failed to fetch incident tickets.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const displayedTickets = tickets.filter(
    (t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickTemplate = (tpl) => {
    navigate('/employee/create-ticket', { state: { prefill: tpl } });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Command Center Banner */}
      <div className="relative group overflow-hidden rounded-3xl p-7 sm:p-10 border border-white/10 shadow-2xl bg-gradient-to-br from-brand-950/70 via-slate-950 to-purple-950/40 backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous IT Support & Incident Command
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">{user?.name || 'Employee'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Report issues for instant diagnosis. Our multi-agent AI cluster automatically triages category, retrieves technical SOPs, and delivers root-cause resolutions in seconds.
            </p>

            {/* Quick Prompt Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                Quick Prompts:
              </span>
              {QUICK_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickTemplate(tpl)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-brand-400" />
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => navigate('/employee/my-tickets')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-brand-400" />
              <span>View My Tickets</span>
            </button>
            <button
              onClick={() => navigate('/employee/create-ticket')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-2xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-300 font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Stat Cards - 6 Exact Metrics from Spec */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total */}
        <div
          onClick={() => navigate('/employee/my-tickets')}
          className="glass-panel-interactive rounded-2xl p-4 relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Total
            </span>
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-white">{loading ? '...' : stats.total}</h3>
            <span className="text-[10px] text-slate-400 font-medium">All Tickets</span>
          </div>
        </div>

        {/* Open */}
        <div
          onClick={() => navigate('/employee/my-tickets')}
          className="glass-panel-interactive rounded-2xl p-4 relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Open
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-blue-400">{loading ? '...' : stats.open}</h3>
            <span className="text-[10px] text-slate-400 font-medium">Pending triage</span>
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => navigate('/employee/my-tickets')}
          className="glass-panel-interactive rounded-2xl p-4 relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-amber-400">{loading ? '...' : stats.inProgress}</h3>
            <span className="text-[10px] text-slate-400 font-medium">Active fix</span>
          </div>
        </div>

        {/* Escalated */}
        <div
          onClick={() => navigate('/employee/my-tickets')}
          className="glass-panel-interactive rounded-2xl p-4 relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Escalated
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-rose-400">{loading ? '...' : stats.escalated}</h3>
            <span className="text-[10px] text-slate-400 font-medium">L2/Agent</span>
          </div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => navigate('/employee/my-tickets')}
          className="glass-panel-interactive rounded-2xl p-4 relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Resolved
            </span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-teal-400">{loading ? '...' : stats.resolved}</h3>
            <span className="text-[10px] text-slate-400 font-medium">Verified fixed</span>
          </div>
        </div>

        {/* Closed */}
        <div
          onClick={() => navigate('/employee/my-tickets')}
          className="glass-panel-interactive rounded-2xl p-4 relative overflow-hidden cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Closed
            </span>
            <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-400">{loading ? '...' : stats.closed}</h3>
            <span className="text-[10px] text-slate-400 font-medium">Archived</span>
          </div>
        </div>
      </div>

      {/* Main Ticket Hub */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              Live Incident Stream
            </h2>
            <p className="text-xs text-slate-400">
              Real-time multi-agent triage, diagnosis and root-cause status
            </p>
          </div>

          {/* Controls: Search + Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keywords..."
                className="bg-slate-950/70 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              onClick={() => navigate('/employee/my-tickets')}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({tickets.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col justify-center items-center gap-3">
            <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <span>Synchronizing incident data with MongoDB...</span>
          </div>
        ) : displayedTickets.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-500 mx-auto mb-3">
              <Ticket className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-200">
              No Personal Incidents Logged
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Submit your IT problem to experience autonomous triage and root-cause resolution.
            </p>
            <button
              onClick={() => navigate('/employee/create-ticket')}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Report Incident
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5">
                <tr>
                  <th className="py-3 px-3">Incident</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">AI Confidence</th>
                  <th className="py-3 px-3">Logged Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {displayedTickets.map((t) => {
                  const conf = t.aiConfidence
                    ? Math.round(t.aiConfidence > 1 ? t.aiConfidence : t.aiConfidence * 100)
                    : 0;

                  return (
                    <tr
                      key={t._id}
                      className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                      onClick={() => navigate(`/ticket/${t._id}`)}
                    >
                      <td className="py-4 px-3 max-w-sm">
                        <div className="font-semibold text-slate-200 group-hover:text-brand-300 transition-colors">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {t.description}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <CategoryBadge category={t.category} />
                      </td>
                      <td className="py-4 px-3">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="py-4 px-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-4 px-3">
                        {conf > 0 ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-white/5 font-mono text-[11px]">
                            <span className="font-bold text-slate-200">{conf}%</span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                conf >= 75 ? 'bg-emerald-400' : conf >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                              }`}
                            />
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">Pending</span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-slate-400 whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-brand-400 group-hover:text-brand-300 font-semibold">
                          View AI Analysis <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
