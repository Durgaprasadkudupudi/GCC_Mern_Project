import React, { useState, useEffect } from 'react';
import { getStudentsData } from '../api';

const GetStudentsData = () => {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStudentsData(token);
        setStudents(response.data);
      } catch (error) {
        alert(error.response?.data || 'Error fetching students data');
      }
    };
    fetchData();
  }, [token]);

  return (
    <div>
      <h2>Students Data</h2>
      {students.map((student, index) => (
        <div key={index}>
          <p>{student.name} - {student.rollnum}</p>
        </div>
      ))}
    </div>
  );
};

export default GetStudentsData;
