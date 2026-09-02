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
import { Plus, Search, Edit2, Trash2, LayoutGrid, List } from 'lucide-react';

export const Horses = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [formData, setFormData] = useState({ name: '', breed: '', age: 4, gender: 'Male', status: 'ACTIVE' });
  const [formError, setFormError] = useState('');

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchHorses();
  }, [search, statusFilter]);

  const fetchHorses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/horses', {
        params: { search, status: statusFilter }
      });
      setHorses(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingHorse(null);
    setFormData({ name: '', breed: 'Thoroughbred', age: 4, gender: 'Male', status: 'ACTIVE' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (horse) => {
    setEditingHorse(horse);
    setFormData({
      name: horse.name,
      breed: horse.breed,
      age: horse.age,
      gender: horse.gender,
      status: horse.status
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingHorse) {
        await api.put(`/horses/${editingHorse.horseId}`, formData);
        showToast(`Horse '${formData.name}' updated successfully`, 'success');
      } else {
        await api.post('/horses', formData);
        showToast(`Horse '${formData.name}' created successfully`, 'success');
      }
      setIsModalOpen(false);
      fetchHorses();
    } catch (err) {
      setFormError(err.message);
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/horses/${deleteId}`);
      showToast('Horse record deleted successfully', 'success');
      setDeleteId(null);
      fetchHorses();
    } catch (err) {
      showToast(err.message || 'Failed to delete horse', 'error');
      setDeleteId(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'horseId', width: '80px' },
    { header: 'Horse Name', render: (row) => <strong style={{ color: 'var(--text-main)' }}>{row.name}</strong> },
    { header: 'Breed', accessor: 'breed' },
    { header: 'Age', render: (row) => `${row.age} yrs` },
    { header: 'Gender', accessor: 'gender' },
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
            <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(row.horseId)}>
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
          <h1>Horse Directory</h1>
          <p>Manage thoroughbreds and racehorse profiles</p>
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
              <Plus size={18} /> Register New Horse
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
              placeholder="Search horse by name..."
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
      ) : horses.length === 0 ? (
        <EmptyState
          title="No horses registered"
          message="Add your first thoroughbred profile to get started."
          actionText={hasRole(['ADMIN', 'RACE_OFFICIAL']) ? "Register New Horse" : null}
          onAction={handleOpenAdd}
        />
      ) : viewMode === 'card' ? (
        <div className="profile-card-grid">
          {horses.map((h) => (
            <div key={h.horseId} className="glass-card profile-card">
              <div className="profile-avatar">🐎</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{h.name}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 600, marginBottom: '0.85rem' }}>
                {h.breed}
              </span>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <span>Age: <strong>{h.age} yrs</strong></span>
                <span>Gender: <strong>{h.gender}</strong></span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <Badge status={h.status} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: 'auto' }}>
                {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleOpenEdit(h)}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                {hasRole('ADMIN') && (
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(h.horseId)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={horses} loading={loading} />
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingHorse ? "Edit Horse Profile" : "Register New Horse"}>
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <label>Horse Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Breed</label>
            <input
              type="text"
              className="form-control"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Age (years)</label>
              <input
                type="number"
                min="1"
                max="25"
                className="form-control"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="input-group">
              <label>Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
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
              {editingHorse ? "Save Changes" : "Create Horse Record"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Horse Deletion"
        message="Are you sure you want to delete this horse record from the system?"
      />
    </div>
  );
};
