import React, { useState } from 'react';
import API from '../services/api';
import { X, Send, Clock, Sparkles } from 'lucide-react';

export default function RequestModal({ mentor, onClose, onSuccess }) {
  const [topic, setTopic] = useState('');
  const [agenda, setAgenda] = useState('');
  const [preferredSlot, setPreferredSlot] = useState(mentor.availabilitySlots?.[0] || 'Saturdays 10 AM - 1 PM');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await API.post('/mentorships/request', {
        mentorId: mentor._id,
        topic,
        agenda,
        preferredSlot
      });

      if (res.data.success) {
        onSuccess(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Request Mentorship Session</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-dark)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <img src={mentor.avatar} alt={mentor.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{mentor.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{mentor.company} • {mentor.department}</div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Mentorship Topic / Goal</label>
            <input 
              type="text" 
              className="input"
              placeholder="e.g. Amazon SDE Resume Review & Mock Interview"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Agenda & Questions</label>
            <textarea 
              className="textarea"
              rows={4}
              placeholder="Describe your background and what specific advice or feedback you are looking for..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Time Slot</label>
            <select 
              className="select"
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
            >
              {mentor.availabilitySlots?.map((slot, i) => (
                <option key={i} value={slot}>{slot}</option>
              )) || <option value="Flexible">Flexible Schedule</option>}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              <Send size={16} /> {submitting ? 'Submitting...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
