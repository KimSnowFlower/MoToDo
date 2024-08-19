import React, { useState } from 'react';
import MenuBar from '../MenuBar/MenuBar';
import styles from './Calendar.module.css'; // CSS 모듈로 변경

const Calendar = () => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState(''); // 이벤트 제목 상태 추가
  const [events, setEvents] = useState({}); // 이벤트 저장 상태 추가

  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setEventTitle(events[`${currentYear}-${currentMonth + 1}-${day}`] || ''); // 선택한 날짜에 이미 저장된 이벤트 제목을 불러오기
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(prevYear => prevYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(prevYear => prevYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
  };

  const handleSaveEvent = () => {
    if (selectedDate) {
      const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      setEvents(prevEvents => ({ ...prevEvents, [dateKey]: eventTitle }));
      setEventTitle(''); // 제목을 저장한 후 필드를 초기화
    }
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    days.push(
      <div
        key={day}
        className={`${styles.calendarDay} ${selectedDate?.getDate() === day ? styles.selected : ''}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
        <div className={styles.eventTitle}>{events[dateKey]}</div> {/* 캘린더에 이벤트 제목 표시 */}
      </div>
    );
  }

  return (
    <div className={styles.calendarPage}>
      <MenuBar />
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button onClick={handlePrevMonth}>&lt;</button>
          <div>{`${currentYear}년 ${currentMonth + 1}월`}</div>
          <button onClick={handleNextMonth}>&gt;</button>
          <div className={styles.selectedDate}>
            {selectedDate ? `선택: ${selectedDate.toLocaleDateString()}` : 'No date selected'}
          </div>
        </div>
        <div className={styles.calendarGrid}>
          {daysInWeek.map((dayName, index) => (
            <div key={index} className={styles.calendarDayName}>
              {dayName}
            </div>
          ))}
          {days}
        </div>
      </div>
      <div className={styles.textField}>
        <input
          type="text"
          placeholder="제목"
          className={styles.textFieldTitle}
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <input type="text" placeholder="00:00:00 ~ 00:00:00" className={styles.textFieldTime} />
        <textarea
          placeholder="일정을 입력해 주세요..."
          className={styles.textArea}
        ></textarea>
        <button onClick={handleSaveEvent} className={styles.saveButton}>저장</button> 
      </div>
    </div>
  );
};

export default Calendar;
