import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import MenuBar from '../MenuBar/MenuBar';
import OptionBar from '../OptionBar/OptionBar';

const Home = () => {
  const [data, setData] = useState({ calendar: [], sticky: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/home');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="totalPage">
      <div className="menuBar">
        <MenuBar />
      </div>
      <div className="optionBar">
        <OptionBar />
      </div>
      <div className="homeMain">
        <div className="homeCalendarList">
          {data.calendar.length === 0 ? (
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
          {data.sticky.length === 0 ? (
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
