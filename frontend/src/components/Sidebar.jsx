import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Calendar,
  ClipboardList,
  Award,
  UserCheck,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">🏇</div>
        <div>
          <h2 className="sidebar-title">RACEHUB</h2>
          <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', letterSpacing: '0.08em', fontWeight: 700 }}>
            EVENT PLATFORM
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/races" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={18} />
          <span>Races & Schedule</span>
        </NavLink>

        <NavLink to="/horses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Trophy size={18} />
          <span>Horse Directory</span>
        </NavLink>

        <NavLink to="/jockeys" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <UserCheck size={18} />
          <span>Jockey Directory</span>
        </NavLink>

        <NavLink to="/registrations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ClipboardList size={18} />
          <span>Registrations</span>
        </NavLink>

        <NavLink to="/results" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Award size={18} />
          <span>Official Results</span>
        </NavLink>

        <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Trophy size={18} />
          <span>Leaderboard</span>
        </NavLink>

        {role === 'ADMIN' && (
          <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>User Management</span>
          </NavLink>
        )}
      </nav>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={logout}
          className="nav-item"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={18} color="#F43F5E" />
          <span style={{ color: '#F43F5E' }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
