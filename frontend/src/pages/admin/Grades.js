import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminGrades = () => {
  const [grades, setGrades] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [formData, setFormData] = useState({
    enrollmentId: '',
    assignment: '',
    score: '',
    maxScore: '',
    grade: '',
    remarks: '',
  });

  useEffect(() => {
    fetchGrades();
    fetchEnrollments();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get('/admin/grades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/admin/enrollments');
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGrade) {
        await api.put(`/admin/grades/${editingGrade.id}`, formData);
      } else {
        await api.post('/admin/grades', formData);
      }
      setShowModal(false);
      setEditingGrade(null);
      setFormData({
        enrollmentId: '',
        assignment: '',
        score: '',
        maxScore: '',
        grade: '',
        remarks: '',
      });
      fetchGrades();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving grade');
    }
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setFormData({
      enrollmentId: grade.enrollmentId,
      assignment: grade.assignment,
      score: grade.score,
      maxScore: grade.maxScore,
      grade: grade.grade || '',
      remarks: grade.remarks || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await api.delete(`/admin/grades/${id}`);
        fetchGrades();
      } catch (error) {
        alert(error.response?.data?.error || 'Error deleting grade');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Grades Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Grade
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Assignment</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id}>
                <td>{grade.studentId}</td>
                <td>{grade.studentName}</td>
                <td>{grade.courseCode} - {grade.courseName}</td>
                <td>{grade.assignment}</td>
                <td>{grade.score} / {grade.maxScore}</td>
                <td>{grade.grade}</td>
                <td>{new Date(grade.dateRecorded).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(grade)} style={{ marginRight: '10px' }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(grade.id)}>
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
              <h2>{editingGrade ? 'Edit Grade' : 'Add Grade'}</h2>
              <span className="close" onClick={() => { setShowModal(false); setEditingGrade(null); }}>&times;</span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Enrollment</label>
                <select name="enrollmentId" value={formData.enrollmentId} onChange={handleChange} required disabled={!!editingGrade}>
                  <option value="">Select Enrollment</option>
                  {enrollments.map((enrollment) => (
                    <option key={enrollment.id} value={enrollment.id}>
                      {enrollment.studentId} - {enrollment.courseCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assignment</label>
                <input type="text" name="assignment" value={formData.assignment} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Score</label>
                <input type="number" name="score" value={formData.score} onChange={handleChange} required step="0.01" />
              </div>
              <div className="form-group">
                <label>Max Score</label>
                <input type="number" name="maxScore" value={formData.maxScore} onChange={handleChange} required step="0.01" />
              </div>
              <div className="form-group">
                <label>Grade</label>
                <input type="text" name="grade" value={formData.grade} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Remarks</label>
                <textarea name="remarks" value={formData.remarks} onChange={handleChange} />
              </div>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingGrade(null); }} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGrades;

