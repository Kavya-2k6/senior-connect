import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    domain: '',
    skills: '',
    company: '',
    experienceYears: 0,
    bio: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Clean payload before submitting
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
      bio: formData.bio.trim(),
    };

    if (formData.role === 'mentor') {
      payload.domain = formData.domain.trim();
      payload.company = formData.company.trim();
      payload.experienceYears = Number(formData.experienceYears) || 0;
      payload.skills = formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }

    try {
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check the form and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 540, marginTop: 30 }}>
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
          Create an Account
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: 20, fontSize: '0.9rem' }}>
          Join Senior Connect as a Student or a Senior Mentor
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I want to join as a:</label>
            <div style={{ display: 'flex', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 500 }}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                />
                Student
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 500 }}>
                <input
                  type="radio"
                  name="role"
                  value="mentor"
                  checked={formData.role === 'mentor'}
                  onChange={handleChange}
                />
                Senior Mentor
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              placeholder="e.g. Jordan Smith"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="form-input"
              placeholder="e.g. jordan@college.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Mentor Specific Fields */}
          {formData.role === 'mentor' && (
            <>
              <div className="form-group">
                <label className="form-label">Professional Domain</label>
                <input
                  type="text"
                  name="domain"
                  required={formData.role === 'mentor'}
                  className="form-input"
                  placeholder="e.g. Software Engineering, AI/ML, Cloud"
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
                    placeholder="e.g. Google, Microsoft, Freelance"
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
                  placeholder="e.g. React, Node.js, System Design, Python"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="form-textarea"
                  placeholder="Tell students about your expertise and how you can help..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 10 }}
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--gray-700)' }}>
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
