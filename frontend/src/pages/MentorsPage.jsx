import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import MentorCard from '../components/MentorCard';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MentorsPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Modals state
  const [bookingMentor, setBookingMentor] = useState(null);
  const [viewingMentor, setViewingMentor] = useState(null);
  const [mentorReviews, setMentorReviews] = useState([]);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    topic: '',
    date: '',
    time: '',
    notes: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedDomain) params.domain = selectedDomain;
      if (selectedSkill) params.skill = selectedSkill;

      const res = await api.get('/mentors', { params });
      setMentors(res.data);
    } catch (err) {
      console.error('Failed to load mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [selectedDomain]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  const handleOpenBooking = (mentor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingMentor(mentor);
    setBookingSuccess('');
    setBookingError('');
  };

  const handleOpenProfile = async (mentor) => {
    setViewingMentor(mentor);
    try {
      const res = await api.get(`/mentors/${mentor._id}`);
      setMentorReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Error fetching mentor reviews:', err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (bookingLoading) return;
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    try {
      await api.post('/sessions', {
        mentorId: bookingMentor._id,
        ...bookingData,
      });

      setBookingSuccess('Session booked successfully! You can view it in My Sessions.');
      setBookingData({ topic: '', date: '', time: '', notes: '' });
      setTimeout(() => {
        setBookingMentor(null);
        setBookingLoading(false);
      }, 1500);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book session. Please try again.');
      setBookingLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Find a Mentor</h1>
        <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>
          Connect with industry experts for career advice, resume reviews, and mock interviews.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 28 }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: '1 1 240px' }}
            placeholder="Search by mentor name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-select"
            style={{ flex: '1 1 180px' }}
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <option value="">All Domains</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Web Development">Web Development</option>
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="Cloud">Cloud & DevOps</option>
            <option value="Data Science">Data Science</option>
            <option value="Product">Product Management</option>
          </select>

          <input
            type="text"
            className="form-input"
            style={{ flex: '1 1 180px' }}
            placeholder="Filter by skill (e.g. React)"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: 40, color: 'var(--gray-500)' }}>
          Loading senior mentors...
        </p>
      ) : mentors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <h3>No mentors found</h3>
          <p style={{ color: 'var(--gray-500)', marginTop: 8 }}>
            Try adjusting your search keywords or filter options.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor._id}
              mentor={mentor}
              userRole={user?.role}
              onBookSession={handleOpenBooking}
              onViewProfile={handleOpenProfile}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingMentor && (
        <div className="modal-overlay" onClick={() => setBookingMentor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 4 }}>
              Book a Session
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 16 }}>
              with <strong>{bookingMentor.name}</strong> ({bookingMentor.domain || 'Mentor'})
            </p>

            {bookingSuccess && <div className="alert alert-success">{bookingSuccess}</div>}
            {bookingError && <div className="alert alert-danger">{bookingError}</div>}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Session Topic / Goal</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Resume Review for Frontend Roles"
                  value={bookingData.topic}
                  onChange={(e) => setBookingData({ ...bookingData, topic: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Questions or notes for mentor</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="What would you like to discuss or achieve in this session?"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setBookingMentor(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={bookingLoading}>
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Full Profile & Reviews Modal */}
      {viewingMentor && (
        <div className="modal-overlay" onClick={() => setViewingMentor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{viewingMentor.name}</h2>
                <p style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  {viewingMentor.domain} {viewingMentor.company ? `at ${viewingMentor.company}` : ''}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 2 }}>
                  {viewingMentor.experienceYears} years of experience
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f59e0b' }}>
                  ★ {viewingMentor.rating > 0 ? viewingMentor.rating.toFixed(1) : 'New'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', display: 'block' }}>
                  ({viewingMentor.numReviews} reviews)
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>About</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                {viewingMentor.bio || 'No detailed bio provided.'}
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>Skills</h4>
              <div>
                {viewingMentor.skills?.map((s, i) => (
                  <span key={i} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-200)', margin: '16px 0' }} />

            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Student Reviews</h4>
            {mentorReviews.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>No reviews yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {mentorReviews.map((rev) => (
                  <div key={rev._id} style={{ background: 'var(--gray-50)', padding: 10, borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{rev.student?.name}</span>
                      <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setViewingMentor(null)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorsPage;
