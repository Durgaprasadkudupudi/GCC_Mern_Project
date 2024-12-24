import React, { useState, useEffect } from 'react';
import './StudentAttendance.css';
import { getStudentsData, addAttendance, createStudent, updateStudent, deleteStudent } from '../api';

const StudentAttendance = () => {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({ name: '', rollnum: '', branch: '', year: '4th Year' });
    const [attendance, setAttendance] = useState({});
    const [attendanceSummary, setAttendanceSummary] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTeam, setSelectedTeam] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStudentsForTeam = async () => {
            setIsLoading(true);
            setStudents([]); // Reset students on team change
            try {
                const storedStudents = localStorage.getItem(`students_team_${selectedTeam}_4thYear`);
                if (storedStudents) {
                    setStudents(JSON.parse(storedStudents));
                } else {
                    const response = await getStudentsData(token, selectedTeam, '4th Year');
                    if (response && response.data) {
                        setStudents(response.data);
                        localStorage.setItem(`students_team_${selectedTeam}_4thYear`, JSON.stringify(response.data));
                    } else {
                        console.error('No data received from server.');
                    }
                }
            } catch (error) {
                console.error('Error fetching students data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentsForTeam();
    }, [selectedTeam, token]);

    const handleAttendanceChange = (rollnum, status) => {
        setAttendance((prevState) => ({
            ...prevState,
            [rollnum]: status,
        }));
    };

    const handleAddStudent = async () => {
        if (!newStudent.name || !newStudent.rollnum || !newStudent.branch) {
            alert("All fields are required!");
            return;
        }

        const studentToAdd = { ...newStudent, id: Date.now() };
        try {
            const response = await createStudent(studentToAdd, token);
            const updatedStudents = [...students, response.data];
            setStudents(updatedStudents);
            localStorage.setItem(`students_team_${selectedTeam}_4thYear`, JSON.stringify(updatedStudents));
            setNewStudent({ name: '', rollnum: '', branch: '', year: '4th Year' }); // Clear form
            setIsEditing(false);
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleDeleteStudent = async (rollnum) => {
        try {
            await deleteStudent(rollnum, token);
            const updatedStudents = students.filter((student) => student.rollnum !== rollnum);
            setStudents(updatedStudents);
            localStorage.setItem(`students_team_${selectedTeam}_4thYear`, JSON.stringify(updatedStudents));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleEditStudent = (student) => {
        setNewStudent(student); // Prefill form with student details
        setIsEditing(true);
    };

    const handleSaveStudentUpdate = async () => {
        if (!newStudent.name || !newStudent.rollnum || !newStudent.branch) {
            alert("All fields are required!");
            return;
        }

        const data = {
            rollnum: newStudent.rollnum,
            name: newStudent.name,
            branch: newStudent.branch,
            year: '4th Year',
        };

        try {
            const response = await updateStudent(data, token);
            const updatedStudents = students.map((s) =>
                s.rollnum === response.data.rollnum ? response.data : s
            );
            setStudents(updatedStudents);
            localStorage.setItem(`students_team_${selectedTeam}_4thYear`, JSON.stringify(updatedStudents));
            setNewStudent({ name: '', rollnum: '', branch: '', year: '4th Year' }); // Clear form after save
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleSubmitAttendance = async () => {
        try {
            const attendanceData = students.map((student) => ({
                rollnum: student.rollnum,
                name: student.name,
                branch: student.branch,
                year: '4th Year',
                attendance: attendance[student.rollnum] || 'Absent',
                date: attendanceDate,
                team: selectedTeam,
            }));
            await addAttendance(attendanceData, token);
            console.log('Attendance submitted successfully:', attendanceData);
            setAttendanceSummary((prevSummary) => [...prevSummary, ...attendanceData]);
        } catch (error) {
            console.error('Error submitting attendance:', error);
        }
    };

    return (
        <div className="student-attendance-container">
            <h1>Student Attendance Form for 4th Year, Team {selectedTeam}</h1>

            <div className="team-dropdown">
                <label>Select Team: </label>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(Number(e.target.value))}>
                    {[...Array(10).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                            Team {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading && <p>Loading students data...</p>}
            {!isLoading && students.length > 0 && (
                <table className="student-attendance-table">
                    <thead>
                        <tr>
                            <th>Roll Number</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.rollnum}>
                                <td>{student.rollnum}</td>
                                <td>{student.name}</td>
                                <td>{student.branch}</td>
                                <td>
                                    <input
                                        type="radio"
                                        name={`attendance-${student.rollnum}`}
                                        checked={attendance[student.rollnum] === 'Present'}
                                        onChange={() => handleAttendanceChange(student.rollnum, 'Present')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="radio"
                                        name={`attendance-${student.rollnum}`}
                                        checked={attendance[student.rollnum] === 'Absent'}
                                        onChange={() => handleAttendanceChange(student.rollnum, 'Absent')}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => handleEditStudent(student)}>Edit</button>
                                    <button onClick={() => handleDeleteStudent(student.rollnum)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {students.length === 0 && !isLoading && <p>No students found for this team.</p>}

            <div className="add-student-form">
                <h3>{isEditing ? 'Edit' : 'Add'} Student to 4th Year, Team {selectedTeam}</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Roll Number"
                    value={newStudent.rollnum}
                    onChange={(e) => setNewStudent({ ...newStudent, rollnum: e.target.value })}
                    disabled={isEditing} // Disable editing roll number if updating
                />
                <input
                    type="text"
                    placeholder="Branch"
                    value={newStudent.branch}
                    onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                />
                <button onClick={isEditing ? handleSaveStudentUpdate : handleAddStudent}>
                    {isEditing ? 'Save Changes' : 'Add Student'}
                </button>
            </div>

            <button className="submit-btn" onClick={handleSubmitAttendance}>
                Submit Attendance
            </button>

            {attendanceSummary.length > 0 && (
                <div className="attendance-summary">
                    <h2>Attendance Summary</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Roll Number</th>
                                <th>Name</th>
                                <th>Branch</th>
                                <th>Attendance</th>
                                <th>Date</th>
                                <th>Team</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceSummary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.rollnum}</td>
                                    <td>{item.name}</td>
                                    <td>{item.branch}</td>
                                    <td>{item.attendance}</td>
                                    <td>{item.date}</td>
                                    <td>{item.team}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentAttendance;
