import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginForm from './Components/LoginForm/LoginForm';
import Register from './Components/Register/Register';
import Home from './Components/Home/Home';
import Calendar from './Components/Calendar/Calendar';
import Sticky from './Components/Sticky/Sticky';
import Friends from './Components/Friends/Friends';
import Group from './Components/Group/Group';
import { ThemeProvider } from './Components/Context/themeProvider';
import { GlobalStyle } from './Components/Theme/GlobalStyle';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <GlobalStyle/>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/sticky" element={<Sticky/>} />
            <Route path="/friends" element={<Friends/>} />
            <Route path="/group" element={<Group/>} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;