import React, { useEffect, useState} from 'react';
import axios from 'axios';
import './Home.css';
import MenuBar from '../MenuBar/MenuBar';
import OptionBar from '../OptionBar/OptionBar';

const Home = () => {
  const [data, setData] = useState({ calendar: [], sticky: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/home');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="totalPage">
      <div className="menuBar">
        <MenuBar/>
      </div>
      <div className="optionBar">
        <OptionBar/>
      </div>
      <div className="homeMain">
        <ul className="homeLists">
          <li className="homeCalendarList">

          </li>
          <li className="homeStickyList">

          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;