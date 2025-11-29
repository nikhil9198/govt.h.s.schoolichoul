import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/user/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Announcements</h1>
      
      {announcements.length === 0 ? (
        <div className="card">
          <p>No announcements available.</p>
        </div>
      ) : (
        <div>
          {announcements.map((announcement) => (
            <div key={announcement.id} className="card" style={{ marginBottom: '20px' }}>
              <h2>{announcement.title}</h2>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                By {announcement.authorName} • {new Date(announcement.createdAt).toLocaleString()}
                {announcement.targetAudience !== 'all' && (
                  <span> • For: {announcement.targetAudience}</span>
                )}
              </p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{announcement.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAnnouncements;

