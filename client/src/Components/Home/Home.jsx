import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Home.module.css'; // CSS 모듈
import MenuBar from '../MenuBar/MenuBar'; // MenuBar 임포트
import ToDo from '../ToDo/ToDo'; // ToDo 컴포넌트 임포트
import Schedule from '../Schedule/Schedule';

const Home = () => {
  const [data, setData] = useState({ calendar: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
            <h2>Calendar</h2>
            <div className={styles.tableWrap}>
              {error ? (
                <span className={styles.emptyMessage}>Error: {error}</span>
              ) : data.calendar.length === 0 ? (
                <span className={styles.emptyMessage}>이번 달은 일정이 없어요!!</span>
              ) : (
                <div><Schedule /></div>
              )}
            </div>
          </div>
          <div className={styles.noticeAndTime}>
            <h2>Notice and Time</h2>
            <p>No notices available.</p>
          </div>
          <div className={styles.todoCheckList}>
            <ToDo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;