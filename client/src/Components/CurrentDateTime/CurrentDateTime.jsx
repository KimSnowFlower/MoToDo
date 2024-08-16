import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CurrentDateTime = () => {
  const [time, setTime] = useState({ date: '', time: '' });

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
    <DateTimeWrapper>
      <TimeDisplay>
        {time.date}<br />
        {time.time}
      </TimeDisplay>
    </DateTimeWrapper>
  );
};

const DateTimeWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding: 10px 0;
  box-sizing: border-box;
`;

const TimeDisplay = styled.div`
  display: inline-block;
  color: ${({ theme }) => theme.textColor}; /* 테마에 맞춰 색상 변경 */
  font-size: 16px;
`;

export default CurrentDateTime;
