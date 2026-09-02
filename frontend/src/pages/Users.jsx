import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DataTable } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Users as UsersIcon, Shield, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'VIEWER' });
  const [formError, setFormError] = useState('');

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
      await api.post('/auth/register', formData);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: 'User ID', accessor: 'userId', width: '80px' },
    { header: 'Full Name', render: (row) => <strong>{row.name}</strong> },
    { header: 'Email Address', accessor: 'email' },
    { header: 'System Role', render: (row) => <Badge status={row.role} /> }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title-group">
          <h1>User Management</h1>
          <p>Admin panel for managing system accounts and role privileges</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create System Account
        </button>
      </div>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="No users found." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create System Account">
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
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Assign Role</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="ADMIN">ADMIN (Full Access)</option>
              <option value="RACE_OFFICIAL">RACE_OFFICIAL (Race & Results)</option>
              <option value="VIEWER">VIEWER (Read-Only)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create User Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
