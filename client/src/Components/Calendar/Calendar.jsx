import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      <div
        key={day}
        className={`calendar-day ${selectedDate === day ? 'selected' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div>{`${currentYear}년 ${currentMonth + 1}월`}</div>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day-name">일</div>
        <div className="calendar-day-name">월</div>
        <div className="calendar-day-name">화</div>
        <div className="calendar-day-name">수</div>
        <div className="calendar-day-name">목</div>
        <div className="calendar-day-name">금</div>
        <div className="calendar-day-name">토</div>
        {days}
      </div>
    </div>
  );
};

export default Calendar;
