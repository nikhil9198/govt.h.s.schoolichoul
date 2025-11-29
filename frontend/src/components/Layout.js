import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/user';

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/students', label: 'Students' },
    { path: '/admin/teachers', label: 'Teachers' },
    { path: '/admin/courses', label: 'Courses' },
    { path: '/admin/enrollments', label: 'Enrollments' },
    { path: '/admin/announcements', label: 'Announcements' },
    { path: '/admin/grades', label: 'Grades' },
    { path: '/admin/slides', label: 'Home Slides' },
  ];

  const userMenuItems = [
    { path: '/user/dashboard', label: 'Dashboard' },
    { path: '/user/courses', label: 'My Courses' },
    { path: '/user/grades', label: 'My Grades' },
    { path: '/user/announcements', label: 'Announcements' },
    { path: '/user/profile', label: 'Profile' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div>
      <nav className="navbar">
        <h1>School Management System</h1>
        <div className="navbar-nav">
          <span>Welcome, {user?.firstName} {user?.lastName}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="main-content">
        <div className="sidebar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

