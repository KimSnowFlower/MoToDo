import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'; // CSS 모듈로 변경
import MenuBar from '../MenuBar/MenuBar';

const Home = () => {
  const [data, setData] = useState({ calendar: [], sticky: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:5000/api/home', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="totalPage">
      <div className="menuBar">
        <MenuBar />
      </div>
      <div className="homeMain">
        <div className="homeCalendarList">
          {error ? (
            <span className="emptyMessage">Error: {error}</span>
          ) : data.calendar.length === 0 ? (
            <span className="emptyMessage">No Data</span>
          ) : (
            <ul className="homeLists">
              {data.calendar.map((event, index) => (
                <li key={index}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="homeStickyList">
          {error ? (
            <span className="emptyMessage">Error: {error}</span>
          ) : data.sticky.length === 0 ? (
            <span className="emptyMessage">No Data</span>
          ) : (
            <ul className="homeLists">
              {data.sticky.map((note, index) => (
                <li key={index}>
                  <p>{note.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
