import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BiSolidHeart } from "react-icons/bi";
import { PiCakeDuotone } from "react-icons/pi";
import { IoAirplane } from "react-icons/io5";
import { IoBeerOutline } from "react-icons/io5";
import Modal from 'react-modal';
import MenuBar from '../MenuBar/MenuBar';
import styles from './Calendar.module.css';
import colorCheckIcon from '../Assets/color_check.png';
import axios from 'axios';

const icons = [<BiSolidHeart />, <PiCakeDuotone />, <IoAirplane />, <IoBeerOutline />];

Modal.setAppElement('#root');

const Calendar = () => {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('오전 12:00');
  const [eventContent, setEventContent] = useState('');
  const [events, setEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [iconIndexes, setIconIndexes] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [moreEvents, setMoreEvents] = useState([]);
  const [sortByTime, setSortByTime] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#FFFF00');
  const [userInfo, setUserInfo] = useState({ user_id: ''});
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 추가


  const daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const dayColors = {
    Sun: 'red',
    Sat: 'blue',
    default: 'black',
  };

  const colorOptions = [
    '#7F24A6', '#4563BF', '#39BF73', '#F2AC29', '#D90404'
  ];

  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = isPM ? "오후" : "오전";
    return `${period} ${formattedHour}:${minute.toString().padStart(2, '0')}`;
  });

  
  const fetchEvents = useCallback(async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const fetchedEvents = response.data.events;
      const userId = response.data.userId;
  
      const eventsMap = {};
  
      fetchedEvents.forEach(event => {
        // UTC 시간을 KST 형식으로 변환
        const startDateKST = new Date(event.start_date).toLocaleString('en-KR', {
          timeZone: 'Asia/Seoul',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        
        // 필요한 경우 다른 필드도 변환할 수 있습니다.
        // 예를 들어 end_date도 변환하려면 아래 코드 추가
        const endDateKST = new Date(event.end_date).toLocaleString('en-KR', {
          timeZone: 'Asia/Seoul',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
  
        // KST로 변환한 시간을 event에 추가
        const kstEvent = {
          ...event,
          start_date: startDateKST,
          end_date: endDateKST
        };
  
        const dateParts = startDateKST.split(',')[0].split('/'); // 쉼표와 슬래시로 구분
        const [month, day, year] = dateParts;
        
        const dateKey = `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
        console.log("Extracted dateKey:", dateKey); // 디버깅용 로그
        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }
  
        eventsMap[dateKey].push(kstEvent);
      });
      console.log("이벤트 저장 확인",eventsMap)
      setUserInfo(userId);
      setEvents(eventsMap);
      setUserInfo({ user_id: response.data.userId });
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  }, []);

  useEffect(() => {
    fetchEvents(); // 이벤트 로드
  }, [fetchEvents, currentYear, currentMonth]); // 년도/월 변경 시마다 실행

  const formatDateToMMDDYYYY = (year, month, day) => {
    // 월은 0부터 시작하므로 1을 더해야 함
    const formattedMonth = (month + 1).toString().padStart(2, '0'); // 두 자리 숫자로 변환
    const formattedDay = day.toString().padStart(2, '0'); // 두 자리 숫자로 변환
    return `${formattedMonth}/${formattedDay}/${year}`; // MM/DD/YYYY 형식으로 반환
  };

  const convertTo24HourFormat = (timeString) => {
    if (!timeString || !timeString.includes(' ')) {
      console.warn('Invalid or empty time input, setting default: 00:00:00');
      return '00:00:00'; // 기본값 반환
    }
  
    const [period, time] = timeString.split(' ');
    let [hour, minute] = time.split(':').map(Number);
  
    if (period === '오후' && hour !== 12) hour += 12;
    if (period === '오전' && hour === 12) hour = 0;
  
    if (isNaN(hour) || isNaN(minute)) {
      console.error('Invalid time format:', timeString);
      return '00:00:00'; // 오류 시 기본값 반환
    }
  
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setEventTitle('');
    setEventContent('');
    setEventTime('오전 12:00'); // 초기화
    setSelectedColor('#FFFF00'); // 기본 색상으로 리셋
  };
  const closeMoreModal = () => setShowMoreModal(false);

  const handleDateClick = (day) => {
    const dateKey = formatDateToMMDDYYYY(currentYear, currentMonth, day);
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

  const formatDateToMySQL = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleSaveEvent = async () => {
    if (selectedDate) {
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = convertTo24HourFormat(eventTime).split(':').map(Number);
      selectedDateTime.setHours(hours, minutes);
  
      const dateKey = formatDateToMMDDYYYY(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
  
      const startDateFormatted = formatDateToMySQL(selectedDateTime);
      const endDateFormatted = formatDateToMySQL(new Date(selectedDateTime.getTime() + 60 * 60 * 1000));
  
      // 로그 추가
      console.log('Formatted start date for MySQL:', startDateFormatted);
      console.log('Formatted end date for MySQL:', endDateFormatted);
  
      const eventDetail = {
        title: eventTitle,
        time: convertTo24HourFormat(eventTime),
        description: eventContent,
        start_date: startDateFormatted, // 시간 포함
        end_date: endDateFormatted, // 시간 포함
        all_day: 1,
        color: selectedColor,
      };
  
      console.log('Saving event with time:', eventDetail.time);
      console.log('dateKey:', dateKey); // dateKey 확인
  
      try {
        const token = localStorage.getItem('jwtToken');
  
        // axios로 POST 요청
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, eventDetail, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const data = response.data;
        const savedEventId = data.saveEventId.insertId; // 백엔드에서 반환한 ID 사용
  
        const newEventDetail = {
          id: savedEventId,
          ...eventDetail,
          time: convertTo24HourFormat(eventTime),
        };
  
        setEvents((prevEvents) => ({
          ...prevEvents,
          [dateKey]: [...(prevEvents[dateKey] || []), newEventDetail]
            .sort((a, b) => a.time.localeCompare(b.time)), // 시간 순 정렬
        }));
        closeModal();
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
  };
   

  const handleEventClick = (day, event) => {
    console.log('Selected event:', event); // 선택된 이벤트 확인용 로그
  
    setSelectedDate(new Date(currentYear, currentMonth, day)); // 선택된 날짜 설정
    setSelectedEvent(event); // 선택된 이벤트 설정
  
    // 이벤트 데이터로 모달의 필드 설정
    setEventTitle(event.title || ''); 
    setEventTime(event.time || '오전 12:00');
    setEventContent(event.description || ''); // 이벤트 내용 설정
    setSelectedColor(event.color || '#FFFF00');
  
    openModal(); // 모달 열기
  };

  const handleMoreClick = (day) => {
    const dateKey = formatDateToMMDDYYYY(currentYear, currentMonth, day);
    const eventsForDay = events[dateKey] || [];
    
    if (eventsForDay.length > 0) {
      setMoreEvents(eventsForDay);
      setShowMoreModal(true);
    } else {
      console.error('No events for this day.');
    }
  };

  const handleEventUpdate = async () => {
    if (!selectedEvent) {
        console.error('No event selected for update.');
        return;
    }

    console.log('Updating event:', selectedEvent); // 이벤트 확인용 로그

    // 선택한 날짜와 시간 조합
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = convertTo24HourFormat(eventTime || '오전 12:00').split(':').map(Number);
    selectedDateTime.setHours(hours, minutes);

    // 업데이트할 이벤트 세부사항 정의
    const updatedEventDetails = {
        ...selectedEvent,
        title: eventTitle,
        description: eventContent,
        color: selectedColor,
        time: convertTo24HourFormat(eventTime || '오전 12:00'),
        start_date: formatDateToMySQL(selectedDateTime), // 시작 시간
        end_date: formatDateToMySQL(selectedDateTime), // 종료 시간
    };

    try {
        const token = localStorage.getItem('jwtToken');
        console.log('Sending update request with:', updatedEventDetails); // 요청 데이터 확인

        await axios.put(
            `${process.env.REACT_APP_API_URL}/api/events/${selectedEvent.id}`,
            updatedEventDetails,
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        const dateKey = formatDateToMMDDYYYY(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
        setEvents((prevEvents) => {
            const updatedEvents = prevEvents[dateKey].map((event) =>
                event.id === selectedEvent.id ? updatedEventDetails : event
            );
            return { ...prevEvents, [dateKey]: updatedEvents };
        });

        setSelectedEvent(null);
        setEventTime('오전 12:00');
        closeModal();
    } catch (error) {
        console.error('Error updating event:', error); // 오류 로그 추가
    }
};
  



  const handleIconClick = (e, day) => {
    e.stopPropagation();
    const dateKey = formatDateToMMDDYYYY(currentYear, currentMonth, day);
  
    // 아이콘 인덱스를 업데이트합니다.
    setIconIndexes(prevIndexes => ({
      ...prevIndexes,
      [dateKey]: (prevIndexes[dateKey] === undefined || prevIndexes[dateKey] === -1) 
        ? 0 
        : (prevIndexes[dateKey] + 1) % icons.length
    }));
  };
  
  const handleEventDelete = async () => {
    if (!selectedEvent) {
      console.error('No event selected for deletion.');
      return;
    }
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = convertTo24HourFormat(eventTime || '오전 12:00').split(':').map(Number);
    selectedDateTime.setHours(hours, minutes);
    console.log('Deleting event:', selectedEvent); // 삭제할 이벤트 확인용 로그
  
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/events/${selectedEvent.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log('Delete response:', response.data); // 삭제 응답 로그
  
      const dateKey = formatDateToMMDDYYYY(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
      setEvents((prevEvents) => {
        const filteredEvents = prevEvents[dateKey].filter(
          (event) => event.id !== selectedEvent.id
        );
  
        // 만약 그 날의 이벤트가 없어지면 아이콘 인덱스도 초기화
        if (filteredEvents.length === 0) {
          setIconIndexes(prevIndexes => ({
            ...prevIndexes,
            [dateKey]: -1 // 아이콘을 기본 상태로 설정
          }));
        }
  
        return { ...prevEvents, [dateKey]: filteredEvents };
      });
  
      setSelectedEvent(null);
      closeModal();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventEditFromMoreModal = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventTime(event.time);
    setEventContent(event.content);
    closeMoreModal();
    openModal();
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const filteredAndSortedEvents = moreEvents
  .sort((a, b) => {
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    return 0;
  });

  const weeks = Math.ceil((firstDayOfMonth + daysInMonth) / 7);
  const isSixWeeks = weeks === 6;

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateToMMDDYYYY(currentYear, currentMonth, day)
  
    // events[dateKey]가 문자열인지 확인
    const eventString = events && events[dateKey];
    const eventList = events[dateKey] || []; // 이벤트가 없으면 빈 배열 할당
    const hasEvents = eventList.length > 0;
    const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
    const color = (dayOfWeek === 0) ? dayColors.Sun : (dayOfWeek === 6) ? dayColors.Sat : dayColors.default;
    const currentIconIndex = iconIndexes[dateKey];
    const maxVisibleEvents = 2;
  
    days.push(
      <div
        key={day}
        className={`${styles.calendarDay} ${selectedDate?.getDate() === day ? styles.selected : ''}`}
        onClick={() => handleDateClick(day)}
        style={{  
          minHeight: isSixWeeks ? '11.5vh' : '13vh',
          color: color 
        }}
      >
        {day}
        {hasEvents && (
          <>
            <div className={styles.iconContainer} onClick={(e) => handleIconClick(e, day)}>
              {icons[currentIconIndex]}
            </div>
            {eventList
              .slice(0, events[dateKey].length > maxVisibleEvents ? 1 : maxVisibleEvents)
            .map((event, index) => (
          <div
            key={index}
            className={styles.eventTitle}
            onClick={(e) => {
            e.stopPropagation();
            handleEventClick(day, event); // 이벤트 클릭 처리
          }}
          style={{ backgroundColor: event.color }}
        >
        {event.title}
      </div>
      ))}
            {eventList.length > maxVisibleEvents && (
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
  if (isLoading) {
    return <div>Loading...</div>;  // 로딩 중 표시
  }

  return (
    <div className={styles.calendarPage}>
      <MenuBar />
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
        <button className={styles.moveMonthButton} onClick={handlePrevMonth}>
        <img src={require('../Assets/arrow_left_button.png')} className={styles.buttonImage} /></button>
          <div>{`${currentYear}년 ${currentMonth + 1}월`}</div>
          <button className={styles.moveMonthButton} onClick={handleNextMonth}>
          <img src={require('../Assets/arrow_right_button.png')} className={styles.buttonImage} /></button>
        </div>
        <div className={styles.calendarGrid}>
          {daysInWeek.map((dayName, index) => (
            <div key={index} 
              className={styles.calendarDayName}
              style={{ color: dayColors[dayName] || dayColors.default }}
            >
              {dayName}
            </div>
          ))}
          {days}
        </div>
      </div>
      <Modal isOpen={showModal} onRequestClose={closeModal} className={styles.modal}>
        <h2>제목 및 일정 추가</h2>
        <input type="text" placeholder="제목" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
        <select value={eventTime} onChange={(e) => setEventTime(e.target.value)}>
          {timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        <textarea 
          placeholder="내용" 
          value={eventContent} 
          onChange={(e) => setEventContent(e.target.value)} 
          style={{ border: '1px solid #000000', padding: '10px'}}
        />
        <div className={styles.colorPicker}>
          {colorOptions.map(color => (
            <button
              key={color}
              style={{
                background: color,
                margin: '5px',
                border: '2px solid black',
                display: 'inline-block',
                overflow: 'hidden',
                position: 'relative',
              }}
              onClick={() => handleColorSelection(color)}
            >
              {selectedColor === color && (
                <img 
                  src={colorCheckIcon} 
                  alt="selected" 
                  style={{
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
            </button>
          ))}
        </div>
        <button onClick={handleSaveEvent}>저장</button>
        <button onClick={closeModal}>닫기</button>
        <button onClick={handleEventUpdate}>수정</button>
        <button onClick={handleEventDelete}>삭제</button>
      </Modal>
      <Modal isOpen={showMoreModal} onRequestClose={closeMoreModal} className={styles.modal}>
        <h2>모든 일정 보기</h2>
        {filteredAndSortedEvents.map((event, index) => (
          <div key={index} className={styles.eventDetail}>
            <strong>{event.title}</strong> - {event.time}
            <p>{event.content}</p>
            <button onClick={() => handleEventEditFromMoreModal(event)}>수정</button>
          </div>
        ))}
        <button onClick={closeMoreModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Calendar;