import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DataTable } from '../components/DataTable';
import { SkeletonCard, SkeletonTable } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Trophy, Award, Medal } from 'lucide-react';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leaderboard');
      setLeaderboard(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);

  const columns = [
    {
      header: 'RANK',
      render: (row) => (
        <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
          {row.rank === 1 && '🥇'} {row.rank === 2 && '🥈'} {row.rank === 3 && '🥉'} #{row.rank}
        </span>
      ),
      width: '90px'
    },
    { header: 'HORSE NAME', render: (row) => <strong>🐎 {row.horseName}</strong> },
    { header: 'BREED', accessor: 'breed' },
    { header: '1ST PLACE (WINS)', render: (row) => <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1rem' }}>{row.wins}</span> },
    { header: '2ND PLACE', accessor: 'secondPlaces' },
    { header: '3RD PLACE', accessor: 'thirdPlaces' },
    { header: 'TOTAL RACES', accessor: 'totalRaces' },
    { header: 'WIN RATE', render: (row) => <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{row.winRate}</span> }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-title-group">
          <h1>🏆 HORSE LEADERBOARD</h1>
          <p>Official thoroughbred rankings derived from race finish victories</p>
        </div>
      </div>

      {loading ? (
        <div className="podium-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : topThree.length > 0 ? (
        <div className="podium-grid">
          {/* 2nd Place */}
          {topThree[1] ? (
            <div className="glass-card podium-card podium-2nd">
              <div className="podium-rank" style={{ color: '#9CA3AF' }}>🥈 2nd</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', color: '#FFF' }}>{topThree[1].horseName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{topThree[1].breed}</p>
              <div style={{ fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                <strong>{topThree[1].wins} Wins</strong> • {topThree[1].totalRaces} Total Races
              </div>
            </div>
          ) : <div />}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="glass-card podium-card podium-1st" style={{ transform: 'scale(1.04)' }}>
              <div className="podium-rank" style={{ color: 'var(--accent-gold)' }}>🥇 1st</div>
              <h3 style={{ fontSize: '1.65rem', marginBottom: '0.25rem', color: '#FFF' }}>{topThree[0].horseName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{topThree[0].breed}</p>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.15)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--accent-gold)' }}>
                🏆 {topThree[0].wins} WINS ({topThree[0].winRate})
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] ? (
            <div className="glass-card podium-card podium-3rd">
              <div className="podium-rank" style={{ color: '#D97706' }}>🥉 3rd</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem', color: '#FFF' }}>{topThree[2].horseName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>{topThree[2].breed}</p>
              <div style={{ fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                <strong>{topThree[2].wins} Wins</strong> • {topThree[2].totalRaces} Total Races
              </div>
            </div>
          ) : <div />}
        </div>
      ) : null}

      {leaderboard.length === 0 && !loading ? (
        <EmptyState
          title="No leaderboard data available"
          message="Race winners will automatically rank on the leaderboard once official results are recorded."
        />
      ) : (
        <DataTable columns={columns} data={leaderboard} loading={loading} />
      )}
    </div>
  );
};
