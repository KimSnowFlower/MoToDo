import React from 'react';
import { Link } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import { FaCalendarCheck, FaStickyNote } from "react-icons/fa";
import styles from './MenuBar.module.css';
import CurrentDateTime from '../CurrentDateTime/CurrentDateTime';

const MenuBar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.nav__main}>
        <div className={styles.currentDateTime}>
          <CurrentDateTime />
        </div>
        <span className={styles.nav__heading}>
          <span className={styles.nav__headingText}>Menu</span>
        </span>
        <ul className={styles.nav__items}>
          <li className={styles.nav__item}>
            <Link className={styles.nav__itemBox} to="/home" title="Home">
              <IoHome className={styles.icon} />
              <span className={styles.nav__itemText}>Home</span>
            </Link>
          </li>
          <li className={styles.nav__item}>
            <Link className={styles.nav__itemBox} to="/calendar" title="Calendar">
              <FaCalendarCheck className={styles.icon} />
              <span className={styles.nav__itemText}>Calendar</span> 
            </Link>
          </li>
          <li className={styles.nav__item}>
            <Link className={styles.nav__itemBox} to="#" title="Sticky">
              <FaStickyNote className={styles.icon} />
              <span className={styles.nav__itemText}>Sticky</span>
            </Link>
          </li>
        </ul>
        <span className={styles.nav__heading}>
          <span className={styles.nav__headingText}>Mo</span>
        </span>
        <ul className={styles.nav__items}>
          <li className={styles.nav__item}>
            <Link className={styles.nav__itemBox} to="/friends" title="Friends">
              <span className={styles.nav__itemText}>Friends</span>
            </Link>
          </li>
          <li className={styles.nav__item}>
            <Link className={styles.nav__itemBox} to="#" title="Group">
              <span className={styles.nav__itemText}>Group</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
