import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import { Search, Filter, PlusCircle, Ticket, AlertCircle } from 'lucide-react';

export const MyTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const myData = await ticketService.getMyTickets().catch(() => []);
        setTickets(Array.isArray(myData) ? myData : []);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);


  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Support Tickets</h1>
          <p className="text-xs text-slate-400">View and track all IT incident requests filed by you</p>
        </div>

        <button
          onClick={() => navigate('/employee/create-ticket')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create Ticket
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by keywords..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_USER">Waiting for User</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm flex justify-center items-center gap-3">
            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Loading your tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No Tickets Match Your Filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or submit a new ticket.</p>
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
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTickets.map((t) => {
                  const conf = t.aiConfidence
                    ? Math.round(t.aiConfidence > 1 ? t.aiConfidence : t.aiConfidence * 100)
                    : 0;

                  return (
                    <tr
                      key={t._id}
                      onClick={() => navigate(`/ticket/${t._id}`)}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-4 px-4 max-w-xs">
                        <span className="font-semibold text-slate-200 group-hover:text-brand-300 transition-colors block truncate">
                          {t.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                          {t.description}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <CategoryBadge category={t.category} />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <PriorityBadge priority={t.priority} />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {conf > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-slate-200">{conf}%</span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                conf >= 75 ? 'bg-emerald-400' : conf >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                              }`}
                            />
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="text-xs text-brand-400 group-hover:text-brand-300 font-medium">
                          View Analysis →
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

export default MyTickets;
