import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import { Plus, Search, Edit2, Trash2, Award, LayoutGrid, List } from 'lucide-react';

export const Jockeys = () => {
  const [jockeys, setJockeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJockey, setEditingJockey] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: 28, experience: 5, status: 'ACTIVE' });
  const [formError, setFormError] = useState('');

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchJockeys();
  }, [search, statusFilter]);

  const fetchJockeys = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jockeys', {
        params: { search, status: statusFilter }
      });
      setJockeys(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingJockey(null);
    setFormData({ name: '', age: 25, experience: 5, status: 'ACTIVE' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (jockey) => {
    setEditingJockey(jockey);
    setFormData({
      name: jockey.name,
      age: jockey.age,
      experience: jockey.experience,
      status: jockey.status
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingJockey) {
        await api.put(`/jockeys/${editingJockey.jockeyId}`, formData);
        showToast(`Jockey '${formData.name}' updated successfully`, 'success');
      } else {
        await api.post('/jockeys', formData);
        showToast(`Jockey '${formData.name}' registered successfully`, 'success');
      }
      setIsModalOpen(false);
      fetchJockeys();
    } catch (err) {
      setFormError(err.message);
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/jockeys/${deleteId}`);
      showToast('Jockey profile deleted successfully', 'success');
      setDeleteId(null);
      fetchJockeys();
    } catch (err) {
      showToast(err.message || 'Failed to delete jockey', 'error');
      setDeleteId(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'jockeyId', width: '80px' },
    { header: 'Jockey Name', render: (row) => <strong style={{ color: 'var(--text-main)' }}>{row.name}</strong> },
    { header: 'Age', render: (row) => `${row.age} yrs` },
    { header: 'Experience', render: (row) => `${row.experience} yrs` },
    { header: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(row)}>
              <Edit2 size={14} /> Edit
            </button>
          )}
          {hasRole('ADMIN') && (
            <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(row.jockeyId)}>
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Jockey Directory</h1>
          <p>Manage licensed club jockeys and rider records</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'card' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid size={15} /> Cards
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              <List size={15} /> Table
            </button>
          </div>

          {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={18} /> Add New Jockey
            </button>
          )}
        </div>
      </div>

      <div className="search-bar">
        <div className="input-group" style={{ flex: 1, minWidth: '240px', marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search jockey by name..."
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <select
          className="form-control"
          style={{ width: '180px', marginBottom: 0 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {loading ? (
        <div className="profile-card-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : jockeys.length === 0 ? (
        <EmptyState
          title="No jockeys found"
          message="Register a new jockey profile to assign riders to race fixtures."
          actionText={hasRole(['ADMIN', 'RACE_OFFICIAL']) ? "Add New Jockey" : null}
          onAction={handleOpenAdd}
        />
      ) : viewMode === 'card' ? (
        <div className="profile-card-grid">
          {jockeys.map((j) => (
            <div key={j.jockeyId} className="glass-card profile-card">
              <div className="profile-avatar" style={{ borderColor: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)' }}>
                🏇
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{j.name}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                Age: {j.age} yrs
              </span>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                <Award size={14} /> {j.experience} Years Experience
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <Badge status={j.status} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
                {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleOpenEdit(j)}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                {hasRole('ADMIN') && (
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(j.jockeyId)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={jockeys} loading={loading} />
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingJockey ? "Edit Jockey Profile" : "Add New Jockey"}>
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <label>Jockey Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Age</label>
              <input
                type="number"
                min="16"
                max="70"
                className="form-control"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="input-group">
              <label>Experience (years)</label>
              <input
                type="number"
                min="0"
                max="55"
                className="form-control"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingJockey ? "Save Changes" : "Register Jockey"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Jockey Deletion"
        message="Are you sure you want to delete this jockey profile from the system?"
      />
    </div>
  );
};
