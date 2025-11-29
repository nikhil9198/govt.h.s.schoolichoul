import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminTeachers from './pages/admin/Teachers';
import AdminCourses from './pages/admin/Courses';
import AdminEnrollments from './pages/admin/Enrollments';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminGrades from './pages/admin/Grades';
import AdminSlides from './pages/admin/Slides';
import UserDashboard from './pages/user/Dashboard';
import UserCourses from './pages/user/Courses';
import UserCourseDetails from './pages/user/CourseDetails';
import UserGrades from './pages/user/Grades';
import UserAnnouncements from './pages/user/Announcements';
import UserProfile from './pages/user/Profile';
import Layout from './components/Layout';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          <Route path="/about" element={
            <PublicLayout>
              <About />
            </PublicLayout>
          } />
          <Route path="/courses" element={
            <PublicLayout>
              <Courses />
            </PublicLayout>
          } />
          <Route path="/contact" element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          } />
          <Route path="/login" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />
          <Route path="/register" element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          } />
          
          <Route path="/admin/*" element={
            <PrivateRoute requiredRole="admin">
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="students" element={<AdminStudents />} />
                  <Route path="teachers" element={<AdminTeachers />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="enrollments" element={<AdminEnrollments />} />
                  <Route path="announcements" element={<AdminAnnouncements />} />
                  <Route path="grades" element={<AdminGrades />} />
                  <Route path="slides" element={<AdminSlides />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/user/*" element={
            <PrivateRoute requiredRole="user">
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="courses" element={<UserCourses />} />
                  <Route path="courses/:courseId" element={<UserCourseDetails />} />
                  <Route path="grades" element={<UserGrades />} />
                  <Route path="announcements" element={<UserAnnouncements />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="*" element={<Navigate to="/user/dashboard" />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

