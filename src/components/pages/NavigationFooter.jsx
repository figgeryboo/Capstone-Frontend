import React, { useState, useEffect } from 'react';
import './NavigationFooter.css';
import { Link, useLocation } from 'react-router-dom';

const NavigationFooter = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const location = useLocation();

	const handleItemClick = (index, e) => {
		e.preventDefault();
		setActiveIndex(index);
		localStorage.setItem('activeIndex', index);
	};

	useEffect(() => {
		const storedActiveIndex = localStorage.getItem('activeIndex');
		if (storedActiveIndex !== null) {
			setActiveIndex(parseInt(storedActiveIndex));
		}

		const pathname = location.pathname;
		if (pathname === '/usercatering') {
			setActiveIndex(0);
		} else if (pathname === '/usermapview') {
			setActiveIndex(1);
		} else if (pathname === '/userratings') {
			setActiveIndex(2);
		} else if (pathname === '/userdashboard') {
			setActiveIndex(3);
		}
	}, [location.pathname]);

	return (
		<div className="navigation">
			<ul>
				<li
					className={`list ${activeIndex === 0 ? 'active' : ''}`}
					onClick={(e) => handleItemClick(0, e)}
				>
					<Link to="/usercatering">
						<span className="icon">
							<i className="bi bi-calendar3"></i>
						</span>
						<span className="text">Catering</span>
					</Link>
				</li>
				<li
					className={`list ${activeIndex === 1 ? 'active' : ''}`}
					onClick={(e) => handleItemClick(1, e)}
				>
					<Link to="/usermapview">
						<span className="icon">
							<i className="fa-solid fa-ice-cream"></i>
						</span>
						<span className="text">Find Me</span>
					</Link>
				</li>
				<li
					className={`list ${activeIndex === 2 ? 'active' : ''}`}
					onClick={(e) => handleItemClick(2, e)}
				>
					<Link to="/userratings">
						<span className="icon">
						<i className="bi bi-star-half"></i>
						</span>
						<span className="text">Ratings</span>
					</Link>
				</li>
				<li
					className={`list ${activeIndex === 3 ? 'active' : ''}`}
					onClick={(e) => handleItemClick(3, e)}
				>
					<Link to="/userdashboard">
						<span className="icon">
							<i className="bi bi-person-circle"></i>
						</span>
						<span className="text">Profile</span>
					</Link>
				</li>
			</ul>
			<div
				className={`indicator ${
					activeIndex === 0
						? 'active-indicator-1'
						: activeIndex === 1
						? 'active-indicator-2'
						: activeIndex === 2
						? 'active-indicator-3'
						: 'active-indicator-4'
				}`}
			></div>
		</div>
	);
};

export default NavigationFooter;
