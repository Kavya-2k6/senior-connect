import React from 'react';
import { Star, Building2, Calendar, Award, ExternalLink } from 'lucide-react';

export default function MentorCard({ mentor, onRequestSession }) {
  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <img 
          src={mentor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
          alt={mentor.name} 
          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{mentor.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
              <Star size={14} fill="#f59e0b" />
              <span>{mentor.averageRating ? mentor.averageRating.toFixed(1) : '5.0'}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{mentor.department}</span>
            <span className="badge badge-secondary">{mentor.graduationYear} Batch</span>
            {mentor.company && (
              <span className="badge badge-warning" style={{ textTransform: 'none' }}>
                <Building2 size={10} style={{ marginRight: '2px' }} /> {mentor.company}
              </span>
            )}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {mentor.bio}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
        {mentor.skills.map((skill, i) => (
          <span key={i} className="skill-pill">{skill}</span>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Award size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
          {mentor.totalSessions || 12}+ Sessions Led
        </div>
        <button onClick={() => onRequestSession(mentor)} className="btn btn-primary btn-sm">
          Request Guidance
        </button>
      </div>
    </div>
  );
}
