// components/WelcomeCard.js
'use client';
import { useState } from 'react';
import planesidebar from '../../assets/home_images/plane.gif';
import QueryForm from '@/Components/autoloadPopup/QueryForm';


const WelcomeCard = () => {

  const [isopenForm, setIsopenForm] = useState(false);
  const openQueryForm =()=>{
    setIsopenForm(true);
  }

  return (
    <>
    {isopenForm && <QueryForm setIsopenForm={setIsopenForm} />}

    <div className="sidebar-enquiry">
      <img src={planesidebar.src}alt="Plane" className="plane" />
      <div className="enquiry-section">
        <div className="planetitle">Welcome to Street romeo.</div>
        <button className="planebutton" onClick={openQueryForm}>Enquiry Now</button>
      </div>
    </div>
    </>
    
  );
};

export default WelcomeCard;
