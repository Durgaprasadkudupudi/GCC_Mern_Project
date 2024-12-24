import React, { useState } from 'react';
import { deleteStudent } from '../api';

const DeleteStudent = () => {
  const [rollnum, setRollnum] = useState('');
  const token = localStorage.getItem('token');

  const handleDeleteStudent = async () => {
    try {
      await deleteStudent(rollnum, token);
      alert("Student deleted successfully");
    } catch (error) {
      alert(error.response?.data || 'Error deleting student');
    }
  };

  return (
    <div>
      <h2>Delete Student</h2>
      <input placeholder="Roll Number" onChange={(e) => setRollnum(e.target.value)} />
      <button onClick={handleDeleteStudent}>Delete Student</button>
    </div>
  );
};

export default DeleteStudent;
