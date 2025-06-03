
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import useFetchAllSections from '@/hooks/useLoadApiHook';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';
import emptyImage from '../../assets/home_images/empty.jpg';
const CarOptions = () => {


  const [page, setPage] = useState(1);

  const [] = useState()

  const response = useFetchAllSections(page, PER_PAGE_LIMIT);
  const { transferData = [], pagination = {} } = response.data;

 



  return (
   <div className="transfer-vehicle-section">
  {Array.isArray(transferData) && transferData.length > 0 ? (
    transferData.map((car, index) => (
      <div key={index} className="car-box">
        <Link href={`/transfers/${car.transfer_slug ?? ''}`}>
          <img
            src={
              car.transfer_image?car.transfer_image: emptyImage.src
            }
            alt={car.transfer_title ?? 'Transfer'}
            className="carimage"
          />
          <div className="inner-transfer-text">
            <h3 className="cartitle">{car.transfer_title ?? 'Untitled'}</h3>
            <div className="rating-price">
              <div className="carprice">
                From ₹ {car.transfer_price ?? 'N/A'}
              </div>
            </div>
          </div>
        </Link>
      </div>
    ))
  ) : (
    <>
  
    <p className='error_trans'>No transfers available</p>
    
    </>
  )}
</div>

  );
};

export default CarOptions;
