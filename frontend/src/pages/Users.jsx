import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Plus, ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'VIEWER' });
  const [formError, setFormError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/users', formData);
      showToast(`User account created for '${formData.name}' with role ${formData.role}`, 'success');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'VIEWER' });
      fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Failed to create user account.');
      showToast(err.message || 'Error creating user', 'error');
    }
  };

  const handleRoleChange = async (userId, userName, currentRole, newRole) => {
    if (currentRole === newRole) return;
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      showToast(`Role updated for ${userName} to ${newRole}`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'userId', width: '80px' },
    { header: 'Full Name', render: (row) => <strong>{row.name}</strong> },
    { header: 'Email Address', accessor: 'email' },
    { header: 'Current Role', render: (row) => <Badge status={row.role} /> },
    {
      header: 'Manage Privilege Level',
      render: (row) => (
        <select
          className="form-control"
          style={{ width: '170px', padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
          value={row.role}
          onChange={(e) => handleRoleChange(row.userId, row.name, row.role, e.target.value)}
        >
          <option value="VIEWER">VIEWER</option>
          <option value="RACE_OFFICIAL">RACE_OFFICIAL</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title-group">
          <h1>User & Role Management</h1>
          <p>Admin panel for managing system accounts and role privileges</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create User Account
        </button>
      </div>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="No users found." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Admin Provisioned Account">
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleCreateUser}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Password (min. 8 characters)</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Assign Role Privilege</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="VIEWER">VIEWER (Read-Only Public Access)</option>
              <option value="RACE_OFFICIAL">RACE_OFFICIAL (Race & Results Management)</option>
              <option value="ADMIN">ADMIN (Full System Privileges)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
