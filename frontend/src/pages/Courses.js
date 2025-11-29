import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Try public endpoint first
      const response = await api.get('/public/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to sample courses if API fails
      setCourses([
        {
          id: 1,
          courseCode: 'MATH101',
          courseName: 'Mathematics Fundamentals',
          description: 'Introduction to basic mathematical concepts and problem-solving techniques.',
          credits: 3,
          schedule: 'Mon, Wed, Fri 9:00 AM - 10:30 AM'
        },
        {
          id: 2,
          courseCode: 'ENG101',
          courseName: 'English Literature',
          description: 'Study of classic and contemporary English literature.',
          credits: 3,
          schedule: 'Tue, Thu 11:00 AM - 12:30 PM'
        },
        {
          id: 3,
          courseCode: 'SCI101',
          courseName: 'General Science',
          description: 'Introduction to physics, chemistry, and biology.',
          credits: 4,
          schedule: 'Mon, Wed 2:00 PM - 4:00 PM'
        },
        {
          id: 4,
          courseCode: 'HIST101',
          courseName: 'World History',
          description: 'Comprehensive study of world history from ancient to modern times.',
          credits: 3,
          schedule: 'Tue, Thu 2:00 PM - 3:30 PM'
        },
        {
          id: 5,
          courseCode: 'CS101',
          courseName: 'Computer Science Basics',
          description: 'Introduction to programming and computer science fundamentals.',
          credits: 4,
          schedule: 'Mon, Wed, Fri 1:00 PM - 2:30 PM'
        },
        {
          id: 6,
          courseCode: 'ART101',
          courseName: 'Visual Arts',
          description: 'Exploring various forms of visual arts and creative expression.',
          credits: 2,
          schedule: 'Thu 3:00 PM - 5:00 PM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="courses-page">
        <div className="container">
          <div className="loading">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <div className="container">
          <h1>Our Courses</h1>
          <p className="hero-subtitle">Explore our comprehensive curriculum</p>
        </div>
      </div>

      <div className="container">
        <div className="courses-search">
          <input
            type="text"
            placeholder="Search courses by name, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="courses-grid">
          {filteredCourses.length === 0 ? (
            <div className="no-courses">
              <p>No courses found matching your search.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.courseCode}</h3>
                  <span className="course-credits">{course.credits || 0} Credits</span>
                </div>
                <h2>{course.courseName}</h2>
                {course.teacherName && (
                  <p className="course-teacher">
                    <strong>Instructor:</strong> {course.teacherName}
                  </p>
                )}
                {course.description && (
                  <p className="course-description">{course.description}</p>
                )}
                {course.schedule && (
                  <div className="course-schedule">
                    <strong>Schedule:</strong> {course.schedule}
                  </div>
                )}
                <div className="course-footer">
                  <a href="/register" className="btn-enroll">Enroll Now</a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

