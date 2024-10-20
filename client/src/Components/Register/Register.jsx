import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    studentId: '',
    department: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      const regex = /^[A-Za-z0-9@_\-~]*$/;
      if (regex.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
      } else {
        setErrors({ ...errors, [name]: 'Username can only contain letters, numbers, and special characters (@, _, -, ~).' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.username) {
      return;
    }

    try {
      // 사용자 등록 요청
      await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, formData);

      // 자동 로그인 요청
      const loginResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        username: formData.username,
        password: formData.password
      });

      // JWT 저장 및 리다이렉트
      localStorage.setItem('jwtToken', loginResponse.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`;
      navigate('/home');
    } catch (error) {
      console.error('Registration or login error:', error);
    }
  };

  return (
    <><div className={styles['title']}>Welcome to Mo To Do</div><div className={styles.registerForm}>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} value={formData.name} required />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} value={formData.age} required />
        <input name="studentId" placeholder="Student number" onChange={handleChange} value={formData.studentId} required />
        <input name="department" placeholder="Department" onChange={handleChange} value={formData.department} required />
        <input name="username" placeholder="ID" onChange={handleChange} value={formData.username} required />
        {errors.username && <p className={styles.error}>{errors.username}</p>}
        <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
        <button type="submit">Sign in</button>
      </form>
    </div></>
  );
};

export default Register;
