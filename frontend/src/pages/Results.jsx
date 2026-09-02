import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Award, Plus, Trash2, Trophy, Clock } from 'lucide-react';

export const Results = () => {
  const [results, setResults] = useState([]);
  const [races, setRaces] = useState([]);
  const [registeredParticipants, setRegisteredParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected race filter
  const [selectedRaceId, setSelectedRaceId] = useState('');

  // Result entry form state
  const [formData, setFormData] = useState({
    raceId: '',
    registrationId: '',
    position: 1,
    finishTime: '1:35.00'
  });

  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { hasRole } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchRaces();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [selectedRaceId]);

  useEffect(() => {
    if (formData.raceId) {
      fetchRaceParticipants(formData.raceId);
    } else {
      setRegisteredParticipants([]);
    }
  }, [formData.raceId]);

  const fetchRaces = async () => {
    try {
      const res = await api.get('/races');
      setRaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get('/results', {
        params: { raceId: selectedRaceId || undefined }
      });
      setResults(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const fetchRaceParticipants = async (raceId) => {
    try {
      const res = await api.get('/registrations', { params: { raceId } });
      setRegisteredParticipants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordResult = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.raceId || !formData.registrationId || !formData.position || !formData.finishTime) {
      setFormError('All fields are required.');
      return;
    }

    const reg = registeredParticipants.find(r => r.registrationId === parseInt(formData.registrationId));
    if (!reg) {
      setFormError('Invalid participant selection.');
      return;
    }

    try {
      await api.post('/results', {
        raceId: parseInt(formData.raceId),
        horseId: reg.horseId,
        jockeyId: reg.jockeyId,
        position: parseInt(formData.position),
        finishTime: formData.finishTime
      });

      showToast(`Position #${formData.position} recorded for ${reg.horseName}!`, 'success');
      setFormData({ raceId: formData.raceId, registrationId: '', position: formData.position + 1, finishTime: '1:35.00' });
      fetchResults();
    } catch (err) {
      setFormError(err.message);
      showToast(err.message || 'Failed to record result', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/results/${deleteId}`);
      showToast('Recorded result removed successfully', 'success');
      setDeleteId(null);
      fetchResults();
    } catch (err) {
      showToast(err.message || 'Failed to delete result', 'error');
      setDeleteId(null);
    }
  };

  const firstPlaceWinner = results.find(r => r.position === 1);

  const columns = [
    { header: 'Position', render: (row) => (
        <span style={{
          fontWeight: 800,
          fontSize: '1rem',
          color: row.position === 1 ? 'var(--accent-gold)' : row.position === 2 ? '#9CA3AF' : row.position === 3 ? '#D97706' : '#FFF'
        }}>
          #{row.position} {row.position === 1 && '🥇'} {row.position === 2 && '🥈'} {row.position === 3 && '🥉'}
        </span>
      )
    },
    { header: 'Race Name', accessor: 'raceName' },
    { header: 'Horse Name', render: (row) => <strong>🐎 {row.horseName}</strong> },
    { header: 'Assigned Jockey', render: (row) => `🏇 ${row.jockeyName}` },
    { header: 'Official Finish Time', render: (row) => <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{row.finishTime}</span> },
    {
      header: 'Actions',
      render: (row) => (
        hasRole('ADMIN') && (
          <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(row.resultId)}>
            <Trash2 size={14} /> Remove
          </button>
        )
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🏆 Official Race Results</h1>
          <p>Record finish positions and official race finish timings</p>
        </div>
      </div>

      {/* WINNER SPOTLIGHT BANNER IF FILTERED BY SPECIFIC RACE */}
      {firstPlaceWinner && (
        <div className="glass-card podium-card podium-1st" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem 2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, color: 'var(--accent-gold)' }}>
              🥇 RACE WINNER SPOTLIGHT
            </span>
            <h2 style={{ fontSize: '2.1rem', color: '#FFF', margin: '0.25rem 0' }}>
              {firstPlaceWinner.horseName}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Jockey: <strong>{firstPlaceWinner.jockeyName}</strong> • Event: <strong>{firstPlaceWinner.raceName}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', uppercase: true, letterSpacing: '0.05em' }}>OFFICIAL TIME</div>
            <div style={{ fontSize: '2.2rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent-gold)' }}>
              ⏱️ {firstPlaceWinner.finishTime}
            </div>
          </div>
        </div>
      )}

      {hasRole(['ADMIN', 'RACE_OFFICIAL']) && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--border-hover)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <Trophy size={24} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.25rem' }}>Record Official Finish Position</h3>
          </div>

          {formError && <div className="alert alert-error">{formError}</div>}

          <form onSubmit={handleRecordResult}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="input-group">
                <label>1. SELECT RACE</label>
                <select
                  className="form-control"
                  value={formData.raceId}
                  onChange={(e) => setFormData({ ...formData, raceId: e.target.value, registrationId: '' })}
                  required
                >
                  <option value="">-- Select Race --</option>
                  {races.map(r => (
                    <option key={r.raceId} value={r.raceId}>
                      {r.raceName} ({r.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>2. SELECT PARTICIPANT</label>
                <select
                  className="form-control"
                  value={formData.registrationId}
                  onChange={(e) => setFormData({ ...formData, registrationId: e.target.value })}
                  required
                  disabled={!formData.raceId}
                >
                  <option value="">-- Select Registered Participant --</option>
                  {registeredParticipants.map(rp => (
                    <option key={rp.registrationId} value={rp.registrationId}>
                      {rp.horseName} (Jockey: {rp.jockeyName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>3. POSITION RANK</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="input-group">
                <label>4. FINISH TIME</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1:36.42"
                  value={formData.finishTime}
                  onChange={(e) => setFormData({ ...formData, finishTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-gold" style={{ padding: '0.75rem 1.75rem' }}>
                <Plus size={18} /> RECORD RACE RESULT
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="search-bar">
        <select
          className="form-control"
          style={{ width: '280px', marginBottom: 0 }}
          value={selectedRaceId}
          onChange={(e) => setSelectedRaceId(e.target.value)}
        >
          <option value="">All Race Results</option>
          {races.map(r => (
            <option key={r.raceId} value={r.raceId}>
              {r.raceName}
            </option>
          ))}
        </select>
      </div>

      {results.length === 0 && !loading ? (
        <EmptyState
          title="No race results recorded yet"
          message="Official race finish timings will appear here after results are entered."
        />
      ) : (
        <DataTable columns={columns} data={results} loading={loading} />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Result Record"
        message="Are you sure you want to delete this recorded result?"
      />
    </div>
  );
};
