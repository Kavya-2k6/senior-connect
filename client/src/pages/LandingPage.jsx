import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, MessageSquare, Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ flex: 1 }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span className="badge badge-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Institutional Domain Verified Platform
          </span>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Bridge the Gap Between Juniors & Top Seniors with <span className="gradient-text">SeniorConnect</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            No more lost WhatsApp notes or unanswered LinkedIn cold DMs. Book 1-on-1 mentorship sessions with verified college seniors, download authentic exam notes, and get clear answers to career & academic questions.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started with @college.edu <ArrowRight size={18} />
            </Link>
            <Link to="/mentors" className="btn btn-secondary btn-lg">
              Explore Mentor Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>
          Everything You Need to Succeed on Campus
        </h2>

        <div className="grid-3">
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Users size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Structured 1-on-1 Mentorship</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Book dedicated guidance slots with seniors who have cracked Amazon, CMU admissions, or CAT 99+ percentiles.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BookOpen size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Centralized Resource Vault</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Access hand-written exam notes, lab code, previous year question solutions, and interview experiences categorized by semester.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <MessageSquare size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem' }}>Targeted Campus Q&A Forum</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Ask questions tagged by domain (e.g. #SystemDesign, #GRE) and get verified answers from domain-expert seniors.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ padding: '3rem 2rem', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="grid-4">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>50+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Verified Senior Mentors</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)' }}>200+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mentorship Hours Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>350+</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Exam Notes & Interview Guides</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>4.9 / 5</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Average Student Satisfaction</div>
          </div>
        </div>
      </section>
    </div>
  );
}
