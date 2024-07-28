import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';
import { IoHome, IoMenu } from "react-icons/io5";
import { FaCalendarCheck, FaStickyNote } from "react-icons/fa";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";

const MenuBar = () => {
  const [expanded, setExpanded] = useState(true);
  const navRef = useRef(null);
  const expandBtnRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClick = () => {
      setExpanded(prev => !prev);
    };

    const expandBtn = expandBtnRef.current;
    expandBtn?.addEventListener('click', handleClick);

    return () => {
      expandBtn?.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    const label = expanded ? "Collapse" : "Expand";
    const timeoutValue = expanded ? 0 : 300;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (navRef.current) {
        const labelElement = navRef.current.querySelector("[data-expand-label]");
        if (labelElement) {
          labelElement.innerText = label;
        }
      }
    }, timeoutValue);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [expanded]);

  return (
    <nav ref={navRef} className="nav" data-expanded={expanded}>
      <div className="nav__main">
        <div className="nav__logo">
          <svg role="img" aria-label="Logo" width="24px" height="24px">
            <use xlinkHref="#app" />
          </svg>
        </div>
        <span className="nav__heading">
          <IoMenu className="icon"/>
          <span className="nav__heading-text">Menu</span>
        </span>
        <ul className="nav__items">
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Dashboard">
            <IoHome className="icon"/>
            <span className="nav__item-text">Home</span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Performance">
            <FaCalendarCheck className="icon"/>
            <span className="nav__item-text">Calendar</span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Performance">
            <FaStickyNote className="icon"/>
            <span className="nav__item-text">Sticky</span>
            </Link>
          </li>
        </ul>
        <span className="nav__heading">
          <span className="nav__heading-text">Group</span>
        </span>
        <ul className="nav__items">
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Guides">
              <span className="nav__item-icon">
              </span>
              <span className="nav__item-text">Guides</span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Hotspots (28)">
              <span className="nav__item-icon nav__item-icon--badge">
              </span>
              <span className="nav__item-text">Hotspots <strong className="nav__item-badge">28</strong></span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Checklists">
              <span className="nav__item-icon">
              </span>
              <span className="nav__item-text">Checklists</span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="NPS">
              <span className="nav__item-icon">
              </span>
              <span className="nav__item-text">NPS</span>
            </Link>
          </li>
        </ul>
        <span className="nav__heading">
          <span className="nav__heading-text">Customize</span>
        </span>
        <ul className="nav__items">
          <li className="nav__item">
            <Link className="nav__item-box nav__item-box--red" to="#" title="Segments (24)">
              <span className="nav__item-icon nav__item-icon--badge">
              </span>
              <span className="nav__item-text">Segments <strong className="nav__item-badge">24</strong></span>
            </Link>
          </li>
          <li className="nav__item">
            <Link className="nav__item-box" to="#" title="Themes">
              <span className="nav__item-icon">
              </span>
              <span className="nav__item-text">Themes</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav__bottom">
        <ul className="nav__items">
          <li className="nav__item">
            <button ref={expandBtnRef} className="nav__item-box" type="button" aria-expanded={expanded}  data-expand>
              {expanded ? (
                <TbLayoutSidebarLeftCollapseFilled className="icon"/>
              ) : (
                <TbLayoutSidebarRightCollapseFilled className="icon"/>
              )}
              <span className="nav__item-text" data-expand-label>
                {expanded ? "Collapse" : ""}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MenuBar;
