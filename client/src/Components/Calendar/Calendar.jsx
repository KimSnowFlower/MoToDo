import React, { useState } from 'react';
import { BiSolidHeart } from "react-icons/bi";
import { PiCakeDuotone } from "react-icons/pi";
import { IoAirplane } from "react-icons/io5";
import { IoBeerOutline } from "react-icons/io5";
import Modal from 'react-modal';
import MenuBar from '../MenuBar/MenuBar';
import styles from './Calendar.module.css';

const icons = [<BiSolidHeart />, <PiCakeDuotone />, <IoAirplane />, <IoBeerOutline />];

Modal.setAppElement('#root'); // Modal 접근성 설정

const Calendar = () => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('오전 12:00');
  const [eventContent, setEventContent] = useState('');
  const [events, setEvents] = useState({}); 
  const [eventColor, setEventColor] = useState('#FFFF00'); // 기본 색상
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [iconIndexes, setIconIndexes] = useState({});
  const [showModal, setShowModal] = useState(false);

  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const colors = [
    '#FF0000', '#FFC0CB', '#FFA500', '#FFFF00',
    '#008000', '#0000FF', '#800080', '#000000'
  ]; // 추가된 색상 옵션

  // 15분 단위 시간 배열
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = isPM ? "오후" : "오전";
    return `${period} ${formattedHour}:${minute.toString().padStart(2, '0')}`;
  });

  // 시간 변환 (오전/오후 -> 24시간 형식)
  const convertTo24HourFormat = (timeString) => {
    const [period, time] = timeString.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (period === '오후' && hour !== 12) hour += 12;
    if (period === '오전' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDateClick = (day) => {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    setSelectedDate(new Date(currentYear, currentMonth, day));
    const event = events[dateKey] || { title: '', time: '00:00', content: '' };
    setEventTitle(event.title);
    setEventTime(event.time);
    setEventContent(event.content);
    openModal();
    
    // 아이콘 토글
    setIconIndexes(prevIndexes => ({
      ...prevIndexes,
      [dateKey]: (prevIndexes[dateKey] === undefined || prevIndexes[dateKey] === -1) ? 0 : (prevIndexes[dateKey] + 1) % icons.length
    }));
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
        id: events[dateKey]?.id || Date.now(),
        title: eventTitle,
        time: convertTo24HourFormat(eventTime),
        content: eventContent,
        color: eventColor // 색상 저장
      };
      setEvents(prevEvents => ({
        ...prevEvents,
        [dateKey]: prevEvents[dateKey] ? [...prevEvents[dateKey], eventDetail].sort((a, b) => a.time.localeCompare(b.time)) : [eventDetail]
      }));
      closeModal();
    }
  };

  const handleEventClick = (day, event) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventTime(event.time);
    setEventContent(event.content);
    openModal();
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
      setSelectedEvent(null);
      closeModal();
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
      setSelectedEvent(null);
      closeModal();
    }
  };

  const handleIconClick = (e, day) => {
    e.stopPropagation(); // 아이콘 클릭 시 날짜 클릭 방지
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    setIconIndexes(prevIndexes => ({
      ...prevIndexes,
      [dateKey]: (prevIndexes[dateKey] === undefined || prevIndexes[dateKey] === -1) ? 0 : (prevIndexes[dateKey] + 1) % icons.length
    }));
  };

  const weeks = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
  const daySize = weeks === 6 ? 80 : 100; // 6주일 때 칸 크기 조정

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    const hasEvents = !!events[dateKey];
    const currentIconIndex = iconIndexes[dateKey];

    days.push(
      <div
        key={day}
        className={`${styles.calendarDay} ${selectedDate?.getDate() === day ? styles.selected : ''}`}
        onClick={() => handleDateClick(day)}
        style={{ height: `${daySize}px` }}
      >
        {day}
        {hasEvents && (
          <>
            <div className={styles.iconContainer} onClick={(e) => handleIconClick(e, day)}>
              {icons[currentIconIndex]}
            </div>
            {events[dateKey].map((event, index) => (
              <div
                key={index}
                className={styles.eventTitle}
                onClick={(e) => {
                  e.stopPropagation(); // 이벤트 클릭 시 날짜 클릭 방지
                  handleEventClick(day, event);
                }}
                style={{
                  backgroundColor: 'colors',
                  color: 'white', // 글자색 하얗게
                  padding: '2px 4px',
                  borderRadius: '4px',
                  marginTop: '4px',
                }}
              >
                {event.title}
              </div>
            ))}
          </>
        )}
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
            {selectedDate ? `선택: ${selectedDate.toLocaleDateString()}` : '날짜 선택 안됨'}
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
      <Modal isOpen={showModal} onRequestClose={closeModal} className={styles.modal}>
        <h2>이벤트 상세 정보</h2>
        <input type="text" placeholder="제목" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
        <select
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        <textarea placeholder="내용" value={eventContent} onChange={(e) => setEventContent(e.target.value)} />
        <button onClick={handleSaveEvent}>저장</button>
        <button onClick={closeModal}>닫기</button>
        {selectedEvent && (
          <>
            <button onClick={handleEventUpdate}>수정</button>
            <button onClick={handleEventDelete}>삭제</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Calendar;
