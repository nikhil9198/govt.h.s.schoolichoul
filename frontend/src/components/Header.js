import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1>Govt. Higher Secondary School, Ichaul</h1>
          </Link>
        </div>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard">Admin Panel</Link>
              ) : (
                <Link to="/user/dashboard">Dashboard</Link>
              )}
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

