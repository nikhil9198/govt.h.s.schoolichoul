import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const UserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/user/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (courseId) => {
    navigate(`/user/courses/${courseId}`);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Courses</h1>
      
      {courses.length === 0 ? (
        <div className="card">
          <p>You are not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {courses.map((course) => (
            <div key={course.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2>{course.courseCode} - {course.courseName}</h2>
                  {course.description && <p style={{ color: '#666', marginTop: '10px' }}>{course.description}</p>}
                  <div style={{ marginTop: '15px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
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
                      <strong>Enrolled:</strong> {new Date(course.enrollmentDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleViewDetails(course.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCourses;

