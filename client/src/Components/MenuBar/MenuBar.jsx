import React from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { FaCalendarCheck, FaStickyNote } from "react-icons/fa";
import './MenuBar.css';
import CurrentDateTime from '../CurrentDateTime/CurrentDateTime';

const MenuBar = () => {
  return (
    <nav className="nav">
      <div className="nav__main">
        <div className="currentDateTime">
          <CurrentDateTime/>
        </div>
        <span className="nav__heading">
          <span className="nav__heading-text">Menu</span>
        </span>
        <ul className="nav__items">
          <li className="nav__item">
            <Link className="nav__item-box" to="/home" title="Home">
              <IoHome className="icon"/>
              <span className="nav__item-text">Home</span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="/calendar" title="Calendar">
              <FaCalendarCheck className="icon"/>
              <span className="nav__item-text">Calendar</span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Sticky">
              <FaStickyNote className="icon"/>
              <span className="nav__item-text">Sticky</span>
            </Link>
          </li>
        </ul>
        <span className="nav__heading">
          <span className="nav__heading-text">Mo</span>
        </span>
        <ul className="nav__items">
          <li className="nav__item">
            <Link className="nav__item-box" to="/friends" title="Freinds">
              <span className="nav__item-text">Friends</span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Group">
              <span className="nav__item-text">Gruop</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
