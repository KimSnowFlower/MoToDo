import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

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
      // 정규 표현식: 영어 대소문자, 숫자, 특수기호(@, _, -, ~) 허용
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

    // 유효성 검사
    if (errors.username) {
      return; // 유효성 오류가 있으면 제출하지 않음
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      console.log(response.data);
      navigate('/');  // 등록 성공 후 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="이름" onChange={handleChange} value={formData.name} required />
        <input name="age" type="number" placeholder="나이" onChange={handleChange} value={formData.age} required />
        <input name="studentId" placeholder="학번" onChange={handleChange} value={formData.studentId} required />
        <input name="department" placeholder="학과" onChange={handleChange} value={formData.department} required />
        <input name="username" placeholder="아이디" onChange={handleChange} value={formData.username} required />
        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} value={formData.password} required />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Register;
