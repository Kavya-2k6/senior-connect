import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '1.5rem 2rem',
      background: 'var(--bg-card)',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>Senior Connect</strong> — Peer Mentorship Platform & Resource Vault
        </div>
        <div>
          Built for 5th Semester Lab Project Demonstration • React + Node.js + Express + MongoDB
        </div>
      </div>
    </footer>
  );
}
