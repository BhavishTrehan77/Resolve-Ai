import React, { useState } from 'react';
import {
  Sparkles,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ListOrdered,
  Copy,
  Check,
  Terminal,
  Zap,
  Cpu,
} from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import PriorityBadge from './PriorityBadge';

export const AiAnalysisCard = ({ ticket, onUpdateResolution, isStaff }) => {
  const [completedSteps, setCompletedSteps] = useState({});
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editResolutionText, setEditResolutionText] = useState('');
  const [editStepsText, setEditStepsText] = useState('');
  const [savingResolution, setSavingResolution] = useState(false);

  if (!ticket) return null;

  const { aiTriage, aiDiagnosis, aiResolution, aiConfidence, aiEscalated } = ticket;

  const confidencePercent = aiConfidence
    ? Math.round(aiConfidence > 1 ? aiConfidence : aiConfidence * 100)
    : 0;

  const toggleStep = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const copyResolution = () => {
    if (!aiResolution?.resolution) return;
    const text = `${aiResolution.resolution}\n\nSteps:\n${(aiResolution.steps || [])
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEditing = () => {
    setEditResolutionText(aiResolution?.resolution || '');
    setEditStepsText((aiResolution?.steps || []).join('\n'));
    setIsEditing(true);
  };

  const saveEditedResolution = async () => {
    if (!onUpdateResolution) return;
    try {
      setSavingResolution(true);
      const stepsArray = editStepsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      await onUpdateResolution(editResolutionText, stepsArray);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update resolution: ' + err.message);
    } finally {
      setSavingResolution(false);
    }
  };


  const hasAiData = aiTriage || aiDiagnosis || aiResolution || aiConfidence !== undefined;

  if (!hasAiData) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center border border-white/5">
        <Sparkles className="w-10 h-10 text-brand-400 mx-auto mb-3 opacity-40 animate-pulse" />
        <h4 className="text-base font-semibold text-slate-300">AI Intelligence Pending</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          The autonomous triage, retrieval, and diagnosis pipeline has not run on this ticket yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-600/30 via-purple-600/20 to-cyan-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

      {/* Main Container */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-brand-500/30">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  Multi-Agent AI Intelligence
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  GenAI RAG Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous root-cause diagnosis & vector knowledge resolution
              </p>
            </div>
          </div>

          {/* Top Metric Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Confidence Dial Badge */}
            <div className="bg-slate-950/80 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                  AI Confidence
                </span>
                <span className="text-sm font-black text-white">{confidencePercent}%</span>
              </div>
              <div className="w-12 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    confidencePercent >= 75
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : confidencePercent >= 50
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, confidencePercent))}%` }}
                />
              </div>
            </div>

            {/* Human Escalation Badge */}
            {aiEscalated ? (
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-lg shadow-rose-500/10">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Human Escalation Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Autonomously Resolvable
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Agent Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {/* Triage Agent Box */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Triage & Intent Agent
                </h4>
              </div>
              <div className="flex gap-2">
                {aiTriage?.category && <CategoryBadge category={aiTriage.category} />}
                {aiTriage?.priority && <PriorityBadge priority={aiTriage.priority} />}
              </div>
            </div>

            {aiTriage?.intent && (
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Extracted Intent
                </span>
                <p className="text-xs font-mono font-medium text-cyan-300 mt-1 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-800/30">
                  {aiTriage.intent}
                </p>
              </div>
            )}

            {aiTriage?.summary && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Incident Summary
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiTriage.summary}</p>
              </div>
            )}
          </div>

          {/* Diagnosis Agent Box */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Root Cause Diagnosis Agent
                </h4>
              </div>
              {aiDiagnosis?.confidence !== undefined && (
                <span className="text-[11px] text-purple-300 font-mono font-semibold bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                  {Math.round(aiDiagnosis.confidence > 1 ? aiDiagnosis.confidence : aiDiagnosis.confidence * 100)}% accuracy
                </span>
              )}
            </div>

            {aiDiagnosis?.rootCause && (
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Root Cause
                </span>
                <p className="text-xs font-semibold text-purple-200 mt-1 bg-purple-950/40 p-2.5 rounded-xl border border-purple-800/30 leading-snug">
                  {aiDiagnosis.rootCause}
                </p>
              </div>
            )}

            {aiDiagnosis?.reasoning && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Technical Reasoning
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{aiDiagnosis.reasoning}</p>
              </div>
            )}
          </div>
        </div>

        {/* Resolution Agent Section */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Recommended AI Resolution Strategy</h4>
            </div>

            <div className="flex items-center gap-2">
              {isStaff && !isEditing && (
                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-300 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-all cursor-pointer"
                >
                  <span>Edit / Modify Resolution</span>
                </button>
              )}

              <button
                onClick={copyResolution}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-white/5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 mb-5 p-4 rounded-xl bg-slate-950/80 border border-brand-500/30">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Resolution Summary
                </label>
                <textarea
                  rows="3"
                  value={editResolutionText}
                  onChange={(e) => setEditResolutionText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Troubleshooting Steps (One per line)
                </label>
                <textarea
                  rows="4"
                  value={editStepsText}
                  onChange={(e) => setEditStepsText(e.target.value)}
                  placeholder="Step 1&#10;Step 2&#10;Step 3"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingResolution || !editResolutionText.trim()}
                  onClick={saveEditedResolution}
                  className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow cursor-pointer disabled:opacity-50"
                >
                  {savingResolution ? 'Saving...' : 'Save Resolution'}
                </button>
              </div>
            </div>
          ) : (
            aiResolution?.resolution && (
              <p className="text-sm text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-950/60 border border-white/5 mb-5 font-normal">
                {aiResolution.resolution}
              </p>
            )
          )}


          {/* Interactive Steps Checklist */}
          {aiResolution?.steps && aiResolution.steps.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-brand-400" />
                  Step-by-Step Action Plan (Click to check off)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {Object.values(completedSteps).filter(Boolean).length}/{aiResolution.steps.length} done
                </span>
              </div>

              <div className="space-y-2.5">
                {aiResolution.steps.map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                          : 'bg-slate-900/50 hover:bg-slate-800/60 border-white/5 hover:border-brand-500/30 text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors mt-0.5 ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-brand-500/20 text-brand-400 border border-brand-500/30 group-hover:bg-brand-500 group-hover:text-white'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-500' : ''}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisCard;
