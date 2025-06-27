import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100 text-yellow-800',
      text: 'Pending'
    },
    'in-progress': {
      bg: 'bg-blue-100 text-blue-800',
      text: 'In Progress'
    },
    completed: {
      bg: 'bg-green-100 text-green-800',
      text: 'Completed'
    },
    cancelled: {
      bg: 'bg-red-100 text-red-800',
      text: 'Cancelled'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
      {config.text}
    </span>
  );
}