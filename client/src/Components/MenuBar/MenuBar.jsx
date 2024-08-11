import React from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';
import { IoHome } from "react-icons/io5";
import { FaCalendarCheck, FaStickyNote } from "react-icons/fa";

const MenuBar = () => {
  return (
    <nav className="nav">
      <div className="nav__main">
        <div className="nav__logo">
          <svg role="img" aria-label="Logo" width="24px" height="24px">
            <use xlinkHref="#app" />
          </svg>
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
            <Link className="nav__item-box" to="#" title="Freinds">
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
