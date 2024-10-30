import React, { useEffect, useState } from 'react';
import styles from './Schedule.module.css'; // CSS 모듈

const Schedule = () => {
  const [events, setEvents] = useState([]); // 모든 이벤트를 저장할 상태
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchScheduleInfo = async () => {
    setLoading(true); // 로딩 시작
    const token = localStorage.getItem('jwtToken'); // 토큰 가져오기

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('API 응답 전체 구조:', JSON.stringify(data, null, 2)); // 디버깅용 로그

      const formattedEvents = data.events.map(event => {
        const utcDate = new Date(event.start_date); // UTC 시간 변환

        // KST로 변환 옵션
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Seoul',
          hour12: false, // 24시간 형식
        };

        const formattedDateTime = utcDate.toLocaleString('ko-KR', options); // KST 변환

        return {
          ...event,
          start_date: formattedDateTime, // 변환된 시간 저장
        };
      });

      setEvents(formattedEvents); // 상태에 저장
    } catch (error) {
      console.error('스케줄 정보 가져오기 실패:', error);
      setError(error.message);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchScheduleInfo(); // 컴포넌트 마운트 시 데이터 요청
  }, []);

  return (
    <div className={styles.scheduleContainer}>
      {loading && <p>Loading...</p>} {/* 로딩 중 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 */}

      {/* 모든 이벤트 표시 */}
      {!loading && !error && (
        <ul className={styles.homeLists}>
          {events.map((event) => (
            <li key={event.id} className={styles.eventItem}>
              <p>
                <strong>날짜:</strong> {event.start_date}{' '}
                <strong>제목:</strong> {event.title}
              </p>
              <p>
                <strong>내용:</strong> {event.description || '설명 없음'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
