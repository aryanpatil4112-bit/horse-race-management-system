import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { Plus, Trash2, ClipboardCheck, AlertCircle } from 'lucide-react';

export const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [races, setRaces] = useState([]);
  const [horses, setHorses] = useState([]);
  const [jockeys, setJockeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedRaceFilter, setSelectedRaceFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState({ raceId: '', horseId: '', jockeyId: '' });
  const [formError, setFormError] = useState('');

  // Delete Confirm State
  const [deleteId, setDeleteId] = useState(null);

  const { hasRole } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchOptions();
    fetchRegistrations();
  }, [selectedRaceFilter]);

  const fetchOptions = async () => {
    try {
      const racesRes = await api.get('/races');
      setRaces(racesRes.data.filter(r => r.status === 'SCHEDULED' || r.status === 'ONGOING'));

      const horsesRes = await api.get('/horses', { params: { status: 'ACTIVE' } });
      setHorses(horsesRes.data);

      const jockeysRes = await api.get('/jockeys', { params: { status: 'ACTIVE' } });
      setJockeys(jockeysRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/registrations', {
        params: { raceId: selectedRaceFilter || undefined }
      });
      setRegistrations(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.raceId || !formData.horseId || !formData.jockeyId) {
      setFormError('Please select a race, horse, and jockey.');
      return;
    }

    try {
      await api.post('/registrations', {
        raceId: parseInt(formData.raceId),
        horseId: parseInt(formData.horseId),
        jockeyId: parseInt(formData.jockeyId)
      });
      showToast('Participant registered successfully!', 'success');
      setFormData({ raceId: formData.raceId, horseId: '', jockeyId: '' });
      fetchRegistrations();
    } catch (err) {
      setFormError(err.message);
      showToast(err.message || 'Registration failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/registrations/${deleteId}`);
      showToast('Registration cancelled successfully', 'success');
      setDeleteId(null);
      fetchRegistrations();
    } catch (err) {
      showToast(err.message || 'Failed to cancel registration', 'error');
      setDeleteId(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'registrationId', width: '80px' },
    { header: 'Race Event', render: (row) => <strong style={{ color: 'var(--text-main)' }}>{row.raceName}</strong> },
    { header: 'Horse Name', render: (row) => `🐎 ${row.horseName} (${row.horseBreed})` },
    { header: 'Assigned Jockey', render: (row) => `🏇 ${row.jockeyName}` },
    { header: 'Registration Date', render: (row) => new Date(row.registrationDate).toLocaleDateString() },
    { header: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        hasRole('ADMIN') && (
          <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(row.registrationId)}>
            <Trash2 size={14} /> Cancel Reg
          </button>
        )
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Race Registrations</h1>
          <p>Register horses and jockeys for upcoming race fixtures</p>
        </div>
      </div>

      {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--border-hover)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <ClipboardCheck size={24} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.25rem' }}>Register Participant for Race Fixture</h3>
          </div>

          {formError && <div className="alert alert-error"><AlertCircle size={18} /> {formError}</div>}

          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
              <div className="input-group">
                <label>SELECT RACE</label>
                <select
                  className="form-control"
                  value={formData.raceId}
                  onChange={(e) => setFormData({ ...formData, raceId: e.target.value })}
                  required
                >
                  <option value="">-- Select Scheduled Race --</option>
                  {races.map(r => (
                    <option key={r.raceId} value={r.raceId}>
                      {r.raceName} ({r.raceDate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>SELECT HORSE</label>
                <select
                  className="form-control"
                  value={formData.horseId}
                  onChange={(e) => setFormData({ ...formData, horseId: e.target.value })}
                  required
                >
                  <option value="">-- Select Active Horse --</option>
                  {horses.map(h => (
                    <option key={h.horseId} value={h.horseId}>
                      {h.name} - {h.breed} ({h.age} yrs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>SELECT JOCKEY</label>
                <select
                  className="form-control"
                  value={formData.jockeyId}
                  onChange={(e) => setFormData({ ...formData, jockeyId: e.target.value })}
                  required
                >
                  <option value="">-- Select Active Jockey --</option>
                  {jockeys.map(j => (
                    <option key={j.jockeyId} value={j.jockeyId}>
                      {j.name} ({j.experience} yrs exp)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                <Plus size={18} /> REGISTER PARTICIPANT
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="search-bar">
        <select
          className="form-control"
          style={{ width: '280px', marginBottom: 0 }}
          value={selectedRaceFilter}
          onChange={(e) => setSelectedRaceFilter(e.target.value)}
        >
          <option value="">Filter by All Races</option>
          {races.map(r => (
            <option key={r.raceId} value={r.raceId}>
              {r.raceName}
            </option>
          ))}
        </select>
      </div>

      {registrations.length === 0 && !loading ? (
        <EmptyState
          title="No race registrations found"
          message="Select a race above to register your first horse and jockey."
        />
      ) : (
        <DataTable columns={columns} data={registrations} loading={loading} />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Registration"
        message="Are you sure you want to cancel this race registration?"
      />
    </div>
  );
};
