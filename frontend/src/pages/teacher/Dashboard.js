import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserGroupIcon, ClipboardListIcon, DocumentReportIcon, AcademicCapIcon } from '@heroicons/react/outline';
import teacherService from '../../services/teacherService';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { name: 'Total Students', value: 'Loading...', icon: UserGroupIcon, to: '/teacher/students' },
    { name: 'Total Courses', value: 'Loading...', icon: AcademicCapIcon, to: '/teacher/courses' },
    { name: 'Attendance Today', value: 'Loading...', icon: ClipboardListIcon, to: '/teacher/attendance' },
    { name: 'Upcoming Classes', value: 'Loading...', icon: CalendarIcon, to: '/teacher/schedule' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await teacherService.getDashboard();
        
        // Update stats with real data
        setStats([
          { name: 'Total Students', value: dashboardData.stats.totalStudents, icon: UserGroupIcon, to: '/teacher/students' },
          { name: 'Total Courses', value: dashboardData.stats.totalCourses, icon: AcademicCapIcon, to: '/teacher/courses' },
          { name: 'Attendance Today', value: `${dashboardData.stats.todaysAttendance}%`, icon: ClipboardListIcon, to: '/teacher/attendance' },
          { name: 'Upcoming Classes', value: dashboardData.stats.upcomingClasses, icon: CalendarIcon, to: '/teacher/schedule' },
        ]);
        
        // Set recent activity
        setRecentActivity(dashboardData.recentActivity || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back, {user?.name || 'Teacher'}! Here's an overview of your classes and activities.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.to}
            className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recent actions and notifications.</p>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </li>
              ))
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                No recent activities to show
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
