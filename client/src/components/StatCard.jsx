import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = 'var(--primary)' }) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
          {value}
        </div>
        {trend && (
          <div style={{ fontSize: '0.78rem', color: 'var(--secondary)', marginTop: '0.2rem' }}>
            {trend}
          </div>
        )}
      </div>

      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-md)',
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <Icon size={24} />
      </div>
    </div>
  );
}
