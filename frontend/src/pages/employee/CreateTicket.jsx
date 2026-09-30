import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ticketService } from '../../services/ticketService';
import CategoryBadge from '../../components/CategoryBadge';
import PriorityBadge from '../../components/PriorityBadge';
import {
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Bot,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Brain,
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES = [
  'NETWORK',
  'HARDWARE',
  'SOFTWARE',
  'DATABASE',
  'SECURITY',
  'ACCESS',
  'CLOUD',
  'OTHER',
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const CreateTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SOFTWARE',
    priority: 'MEDIUM',
  });
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');

  // Handle prefill if coming from quick prompt
  useEffect(() => {
    if (location.state?.prefill) {
      const p = location.state.prefill;
      setFormData((prev) => ({
        ...prev,
        title: p.title || prev.title,
        category: p.cat || prev.category,
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const stepsList = [
    { name: 'Triage Agent', desc: 'Classifying category & intent' },
    { name: 'Retrieval Agent', desc: 'Vector searching technical SOPs' },
    { name: 'Diagnosis Agent', desc: 'Analyzing root cause' },
    { name: 'Resolution Agent', desc: 'Formulating step-by-step fix' },
    { name: 'Escalation Agent', desc: 'Scoring confidence' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }

    try {
      setLoading(true);
      setActiveStep(0);

      // Animate agent progression
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 1400);

      const result = await ticketService.createTicket(formData);
      clearInterval(interval);

      const createdTicketId = result?.ticket?._id || result?._id;
      if (createdTicketId) {
        navigate(`/ticket/${createdTicketId}`);
      } else {
        navigate('/employee/my-tickets');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to create ticket.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Main Form Card */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Report IT Incident</h1>
            <p className="text-xs text-slate-400">
              Dispatches multi-agent neural cluster for instant root cause diagnosis & SOP retrieval
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          /* Multi-Agent Orchestration Visualizer */
          <div className="py-12 space-y-8 text-center">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
              <Cpu className="w-9 h-9 text-brand-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                AI Agent Pipeline Executing
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Please hold while 5 autonomous agents orchestrate Gemini and MongoDB Vector Search.
              </p>
            </div>

            {/* Stepper progress */}
            <div className="max-w-md mx-auto space-y-2.5 text-left">
              {stepsList.map((step, idx) => {
                const isCurrent = idx === activeStep;
                const isDone = idx < activeStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-brand-950/40 border-brand-500/40 text-white shadow-lg shadow-brand-500/10'
                        : isDone
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                        : 'bg-white/[0.01] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : isCurrent
                            ? 'bg-brand-500 text-white animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{step.name}</p>
                        <p className="text-[10px] text-slate-400">{step.desc}</p>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-mono text-brand-400 animate-pulse font-bold">
                        Running...
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Incident Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Cannot connect to corporate VPN or access staging DB"
                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Category & Priority with Live Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Category
                  </label>
                  <CategoryBadge category={formData.category} />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Priority
                  </label>
                  <PriorityBadge priority={formData.priority} />
                </div>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  {PRIORITIES.map((pri) => (
                    <option key={pri} value={pri}>
                      {pri}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Detailed Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                required
                rows="6"
                value={formData.description}
                onChange={handleChange}
                placeholder="Include error codes, command outputs, timestamps, and steps already attempted..."
                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none leading-relaxed"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Detailed logs and symptoms allow the RAG Retrieval Agent to match company documentation with higher accuracy.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit & Analyze with Multi-Agent AI</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateTicket;
