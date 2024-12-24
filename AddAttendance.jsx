import React, { useState } from 'react';
import { addAttendance } from '../api';

const AddAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const token = localStorage.getItem('token');

  const handleAddAttendance = async () => {
    try {
      await addAttendance(attendanceData, token);
      alert("Attendance added/updated successfully");
    } catch (error) {
      alert(error.response?.data || 'Error updating attendance');
    }
  };

  const addRecord = () => {
    setAttendanceData([...attendanceData, { rollnum: "001", name: "John", date: "2024-09-19", attendance: "present" }]);
  };

  return (
    <div>
      <h2>Add Attendance</h2>
      <button onClick={addRecord}>Add Sample Record</button>
      <button onClick={handleAddAttendance}>Submit Attendance</button>
    </div>
  );
};

export default AddAttendance;
