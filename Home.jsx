import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Home.css';
import gccLogo from './gcc logo.jpeg'; // Import the GCC logo
import { useNavigate } from 'react-router-dom'; // To handle navigation

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // State for Attendance dropdown
  const [attendanceData, setAttendanceData] = useState([]); // Store data from MongoDB
  const navigate = useNavigate();

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track scrolling position to show/hide the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data from MongoDB on load
  useEffect(() => {
    const fetchAttendanceData = async () => {
      const response = await fetch('/api/attendance'); // Replace with your actual endpoint
      const data = await response.json();
      setAttendanceData(data);
    };
    fetchAttendanceData();
  }, []);

  // Function to handle navigation to the attendance form
  const handleYearSelect = (year) => {
    if (year === 3) {
      navigate(`/student-attendance/3rd-year`); // Navigate to the 3rd-year page
    } else if (year === 4) {
      navigate(`/student-attendance/4th-year`); // Navigate to the 4th-year page
    }
  };

  // Attendance form submit handler (simplified for now)
  const handleSubmit = () => {
    // Add form submission logic here (e.g., post data to backend)
  };

  // Download attendance data as PDF
  const handleDownloadPdf = () => {
    // Logic to download attendance data as PDF
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={gccLogo} alt="GCC Logo" className="logo" />
          <span className="club-name">Global Coding Club</span>
        </div>
        <ul className="nav-links">
          <li><a href="#history">History</a></li>
          <li><a href="#learnings">Courses</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <a href="#student-attendance">Attendance</a>
            {showDropdown && (
              <ul className="dropdown">
                <li>
                  <Link to="/student-attendance/3rd-year">3rd Year</Link>
                </li>
                <li>
                  <Link to="/student-attendance/4th-year">4th Year</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Main Section */}
      <div className="main-content">
        {/* History Section */}
        <div className="history-section" id="history">
          <h2>History of GCC</h2>
          <p>The Global Coding Club (GCC) was originally founded in 2020 by Satya Yalla, a senior student, under the name "Special Coding Batch". It began as an initiative to bring together students passionate about coding and to help them improve their technical skills through collaboration and hands-on projects.</p>
          <p>In 2022, under the leadership of Chairman Vishwam Sir, the club was rebranded as the Global Coding Club (GCC). This reflected the club’s broader mission to foster a global community of tech enthusiasts, offering coding resources, workshops, and hackathons to help students prepare for the evolving demands of the tech industry.</p>
        </div>

        {/* Current Learnings Section */}
        <div className="current-learnings" id="learnings">
          <h2>Current Learnings at GCC</h2>
          <div className="card-container">
            <div className="card">
              <h3>MERN Stack</h3>
              <p>Learn how to build web applications using MongoDB, Express, React, and Node.js. This course teaches both backend and frontend development, covering the entire process of building a full-stack app.</p>
            </div>
            <div className="card">
              <h3>Machine Learning</h3>
              <p>Get an introduction to machine learning and understand how to work with data. You'll learn about algorithms, training models, and applying AI to real-world problems.</p>
            </div>
            <div className="card">
              <h3>AWS</h3>
              <p>Master the basics of cloud computing with Amazon Web Services. Learn how to manage servers, store data, and deploy scalable applications on the AWS platform.</p>
            </div>
            <div className="card">
              <h3>Cloud Computing</h3>
              <p>Understand the fundamentals of cloud computing, virtualization, and service models. This course will help you get hands-on experience with cloud platforms and managing cloud-based applications.</p>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="about-us-section" id="about">
          <h2>About Us</h2>
          <p>At Global Coding Club (GCC), we are committed to fostering a culture of learning and innovation. Our club is dedicated to helping students and tech enthusiasts acquire in-demand skills in cutting-edge technologies such as MERN stack, Machine Learning, AWS, and Cloud Computing.</p>
        </div>

        {/* Contact Us Section */}
        <div className="contact-us-section" id="contact">
          <h2>Contact Us</h2>
          <div className="social-links">
            <a href="https://www.linkedin.com/company/kiet-special-coding/"><i className="fab fa-linkedin-in"></i></a>
            <a href="https://github.com/KIET-GlobalCodingClub"><i className="fab fa-github"></i></a>
            <a href="https://www.instagram.com/kiet_global_coding_club/?hl=en"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 GCC | All Rights Reserved</p>
      </footer>

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Home;
