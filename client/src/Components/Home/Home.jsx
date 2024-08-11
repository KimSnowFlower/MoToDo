import React from 'react';
import './Home.css';
import MenuBar from '../MenuBar/MenuBar';
import CurrentDateTime from '../CurrentDateTime/CurrentDateTime';

const Home = () => {
  return (
    <div>
       <MenuBar/>
       <CurrentDateTime/>
    </div>
  );
}

export default Home;