import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { LayoutDashboard, Users, BookOpen, HelpCircle, Calendar, ShieldCheck, Bell } from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Find Mentors', path: '/mentors', icon: Users },
    { label: 'Resource Vault', path: '/resources', icon: BookOpen },
    { label: 'Campus Q&A', path: '/questions', icon: HelpCircle },
    { label: 'Workshops & Events', path: '/events', icon: Calendar },
    { label: 'Notifications', path: '/notifications', icon: Bell }
  ];

  if (user.role === 'ADMIN') {
    navItems.push({ label: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside style={{
      width: '240px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 0.75rem 0.5rem 0.75rem', letterSpacing: '0.05em' }}>
        Navigation
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)' : 'transparent',
              border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
              transition: 'all 0.2s ease'
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}
