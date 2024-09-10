'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import BookingForm from '@/Components/(bookings)/bookings/bookingForm';
import LoginPopup from '@/Components/loginPopup/Components/popup';

const carData = [
  {
    _id: '66a9fdd4c671db1458b10548',
    title: "Price Start From",
    name: "Maruti Suzuki Swift",
    imageUrl: '/images/innercar-2.png',
    price: "40,000",
  },
  {
    _id: 'b2a7d9d4f5b3cd6548b2187f',
    title: "Price Start From",
    name: "Maruti Suzuki Brezza",
    imageUrl: '/images/innercar-3.png',
    price: "40,000",
  },
  {
    _id: 'd4a7c9e8a0b4ef1458c51234',
    title: "Price Start From",
    name: "Maruti Suzuki Swift",
    imageUrl: '/images/innercar-1.png',
    price: "40,000",
  },
  {
    _id: 'e1c6b9f4d8a7b2164f8c5231',
    title: "Price Start From",
    name: "Maruti Suzuki Swift",
    imageUrl: '/images/innercar-1.png',
    price: "40,000",
  },
  {
    _id: 'f7d3e9a4b2c5d6784e2b910f',
    title: "Price Start From",
    name: "Maruti Suzuki Ertiga",
    imageUrl: '/images/innercar-3.png',
    price: "40,000",
  },
  {
    _id: 'a8e6b9f4d8a7b2164f8c5241',
    title: "Price Start From",
    name: "Maruti Suzuki Swift",
    imageUrl: '/images/innercar-2.png',
    price: "40,000",
  },
];


const TransferContent = () => {
  

  const [userVerified, setUserVerified] = useState(false);
  const [isopenForm, setIsopenForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  const checkUserVerification = async () => {
    try {
      const session = await getSession();
      if (session && session.user) {
        setUserVerified(session.user.role === 'user');
      } else {
        setUserVerified(false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  useEffect(() => {
    checkUserVerification();
  }, []);

  const bookingAndLogin = (pkgId) => {
    if (!userVerified) {
      setIsLogin(true);
    } else {
      setSelectedPackageId(pkgId);
      setIsopenForm(true);
    }
  };


  return (
    <>
    {isopenForm && <BookingForm setIsopenForm={setIsopenForm} packageId={selectedPackageId} />}
    {isLogin && <LoginPopup setIsLogin={setIsLogin} />}

    <div className="transfer-info">
      <div className="over">
        <h2 className="heading_inner_page">Overview</h2>
        <p>
          Mesmerizing 4-night 5-day journey with our Passionate Paris With Disney tour seamlessly blending the romance of Parisian streets with the enchantment of Disneyland Paris. Begin your adventure immersing in Paris is iconic landmarks like the Eiffel Tower and Notre-Dame Cathedral followed by leisurely explorations of charming neighborhoods and
        </p>
      </div>
      <div className="transfer-details">

          <h2> Transfer Details</h2>
          <div className="transferinner-vehicle-section">
                {carData.map((car, index) => (
                <div key={index} className="car-inner-box">
                    <img src={car.imageUrl} alt={car.title} className="car-image" />
                    <div className="car-text-container">
                        <div className='txtleft'>
                            <h3>{car.title}</h3>
                            <div className="car-price"> ₹ {car.price}</div>
                        </div>
                        <div className='txtright'>
                            <h3>{car.name}</h3>
                        </div>
                        
                    </div>
                    <button className="transfer-inner-butn" onClick={() => bookingAndLogin(car._id)}><span>
                    Book Now</span></button>
                </div>
                ))}
            </div>

        
        </div>
    </div>
    </>
    
  );
};

export default TransferContent;
