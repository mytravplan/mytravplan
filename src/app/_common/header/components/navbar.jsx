// components/Navbar.js
'use client';
import Link from 'next/link';
import { useState } from 'react';
import ballon from '../../../assets/home_images/ballon.png';
import car from '../../../assets/home_images/car.png';
import holiday from '../../../assets/home_images/holiday.png';
import destination from '../../../assets/home_images/dest.png';
import flight from '../../../assets/home_images/flight.png';

import menubar from '../../../assets/home_images/menu.svg';
import closebar from '../../../assets/home_images/close-menu.svg';




const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
      
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar-toggle"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only"></span>
            {isOpen ? (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 20L4 4M20 4L4 20" stroke="#CA1E2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              
            ) : (
             
              <svg width="30" height="30" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.1429 20H28M2 11H28M13.1429 2H28" stroke="#CA1E2A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
            )}
          </button>
        </div>
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link href={"/"} className="navbar-item">
            <img src={holiday.src} alt="Holidays" />
            Holidays
          </Link>
          <Link href="/flights" className="navbar-item">
            <img src={flight.src} alt="Flights" />
            Flights
          </Link>
          <Link href={"/activity"} className="navbar-item">
            <img src={ballon.src} alt="Activity" />
            Activity
          </Link>
          <Link href="/packages" className="navbar-item">
            <img src={destination.src} alt="Destinations" />
            Packages
          </Link>
          <Link href="/transfers" className="navbar-item">
            <img src={car.src} alt="Transfers" />
            Transfers
          </Link>
          <button className="contact-buttondfsadf mobile-button"><Link href='/contact-us' >Contact Us</Link></button>
          
        
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
