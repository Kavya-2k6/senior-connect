import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎓 Senior Connect
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/mentors" className="nav-link">
                Find Mentors
              </Link>
              <Link to="/sessions" className="nav-link">
                My Sessions
              </Link>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              <div className="nav-user">
                <span className="badge-role">{user?.role}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {!isAuthPage && (
                <Link to="/mentors" className="nav-link">
                  Browse Mentors
                </Link>
              )}
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
