import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ResourceCard from '../components/ResourceCard';
import { Search, Plus, BookOpen, Upload, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../services/auth';

export default function ResourceVaultPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [department, setDepartment] = useState('ALL');
  const [semester, setSemester] = useState('ALL');
  const [search, setSearch] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toast, setToast] = useState('');

  // Upload Form State
  const [uploadData, setUploadData] = useState({
    title: '',
    category: 'NOTES',
    department: 'CSE',
    semester: 4,
    description: '',
    fileUrl: '',
    tags: ''
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'ALL') params.append('category', category);
      if (department !== 'ALL') params.append('department', department);
      if (semester !== 'ALL') params.append('semester', semester);
      if (search) params.append('search', search);

      const res = await API.get(`/resources?${params.toString()}`);
      if (res.data.success) {
        setResources(res.data.data);
      }
    } catch (err) {
      console.error('Fetch resources failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category, department, semester, search]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/resources', uploadData);
      if (res.data.success) {
        setShowUploadModal(false);
        setToast('Study resource uploaded successfully!');
        fetchResources();
        setTimeout(() => setToast(''), 5000);
      }
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Resource <span className="gradient-text">Vault</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Verified exam notes, interview experiences, lab code & syllabus roadmaps
          </p>
        </div>

        {user && (
          <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
            <Plus size={18} /> Upload Resource
          </button>
        )}
      </div>

      {toast && (
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      {/* Category Tabs & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {['ALL', 'NOTES', 'INTERVIEW_EXP', 'PYQ', 'ROADMAP'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {cat === 'ALL' ? 'All Resources' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Search notes by subject (e.g. Operating Systems, LeetCode, GRE)..."
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
          </select>

          <select className="select" value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="ALL">All Semesters</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading resource materials...</div>
      ) : resources.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>No study materials found for this filter</h3>
        </div>
      ) : (
        <div className="grid-3">
          {resources.map((res) => (
            <ResourceCard key={res._id} resource={res} />
          ))}
        </div>
      )}

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Upload Study Resource</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. DBMS Lab Solutions & Viva Cheat Sheet" 
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required 
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="select"
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  >
                    <option value="NOTES">Exam Notes</option>
                    <option value="INTERVIEW_EXP">Interview Experience</option>
                    <option value="PYQ">Previous Year Questions (PYQs)</option>
                    <option value="ROADMAP">Preparation Roadmap</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input 
                    type="number" 
                    className="input" 
                    value={uploadData.semester}
                    onChange={(e) => setUploadData({ ...uploadData, semester: parseInt(e.target.value) })}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Summary</label>
                <textarea 
                  className="textarea" 
                  rows={3}
                  placeholder="Provide details on what topics this note covers..."
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">File Link / Cloud Storage URL</label>
                <input 
                  type="url" 
                  className="input" 
                  placeholder="https://drive.google.com/file/... or PDF link"
                  value={uploadData.fileUrl}
                  onChange={(e) => setUploadData({ ...uploadData, fileUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="DBMS, SQL, MidSem, Notes" 
                  value={uploadData.tags}
                  onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Upload size={16} /> Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
