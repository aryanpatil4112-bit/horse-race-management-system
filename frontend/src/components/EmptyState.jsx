import React from 'react';

export const EmptyState = ({ title = "No records found.", message = "Your next race starts here.", actionText, onAction }) => {
  return (
    <div className="glass-card empty-state" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))' }}>
        🏇
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#FFF' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem', maxWidth: '400px', margin: '0 auto 1.75rem auto' }}>
        "{message}"
      </p>
      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
