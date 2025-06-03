'use client';
import React, { useEffect, useState } from 'react';

import { getSession } from 'next-auth/react';
import BookingForm from '@/Components/(bookings)/bookings/bookingForm';
import LoginPopup from '@/Components/loginPopup/Components/popup';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
const TransferContent = ({ slug }) => {
  let [data, setData] = useState([])
  let api = EXPORT_ALL_APIS()

  let fetchBlogInnerPage = async () => {
    let resp = await api.loadSingleTransfer(slug)
    setData(resp?.result)
  }
  useEffect(() => {
    fetchBlogInnerPage()
  }, [])

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
          <p>{data?.transfer_overview_description||'not found'}</p>
        </div>
        <div  className="car-inner-box">
          <button className="transfer-inner-butn" onClick={() => bookingAndLogin(data?._id)}><span>
            Book Now</span></button>
        </div>

      </div>
    </>

  );
};

export default TransferContent;
