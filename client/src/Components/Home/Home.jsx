import React from 'react';
import './Home.css';
import MenuBar from '../MenuBar/MenuBar';
import OptionBar from '../OptionBar/OptionBar';

const Home = () => {
  return (
    <div className="totalPage">
      <div className="menuBar">
        <MenuBar/>
      </div>
      <div className="optionBar">
        <OptionBar/>
      </div>
      <div className="homeMain">

      </div>
    </div>
  );
}

export default Home;