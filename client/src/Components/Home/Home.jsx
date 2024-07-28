import React, { useState } from 'react';
import './Home.css';
import MenuBar from '../MenuBar/MenuBar';
import CurrentDateTime from '../CurrentDateTime/CurrentDateTime';

const Home = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const toggleMenu = () => {
    setIsMenuExpanded(prev => !prev);
  };

  return (
    <div className={`home ${isMenuExpanded ? 'expanded' : 'collapsed'}`}>
      <MenuBar isExpanded={isMenuExpanded} onToggleMenu={toggleMenu} />
      <CurrentDateTime isMenuExpanded={isMenuExpanded} />
    </div>
  );
}

export default Home;