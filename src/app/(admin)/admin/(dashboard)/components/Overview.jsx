'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendarCheck,
  faBoxOpen,
  faGlobe,
  faFlag,
  faCity,
  faSpinner,
  faPhoneAlt
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Overview = () => {
 
  const [data, setData] = useState({
    users: 0,
    contacts: 0,
    bookings: 0,
    continents: 0,
    countries: 0,
    cities: 0,
    packages: 0,
  });

  const [loading, setLoading] = useState(true);

  const endpoints = [
    '/api/v1/otpuser/getallusers',
    '/api/v1/queries/get',
    '/api/v1/bookings/get',
    '/api/v1/continents/get',
    '/api/v1/countries/get',
    '/api/v1/cities/get',
    '/api/v1/packages/get',
  ];

  const fetchData = async () => {
    try {
      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(endpoint))
      );

      const dataResults = await Promise.all(responses.map((res) => res.json()));

      setData({
        users: dataResults[0].totalResult || 0,
        contacts: dataResults[1].totalResults || 0,
        bookings: dataResults[2].totalResults || 0,
        continents: dataResults[3].totalResults || 0,
        countries: dataResults[4].totalResults || 0,
        cities: dataResults[5].totalResults || 0,
        packages: dataResults[6].result.length || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overview-d">
      <h2>Dashboard Overview</h2>
      <div className="overview-d-cards">
        {Object.keys(data).map((key) => (
          <div className="overview-d-card" key={key}>
            <Link href={`/admin/${key}`}>
              <div className="icon_wrap">
                <FontAwesomeIcon icon={iconMap[key]} className="overview-d-icon" />
              </div>
              <div className="data_wrap">
                <h3>Total {capitalizeFirstLetter(key)}</h3>
                <p>{loading ? <FontAwesomeIcon icon={faSpinner} spin /> : data[key]}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions
const iconMap = {
  users: faUsers,
  contacts: faPhoneAlt,
  bookings: faCalendarCheck,
  continents: faGlobe,
  countries: faFlag,
  cities: faCity,
  packages: faBoxOpen
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default Overview;
