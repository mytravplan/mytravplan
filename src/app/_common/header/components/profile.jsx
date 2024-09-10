'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import LogoutPage from '../../_logout/logoutPage';
import Link from 'next/link';

const ContactUs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Get the first letter of the user's name
  const firstLetter = session?.user?.registerusername ? session.user.registerusername.charAt(0).toUpperCase() : '';

  const svg = <svg width="18" height="20" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.7907 4.76785C10.7907 6.64671 9.3031 8.14285 7.4999 8.14285C5.69669 8.14285 4.20908 6.64671 4.20908 4.76785C4.20908 2.88899 5.69669 1.39285 7.4999 1.39285C9.3031 1.39285 10.7907 2.88899 10.7907 4.76785ZM7.4999 11.1897C8.3747 11.1897 9.20781 11.0033 9.96287 10.6741H10.3285C12.2422 10.6741 13.8213 12.2637 13.8213 14.2554V15.596C13.8213 16.0504 13.4639 16.3929 13.056 16.3929H1.94377C1.53591 16.3929 1.17847 16.0504 1.17847 15.596V14.2554C1.17847 12.2637 2.75763 10.6741 4.67132 10.6741H5.03746C5.79384 11.0029 6.62413 11.1897 7.4999 11.1897Z" stroke="#1802A0" strokeWidth="1.5" />
</svg>

  return (
    <div className="contact-us-container">
      <div className='login-container'>
        <div className="login-button" onClick={toggleDropdown}>
          <div className="icon-container">
            {session ? (
              session.user.role === 'user' ? (
                <h2>{firstLetter || svg}
                </h2>
              ) : (
               svg
              )
            ) : (svg)
            }
          </div>
        </div>
        {isOpen && (
          <div className="dropdown-menu">
            {session ? (
              session.user.role === 'user' ? (
                <>
                  <Link href={`/my-orders`} className="dropdown-item">My Orders</Link>
                  <LogoutPage />
                </>
              ) : (
                <Link href={`/login`} className="dropdown-item">Login</Link>
              )
            ) : (
              <Link href={`/login`} className="dropdown-item">Login</Link>
            )}
          </div>
        )}
      </div>
      <button className="contact-button">
        <a href='/contact-us'>Contact Us</a>
      </button>
    </div>
  );
};

export default ContactUs;
