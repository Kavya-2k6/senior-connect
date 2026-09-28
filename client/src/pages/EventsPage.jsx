import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Users, Video, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../services/auth';

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredMap, setRegisteredMap] = useState({});

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Fetch events failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const res = await API.post(`/events/${eventId}/register`);
      if (res.data.success) {
        setRegisteredMap({ ...registeredMap, [eventId]: true });
        fetchEvents();
      }
    } catch (err) {
      console.error('RSVP failed', err);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Senior Workshops & <span className="gradient-text">Campus Webinars</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Live career sessions, SDE mock interviews, GRE masterclasses, and placement guidance hosted by seniors
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading events schedule...</div>
      ) : (
        <div className="grid-2">
          {events.map((evt) => {
            const isRegistered = registeredMap[evt._id] || (user && evt.registeredUserIds?.includes(user._id));
            return (
              <div key={evt._id} className="glass-panel glass-panel-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={evt.bannerImageUrl} 
                  alt={evt.title} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {new Date(evt.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Users size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '3px' }} />
                      {evt.registeredCount} Seats Reserved
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>{evt.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
                    {evt.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Host: <strong style={{ color: 'var(--text-primary)' }}>{evt.hostName}</strong>
                    </div>

                    {isRegistered ? (
                      <a href={evt.meetingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                        <Video size={14} /> Join Session <ExternalLink size={12} />
                      </a>
                    ) : (
                      <button onClick={() => handleRegister(evt._id)} className="btn btn-primary btn-sm">
                        <CheckCircle2 size={14} /> Reserve Seat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
