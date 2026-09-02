import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user } = useAuth();

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'badge-admin';
      case 'RACE_OFFICIAL': return 'badge-official';
      default: return 'badge-viewer';
    }
  };

  return (
    <header className="top-header">
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Apex Horse Racing Club Portal
        </span>
      </div>

      <div className="header-user">
        <span className={`badge ${getRoleBadgeClass(user?.role)}`}>
          {user?.role?.replace('_', ' ') || 'GUEST'}
        </span>
        <div className="user-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{user?.email || ''}</div>
        </div>
      </div>
    </header>
  );
};
