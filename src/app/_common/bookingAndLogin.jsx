
'use client'
import BookingForm from '@/Components/(bookings)/bookings/bookingForm'
import LoginPopup from '@/Components/loginPopup/Components/popup'
import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

function BookingAndLogin({pkg}) {
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
    
      const bookingAndLogin = (pkgId) => {
        if (!userVerified) {
          setIsLogin(true);
        } else {
          setSelectedPackageId(pkgId);
          setIsopenForm(true);
        }
      };

      useEffect(() => {
        checkUserVerification();
    }, [])

  return (
    <>
    {isopenForm && <BookingForm setIsopenForm={setIsopenForm} packageId={selectedPackageId} />}
    {isLogin && <LoginPopup setIsLogin={setIsLogin}  />}

    <button className="enquiry-btn" onClick={() => bookingAndLogin(pkg._id)}>Book Now</button>
    </>
  )
}

export default BookingAndLogin