import React from 'react';

const MentorCard = ({ mentor, onBookSession, onViewProfile }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--gray-900)' }}>{mentor.name}</h3>
          <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}>
            {mentor.domain || 'Domain Expert'} {mentor.company ? `• ${mentor.company}` : ''}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f59e0b' }}>
            ★ {mentor.rating > 0 ? mentor.rating.toFixed(1) : 'New'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'block' }}>
            ({mentor.numReviews || 0} reviews)
          </span>
        </div>
      </div>

      <p style={{ color: 'var(--gray-700)', fontSize: '0.9rem', marginBottom: 16, flexGrow: 1 }}>
        {mentor.bio ? mentor.bio.slice(0, 120) + (mentor.bio.length > 120 ? '...' : '') : 'Ready to help students navigate their career paths and technical goals.'}
      </p>

      {mentor.skills && mentor.skills.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {mentor.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="tag">
              {skill}
            </span>
          ))}
          {mentor.skills.length > 4 && (
            <span className="tag" style={{ background: 'transparent' }}>
              +{mentor.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--gray-200)', paddingTop: 14 }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: mentor.isAvailable ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            ● {mentor.isAvailable ? 'Available for booking' : 'Currently Busy'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onViewProfile(mentor)}
            className="btn btn-outline btn-sm"
          >
            View
          </button>
          <button
            onClick={() => onBookSession(mentor)}
            disabled={!mentor.isAvailable}
            className="btn btn-primary btn-sm"
            style={{ opacity: mentor.isAvailable ? 1 : 0.5 }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
