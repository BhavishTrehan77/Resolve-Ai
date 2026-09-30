import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { userService } from '../services/userService';
import { incidentService } from '../services/incidentService';
import { useAuth } from '../context/useAuth';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import AiAnalysisCard from '../components/AiAnalysisCard';
import TicketComments from '../components/TicketComments';
import {
  ArrowLeft,
  Clock,
  User,
  Shield,
  Trash2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Tag,
  Save,
  Archive,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

const STATUS_OPTIONS = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_FOR_USER',
  'ESCALATED',
  'RESOLVED',
  'CLOSED',
];

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Editable fields for Agent/Admin
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const loadTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ticketService.getTicketById(id);
      setTicket(data);
      setSelectedStatus(data.status);
      setSelectedPriority(data.priority);
      setAssignedTo(data.assignedTo?._id || data.assignedTo || '');
    } catch (err) {
      console.error('Failed to load ticket:', err);
      setError('Could not load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  const isStaff = user?.role === 'AGENT' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const isAgent = user?.role === 'AGENT';
  const isAssignedToMe = String(ticket?.assignedTo?._id || ticket?.assignedTo || '') === String(user?.id || user?._id || '');
  const canModifyTicket = isAdmin || (isAgent && isAssignedToMe);

  useEffect(() => {
    loadTicket();

    // Only Admin can assign tickets, fetch available agents with role === 'AGENT'
    if (user?.role === 'ADMIN') {
      userService
        .getUsers()
        .then((users) => {
          const agentList = (Array.isArray(users) ? users : []).filter((u) => u.role === 'AGENT');
          setAgents(agentList);
        })
        .catch(console.error);
    }
  }, [id, user]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setStatusMessage('');

      // If Admin changed the assigned agent, use assign API
      const currentAssignedId = ticket.assignedTo?._id || ticket.assignedTo || '';
      if (isAdmin && assignedTo && assignedTo !== currentAssignedId) {
        await ticketService.assignTicket(id, assignedTo);
      }

      const updatePayload = {
        status: selectedStatus,
        priority: selectedPriority,
      };

      const updated = await ticketService.updateTicket(id, updatePayload);
      setTicket(updated);
      setStatusMessage('Incident properties updated successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
      await loadTicket();
    } catch (err) {
      console.error('Failed to update ticket:', err);
      setError('Failed to save ticket changes: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveTicket = async () => {
    try {
      setUpdating(true);
      setStatusMessage('');
      await ticketService.resolveTicket(id);
      setTicket((prev) => ({ ...prev, status: 'RESOLVED' }));
      setSelectedStatus('RESOLVED');
      setStatusMessage('Ticket resolved successfully via Agent Resolve API!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
      alert('Failed to resolve ticket: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAiResolution = async (resolution, steps) => {
    try {
      setUpdating(true);
      const res = await ticketService.updateAiResolution(id, resolution, steps);
      setTicket((prev) => ({
        ...prev,
        aiResolution: res.aiResolution || { resolution, steps },
      }));
      setStatusMessage('AI resolution updated & saved successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update AI resolution:', err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };


  const handleArchivePostmortem = async () => {
    if (!window.confirm('Archive this ticket into company Incident Postmortems?')) return;
    try {
      setArchiving(true);
      const postmortemData = {
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        rootCause: ticket.aiDiagnosis?.rootCause || 'Root cause identified and resolved.',
        resolution: ticket.aiResolution?.resolution || 'Resolution verified by staff.',
        originalTicket: ticket._id,
        resolvedBy: user?._id || user?.id,
      };
      await incidentService.createIncident(postmortemData);
      setStatusMessage('Archived successfully to /api/incident registry!');
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error('Archive error:', err);
      alert('Failed to archive postmortem.');
    } finally {
      setArchiving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this ticket?')) return;
    try {
      await ticketService.deleteTicket(id);
      navigate(-1);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      alert('Failed to delete ticket.');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-mono">Loading incident telemetry & AI diagnosis...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-2xl">
          {error || 'Ticket not found.'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-800 text-white text-xs rounded-xl hover:bg-slate-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incident Desk
        </button>

        <div className="flex items-center gap-3">
          {/* Postmortem Archive Button */}
          {ticket.status === 'RESOLVED' && (
            <button
              onClick={handleArchivePostmortem}
              disabled={archiving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{archiving ? 'Archiving...' : 'Archive as Postmortem'}</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Ticket
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/10">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Incident Overview Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-slate-400 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/5">
                INC-{ticket._id?.slice(-6).toUpperCase()}
              </span>
              <CategoryBadge category={ticket.category} />
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {ticket.title}
            </h1>
          </div>

          {/* Quick Staff Controls */}
          {isStaff && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 w-full lg:w-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {isAdmin ? 'Admin Lifecycle & Agent Assignment' : isAssignedToMe ? 'Assigned Agent Controls' : 'Incident Assignment Status'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {canModifyTicket ? (
                  <>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      {PRIORITY_OPTIONS.map((pr) => (
                        <option key={pr} value={pr}>
                          {pr}
                        </option>
                      ))}
                    </select>

                    {isAdmin && (
                      <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="">Select Agent to Assign</option>
                        {agents.map((ag) => (
                          <option key={ag._id} value={ag._id}>
                            {ag.name} ({ag.role})
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      onClick={handleUpdate}
                      disabled={updating}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{updating ? 'Saving...' : isAdmin && assignedTo ? 'Save / Assign' : 'Update'}</span>
                    </button>

                    {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                      <button
                        onClick={handleResolveTicket}
                        disabled={updating}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                        title="Mark ticket as RESOLVED"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Resolve Ticket</span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>
                      {ticket.assignedTo
                        ? `Assigned to ${ticket.assignedTo?.name || 'another agent'}`
                        : 'Unassigned ticket. Awaiting Admin assignment.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-white/5 text-xs text-slate-400">
          <div>
            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Reported By
            </span>
            <div className="flex items-center gap-2 text-slate-200 font-bold mt-1">
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span>{ticket.createdBy?.name || 'Staff User'}</span>
            </div>
            <span className="text-[11px] text-slate-500">{ticket.createdBy?.email}</span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Assigned Handler
            </span>
            <div className="flex items-center gap-2 text-slate-200 font-bold mt-1">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>{ticket.assignedTo?.name || 'Autonomous AI'}</span>
            </div>
            <span className="text-[11px] text-slate-500">{ticket.assignedTo?.email || 'Self-Healing'}</span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Logged At
            </span>
            <div className="flex items-center gap-2 text-slate-200 font-medium mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
            <span className="text-[11px] text-slate-500">{new Date(ticket.createdAt).toLocaleTimeString()}</span>
          </div>

          <div>
            <span className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Last Telemetry Sync
            </span>
            <div className="flex items-center gap-2 text-slate-200 font-medium mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
            </div>
            <span className="text-[11px] text-slate-500">{new Date(ticket.updatedAt).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Detailed Issue Description */}
        <div className="pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Incident Description & Trace
          </h3>
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">
            {ticket.description}
          </div>
        </div>
      </div>

      {/* AI Analysis Master Card */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            Autonomous AI Root Cause & Resolution
          </h2>
        </div>
        <AiAnalysisCard
          ticket={ticket}
          onUpdateResolution={handleUpdateAiResolution}
          isStaff={canModifyTicket}
        />
      </div>


      {/* Timeline & Discussion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline block */}
        <div className="glass-panel rounded-3xl p-6 shadow-xl border border-white/5 h-fit">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-brand-400" />
            Audit Timeline
          </h3>
          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            <div className="relative pl-6">
              <span className="absolute left-0 top-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
              <p className="text-xs font-bold text-slate-200">Incident Submitted</p>
              <p className="text-[11px] text-slate-400">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>

            <div className="relative pl-6">
              <span className="absolute left-0 top-1 w-4 h-4 rounded-full bg-brand-500 border-2 border-slate-950" />
              <p className="text-xs font-bold text-slate-200">AI Multi-Agent Pipeline Executed</p>
              <p className="text-[11px] text-slate-400">Triage, RAG Search & Diagnosis complete</p>
            </div>

            {ticket.status !== 'OPEN' && (
              <div className="relative pl-6">
                <span className="absolute left-0 top-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-slate-950" />
                <p className="text-xs font-bold text-slate-200">Lifecycle: {ticket.status}</p>
                <p className="text-[11px] text-slate-400">{new Date(ticket.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Discussion / Comments */}
        <div className="lg:col-span-2">
          <TicketComments ticketId={ticket._id} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
