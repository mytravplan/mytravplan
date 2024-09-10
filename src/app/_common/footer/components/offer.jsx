'use client';

import React, { useState } from 'react'
import offerimage from '../../../assets/home_images/offer.png';
import QueryForm from '@/Components/autoloadPopup/QueryForm';


function Offer() {

  const [isopenForm, setIsopenForm] = useState(false);
  const openQueryForm =()=>{
    setIsopenForm(true);
  }


  return (
   <>
   {isopenForm && <QueryForm setIsopenForm={setIsopenForm} />}
    <div className='offer_inner'>
      <div className='left_offer_side'>
         <h2>Book Your Package To Stay Updated With Our Latest Discounts more than 40% !!</h2>
         <button onClick={openQueryForm} style={{cursor: "pointer"}}>View Discounts</button>
      </div>

      <div className='right_side_offer'>
          <img src={offerimage.src}/>
      </div>


        
     </div>
   </>
  )
}

export default Offer