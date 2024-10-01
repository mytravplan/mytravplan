'use client'
import React from 'react';
 
import Image1 from '../../assets/home_images/map.svg';
import Image2 from '../../assets/home_images/phone.svg';
import Image3 from '../../assets/home_images/office.svg';
import useFetchAllSections from '@/hooks/useLoadApiHook';
const AddressDetail = () => {
  let response=useFetchAllSections()

  let {footer={}}=response.data
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
        <p>{footer?.address}</p>
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
        <p><span>Mobile:</span>
        {footer?.phoneNumbers?.map((e,index)=>{
          return  <a href={`tel:+91 ${e}`} key={index}>{e}</a>

        })}
        </p>
        <p><span>Email:</span>
        {footer?.emailAddresses?.map((e,index)=>{
          return  <a href={`mailto: ${e}`} key={index}>{e}</a>

        })}
        </p>
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
