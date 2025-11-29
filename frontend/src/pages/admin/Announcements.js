import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/admin/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await api.put(`/admin/announcements/${editingAnnouncement.id}`, formData);
      } else {
        await api.post('/admin/announcements', formData);
      }
      setShowModal(false);
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        targetAudience: 'all',
      });
      fetchAnnouncements();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      targetAudience: announcement.targetAudience,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await api.delete(`/admin/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting announcement');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Announcements Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Announcement
        </button>
      </div>

      <div className="card">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="card" style={{ marginBottom: '15px' }}>
            <h3>{announcement.title}</h3>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              By {announcement.authorName} • {new Date(announcement.createdAt).toLocaleString()} • Target: {announcement.targetAudience}
            </p>
            <p>{announcement.content}</p>
            <div style={{ marginTop: '15px' }}>
              <button className="btn btn-secondary" onClick={() => handleEdit(announcement)} style={{ marginRight: '10px' }}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(announcement.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}</h2>
              <span className="close" onClick={() => { setShowModal(false); setEditingAnnouncement(null); }}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <select name="targetAudience" value={formData.targetAudience} onChange={handleChange}>
                  <option value="all">All</option>
                  <option value="user">Students</option>
                  <option value="teacher">Teachers</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingAnnouncement(null); }} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;

