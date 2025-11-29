import api from './api';

const teacherService = {
  // Get teacher dashboard data
  getDashboard: async () => {
    try {
      const response = await api.get('/teacher/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
      throw error;
    }
  },

  // Get list of students
  getStudents: async (classId = '') => {
    try {
      const params = classId ? { class: classId } : {};
      const response = await api.get('/teacher/students', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get student details
  getStudent: async (studentId) => {
    try {
      const response = await api.get(`/teacher/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student details:', error);
      throw error;
    }
  },

  // Get attendance for a class/date
  getAttendance: async (classId, date) => {
    try {
      const response = await api.get('/teacher/attendance', {
        params: { classId, date: date || new Date().toISOString().split('T')[0] }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  // Submit attendance
  submitAttendance: async (classId, date, attendanceData) => {
    try {
      const response = await api.post('/teacher/attendance', {
        classId,
        date,
        attendance: attendanceData
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting attendance:', error);
      throw error;
    }
  },

  // Get teacher's courses
  getCourses: async () => {
    try {
      const response = await api.get('/teacher/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get course details
  getCourse: async (courseId) => {
    try {
      const response = await api.get(`/teacher/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/teacher/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/teacher/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

export default teacherService;
