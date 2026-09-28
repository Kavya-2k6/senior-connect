import React, { useState } from 'react';
import { FileText, ThumbsUp, Download, Tag, User } from 'lucide-react';
import API from '../services/api';

export default function ResourceCard({ resource }) {
  const [upvotes, setUpvotes] = useState(resource.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    try {
      const res = await API.post(`/resources/${resource._id}/upvote`);
      if (res.data.success) {
        setUpvotes(res.data.upvotes);
        setHasUpvoted(true);
      }
    } catch (err) {
      console.error('Upvote failed', err);
    }
  };

  return (
    <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span className={`badge ${
          resource.category === 'NOTES' ? 'badge-primary' : 
          resource.category === 'INTERVIEW_EXP' ? 'badge-warning' : 'badge-secondary'
        }`}>
          {resource.category}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Sem {resource.semester} • {resource.department}
        </span>
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
        {resource.title}
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>
        {resource.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {resource.tags?.map((tag, i) => (
          <span key={i} className="skill-pill">#{tag}</span>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          By <strong>{resource.uploaderName}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={handleUpvote} 
            className={`btn btn-sm ${hasUpvoted ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.25rem 0.6rem' }}
          >
            <ThumbsUp size={14} /> {upvotes}
          </button>

          <a 
            href={resource.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary btn-sm"
            style={{ padding: '0.25rem 0.6rem' }}
          >
            <Download size={14} /> Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
