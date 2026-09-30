import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import { UserCheck, Ticket, Search, RefreshCw } from 'lucide-react';

export const AssignedTickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchAssigned = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ticketService.getAssignedTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching assigned tickets:', err);
      setError('Could not load assigned tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const filtered = tickets.filter(
    (t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-brand-400" />
            Tickets Assigned to You
          </h1>
          <p className="text-xs text-slate-400">Directly routed from the GET /api/ticket/assigned agent stream</p>
        </div>

        <button
          onClick={fetchAssigned}
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

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter assigned tickets..."
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex justify-center items-center gap-2">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Loading assigned tickets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No Tickets Assigned</p>
            <p className="text-xs text-slate-500 mt-1">You currently have zero assigned tickets.</p>
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
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Assigned / Logged</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => navigate(`/ticket/${t._id}`)}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <span className="font-semibold text-slate-200 group-hover:text-brand-300 block truncate">
                        {t.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate">{t.description}</span>
                    </td>
                    <td className="py-3.5 px-4"><CategoryBadge category={t.category} /></td>
                    <td className="py-3.5 px-4"><PriorityBadge priority={t.priority} /></td>
                    <td className="py-3.5 px-4"><StatusBadge status={t.status} /></td>
                    <td className="py-3.5 px-4 text-slate-300">{t.createdBy?.name || 'Employee'}</td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs text-brand-400 group-hover:text-brand-300 font-medium">
                        Open Ticket →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedTickets;
