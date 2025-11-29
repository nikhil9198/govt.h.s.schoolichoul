import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, ClockIcon, UserGroupIcon, CalendarIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/outline';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Sample course data
  const courses = [
    { 
      id: 1, 
      name: 'Mathematics 101', 
      code: 'MATH101', 
      students: 32, 
      time: 'Mon, Wed, Fri 9:00 AM - 10:30 AM',
      status: 'active',
      progress: 75,
      nextClass: 'Today, 9:00 AM'
    },
    { 
      id: 2, 
      name: 'Physics 201', 
      code: 'PHY201', 
      students: 28, 
      time: 'Tue, Thu 11:00 AM - 12:30 PM',
      status: 'active',
      progress: 60,
      nextClass: 'Tomorrow, 11:00 AM'
    },
    { 
      id: 3, 
      name: 'Chemistry Lab', 
      code: 'CHEM102L', 
      students: 24, 
      time: 'Wed 2:00 PM - 5:00 PM',
      status: 'active',
      progress: 45,
      nextClass: 'Next Week, 2:00 PM'
    },
  ];

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.status === activeTab);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">My Courses</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your courses, view schedules, and track student progress.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/teacher/courses/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Course
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`${activeTab === 'active' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${activeTab === 'upcoming' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`${activeTab === 'completed' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Completed
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <AcademicCapIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {course.status === 'active' ? 'Active' : course.status}
                </span>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {course.time}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  {course.students} students enrolled
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Next class: {course.nextClass}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <span>Course Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <Link
                  to={`/teacher/courses/${course.id}`}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <BookOpenIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                  View
                </Link>
                <Link
                  to={`/teacher/courses/${course.id}/attendance`}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ChartBarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                  Attendance
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="mt-12 text-center">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new course.
          </p>
          <div className="mt-6">
            <Link
              to="/teacher/courses/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <AcademicCapIcon className="-ml-1 mr-2 h-5 w-5" />
              New Course
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
