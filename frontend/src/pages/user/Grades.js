import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UserGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get('/user/grades');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group grades by course
  const gradesByCourse = grades.reduce((acc, grade) => {
    const key = `${grade.courseCode} - ${grade.courseName}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(grade);
    return acc;
  }, {});

  // Calculate average for each course
  const calculateAverage = (courseGrades) => {
    const total = courseGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0);
    return (total / courseGrades.length).toFixed(2);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Grades</h1>
      
      {Object.keys(gradesByCourse).length === 0 ? (
        <div className="card">
          <p>No grades available yet.</p>
        </div>
      ) : (
        <div>
          {Object.entries(gradesByCourse).map(([courseName, courseGrades]) => (
            <div key={courseName} className="card" style={{ marginBottom: '20px' }}>
              <h2>{courseName}</h2>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Average: {calculateAverage(courseGrades)}%
              </p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Date</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {courseGrades.map((grade) => (
                    <tr key={grade.id}>
                      <td>{grade.assignment}</td>
                      <td>{grade.score} / {grade.maxScore}</td>
                      <td>{grade.grade || '-'}</td>
                      <td>{new Date(grade.dateRecorded).toLocaleDateString()}</td>
                      <td>{grade.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserGrades;

