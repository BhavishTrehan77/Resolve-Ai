import React from 'react';

const statusConfig = {
  OPEN: {
    label: 'Open',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  WAITING_FOR_USER: {
    label: 'Waiting for User',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  ESCALATED: {
    label: 'Escalated',
    classes: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dot: 'bg-rose-400',
  },
  RESOLVED: {
    label: 'Resolved',
    classes: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    dot: 'bg-teal-400',
  },
  CLOSED: {
    label: 'Closed',
    classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dot: 'bg-slate-400',
  },
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
