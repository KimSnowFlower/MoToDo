import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', credentials);
      if (response.data.message === 'Login successful') {
        localStorage.setItem('jwtToken', response.data.token); // 토큰 저장
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; // 기본 헤더에 토큰 설정
        navigate('/home');
      } else {
        setError('Login failed: ' + response.data.error);
      }
    } catch (error) {
      if (error.response) {
        setError('Login error: ' + error.response.data.error);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        setError('No response received from server');
        console.error('No response received:', error.request);
      } else {
        setError('Error setting up request');
        console.error('Error setting up request:', error.message);
      }
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Mo To Do</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="input-box">
          <input type="text" name="username" placeholder='Username' onChange={handleChange} required/>
          <FaUser className='icon'/>
        </div>
        <div className="input-box">
          <input type="password" name="password" placeholder='Password' onChange={handleChange} required/>
          <FaLock className='icon'/>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;