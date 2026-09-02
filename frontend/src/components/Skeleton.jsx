import React from 'react';

export const SkeletonCard = () => (
  <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div className="skeleton" style={{ height: '24px', width: '60%' }}></div>
    <div className="skeleton" style={{ height: '16px', width: '85%' }}></div>
    <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
      <div className="skeleton" style={{ height: '36px', flex: 1 }}></div>
      <div className="skeleton" style={{ height: '36px', flex: 1 }}></div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 4 }) => (
  <div className="glass-card" style={{ padding: '1.5rem' }}>
    <div className="skeleton" style={{ height: '32px', width: '100%', marginBottom: '1.25rem' }}></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton" style={{ height: '20px', width: '100%', marginBottom: '0.85rem' }}></div>
    ))}
  </div>
);
