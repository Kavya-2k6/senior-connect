import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';

const SessionsPage = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  // Review modal state
  const [reviewMentor, setReviewMentor] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sessions/my');
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await api.put(`/sessions/${sessionId}/status`, { status: newStatus });
      // Update local state
      setSessions((prev) =>
        prev.map((s) => (s._id === sessionId ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleSaveNotes = async (sessionId, notes) => {
    try {
      await api.put(`/sessions/${sessionId}/notes`, { notes });
      setSessions((prev) =>
        prev.map((s) => (s._id === sessionId ? { ...s, notes } : s))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving notes');
    }
  };

  const handleOpenReview = (mentor) => {
    setReviewMentor(mentor);
    setReviewData({ rating: 5, comment: '' });
    setReviewSuccess('');
    setReviewError('');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    try {
      await api.post('/reviews', {
        mentorId: reviewMentor._id || reviewMentor,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
      });

      setReviewSuccess('Review submitted! Thank you for the feedback.');
      setTimeout(() => {
        setReviewMentor(null);
      }, 1500);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>My Mentorship Sessions</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            {user?.role === 'mentor' ? 'Sessions booked with you by students' : 'Your upcoming and past sessions'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--gray-100)', padding: 4, borderRadius: 8 }}>
          {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="btn btn-sm"
              style={{
                backgroundColor: filter === tab ? '#ffffff' : 'transparent',
                boxShadow: filter === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                color: filter === tab ? 'var(--primary)' : 'var(--gray-700)',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: 40, color: 'var(--gray-500)' }}>
          Loading your sessions...
        </p>
      ) : filteredSessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <h3>No sessions found</h3>
          <p style={{ color: 'var(--gray-500)', marginTop: 8 }}>
            {filter === 'all'
              ? 'You have not booked any mentorship sessions yet.'
              : `No ${filter} sessions found.`}
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              currentUserRole={user?.role}
              onStatusChange={handleStatusChange}
              onSaveNotes={handleSaveNotes}
              onLeaveReview={handleOpenReview}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewMentor && (
        <div className="modal-overlay" onClick={() => setReviewMentor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>
              Leave a Mentor Review
            </h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 16 }}>
              Share your session experience to help other students.
            </p>

            {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}
            {reviewError && <div className="alert alert-danger">{reviewError}</div>}

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                >
                  <option value="5">★★★★★ (5 - Outstanding)</option>
                  <option value="4">★★★★☆ (4 - Very Helpful)</option>
                  <option value="3">★★★☆☆ (3 - Good)</option>
                  <option value="2">★★☆☆☆ (2 - Needs Improvement)</option>
                  <option value="1">★☆☆☆☆ (1 - Poor)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review & Feedback</label>
                <textarea
                  required
                  rows="4"
                  className="form-textarea"
                  placeholder="What was most helpful? What did you learn?"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setReviewMentor(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
