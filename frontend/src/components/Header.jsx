import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronDown, ShieldCheck, Award, Eye, Mail, User } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Compute dynamic 2-letter initials (e.g., "Aryan Patil" -> "AP", "Admin User" -> "AU")
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Capitalize full name nicely
  const formatName = (name) => {
    if (!name) return 'User';
    return name
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'ADMIN', badgeClass: 'badge-admin', avatarClass: 'avatar-admin', icon: ShieldCheck };
      case 'RACE_OFFICIAL':
        return { label: 'RACE OFFICIAL', badgeClass: 'badge-official', avatarClass: 'avatar-official', icon: Award };
      default:
        return { label: 'VIEWER', badgeClass: 'badge-viewer', avatarClass: 'avatar-viewer', icon: Eye };
    }
  };

  const roleInfo = getRoleInfo(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="top-header">
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Apex Horse Racing Club Portal
        </span>
      </div>

      <div className="header-user-wrapper" ref={menuRef}>
        {/* Clickable Profile Card */}
        <div className="header-user-card" onClick={() => setIsOpen(!isOpen)} title={`${user?.name} (${user?.email})`}>
          <div className={`user-avatar-circle ${roleInfo.avatarClass}`}>
            {getInitials(user?.name)}
          </div>

          <div className="user-info-group">
            <span className="user-name-text">{formatName(user?.name)}</span>
            <span className="user-email-text">{user?.email || 'user@horserace.com'}</span>
          </div>

          <span className={`badge ${roleInfo.badgeClass}`} style={{ marginLeft: '0.35rem', fontSize: '0.7rem' }}>
            <RoleIcon size={12} />
            {roleInfo.label}
          </span>

          <ChevronDown size={15} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
        </div>

        {/* Profile Dropdown Menu */}
        {isOpen && (
          <div className="profile-menu-dropdown">
            <div className="dropdown-header">
              <div className={`user-avatar-circle ${roleInfo.avatarClass}`} style={{ width: '44px', height: '44px', fontSize: '1.05rem' }}>
                {getInitials(user?.name)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF' }}>{formatName(user?.name)}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.email}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role Privilege</span>
              <span className={`badge ${roleInfo.badgeClass}`}>
                <RoleIcon size={12} /> {roleInfo.label}
              </span>
            </div>

            <button
              onClick={() => { setIsOpen(false); logout(); }}
              className="dropdown-item"
              style={{ color: '#F43F5E', marginTop: '0.25rem' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
