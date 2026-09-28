import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { UserPlus, Mail, Lock, User, Building, Award, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'JUNIOR',
    department: 'CSE',
    graduationYear: 2027,
    bio: '',
    skills: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.endsWith('@college.edu') && !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await register({
        ...formData,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : ['General']
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ maxWidth: '560px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Join SeniorConnect</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create your student profile and access campus mentorship</p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="input" placeholder="e.g. Alex Chen" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">College Email (@college.edu)</label>
              <input type="email" name="email" className="input" placeholder="alex@college.edu" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="input" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select name="role" className="select" value={formData.role} onChange={handleChange}>
                <option value="JUNIOR">Junior Student (Seeking Guidance)</option>
                <option value="SENIOR">Senior Mentor (Providing Guidance)</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Department / Branch</label>
              <select name="department" className="select" value={formData.department} onChange={handleChange}>
                <option value="CSE">Computer Science (CSE)</option>
                <option value="ECE">Electronics & Comm (ECE)</option>
                <option value="MECH">Mechanical Engg (MECH)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Graduation Batch Year</label>
              <input type="number" name="graduationYear" className="input" value={formData.graduationYear} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skills & Domain Expertise (Comma Separated)</label>
            <input type="text" name="skills" className="input" placeholder="e.g. React.js, Node.js, Amazon SDE, GRE Prep, Quant" value={formData.skills} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Short Profile Bio</label>
            <textarea name="bio" className="textarea" rows={3} placeholder="Tell juniors or seniors a bit about your academic focus and goals..." value={formData.bio} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <UserPlus size={18} /> {loading ? 'Creating Profile...' : 'Complete Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
