import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    description: '',
    teacherId: '',
    credits: 0,
    schedule: '',
  });

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse.id}`, formData);
      } else {
        await api.post('/admin/courses', formData);
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({
        courseCode: '',
        courseName: '',
        description: '',
        teacherId: '',
        credits: 0,
        schedule: '',
      });
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      description: course.description || '',
      teacherId: course.teacherId || '',
      credits: course.credits || 0,
      schedule: course.schedule || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/admin/courses/${id}`);
        fetchCourses();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting course');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Courses Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Course
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Teacher</th>
              <th>Credits</th>
              <th>Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.teacherName || 'Not assigned'}</td>
                <td>{course.credits}</td>
                <td>{course.schedule}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(course)} style={{ marginRight: '10px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(course.id)}>
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
              <h2>{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
              <span className="close" onClick={() => { setShowModal(false); setEditingCourse(null); }}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              {!editingCourse && (
                <div className="form-group">
                  <label>Course Code</label>
                  <input type="text" name="courseCode" value={formData.courseCode} onChange={handleChange} required />
                </div>
              )}
              <div className="form-group">
                <label>Course Name</label>
                <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Teacher</label>
                <select name="teacherId" value={formData.teacherId} onChange={handleChange}>
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input type="number" name="credits" value={formData.credits} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>Schedule</label>
                <input type="text" name="schedule" value={formData.schedule} onChange={handleChange} placeholder="e.g., Mon, Wed, Fri 10:00 AM" />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingCourse(null); }} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;

