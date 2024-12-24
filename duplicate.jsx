import React, { useState } from 'react';
import { getStudentAttendance } from '../api';

const StudentAttendance = () => {
  const [rollnum, setRollnum] = useState('');
  const [date, setDate] = useState('');
  const [attendance, setAttendance] = useState('');
  const token = localStorage.getItem('token');

  const handleFetchAttendance = async () => {
    try {
      const response = await getStudentAttendance(rollnum, date, token);
      setAttendance(response.data.attendance);
    } catch (error) {
      alert(error.response?.data || 'Error fetching attendance');
    }
  };

  return (
    <div>
      <h2>Get Student Attendance</h2>
      <input placeholder="Roll Number" onChange={(e) => setRollnum(e.target.value)} />
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <button onClick={handleFetchAttendance}>Get Attendance</button>
      <p>Attendance Status: {attendance}</p>
    </div>
  );
};

export default StudentAttendance;
