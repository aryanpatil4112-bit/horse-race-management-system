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
import { Plus, Search, Edit2, Trash2, Calendar, MapPin, Eye, Users, Flag, LayoutGrid, List } from 'lucide-react';

export const Races = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const { hasRole } = useAuth();
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const [formData, setFormData] = useState({
    raceName: '',
    raceDate: new Date().toISOString().split('T')[0],
    raceTime: '15:30',
    location: '',
    distance: '1600m',
    status: 'SCHEDULED'
  });
  const [formError, setFormError] = useState('');

  // Selected Race Details Modal
  const [selectedRace, setSelectedRace] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [results, setResults] = useState([]);

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRaces();
  }, [search, statusFilter]);

  const fetchRaces = async () => {
    setLoading(true);
    try {
      const res = await api.get('/races', {
        params: { search, status: statusFilter }
      });
      setRaces(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRace(null);
    setFormData({
      raceName: '',
      raceDate: new Date().toISOString().split('T')[0],
      raceTime: '15:30',
      location: 'Pune Racecourse',
      distance: '1600m',
      status: 'SCHEDULED'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (race) => {
    setEditingRace(race);
    setFormData({
      raceName: race.raceName,
      raceDate: race.raceDate,
      raceTime: race.raceTime,
      location: race.location,
      distance: race.distance,
      status: race.status
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleViewRace = async (race) => {
    setSelectedRace(race);
    try {
      const regRes = await api.get('/registrations', { params: { raceId: race.raceId } });
      setRegistrations(regRes.data);
      const resRes = await api.get('/results', { params: { raceId: race.raceId } });
      setResults(resRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingRace) {
        await api.put(`/races/${editingRace.raceId}`, formData);
        showToast(`Race '${formData.raceName}' updated successfully`, 'success');
      } else {
        await api.post('/races', formData);
        showToast(`Race '${formData.raceName}' scheduled successfully`, 'success');
      }
      setIsModalOpen(false);
      fetchRaces();
    } catch (err) {
      setFormError(err.message);
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/races/${deleteId}`);
      showToast('Race event deleted successfully', 'success');
      setDeleteId(null);
      fetchRaces();
    } catch (err) {
      showToast(err.message || 'Failed to delete race', 'error');
      setDeleteId(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'raceId', width: '80px' },
    { header: 'Race Event Name', render: (row) => <strong style={{ color: 'var(--text-main)' }}>{row.raceName}</strong> },
    { header: 'Date & Time', render: (row) => `${row.raceDate} @ ${row.raceTime}` },
    { header: 'Location', accessor: 'location' },
    { header: 'Distance', accessor: 'distance' },
    { header: 'Participants', render: (row) => `${row.participantCount || 0} Registered` },
    { header: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleViewRace(row)}>
            <Eye size={14} /> View
          </button>
          {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
            <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(row)}>
              <Edit2 size={14} /> Edit
            </button>
          )}
          {hasRole('ADMIN') && (
            <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(row.raceId)}>
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
          <h1>Races & Event Schedule</h1>
          <p>Schedule and manage official club race events</p>
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
              <Plus size={18} /> Schedule New Race
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
              placeholder="Search race by title..."
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <select
          className="form-control"
          style={{ width: '200px', marginBottom: 0 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="ONGOING">ONGOING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {loading ? (
        <div className="race-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : races.length === 0 ? (
        <EmptyState
          title="No races scheduled"
          message="Schedule your next race fixture."
          actionText={hasRole(['ADMIN', 'RACE_OFFICIAL']) ? "Schedule New Race" : null}
          onAction={handleOpenAdd}
        />
      ) : viewMode === 'card' ? (
        <div className="race-grid">
          {races.map((r) => (
            <div key={r.raceId} className="glass-card race-card">
              <div>
                <div className="race-card-header">
                  <div>
                    <h3 className="race-card-title">{r.raceName}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                      🏁 {r.distance}
                    </span>
                  </div>
                  <Badge status={r.status} />
                </div>

                <div className="race-card-meta">
                  <div className="race-card-meta-item">
                    <Calendar size={15} color="var(--text-muted)" />
                    <span>{r.raceDate} @ {r.raceTime}</span>
                  </div>
                  <div className="race-card-meta-item">
                    <MapPin size={15} color="var(--text-muted)" />
                    <span>{r.location}</span>
                  </div>
                  <div className="race-card-meta-item">
                    <Users size={15} color="var(--text-muted)" />
                    <span>{r.participantCount || 0} Participants Registered</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleViewRace(r)}>
                  <Eye size={14} /> View
                </button>
                {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(r)}>
                    <Edit2 size={14} /> Edit
                  </button>
                )}
                {hasRole('ADMIN') && (
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(r.raceId)}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={races} loading={loading} />
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRace ? "Update Race Details" : "Schedule New Race Event"}>
        {formError && <div className="alert alert-error">{formError}</div>}
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <label>Race Event Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.raceName}
              onChange={(e) => setFormData({ ...formData, raceName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Race Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.raceDate}
                onChange={(e) => setFormData({ ...formData, raceDate: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Race Time</label>
              <input
                type="time"
                className="form-control"
                value={formData.raceTime}
                onChange={(e) => setFormData({ ...formData, raceTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Location / Racecourse</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Distance</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 1600m"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Race Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRace ? "Save Changes" : "Schedule Event"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Race Details Modal */}
      <Modal isOpen={!!selectedRace} onClose={() => setSelectedRace(null)} title={selectedRace?.raceName || "Race Details"}>
        {selectedRace && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Date:</strong> {selectedRace.raceDate} @ {selectedRace.raceTime}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Location:</strong> {selectedRace.location}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Distance:</strong> {selectedRace.distance}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Status:</strong> <Badge status={selectedRace.status} /></div>
            </div>

            <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--accent-emerald)' }}>REGISTERED PARTICIPANTS ({registrations.length})</h4>
            {registrations.length > 0 ? (
              <table className="data-table" style={{ marginBottom: '1.5rem' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Horse Name</th>
                    <th>Breed</th>
                    <th>Assigned Jockey</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r, idx) => (
                    <tr key={r.registrationId}>
                      <td><strong>{String(idx + 1).padStart(2, '0')}</strong></td>
                      <td><strong>🐎 {r.horseName}</strong></td>
                      <td>{r.horseBreed}</td>
                      <td>{r.jockeyName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No horses registered yet for this race.</p>}

            {results.length > 0 && (
              <>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--accent-gold)' }}>OFFICIAL RACE FINISH RESULTS</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Horse Name</th>
                      <th>Jockey Name</th>
                      <th>Finish Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((res) => (
                      <tr key={res.resultId} style={{ background: res.position === 1 ? 'rgba(245, 158, 11, 0.1)' : 'transparent' }}>
                        <td>
                          <strong style={{ color: res.position === 1 ? 'var(--accent-gold)' : '#FFF' }}>
                            #{res.position} {res.position === 1 && '🥇'} {res.position === 2 && '🥈'} {res.position === 3 && '🥉'}
                          </strong>
                        </td>
                        <td><strong>{res.horseName}</strong></td>
                        <td>{res.jockeyName}</td>
                        <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{res.finishTime}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Race Event Deletion"
        message="Are you sure you want to delete this race event? All related registrations and results will also be deleted."
      />
    </div>
  );
};
