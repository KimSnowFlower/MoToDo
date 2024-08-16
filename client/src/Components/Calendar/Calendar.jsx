import React, { useState } from 'react';
import MenuBar from '../MenuBar/MenuBar';
import OptionBar from '../OptionBar/OptionBar';
import styles from './Calender.module.css'; // CSS 모듈로 변경

const Calendar = () => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
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

  const toggleMenu = () => {
    setIsMenuExpanded(prev => !prev);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <div
        key={day}
        className={`${styles.calendarDay} ${selectedDate?.getDate() === day ? styles.selected : ''}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className={`${styles.calendarPage} ${isMenuExpanded ? styles.expanded : styles.collapsed}`}>
      <MenuBar isExpanded={isMenuExpanded} onToggleMenu={toggleMenu} />
      <OptionBar />
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button onClick={handlePrevMonth}>&lt;</button>
          <div>{`${currentYear}년 ${currentMonth + 1}월`}</div>
          <button onClick={handleNextMonth}>&gt;</button>
          <div className={styles.selectedDate}>
            {selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : 'No date selected'}
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
        <input type="text" placeholder="Title" className={styles.textFieldTitle} />
        <input type="text" placeholder="00:00:00 ~ 00:00:00" className={styles.textFieldTime} />
        <textarea placeholder="Enter your notes here..." className={styles.textArea}></textarea>
      </div>
    </div>
  );
};

export default Calendar;
