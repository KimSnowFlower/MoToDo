import React, { useState, useEffect } from 'react';
import './CurrentDateTime.css';

const CurrentDateTime = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const showTime = () => {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate();

      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      let session = 'AM';
      
      if (h === 0) {
        h = 12;
      }

      if (h > 12) {
        h = h - 12;
        session = 'PM';
      }

      h = (h < 10) ? '0' + h : h;
      m = (m < 10) ? '0' + m : m;
      s = (s < 10) ? '0' + s : s;

      const currentDate = `${year}-${month}-${day}`;
      const currentTime = `${h}:${m}:${s} ${session}`;
      setTime({ date: currentDate, time: currentTime });
    };

    showTime();
    const interval = setInterval(showTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="parent">
      <div id="timeDisplay">
        <>{time.date}<br />{time.time}</>
      </div>
    </div>
  );
};

export default CurrentDateTime;