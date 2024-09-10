// pages/holiday.js

import Image from 'next/image';
import indigoImage from '../../assets/home_images/indigo.png';
import formbg from '../../assets/home_images/theme-destination.png';

export default function Holiday() {
  return (
    <div className="holiday_container" style={{ backgroundImage: `url(${formbg.src})`}}>
      <div className="image-container">
        <img src={indigoImage.src} alt="Indigo Airplane" layout="responsive" />
      </div>
      <div className="text-container">
        <h2>How It Works</h2>
        <ol>
          <li>Tell us details of your holiday plan.</li>
          <li>Select & book best deal</li>
        </ol>
        <h3 className="highlight">Lowest Price Guarantee</h3>
        <h3 className='se_booking'>Fast Secured Bookings</h3>
        <p className='support'>24 * 7 Support</p>
        <h3 className='deal'>Enjoy Exciting Deals</h3>
        <a href="tel:+918627814386" className="phone-number">+918627814386</a>
      </div>
    </div>
  );
}
