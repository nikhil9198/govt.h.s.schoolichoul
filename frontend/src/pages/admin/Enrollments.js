import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    status: 'active',
  });

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/admin/enrollments');
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/enrollments', formData);
      setShowModal(false);
      setFormData({
        studentId: '',
        courseId: '',
        status: 'active',
      });
      fetchEnrollments();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating enrollment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await api.delete(`/admin/enrollments/${id}`);
        fetchEnrollments();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting enrollment');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Enrollments Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Enrollment
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Enrollment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{enrollment.studentId}</td>
                <td>{enrollment.studentName}</td>
                <td>{enrollment.courseCode}</td>
                <td>{enrollment.courseName}</td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                <td>{enrollment.status}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(enrollment.id)}>
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
              <h2>Add Enrollment</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student</label>
                <select name="studentId" value={formData.studentId} onChange={handleChange} required>
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.studentId} - {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Course</label>
                <select name="courseId" value={formData.courseId} onChange={handleChange} required>
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnrollments;

