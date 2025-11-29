import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, announcementsRes] = await Promise.all([
        api.get('/user/courses'),
        api.get('/user/announcements')
      ]);
      setCourses(coursesRes.data);
      setAnnouncements(announcementsRes.data.slice(0, 5)); // Show latest 5
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
      
      <div className="stats-grid" style={{ marginTop: '30px' }}>
        <div className="stat-card">
          <h3>Enrolled Courses</h3>
          <div className="stat-value">{courses.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div className="card">
          <h2>My Courses</h2>
          {courses.length === 0 ? (
            <p>No courses enrolled yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {courses.slice(0, 5).map((course) => (
                <li key={course.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <strong>{course.courseCode}</strong> - {course.courseName}
                  {course.teacherName && <div style={{ fontSize: '14px', color: '#666' }}>Teacher: {course.teacherName}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>Latest Announcements</h2>
          {announcements.length === 0 ? (
            <p>No announcements yet.</p>
          ) : (
            <div>
              {announcements.map((announcement) => (
                <div key={announcement.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{announcement.title}</h3>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ marginTop: '5px' }}>{announcement.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

