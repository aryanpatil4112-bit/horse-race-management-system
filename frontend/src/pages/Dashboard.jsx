import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { SkeletonCard, SkeletonTable } from '../components/Skeleton';
import { HorseGallopAnimation } from '../components/HorseGallopAnimation';
import { EmptyState } from '../components/EmptyState';
import { Trophy, Calendar, Users, Award, Flag, ArrowRight, MapPin, ShieldCheck } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard metrics from backend.');
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* HERO SECTION */}
      <div className="hero-banner">
        <img
          src="/assets/hero_race.png"
          alt="Racehub Hero Race"
          className="hero-bg-img"
        />
        <div className="hero-content">
          <span className="hero-badge">
            <ShieldCheck size={14} /> RACEHUB OFFICIAL PORTAL
          </span>
          <h1 className="hero-title">Manage. Race. Win.</h1>
          <p className="hero-subtitle">
            Manage horses, jockeys, races, registrations and results from one powerful platform.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={() => navigate('/races')}>
              <Calendar size={18} /> View Upcoming Races
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/races')}>
              <Trophy size={18} /> Manage Races
            </button>
          </div>

          {/* Running Horse Silhouette Animation Line */}
          <HorseGallopAnimation />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* STATISTIC CARDS */}
      <div className="stat-grid">
        <StatCard
          title="Total Horses"
          value={loading ? '...' : (stats?.totalHorses ?? '0')}
          icon={Trophy}
          color="var(--accent-gold)"
        />
        <StatCard
          title="Total Jockeys"
          value={loading ? '...' : (stats?.activeJockeys ?? '0')}
          icon={Users}
          color="var(--accent-blue)"
        />
        <StatCard
          title="Total Races"
          value={loading ? '...' : (stats?.totalRaces ?? '0')}
          icon={Flag}
          color="var(--accent-emerald)"
        />
        <StatCard
          title="Completed"
          value={loading ? '...' : (stats?.completedRaces ?? '0')}
          icon={Award}
          color="var(--accent-purple)"
        />
      </div>

      {/* UPCOMING RACES SECTION */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Calendar size={22} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.4rem' }}>Upcoming Races</h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/races')}>
            View All Events <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="race-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : stats?.upcomingRaceList && stats.upcomingRaceList.length > 0 ? (
          <div className="race-grid">
            {stats.upcomingRaceList.map((race) => (
              <div key={race.raceId} className="glass-card race-card">
                <div>
                  <div className="race-card-header">
                    <div>
                      <h3 className="race-card-title">{race.raceName}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                        {race.distance} Distance
                      </span>
                    </div>
                    <Badge status={race.status} />
                  </div>

                  <div className="race-card-meta">
                    <div className="race-card-meta-item">
                      <Calendar size={15} color="var(--text-muted)" />
                      <span>{race.raceDate} @ {race.raceTime}</span>
                    </div>
                    <div className="race-card-meta-item">
                      <MapPin size={15} color="var(--text-muted)" />
                      <span>{race.location}</span>
                    </div>
                    <div className="race-card-meta-item">
                      <Users size={15} color="var(--text-muted)" />
                      <span>{race.participantCount || 0} Participants Registered</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  onClick={() => navigate('/races')}
                >
                  View Race Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming races scheduled"
            message="Your next race starts here."
            actionText="Schedule New Race"
            onAction={() => navigate('/races')}
          />
        )}
      </div>

      {/* RECENT PODIUM FINISHERS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <Award size={22} color="var(--accent-gold)" />
          <h2 style={{ fontSize: '1.4rem' }}>Recent Podium Finishers</h2>
        </div>

        {loading ? (
          <SkeletonTable rows={4} />
        ) : stats?.recentResults && stats.recentResults.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '10%', textAlign: 'center' }}>Rank</th>
                  <th style={{ width: '25%', textAlign: 'left' }}>Race Event</th>
                  <th style={{ width: '22%', textAlign: 'left' }}>Winning Horse</th>
                  <th style={{ width: '25%', textAlign: 'left' }}>Assigned Jockey</th>
                  <th style={{ width: '18%', textAlign: 'center' }}>Finish Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentResults.map((res) => (
                  <tr key={res.resultId}>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: res.position === 1 ? 'var(--accent-gold)' : res.position === 2 ? '#9CA3AF' : res.position === 3 ? '#D97706' : '#FFF'
                      }}>
                        #{res.position} {res.position === 1 && '🥇'} {res.position === 2 && '🥈'} {res.position === 3 && '🥉'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'left' }}><strong>{res.raceName}</strong></td>
                    <td style={{ textAlign: 'left' }}>🐎 {res.horseName}</td>
                    <td style={{ textAlign: 'left' }}>🏇 {res.jockeyName}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                        {res.finishTime}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No race results recorded yet"
            message="Official race finish timings will appear here after results are entered."
          />
        )}
      </div>
    </div>
  );
};
