import React, { useState, useEffect } from 'react';
import API from '../services/api';
import MentorCard from '../components/MentorCard';
import RequestModal from '../components/RequestModal';
import { Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MentorDirectoryPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [skill, setSkill] = useState('');
  const [year, setYear] = useState('ALL');

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (department !== 'ALL') params.append('department', department);
      if (year !== 'ALL') params.append('year', year);
      if (skill) params.append('skill', skill);

      const res = await API.get(`/mentors?${params.toString()}`);
      if (res.data.success) {
        setMentors(res.data.data);
      }
    } catch (err) {
      console.error('Fetch mentors failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [search, department, year, skill]);

  const handleRequestSuccess = () => {
    setSelectedMentor(null);
    setSuccessToast('Mentorship request submitted successfully! You can track status on your dashboard.');
    setTimeout(() => setSuccessToast(''), 5000);
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Senior Mentor <span className="gradient-text">Directory</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Search & connect with verified 3rd & 4th year seniors by skill set, target company, or academic goal
        </p>
      </div>

      {successToast && (
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {successToast}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Search by name, company (Amazon, CMU), or keyword..."
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <select className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE Branch</option>
            <option value="ECE">ECE Branch</option>
            <option value="MECH">MECH Branch</option>
            <option value="EEE">EEE Branch</option>
          </select>

          <select className="select" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="ALL">All Graduation Batches</option>
            <option value="2025">2025 Batch (4th Year)</option>
            <option value="2026">2026 Batch (3rd Year)</option>
          </select>

          <input 
            type="text" 
            className="input" 
            placeholder="Skill (e.g. React, GRE, CAT)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
        </div>
      </div>

      {/* Mentor Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Searching mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <Filter size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No mentors matching selected filters</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>Try clearing skill filters or searching for keywords like "React" or "Amazon"</p>
        </div>
      ) : (
        <div className="grid-3">
          {mentors.map((mentor) => (
            <MentorCard 
              key={mentor._id} 
              mentor={mentor} 
              onRequestSession={(m) => setSelectedMentor(m)} 
            />
          ))}
        </div>
      )}

      {/* Request Session Modal */}
      {selectedMentor && (
        <RequestModal 
          mentor={selectedMentor} 
          onClose={() => setSelectedMentor(null)}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
}
