import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/user/courses/${courseId}`);
      setCourseData(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!courseData) {
    return <div className="container">Course not found</div>;
  }

  const { course, enrollment, grades } = courseData;

  return (
    <div className="container">
      <h1>{course.courseCode} - {course.courseName}</h1>
      
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>Course Information</h2>
        {course.description && <p style={{ marginTop: '10px' }}>{course.description}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
          {course.teacherName && (
            <div>
              <strong>Teacher:</strong> {course.teacherName}
            </div>
          )}
          {course.credits > 0 && (
            <div>
              <strong>Credits:</strong> {course.credits}
            </div>
          )}
          {course.schedule && (
            <div>
              <strong>Schedule:</strong> {course.schedule}
            </div>
          )}
          <div>
            <strong>Enrolled:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Status:</strong> {enrollment.status}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Grades</h2>
        {grades.length === 0 ? (
          <p>No grades recorded yet.</p>
        ) : (
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
              {grades.map((grade) => (
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
        )}
      </div>
    </div>
  );
};

export default CourseDetails;

