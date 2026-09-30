import React from 'react';

const priorityConfig = {
  LOW: {
    label: 'Low',
    classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  HIGH: {
    label: 'High',
    classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  CRITICAL: {
    label: 'Critical',
    classes: 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse',
  },
};

export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase border ${config.classes}`}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;
