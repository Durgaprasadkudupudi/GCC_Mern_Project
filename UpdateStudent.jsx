import React, { useState } from 'react';
import { updateStudent } from '../api';

const UpdateStudent = () => {
  const [rollnum, setRollnum] = useState('');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [attendance, setAttendance] = useState('absent');
  const token = localStorage.getItem('token');

  const handleUpdateStudent = async () => {
    try {
      await updateStudent({ rollnum, name, class: studentClass, attendance }, token);
      alert("Student data updated successfully");
    } catch (error) {
      alert(error.response?.data || 'Error updating student');
    }
  };

  return (
    <div>
      <h2>Update Student</h2>
      <input placeholder="Roll Number" onChange={(e) => setRollnum(e.target.value)} />
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Class" onChange={(e) => setStudentClass(e.target.value)} />
      <select onChange={(e) => setAttendance(e.target.value)}>
        <option value="absent">Absent</option>
        <option value="present">Present</option>
      </select>
      <button onClick={handleUpdateStudent}>Update Student</button>
    </div>
  );
};

export default UpdateStudent;
