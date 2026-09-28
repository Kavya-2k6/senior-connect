import React, { useState } from 'react';

const SessionCard = ({
  session,
  currentUserRole,
  onStatusChange,
  onSaveNotes,
  onLeaveReview,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(session.notes || '');

  const otherPerson =
    currentUserRole === 'mentor' ? session.student?.name : session.mentor?.name;

  const handleSaveNotes = () => {
    onSaveNotes(session._id, noteText);
    setIsEditingNotes(false);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <span className={`badge-status status-${session.status}`}>
            {session.status}
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginTop: 6 }}>
            {session.topic}
          </h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
            {currentUserRole === 'mentor' ? 'Student: ' : 'Mentor: '}
            <strong style={{ color: 'var(--gray-700)' }}>{otherPerson || 'User'}</strong>
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--gray-900)' }}>
            📅 {session.date}
          </p>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
            ⏰ {session.time}
          </p>
        </div>
      </div>

      {/* Meeting Link */}
      {session.status === 'upcoming' && session.meetingLink && (
        <div style={{ marginBottom: 14, background: 'var(--primary-light)', padding: '8px 12px', borderLeft: '4px solid var(--primary)', borderRadius: '4px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            🔗 Video Meeting: {' '}
          </span>
          <a
            href={session.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}
          >
            {session.meetingLink}
          </a>
        </div>
      )}

      {/* Session Notes Section */}
      <div style={{ marginBottom: 14, background: 'var(--gray-50)', padding: 12, borderRadius: 6, border: '1px solid var(--gray-200)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-700)' }}>
            📝 Session Notes / Questions:
          </span>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Edit Notes
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div>
            <textarea
              className="form-textarea"
              rows="2"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add agenda, questions, or action items..."
              style={{ fontSize: '0.85rem' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 6, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsEditingNotes(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="btn btn-primary btn-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: session.notes ? 'var(--gray-700)' : 'var(--gray-500)', fontStyle: session.notes ? 'normal' : 'italic' }}>
            {session.notes || 'No notes added yet.'}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
        {session.status === 'upcoming' && (
          <>
            <button
              onClick={() => onStatusChange(session._id, 'completed')}
              className="btn btn-success btn-sm"
            >
              ✓ Complete
            </button>
            <button
              onClick={() => onStatusChange(session._id, 'cancelled')}
              className="btn btn-danger btn-sm"
            >
              ✕ Cancel
            </button>
          </>
        )}

        {session.status === 'completed' && currentUserRole === 'student' && (
          <button
            onClick={() => onLeaveReview(session.mentor)}
            className="btn btn-primary btn-sm"
          >
            ★ Leave Review
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
