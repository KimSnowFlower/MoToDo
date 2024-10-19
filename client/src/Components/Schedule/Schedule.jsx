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
      console.log('API 응답:', data); // 응답 데이터 로그
  
      // start_date가 유효하고 문자열인 경우
      if (data.start_date && typeof data.start_date === 'string') {
        // ISO 형식의 날짜 문자열을 Date 객체로 변환
        const utcDate = new Date(data.start_date);
  
        // KST(한국 표준시)로 변환하기 위한 옵션
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Seoul', // KST로 변환
          hour12: false, // 24시간 형식
        };
        const formattedDateTime = utcDate.toLocaleString('ko-KR', options); // KST 형식으로 변환
  
        setScheduleInfo({
          title: data.title,
          description: data.description,
          start_date: formattedDateTime, // KST로 변환된 날짜 및 시간 저장
        });
      } else {
        console.warn('유효하지 않은 start_date:', data.start_date); // 유효하지 않은 값 로그
        setScheduleInfo(prevState => ({
          ...prevState,
          start_date: '날짜 정보 없음', // 기본값 설정
        }));
      }
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
