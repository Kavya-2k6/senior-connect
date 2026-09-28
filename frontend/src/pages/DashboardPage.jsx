import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
    rating: 0,
    numReviews: 0,
  });
  const [upcomingList, setUpcomingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        api.get('/sessions/stats'),
        api.get('/sessions/my'),
      ]);

      setStats(statsRes.data);
      const upcoming = sessionsRes.data
        .filter((s) => s.status === 'upcoming')
        .slice(0, 3);
      setUpcomingList(upcoming);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="container">
      {/* Welcome Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', border: 'none', padding: '32px 28px', marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ opacity: 0.9, maxWidth: 600, fontSize: '0.95rem' }}>
          {user?.role === 'mentor'
            ? 'Thank you for sharing your knowledge and empowering junior peers in their careers.'
            : 'Explore mentors, schedule 1-on-1 guidance, and accelerate your tech journey.'}
        </p>

        <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            to="/mentors"
            className="btn"
            style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 600 }}
          >
            {user?.role === 'mentor' ? 'Browse Peers' : 'Find a Mentor'}
          </Link>
          <Link
            to="/sessions"
            className="btn"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            View My Sessions
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 16 }}>Overview</h2>
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 18, borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 500 }}>Total Sessions</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: 4 }}>{stats.totalSessions}</p>
        </div>

        <div className="card" style={{ padding: 18, borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 500 }}>Upcoming</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2563eb', marginTop: 4 }}>{stats.upcomingSessions}</p>
        </div>

        <div className="card" style={{ padding: 18, borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 500 }}>Completed</span>
          <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)', marginTop: 4 }}>{stats.completedSessions}</p>
        </div>

        {user?.role === 'mentor' ? (
          <div className="card" style={{ padding: 18, borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 500 }}>Rating</span>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d97706', marginTop: 4 }}>
              ★ {stats.rating > 0 ? stats.rating.toFixed(1) : 'New'}
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: 18, borderLeft: '4px solid var(--danger)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 500 }}>Cancelled</span>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger)', marginTop: 4 }}>{stats.cancelledSessions}</p>
          </div>
        )}
      </div>

      {/* Next Upcoming Sessions Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Upcoming Sessions</h2>
        <Link to="/sessions" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          View all →
        </Link>
      </div>

      {loading ? (
        <p style={{ color: 'var(--gray-500)' }}>Loading dashboard...</p>
      ) : upcomingList.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-500)', marginBottom: 12 }}>You have no upcoming sessions scheduled.</p>
          <Link to="/mentors" className="btn btn-primary btn-sm">
            Book a Mentor Session
          </Link>
        </div>
      ) : (
        <div className="grid-2">
          {upcomingList.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              currentUserRole={user?.role}
              onStatusChange={() => fetchDashboardData()}
              onSaveNotes={() => fetchDashboardData()}
              onLeaveReview={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
