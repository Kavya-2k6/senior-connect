import React from 'react';
import { MessageSquare, ThumbsUp, CheckCircle, Tag } from 'lucide-react';

export default function QuestionCard({ question, onClick }) {
  return (
    <div 
      onClick={() => onClick(question)}
      className="glass-panel glass-panel-hover" 
      style={{ padding: '1.25rem', marginBottom: '1rem', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            {question.isSolved && (
              <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <CheckCircle size={12} /> Solved
              </span>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted by {question.authorName}</span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {question.title}
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {question.content}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {question.tags?.map((tag, i) => (
              <span key={i} className="skill-pill">#{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            <ThumbsUp size={16} /> {question.upvotes}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <MessageSquare size={16} /> {question.answers?.length || 0} answers
          </div>
        </div>
      </div>
    </div>
  );
}
