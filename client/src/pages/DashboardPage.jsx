import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import API from '../services/api';
import StatCard from '../components/StatCard';
import { Users, Calendar, Award, CheckCircle, Clock, Video, XCircle, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetInputMap, setMeetInputMap] = useState({});

  const fetchRequests = async () => {
    try {
      const res = await API.get('/mentorships/my-requests');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Fetch requests failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (requestId, status, meetingLink = '') => {
    try {
      const res = await API.patch(`/mentorships/${requestId}/status`, {
        status,
        meetingLink
      });
      if (res.data.success) {
        fetchRequests();
      }
    } catch (err) {
      console.error('Update status failed', err);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          Welcome back, <span className="gradient-text">{user.name}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {user.role === 'SENIOR' 
            ? 'Senior Mentor Portal • Manage incoming student requests and share expertise.' 
            : 'Junior Student Dashboard • Track your mentorship requests and study resources.'}
        </p>
      </div>

      {/* Stats Widget Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <StatCard title="Role Status" value={user.role} icon={Users} color="var(--primary)" />
        <StatCard title="Active Sessions" value={requests.filter(r => r.status === 'ACCEPTED').length} icon={Calendar} trend="+2 this week" color="var(--secondary)" />
        <StatCard title="Karma Score" value={user.karmaPoints || 45} icon={Award} trend="Top 15% Campus" color="var(--accent-purple)" />
        <StatCard title="Total Requests" value={requests.length} icon={Clock} color="var(--accent-cyan)" />
      </div>

      {/* Main Section */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            {user.role === 'SENIOR' ? 'Incoming Mentorship Requests' : 'My Mentorship Requests'}
          </h2>
          {user.role === 'JUNIOR' && (
            <Link to="/mentors" className="btn btn-primary btn-sm">
              <Users size={16} /> Find New Mentor
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <div>No mentorship requests active yet.</div>
            {user.role === 'JUNIOR' && (
              <Link to="/mentors" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                Browse Mentor Directory
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((req) => (
              <div 
                key={req._id} 
                style={{
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span className={`badge ${
                      req.status === 'ACCEPTED' ? 'badge-secondary' :
                      req.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                    }`} style={{ marginBottom: '0.5rem' }}>
                      {req.status}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{req.topic}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {user.role === 'SENIOR' ? `Requested by Junior: ${req.juniorName}` : `Target Mentor: ${req.mentorName}`} • Preferred Slot: {req.preferredSlot}
                    </div>
                  </div>

                  {req.status === 'ACCEPTED' && req.meetingLink && (
                    <a 
                      href={req.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary btn-sm" 
                      style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                    >
                      <Video size={16} /> Join Google Meet <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Agenda:</strong> {req.agenda}
                </p>

                {/* Actions for Senior */}
                {user.role === 'SENIOR' && req.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <input 
                      type="text"
                      className="input"
                      placeholder="Paste Google Meet / Meeting Link..."
                      style={{ maxWidth: '300px', fontSize: '0.85rem' }}
                      value={meetInputMap[req._id] || ''}
                      onChange={(e) => setMeetInputMap({ ...meetInputMap, [req._id]: e.target.value })}
                    />
                    <button 
                      onClick={() => handleUpdateStatus(req._id, 'ACCEPTED', meetInputMap[req._id] || 'https://meet.google.com/abc-defg-hij')}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle size={16} /> Accept & Send Link
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req._id, 'REJECTED')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={16} /> Decline Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
