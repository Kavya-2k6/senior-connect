import React, { useState, useEffect } from 'react';
import API from '../services/api';
import QuestionCard from '../components/QuestionCard';
import { Search, Plus, MessageSquare, Send, CheckCircle2, ThumbsUp, X } from 'lucide-react';
import { useAuth } from '../services/auth';

export default function QAForumPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answerInput, setAnswerInput] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);

  const [newQuestionData, setNewQuestionData] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const res = await API.get(`/questions?${params.toString()}`);
      if (res.data.success) {
        setQuestions(res.data.data);
      }
    } catch (err) {
      console.error('Fetch questions failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [search]);

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/questions', newQuestionData);
      if (res.data.success) {
        setShowAskModal(false);
        setNewQuestionData({ title: '', content: '', tags: '' });
        fetchQuestions();
      }
    } catch (err) {
      console.error('Ask question failed', err);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerInput.trim() || !activeQuestion) return;

    try {
      const res = await API.post(`/questions/${activeQuestion._id}/answers`, {
        content: answerInput
      });

      if (res.data.success) {
        setActiveQuestion({
          ...activeQuestion,
          answers: [...(activeQuestion.answers || []), res.data.data]
        });
        setAnswerInput('');
        fetchQuestions();
      }
    } catch (err) {
      console.error('Post answer failed', err);
    }
  };

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Campus <span className="gradient-text">Q&A Forum</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Ask questions tagged by domain & receive verified answers from senior mentors
          </p>
        </div>

        {user && (
          <button onClick={() => setShowAskModal(true)} className="btn btn-primary">
            <Plus size={18} /> Ask Question
          </button>
        )}
      </div>

      {/* Search Toolbar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Search discussion threads (e.g. System Design, CAT strategy, GRE, Internships)..."
            style={{ paddingLeft: '2.5rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Main Layout: Split view when thread selected */}
      <div style={{ display: 'grid', gridTemplateColumns: activeQuestion ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading question threads...</div>
          ) : questions.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
              <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3>No questions found</h3>
            </div>
          ) : (
            questions.map((q) => (
              <QuestionCard 
                key={q._id} 
                question={q} 
                onClick={(selected) => setActiveQuestion(selected)}
              />
            ))
          )}
        </div>

        {/* Detailed Question Thread View Panel */}
        {activeQuestion && (
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '90px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span className="badge badge-primary">Question Thread</span>
              <button onClick={() => setActiveQuestion(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} /> Close
              </button>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>{activeQuestion.title}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whitespace: 'pre-wrap', marginBottom: '1.25rem', background: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              {activeQuestion.content}
            </p>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Answers ({activeQuestion.answers?.length || 0})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {activeQuestion.answers?.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  No answers posted yet. Be the first to help out!
                </div>
              ) : (
                activeQuestion.answers?.map((ans, i) => (
                  <div key={i} style={{ background: 'var(--bg-dark)', border: ans.isAccepted ? '1px solid var(--secondary)' : '1px solid var(--border-color)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>{ans.authorName}</span>
                      {ans.isAccepted && (
                        <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>
                          <CheckCircle2 size={10} /> Accepted Solution
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whitespace: 'pre-wrap' }}>{ans.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Answer Input Box */}
            {user ? (
              <form onSubmit={handleAnswerSubmit}>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <textarea 
                    className="textarea" 
                    rows={3} 
                    placeholder="Write your detailed answer or code snippet..."
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  <Send size={14} /> Submit Answer
                </button>
              </form>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Please log in to post an answer.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ask a Question to Seniors</h2>
              <button onClick={() => setShowAskModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAskSubmit}>
              <div className="form-group">
                <label className="form-label">Question Title</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. What is the best strategy to practice DILR sets for CAT?" 
                  value={newQuestionData.title}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, title: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Question Details & Code Snippets</label>
                <textarea 
                  className="textarea" 
                  rows={4}
                  placeholder="Explain your scenario and what guidance you are seeking..."
                  value={newQuestionData.content}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, content: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="CAT Prep, DILR, Strategy" 
                  value={newQuestionData.tags}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, tags: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAskModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Post Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
