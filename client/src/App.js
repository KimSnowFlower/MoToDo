import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Routes와 Route로 수정
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';
import Calendar from './Components/Calendar/Calendar';

function App() {
  return (
    <Router>
      <Routes> {/* Switch 대신 Routes로 변경 */}
        <Route path="/" element={<LoginForm />} /> {/* path와 element로 수정 */}
        <Route path="/register" element={<Register />} /> { }
        <Route path="/home" element={<Home />} /> { }
        <Route path="/calender" element={<Calendar />} /> {/* Calender와 연결되는 라우팅 설정*/}
      </Routes>
    </Router>
  );
}

export default App;
