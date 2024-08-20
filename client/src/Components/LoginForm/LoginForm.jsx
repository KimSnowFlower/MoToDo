import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginForm.module.css'; // CSS 모듈로 변경
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
        localStorage.setItem('jwtToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        navigate('/home');
      } else {
        setError('Login failed: ' + response.data.error);
      }
    } catch (error) {
      if (error.response) {
        setError('Login error: ' + error.response.data.error);
      } else if (error.request) {
        setError('No response received from server');
      } else {
        setError('Error setting up request');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}></div> {/* 배경 이미지 영역 */}
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit}>
          <h1>Mo To Do</h1>
          {error && <p className={styles['error-message']}>{error}</p>}
          <div className={styles['input-box']}>
            <input type="text" name="username" placeholder='Username' onChange={handleChange} required/>
            <FaUser className={styles.icon}/> 
          </div>
          <div className={styles['input-box']}>
            <input type="password" name="password" placeholder='Password' onChange={handleChange} required/>
            <FaLock className={styles.icon}/>
          </div>
          <button type="submit">Login</button>
          <div className={styles['register-link']}>
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
