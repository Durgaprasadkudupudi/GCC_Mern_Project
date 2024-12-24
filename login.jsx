import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Link } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Define fixed admin credentials
  const adminUsername = 'GCC@2026';
  const adminPassword = 'GCC@2026T1';

  const handleLogin = async () => {
    try {
      const response = await login({ username, password });
      localStorage.setItem('token', response.data.token);
      alert('Login successful');

      // Check if entered credentials match the fixed admin credentials
      if (username === adminUsername && password === adminPassword) {
        navigate('/home'); // Redirect to admin home page
      } else {
        navigate('/studenthome'); // Redirect to StudentHome page for all other credentials
      }
    } catch (error) {
      alert(error.response?.data || 'Login failed');
      navigate('/studenthome'); // Redirect to StudentHome page on failed login
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" onClick={handleLogin} className="login-button">
          Login
        </button>

        {/* Register link */}
        <p className="register-link">
          Don't have an account? <Link to="/Signup">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
