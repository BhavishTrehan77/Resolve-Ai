import React from 'react';

const categoryColors = {
  NETWORK: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  HARDWARE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  SOFTWARE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  DATABASE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  SECURITY: 'bg-red-500/10 text-red-400 border-red-500/20',
  ACCESS: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  CLOUD: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  OTHER: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export const CategoryBadge = ({ category }) => {
  const classes = categoryColors[category] || categoryColors.OTHER;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${classes}`}>
      {category || 'OTHER'}
    </span>
  );
};

export default CategoryBadge;
