import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, enrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">{stats.students}</div>
        </div>
        <div className="stat-card">
          <h3>Total Teachers</h3>
          <div className="stat-value">{stats.teachers}</div>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <div className="stat-value">{stats.courses}</div>
        </div>
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <div className="stat-value">{stats.enrollments}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

