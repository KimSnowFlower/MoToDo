import React from 'react';
import './Home.css';
import MenuBar from '../MenuBar/MenuBar';
import OptionBar from '../OptionBar/OptionBar';

const Home = () => {
  return (
    <div className="">
      <div className="MenuBar">
        <MenuBar/>
      </div>
      <div className="OptionBar">
        <OptionBar/>
      </div>
    </div>
  );
}

export default Home;