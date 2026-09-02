import React from 'react';

export const Badge = ({ status }) => {
  if (!status) return null;
  const s = String(status).toLowerCase();
  
  let className = 'badge-inactive';
  if (['active', 'completed', 'registered'].includes(s)) className = 'badge-active';
  if (['scheduled', 'ongoing'].includes(s)) className = 'badge-scheduled';
  if (['inactive', 'cancelled'].includes(s)) className = 'badge-inactive';

  return (
    <span className={`badge ${className}`}>
      {status}
    </span>
  );
};
