import React, { useState } from 'react';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, UserCircleIcon } from '@heroicons/react/outline';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});

  // Sample class data
  const classStudents = [
    { id: 1, name: 'John Doe', status: 'present' },
    { id: 2, name: 'Jane Smith', status: 'present' },
    { id: 3, name: 'Robert Johnson', status: 'absent' },
    { id: 4, name: 'Emily Davis', status: 'present' },
    { id: 5, name: 'Michael Wilson', status: 'absent' },
  ];

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the attendance data to your backend
    console.log('Attendance submitted:', {
      date: selectedDate,
      attendance: attendance
    });
    alert('Attendance submitted successfully!');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
          <p className="mt-2 text-sm text-gray-700">
            Mark and manage student attendance for your classes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="date"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excused
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">ID: {student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      checked={attendance[student.id] === 'present'}
                      onChange={() => handleStatusChange(student.id, 'present')}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      checked={attendance[student.id] === 'absent'}
                      onChange={() => handleStatusChange(student.id, 'absent')}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      checked={attendance[student.id] === 'late'}
                      onChange={() => handleStatusChange(student.id, 'late')}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      checked={attendance[student.id] === 'excused'}
                      onChange={() => handleStatusChange(student.id, 'excused')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              // Reset all to present
              const resetAttendance = {};
              classStudents.forEach(student => {
                resetAttendance[student.id] = 'present';
              });
              setAttendance(resetAttendance);
            }}
          >
            Mark All Present
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Attendance
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance Summary</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Overview of class attendance.</p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Present</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">3</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          60%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                    <XCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Absent</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">2</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                          40%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">This Month</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">85%</div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          +2.5%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
