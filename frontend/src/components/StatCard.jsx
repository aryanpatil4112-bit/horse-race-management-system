import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'var(--accent-gold)' }) => {
  return (
    <div className="glass-card stat-card">
      <div>
        <div className="stat-label">{title}</div>
        <div className="stat-val">{value}</div>
      </div>
      {Icon && (
        <div className="stat-icon" style={{ borderColor: `${color}30` }}>
          <Icon size={24} color={color} />
        </div>
      )}
    </div>
  );
};
