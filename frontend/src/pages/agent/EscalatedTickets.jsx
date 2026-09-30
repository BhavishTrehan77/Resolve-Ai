import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { AlertTriangle, Sparkles, RefreshCw, UserCheck, Shield, CheckCircle } from 'lucide-react';

export const EscalatedTickets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  const fetchEscalated = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ticketService.getEscalatedTickets();
      setTickets(Array.isArray(data) ? data : []);

      if (user?.role === 'ADMIN') {
        const userList = await userService.getUsers().catch(() => []);
        setAgents((Array.isArray(userList) ? userList : []).filter((u) => u.role === 'AGENT'));
      }
    } catch (err) {
      console.error('Error fetching escalated:', err);
      setError('Could not load escalated incidents.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAssign = async (e, ticketId, agentId) => {
    e.stopPropagation();
    if (!agentId) return;
    try {
      setAssigningId(ticketId);
      setSuccess('');
      setError('');
      await ticketService.assignTicket(ticketId, agentId);
      setSuccess('Agent assigned successfully. Incident moved to IN_PROGRESS.');
      setTimeout(() => setSuccess(''), 3000);
      await fetchEscalated();
    } catch (err) {
      console.error('Failed to assign agent:', err);
      setError(err.response?.data?.message || err.message || 'Failed to assign agent');
    } finally {
      setAssigningId(null);
    }
  };

  useEffect(() => {
    fetchEscalated();
  }, [user]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            Escalated Support Incidents
          </h1>
          <p className="text-xs text-slate-400">
            Tickets flagged by ResolveAI's escalation agent requiring human IT intervention (GET /api/ticket/escalated)
          </p>
        </div>

        <button
          onClick={fetchEscalated}
          className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer self-start sm:self-auto flex items-center gap-2 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex justify-center items-center gap-2">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Loading escalated incidents...
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-16 text-center">
            <Sparkles className="w-12 h-12 text-emerald-400/60 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">All Clear!</p>
            <p className="text-xs text-slate-500 mt-1">
              No tickets currently require human escalation. The AI agent pipeline resolved all incidents.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">AI Confidence</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  {isAdmin && <th className="py-3 px-4">Assign Agent</th>}
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((t) => {
                  const conf = t.aiConfidence
                    ? Math.round(t.aiConfidence > 1 ? t.aiConfidence : t.aiConfidence * 100)
                    : 0;
                  const currentAgentId = t.assignedTo?._id || t.assignedTo || '';

                  return (
                    <tr
                      key={t._id}
                      onClick={() => navigate(`/ticket/${t._id}`)}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-slate-200 group-hover:text-brand-300 block truncate">
                          {t.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">{t.description}</span>
                      </td>
                      <td className="py-3.5 px-4"><CategoryBadge category={t.category} /></td>
                      <td className="py-3.5 px-4"><PriorityBadge priority={t.priority} /></td>
                      <td className="py-3.5 px-4"><StatusBadge status={t.status} /></td>
                      <td className="py-3.5 px-4">
                        <span className="text-rose-400 font-mono font-semibold">{conf}%</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="text-[11px] text-purple-300 line-clamp-1">
                          {t.aiDiagnosis?.rootCause || 'Under Diagnosis'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={currentAgentId}
                            disabled={assigningId === t._id}
                            onChange={(e) => handleQuickAssign(e, t._id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="">{currentAgentId ? 'Reassign Agent...' : 'Assign Agent...'}</option>
                            {agents.map((ag) => (
                              <option key={ag._id} value={ag._id}>
                                {ag.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs text-rose-400 group-hover:text-rose-300 font-medium">
                          Open Ticket →
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

export default EscalatedTickets;
