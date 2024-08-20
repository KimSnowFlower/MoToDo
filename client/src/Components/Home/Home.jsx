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
      <MenuBar className={styles.menuBar}/>
      <div className={styles.homeMain}>
        <div className={styles.contentContainer}>
          <div className={styles.homeCalendarList}>
            <h2>Calendar</h2>
            <div className={styles.tableWrap}>
              {error ? (
                <span className={styles.emptyMessage}>Error: {error}</span>
              ) : data.calendar.length === 0 ? (
                <span className={styles.emptyMessage}>No Data</span>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Title</th>
                      <th>Coment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.calendar.map((event, index) => (
                      <tr key={index}>
                        <td>{event.start_date}</td>
                        <td>{event.title}</td>
                        <td>{event.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className={styles.homeStickyList}>
            <h2>Sticky</h2>
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
