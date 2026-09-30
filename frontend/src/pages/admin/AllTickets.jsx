import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { ticketService } from '../../services/ticketService';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import { Ticket, Search, Trash2 } from 'lucide-react';

export const AllTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTickets().catch(() => ticketService.getAllTickets());
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTickets();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this ticket permanently?')) return;
    try {
      await ticketService.deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete ticket.');
    }
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Ticket className="w-6 h-6 text-brand-400" />
          All Organization Tickets
        </h1>
        <p className="text-xs text-slate-400">Complete incident log across all company departments</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all tickets..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="WAITING_FOR_USER">Waiting for User</option>
          <option value="ESCALATED">Escalated</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading all tickets...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No tickets found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted By</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((t) => (
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
                    <td className="py-3.5 px-4 text-slate-300">{t.createdBy?.name || 'User'}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.assignedTo?.name || 'Unassigned'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => handleDelete(e, t._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

export default AllTickets;
