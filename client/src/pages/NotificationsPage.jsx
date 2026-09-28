import React, { useState } from 'react';
import { Bell, CheckCircle2, MessageSquare, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      _id: "n1",
      type: "REQUEST_ACCEPTED",
      message: "Aravind Sharma (Amazon SDE) accepted your mentorship request on 'Amazon SDE Internship Resume Review & Project Guidance'!",
      targetUrl: "/dashboard",
      time: "10 mins ago",
      isRead: false
    },
    {
      _id: "n2",
      type: "ANSWER_POSTED",
      message: "Rohit Kumar answered your question: 'Is CAT preparation manageable along with 5th semester lab projects?'",
      targetUrl: "/questions",
      time: "2 hours ago",
      isRead: true
    },
    {
      _id: "n3",
      type: "EVENT_ALERT",
      message: "Upcoming Event Reminder: 'Mastering SDE Interviews' starts this Saturday at 6 PM.",
      targetUrl: "/events",
      time: "Yesterday",
      isRead: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Notification <span className="gradient-text">Center</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time updates on session request acceptances, question responses, and workshop reminders
          </p>
        </div>

        <button onClick={markAllRead} className="btn btn-secondary btn-sm">
          <CheckCircle2 size={16} /> Mark All as Read
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((notif) => (
            <Link 
              key={notif._id}
              to={notif.targetUrl}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: notif.isRead ? 'var(--bg-dark)' : 'rgba(99, 102, 241, 0.12)',
                border: notif.isRead ? '1px solid var(--border-color)' : '1px solid rgba(99, 102, 241, 0.3)',
                textDecoration: 'none'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: notif.type === 'REQUEST_ACCEPTED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: notif.type === 'REQUEST_ACCEPTED' ? '#34d399' : '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bell size={18} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: notif.isRead ? 400 : 600 }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  {notif.time}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
