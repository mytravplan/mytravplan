import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Image1 from '../../assets/home_images/map.svg';
import Image2 from '../../assets/home_images/phone.svg';
import Image3 from '../../assets/home_images/office.svg';
const AddressDetail = () => {
  return (
  <div className="address_container">
    <div className="address_card">
      <div className="icon">
      <img
        src={Image1.src} 
        alt="map" 
      />
      </div>
      <div className="content">
        <h3>Address</h3>
        <p>Corporate Office: 401, Time Shoppers, Opp. Deepkamal Mall, Sarthana Jakatnaka,</p>
      </div>
    </div>
    <div className="address_card">
      <div className="icon">
      <img
        src={Image2.src} 
        alt="phone" 
      />
      </div>
      <div className="content">
        <h3>Contact</h3>
        <p><span>Mobile:</span> <a href="tel:+918627814386">+918627814386</a></p>
        <p><span>Email:</span> <a href="mailto:booking@streetromeo.com">booking@streetromeo.com</a></p>
      </div>
    </div>
    <div className="address_card">
      <div className="icon">
      <img
        src={Image3.src} 
        alt="office-timming" 
      />
      </div>
      <div className="content">
        <h3>Office Open</h3>
        <p>Monday - Saturday: 9:00 - 6:00</p>
        <p>Sunday: Off</p>
      </div>
    </div>
  </div>
  );
}

export default AddressDetail;
