import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from '../components/StatCard';
import { ShieldCheck, Users, BookOpen, MessageSquare, Calendar, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
    } catch (err) {
      console.error('Fetch admin data failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <ShieldCheck size={28} color="var(--danger)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            System <span className="gradient-text">Admin Panel</span>
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Global platform metrics, institutional email verification management & content moderation
        </p>
      </div>

      {stats && (
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard title="Total Registered Users" value={stats.totalUsers} icon={Users} color="var(--primary)" />
          <StatCard title="Active Seniors" value={stats.totalSeniors} icon={CheckCircle2} color="var(--secondary)" />
          <StatCard title="Mentorship Sessions" value={stats.totalMentorships} icon={Calendar} color="var(--accent-purple)" />
          <StatCard title="Shared Resources" value={stats.totalResources} icon={BookOpen} color="var(--accent-cyan)" />
        </div>
      )}

      {/* User Accounts Management Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Registered Campus Accounts ({users.length})
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading system accounts...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>User Profile</th>
                  <th style={{ padding: '0.75rem' }}>College Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Dept / Year</th>
                  <th style={{ padding: '0.75rem' }}>Verification</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={u.avatar} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${
                        u.role === 'SENIOR' ? 'badge-primary' : 
                        u.role === 'ADMIN' ? 'badge-danger' : 'badge-secondary'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.department} • {u.graduationYear} Batch</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
