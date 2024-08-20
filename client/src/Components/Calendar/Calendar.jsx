import React, { useState } from 'react';
import { BiSolidHeart } from "react-icons/bi";
import { PiCakeDuotone } from "react-icons/pi";
import { IoAirplane } from "react-icons/io5";
import { IoBeerOutline } from "react-icons/io5";
import MenuBar from '../MenuBar/MenuBar';
import styles from './Calendar.module.css';

const icons = [<BiSolidHeart />, <PiCakeDuotone />, <IoAirplane />, <IoBeerOutline />];

const Calendar = () => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState({ hour: '00', minute: '00', second: '00' });
  const [eventContent, setEventContent] = useState(''); // 일정 내용 상태 추가
  const [events, setEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 일정 저장 상태
  const [iconIndex, setIconIndex] = useState(0);

  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    const event = events[`${currentYear}-${currentMonth + 1}-${day}`];
    setEventTitle(event?.title || '');
    setEventTime(event?.time || { hour: '00', minute: '00', second: '00' });
    setEventContent(event?.content || '');
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
      const eventDetail = {
        id: events[dateKey]?.id || Date.now(), // 고유 ID
        title: eventTitle,
        time: eventTime,
        content: eventContent, // 일정 내용 추가
      };
      setEvents(prevEvents => ({
        ...prevEvents,
        [dateKey]: prevEvents[dateKey] ? [...prevEvents[dateKey], eventDetail].sort((a, b) => {
          const timeA = `${a.time.hour}:${a.time.minute}:${a.time.second}`;
          const timeB = `${b.time.hour}:${b.time.minute}:${b.time.second}`;
          return timeA.localeCompare(timeB);
        }) : [eventDetail]
      }));
      setEventTitle('');
      setEventContent(''); // 저장 후 내용 초기화
    }
  };

  const handleTimeChange = (type, value) => {
    setEventTime(prevTime => ({ ...prevTime, [type]: value }));
  };

  const handleEventClick = (day, event) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setSelectedEvent(event); // 선택된 이벤트를 상태로 저장
    setEventTitle(event.title);
    setEventTime(event.time);
    setEventContent(event.content);
  };

  const handleEventUpdate = () => {
    if (selectedDate && selectedEvent) {
      const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      setEvents(prevEvents => {
        const updatedEvents = prevEvents[dateKey].map(event =>
          event.id === selectedEvent.id ? { ...event, title: eventTitle, content: eventContent } : event
        );
        return {
          ...prevEvents,
          [dateKey]: updatedEvents
        };
      });
      setSelectedEvent(null); // 수정 후 선택된 일정 초기화
    }
  };

  const handleEventDelete = () => {
    if (selectedDate && selectedEvent) {
      const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      setEvents(prevEvents => {
        const filteredEvents = prevEvents[dateKey].filter(event => event.id !== selectedEvent.id);
        return {
          ...prevEvents,
          [dateKey]: filteredEvents
        };
      });
      setSelectedEvent(null); // 삭제 후 선택된 일정 초기화
    }
  };

  const handleIconClick = () => {
    setIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    const hasEvents = !!events[dateKey];
    days.push(
      <div
        key={day}
        className={`${styles.calendarDay} ${selectedDate?.getDate() === day ? styles.selected : ''}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
        {hasEvents && <div className={styles.eventIndicator}></div>}
        {hasEvents && (
          <div className={styles.iconContainer} onClick={handleIconClick}>
            {icons[iconIndex]}
          </div>
        )}
        {events[dateKey] && events[dateKey].map((event, index) => (
          <div key={index} className={styles.eventTitle} onClick={() => handleEventClick(day, event)}>
            ■ {event.title}
          </div>
        ))}
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
        <div className={styles.timeSelectors}>
          <label>시간: {selectedDate?.toLocaleDateString()}</label>
          <div>
            <select value={eventTime.hour} onChange={(e) => handleTimeChange('hour', e.target.value)}>
              {[...Array(24).keys()].map(hour => (
                <option key={hour} value={String(hour).padStart(2, '0')}>
                  {String(hour).padStart(2, '0')}
                </option>
              ))}
            </select>
            :
            <select value={eventTime.minute} onChange={(e) => handleTimeChange('minute', e.target.value)}>
              {[...Array(60).keys()].map(minute => (
                <option key={minute} value={String(minute).padStart(2, '0')}>
                  {String(minute).padStart(2, '0')}
                </option>
              ))}
            </select>
            :
            <select value={eventTime.second} onChange={(e) => handleTimeChange('second', e.target.value)}>
              {[...Array(60).keys()].map(second => (
                <option key={second} value={String(second).padStart(2, '0')}>
                  {String(second).padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          placeholder="내용"
          className={styles.textFieldContent}
          value={eventContent}
          onChange={(e) => setEventContent(e.target.value)}
        />
        <div className={styles.actionButtons}>
          <button onClick={handleSaveEvent}>저장</button>
          {selectedEvent && (
            <>
              <button onClick={handleEventUpdate}>수정</button>
              <button onClick={handleEventDelete}>삭제</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
