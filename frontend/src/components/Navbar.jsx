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
              <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/profile" title="My Profile" style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4f46e5&color=fff&rounded=true&bold=true`} 
                    alt="Profile" 
                    style={{ width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer' }}
                  />
                </Link>
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
