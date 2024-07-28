// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Routes와 Route로 수정
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';

function App() {
  return (
    <Router>
      <Routes> {/* Switch 대신 Routes로 변경 */}
        <Route path="/" element={<LoginForm />} /> {/* path와 element로 수정 */}
        <Route path="/register" element={<Register />} /> { }
        <Route path="/home" element={<Home/>} /> { }
      </Routes>
    </Router>
  );
}

export default App;
