
// // /app/(admin)/_common/header/components/sidebar.jsx  

'use client';
import React from 'react';
import './sidebar.css'; // Import the global CSS
import Link from 'next/link';
import { FaBars, FaTachometerAlt, FaGlobe, FaFlag, FaCity, FaTag, FaUsers, FaCog, FaFileAlt, FaCalendarCheck, FaAddressBook, FaPenAlt, FaHiking, FaPlane, FaStickyNote } from 'react-icons/fa';

const sidebarItems = [
  { href: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
  { href: '/admin/continents', icon: FaGlobe, label: 'Continents' },
  { href: '/admin/countries', icon: FaFlag, label: 'Countries' },
  { href: '/admin/cities', icon: FaCity, label: 'Cities' },
  { href: '/admin/packages', icon: FaTag, label: 'Packages' },
  { href: '/admin/activities', icon: FaHiking , label: 'Activities' },
  { href: '/admin/blog', icon: FaPenAlt, label: 'Blogs' },
  { href: '/admin/contacts', icon: FaAddressBook, label: 'Contacts' },
  { href: '/admin/users', icon: FaUsers, label: 'Users' },
  { href: '/admin/bookings', icon: FaCalendarCheck, label: 'Bookings' },
  { href: '/admin/flights', icon: FaPlane, label: 'Flights' },
  { href: '/admin/settings', icon: FaCog, label: 'Settings' },
  { href: '/admin/reports', icon: FaFileAlt, label: 'Reports' },
  { href: '/admin/footer', icon: FaStickyNote, label: 'Footer' },
 
];

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${!isOpen ? 'open' : 'shrink'}`}>
      <div className="sidebar-content_wrapper">
      <div className="sidebar-content">
        <ul>
          <li>
            {!isOpen ? (
              <button className="close-btn" onClick={toggleSidebar}>
                &times;
              </button>
            ) : (
              <button className="toggle-btn" onClick={toggleSidebar}>
                <FaBars />
              </button>
            )}
          </li>
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} >
                <item.icon className="sidebar-icon" />
                {!isOpen && <span>{item.label}</span>}
                {isOpen && <span className="sidebar_tooltip">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      </div>
      
    </div>
  );
}

export default Sidebar;
