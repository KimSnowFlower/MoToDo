import React, { useState } from 'react'; //React Hook 사용
import { BiSolidHeart } from "react-icons/bi";
import { PiCakeDuotone } from "react-icons/pi";
import { IoAirplane } from "react-icons/io5";
import { IoBeerOutline } from "react-icons/io5";
import Modal from 'react-modal';
import MenuBar from '../MenuBar/MenuBar';
import styles from './Calendar.module.css';
// 아이콘 로테이션 순서
const icons = [<BiSolidHeart />, <PiCakeDuotone />, <IoAirplane />, <IoBeerOutline />];

Modal.setAppElement('#root'); // Modal 접근성 설정

const Calendar = () => {
  const currentDate = new Date(); //현재 날짜
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear()); //현재 연도
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth()); // 현재 월
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
  const [eventTitle, setEventTitle] = useState(''); // 이벤트 제목
  const [eventTime, setEventTime] = useState('오전 12:00'); // 이벤트 시간
  const [eventContent, setEventContent] = useState(''); // 이벤트 내용
  const [events, setEvents] = useState({}); // 이벤트 저장
  const [eventColor, setEventColor] = useState('#FFFF00'); // 기본 색상
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트
  const [iconIndexes, setIconIndexes] = useState({}); // 아이콘 인덱스
  const [showModal, setShowModal] = useState(false); // 모달
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [moreEvents, setMoreEvents] = useState([]); // 더보기 이벤트 저장
  const [filterColor, setFilterColor] = useState('all'); // 색상 필터
  const [sortByTime, setSortByTime] = useState(true); // 시간순 정렬 옵션

  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; //요일 배열
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 해당 월의 첫 요일
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // 해당 월의 일수

  const colorOptions = [
    '#7F24A6', '#4563BF', '#39BF73', '#F2AC29',
    '#D90404'
  ]; // 선택할 수 있는 색깔
//시간을 15분 단위로 선택
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = isPM ? "오후" : "오전";
    return `${period} ${formattedHour}:${minute.toString().padStart(2, '0')}`;
  });
// 문자열 시간을 24시간 형식으로 변환
  const convertTo24HourFormat = (timeString) => {
    const [period, time] = timeString.split(' ');
    if (!period || !time) {
      console.error('Invalid time format:', timeString);
      return '00:00:00'; 
    }
    //오전 12시를 인식 못해서 예외 처리를 추가함
    let [hour, minute] = time.split(':').map(Number);
    if (period === '오후' && hour !== 12) hour += 12;
    if (period === '오전' && hour === 12) hour = 0;
    if (!timeString) {
      console.error('Invalid time input:', timeString);
      return '00:00:00'; 
    } 
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  };

  const openModal = () => setShowModal(true); //모달 창 오픈
  const closeModal = () => { // 모달창 닫기
    setShowModal(false);
    setSelectedEvent(null);
  };

  /*const openMoreModal = (eventsForDay) => {
    setMoreEvents(eventsForDay);
    setShowMoreModal(true);
  };*/
  const closeMoreModal = () => setShowMoreModal(false);

//날짜를 클릭했을 때 이벤트
  const handleDateClick = (day) => {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    setSelectedDate(new Date(currentYear, currentMonth, day));
    const event = events[dateKey] || { title: '', time: '00:00', content: '' };
    setEventTitle(event.title);
    setEventTime(event.time);
    setEventContent(event.content);
    openModal();
    
    setIconIndexes(prevIndexes => ({
      ...prevIndexes,
      [dateKey]: (prevIndexes[dateKey] === undefined || prevIndexes[dateKey] === -1) ? 0 : (prevIndexes[dateKey] + 1) % icons.length
    }));
  };
// 이전달 이동 버튼
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(prevYear => prevYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
  };
// 다음달 이동 버튼
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(prevYear => prevYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
  };
// 이벤트 저장
  const handleSaveEvent = () => {
    if (selectedDate) {
      const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
      const eventDetail = {
        id: events[dateKey]?.id || Date.now(),
        title: eventTitle,
        time: convertTo24HourFormat(eventTime),
        content: eventContent,
        color: eventColor 
      };
      setEvents(prevEvents => ({
        ...prevEvents,
        [dateKey]: prevEvents[dateKey] ? [...prevEvents[dateKey], eventDetail].sort((a, b) => a.time.localeCompare(b.time)) : [eventDetail]
      }));
      closeModal();
    }
  };
// 이벤트 클릭? 
  const handleEventClick = (day, event) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventTime(event.time);
    setEventContent(event.content);
    openModal();
  };

  const handleMoreClick = (day) => {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    const eventsForDay = events[dateKey] || [];
    
    if (eventsForDay.length > 0) {
      setMoreEvents(eventsForDay);  // 이벤트가 있을 경우만 모달을 엽니다.
      setShowMoreModal(true);       // 모달 열기
    } else {
      console.error('No events for this day.');
    }
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

  const filteredAndSortedEvents = moreEvents
    .filter(event => filterColor === 'all' || event.color === filterColor)
    .sort((a, b) => sortByTime ? a.time.localeCompare(b.time) : 0);

  const weeks = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
  const daySize = weeks === 6 ? 82 : 100; // 6주일 때 칸 크기 조정

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    const hasEvents = !!events[dateKey];
    const currentIconIndex = iconIndexes[dateKey];
    const maxVisibleEvents = 1; // 최대 보이는 이벤트 수

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
            {events[dateKey].slice(0, maxVisibleEvents).map((event, index) => (
              <div
                key={index}
                className={styles.eventTitle}
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleEventClick(day, event);
                }}
                style={{
                  backgroundColor: event.color,
                  color: 'white', 
                  padding: '2px 4px',
                  borderRadius: '4px',
                  marginTop: '3px',
                }}
              >
                {event.title}
                </div>
            ))}
            {events[dateKey].length > maxVisibleEvents && (
              <div
                className={styles.moreEvents}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoreClick(day);
                }}
              >
                ...더보기
              </div>
            )}
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
        <h2>제목 및 일정 추가</h2>
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
        <div className={styles.colorPicker}>
          {colorOptions.map(color => (
            <button
              key={color}
              style={{ background: color, width: '24px', height: '24px', margin: '5px' }}
              onClick={() => setEventColor(color)}
            />
          ))}
        </div>
        <button onClick={handleSaveEvent}>저장</button>
        <button onClick={closeModal}>닫기</button>
        {selectedEvent && (
          <>
            <button onClick={handleEventUpdate}>수정</button>
            <button onClick={handleEventDelete}>삭제</button>
          </>
        )}
      </Modal>
      <Modal isOpen={showMoreModal} onRequestClose={closeMoreModal} className={styles.modal}>
        <h2>모든 일정 보기</h2>
        <div>
          <label>색상 필터:</label>
          <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
            <option value="all">모든 색상</option>
            {colorOptions.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
          <label>시간순 정렬:</label>
          <input
            type="checkbox"
            checked={sortByTime}
            onChange={(e) => setSortByTime(e.target.checked)}
          />
        </div>
        {filteredAndSortedEvents.map((event, index) => (
          <div key={index} className={styles.eventDetail}>
            <strong>{event.title}</strong> - {event.time}
            <p>{event.content}</p>
            <button onClick={() => handleEventClick(selectedDate?.getDate(), event)}>수정</button>
          </div>
        ))}
        <button onClick={closeMoreModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Calendar;