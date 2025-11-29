import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!profile) {
    return <div className="container">Error loading profile</div>;
  }

  return (
    <div className="container">
      <h1>My Profile</h1>
      
      <div className="card">
        <h2>Personal Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div>
            <strong>Username:</strong> {profile.username}
          </div>
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
          <div>
            <strong>First Name:</strong> {profile.firstName}
          </div>
          <div>
            <strong>Last Name:</strong> {profile.lastName}
          </div>
          <div>
            <strong>Role:</strong> {profile.role}
          </div>
        </div>
      </div>

      {profile.studentDetails && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h2>Student Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
              <strong>Student ID:</strong> {profile.studentDetails.studentId}
            </div>
            <div>
              <strong>Grade:</strong> {profile.studentDetails.grade || 'N/A'}
            </div>
            <div>
              <strong>Section:</strong> {profile.studentDetails.section || 'N/A'}
            </div>
            <div>
              <strong>Parent Name:</strong> {profile.studentDetails.parentName || 'N/A'}
            </div>
            <div>
              <strong>Parent Email:</strong> {profile.studentDetails.parentEmail || 'N/A'}
            </div>
            <div>
              <strong>Parent Phone:</strong> {profile.studentDetails.parentPhone || 'N/A'}
            </div>
          </div>
        </div>
      )}

      {profile.teacherDetails && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h2>Teacher Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
              <strong>Employee ID:</strong> {profile.teacherDetails.employeeId}
            </div>
            <div>
              <strong>Department:</strong> {profile.teacherDetails.department || 'N/A'}
            </div>
            <div>
              <strong>Specialization:</strong> {profile.teacherDetails.specialization || 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

