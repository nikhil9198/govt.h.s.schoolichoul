import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    employeeId: '',
    department: '',
    specialization: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
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
      if (editingTeacher) {
        await api.put(`/admin/teachers/${editingTeacher.id}`, formData);
      } else {
        await api.post('/admin/teachers', formData);
      }
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        employeeId: '',
        department: '',
        specialization: '',
      });
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving teacher');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      department: teacher.department || '',
      specialization: teacher.specialization || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/admin/teachers/${id}`);
        fetchTeachers();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting teacher');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Teachers Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Teacher
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{teacher.employeeId}</td>
                <td>{teacher.firstName} {teacher.lastName}</td>
                <td>{teacher.email}</td>
                <td>{teacher.department}</td>
                <td>{teacher.specialization}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(teacher)} style={{ marginRight: '10px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(teacher.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <span className="close" onClick={() => { setShowModal(false); setEditingTeacher(null); }}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              {!editingTeacher && (
                <>
                  <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                  </div>
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingTeacher(null); }} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;

