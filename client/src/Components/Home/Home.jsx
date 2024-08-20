import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Home.module.css'; // CSS 모듈로 변경
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
    <div className={styles.totalPage}>
      <MenuBar />
      <div className={styles.homeMain}>
        <div className={styles.contentContainer}>
          <div className={styles.homeCalendarList}>
            {error ? (
              <span className={styles.emptyMessage}>Error: {error}</span>
            ) : data.calendar.length === 0 ? (
              <span className={styles.emptyMessage}>No Data</span>
            ) : (
              <ul className={styles.homeLists}>
                {data.calendar.map((event, index) => (
                  <li key={index}>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.homeStickyList}>
            {error ? (
              <span className={styles.emptyMessage}>Error: {error}</span>
            ) : data.sticky.length === 0 ? (
              <span className={styles.emptyMessage}>No Data</span>
            ) : (
              <ul className={styles.homeLists}>
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
    </div>
  );
}

export default Home;
