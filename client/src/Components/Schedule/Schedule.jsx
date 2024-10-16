import React, { useEffect, useState } from 'react';
import styles from './Schedule.module.css'; // CSS 모듈

const Schedule = () => {
  const [scheduleInfo, setScheduleInfo] = useState({ title: '', description: '', start_date: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const fetchScheduleInfo = async () => {
    setLoading(true);
    const token = localStorage.getItem('jwtToken'); // localStorage에서 토큰 가져오기

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 토큰 사용
        },
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      const formattedDate = data.start_date.split(' ')[0];

      setScheduleInfo({
        title: data.title,
        description: data.description,
        start_date: formattedDate, // 시간 없이 저장
      });
    } catch (error) {
      console.error('스케줄 정보 가져오기 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleInfo(); // 컴포넌트 마운트 시 데이터 요청
  }, []);

  return (
    <div className={styles.scheduleContainer}>
   
      {loading && <p>Loading...</p>} {/* 로딩 상태 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 표시 */}

      {/* scheduleInfo 정보 표시 */}
      {!loading && !error && (
        <ul className={styles.homeLists}>
          <li>
            <p> <strong>Date:</strong> {scheduleInfo.start_date} <strong>Title:</strong> {scheduleInfo.title}</p>
          </li>
          <li>
          <span><strong>Description:</strong> {scheduleInfo.description}</span>
          </li>
        </ul>
      )}
    </div>
  );  
};

export default Schedule;
