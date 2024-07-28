import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './CurrentDateTime.css';

const CurrentDateTime = ({ isMenuExpanded }) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(intervalId);
  }, []);

  const containerClass = isMenuExpanded ? 'current-date-time expanded' : 'current-date-time collapsed';

  return (
    <div className={containerClass}>
      <h1>Today {format(dateTime, 'yyyy/MM/dd')}</h1>
    </div>
  );
};

export default CurrentDateTime;