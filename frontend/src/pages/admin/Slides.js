import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orderIndex: 0,
    isActive: true,
    image: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await api.get('/slides/admin');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('orderIndex', formData.orderIndex);
      formDataToSend.append('isActive', formData.isActive ? 1 : 0);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingSlide) {
        await api.put(`/slides/${editingSlide.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/slides', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      setEditingSlide(null);
      setFormData({
        title: '',
        description: '',
        orderIndex: 0,
        isActive: true,
        image: null
      });
      setPreview(null);
      fetchSlides();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving slide');
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      description: slide.description || '',
      orderIndex: slide.orderIndex || 0,
      isActive: slide.isActive === 1 || slide.isActive === true,
      image: null
    });
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    setPreview(baseUrl.replace('/api', '') + slide.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id, isDefault) => {
    if (isDefault) {
      alert('Cannot delete default slide. It will always appear when no other slides are available.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await api.delete(`/slides/${id}`);
        fetchSlides();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting slide');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Slides Management</h1>
        <button className="btn btn-primary" onClick={() => {
          setShowModal(true);
          setEditingSlide(null);
          setFormData({
            title: '',
            description: '',
            orderIndex: 0,
            isActive: true,
            image: null
          });
          setPreview(null);
        }}>
          Add Slide
        </button>
      </div>

      <div className="card">
        {slides.length === 0 ? (
          <p>No slides added yet. Add your first slide to display on the home page.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {slides.map((slide) => (
              <div key={slide.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${baseUrl.replace('/api', '')}${slide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                <div style={{ padding: '15px' }}>
                  <h3>{slide.title || 'Untitled'}</h3>
                  {slide.description && <p style={{ color: '#666', fontSize: '14px' }}>{slide.description}</p>}
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                    Order: {slide.orderIndex} | {slide.isActive === 1 ? 'Active' : 'Inactive'}
                  </div>
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={() => handleEdit(slide)}>
                      Edit
                    </button>
                    {slide.isDefault === 1 ? (
                      <button className="btn btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                        Default (Cannot Delete)
                      </button>
                    ) : (
                      <button className="btn btn-danger" onClick={() => handleDelete(slide.id, slide.isDefault)}>
                        Delete
                      </button>
                    )}
                  </div>
                  {slide.isDefault === 1 && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '5px', fontSize: '12px', color: '#856404' }}>
                      ⚠️ This is the default slide. It will automatically appear when no other slides are available.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{editingSlide ? 'Edit Slide' : 'Add Slide'}</h2>
              <span className="close" onClick={() => {
                setShowModal(false);
                setEditingSlide(null);
                setPreview(null);
              }}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Image {!editingSlide && '(Required)'}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingSlide}
                />
                {editingSlide && editingSlide.isDefault === 1 && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Note: You can change the default slide image, but it cannot be deleted.
                  </p>
                )}
                {preview && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '5px' }} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Order Index</label>
                <input
                  type="number"
                  name="orderIndex"
                  value={formData.orderIndex}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setEditingSlide(null);
                  setPreview(null);
                }}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlides;

