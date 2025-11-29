import React, { useState } from 'react';
import { SearchIcon, UserCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample student data
  const students = [
    { id: 1, name: 'John Doe', email: 'john@example.com', class: '10A', attendance: '85%', lastActive: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', class: '10A', attendance: '92%', lastActive: '1 day ago' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', class: '10B', attendance: '78%', lastActive: '3 hours ago' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', class: '10B', attendance: '95%', lastActive: '5 hours ago' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', class: '10A', attendance: '88%', lastActive: '1 hour ago' },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your students' information and performance.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Student
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Class
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Attendance
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Active
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {student.class}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {parseInt(student.attendance) > 75 ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" aria-hidden="true" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-yellow-500 mr-1" aria-hidden="true" />
                          )}
                          {student.attendance}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{student.lastActive}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a href={`/teacher/students/${student.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          View
                        </a>
                        <a href={`/teacher/students/${student.id}/attendance`} className="text-indigo-600 hover:text-indigo-900">
                          Attendance
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
