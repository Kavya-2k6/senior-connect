import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUserProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    domain: '',
    skills: '',
    company: '',
    experienceYears: 0,
    isAvailable: true,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        domain: user.domain || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        company: user.company || '',
        experienceYears: user.experienceYears || 0,
        isAvailable: user.isAvailable !== undefined ? user.isAvailable : true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await updateUserProfile(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>My Profile</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
              Manage your personal details and mentorship settings
            </p>
          </div>
          <span className="badge-role">{user?.role}</span>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              className="form-input"
              value={user?.email || ''}
              style={{ backgroundColor: 'var(--gray-100)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Mentor Settings */}
          {user?.role === 'mentor' && (
            <>
              <div className="form-group" style={{ background: 'var(--primary-light)', padding: 14, borderRadius: 6, marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    style={{ width: 18, height: 18 }}
                  />
                  <span>I am currently available to take student bookings</span>
                </label>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 4, marginLeft: 28 }}>
                  Uncheck this if you are on vacation or have a full schedule.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Domain / Specialization</label>
                <input
                  type="text"
                  name="domain"
                  className="form-input"
                  placeholder="e.g. Full-Stack Web Development, Data Science"
                  value={formData.domain}
                  onChange={handleChange}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Company / Organization</label>
                  <input
                    type="text"
                    name="company"
                    className="form-input"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    name="experienceYears"
                    min="0"
                    className="form-input"
                    value={formData.experienceYears}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="form-input"
                  placeholder="React, Node.js, AWS, System Design"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mentor Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  className="form-textarea"
                  placeholder="Write a brief intro about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {user?.role === 'student' && (
            <div className="form-group">
              <label className="form-label">Bio / Academic Interests</label>
              <textarea
                name="bio"
                rows="3"
                className="form-textarea"
                placeholder="What are you studying or preparing for?"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
