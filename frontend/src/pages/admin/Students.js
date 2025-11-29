import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    studentId: '',
    grade: '',
    section: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
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
      if (editingStudent) {
        await api.put(`/admin/students/${editingStudent.id}`, formData);
      } else {
        await api.post('/admin/students', formData);
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        studentId: '',
        grade: '',
        section: '',
        parentName: '',
        parentEmail: '',
        parentPhone: '',
      });
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      grade: student.grade || '',
      section: student.section || '',
      parentName: student.parentName || '',
      parentEmail: student.parentEmail || '',
      parentPhone: student.parentPhone || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/admin/students/${id}`);
        fetchStudents();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting student');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Students Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Student
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Grade</th>
              <th>Section</th>
              <th>Parent Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.studentId}</td>
                <td>{student.firstName} {student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.grade}</td>
                <td>{student.section}</td>
                <td>{student.parentName}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(student)} style={{ marginRight: '10px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(student.id)}>
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
              <h2>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
              <span className="close" onClick={() => { setShowModal(false); setEditingStudent(null); }}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              {!editingStudent && (
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
                    <label>Student ID</label>
                    <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Grade</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Section</label>
                <input type="text" name="section" value={formData.section} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Parent Name</label>
                <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Parent Email</label>
                <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Parent Phone</label>
                <input type="text" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingStudent(null); }} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;

