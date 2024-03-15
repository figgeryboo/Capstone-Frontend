import React, { useState } from 'react';
import './NavigationFooter.css';
import { Link } from 'react-router-dom';

const NavigationFooter = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = (index, e) => {
    e.preventDefault();
    setActiveIndex(index);
  };

  return (
    <div className="navigation">
      <ul>
        <li className={`list ${activeIndex === 0 ? 'active' : ''}`} onClick={(e) => handleItemClick(0, e)}>
          <Link to="/usercatering">
            <span className="icon">
              <i className="bi bi-calendar3"></i>
            </span>
            <span className="text">Catering</span>
          </Link>
        </li>
        <li className={`list ${activeIndex === 1 ? 'active' : ''}`} onClick={(e) => handleItemClick(1, e)}>
          <Link to="/mapview">
            <span className="icon">
              <i className="bi bi-map"></i>
            </span>
            <span className="text">Ice Cream</span>
          </Link>
        </li>
        <li className={`list ${activeIndex === 2 ? 'active' : ''}`} onClick={(e) => handleItemClick(2, e)}>
          <Link to="/userratings">
            <span className="icon">
              <i className="bi bi-stars"></i>
            </span>
            <span className="text">Ratings</span>
          </Link>
        </li>
        <li className={`list ${activeIndex === 3 ? 'active' : ''}`} onClick={(e) => handleItemClick(3, e)}>
          <Link to="/userdashboard">
            <span className="icon">
              <i className="bi bi-person-circle"></i>
            </span>
            <span className="text">Profile</span>
          </Link>
        </li>
      </ul>
      <div className={`indicator ${activeIndex === 0 ? 'active-indicator-1' : activeIndex === 1 ? 'active-indicator-2' : activeIndex === 2 ? 'active-indicator-3' : activeIndex === 3 ? 'active-indicator-4' : 'active-indicator-5'}`}></div>
    </div>
  );
};

export default NavigationFooter;
