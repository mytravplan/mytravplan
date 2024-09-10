// components/CarOptions.js
import React from 'react';
import Link from 'next/link';

const CarOptions = () => {
  const carData = [
    {
      title: "4 Seater Car",
      imageUrl: '/images/car-1.png' ,
      rating: 4.0,
      reviews: "1.3K",
      price: "39,550",
      slug: "seater-car",
    },
    {
      title: "7 Seater Van",
      imageUrl: '/images/car-2.png' ,
      rating: 4.0,
      reviews: "1.3K",
      price: "4,550",
      slug: "seater-van",
    },
    {
      title: "34 Seater Car",
      imageUrl: '/images/car-3.png' ,
      rating: 4.0,
      reviews: "1.3K",
      price: "5,000",
      slug: "seater-car",
    },
    {
      title: "5 Maruti Car",
      imageUrl: '/images/car-4.png' ,
      rating: 4.0,
      reviews: "1.3K",
      price: "4,550",
      slug: "maruti-car",
    },
  ];

  return (
    <div className="transfer-vehicle-section">
      {carData.map((car, index) => (
        <div key={index} className="car-box">
          <Link href={`/transfers/${car.slug}`}>
          
              <img src={car.imageUrl} alt={car.title} className="carimage" />
           
          </Link>
          <div className='text-container'>
            <h3 className="cartitle">{car.title}</h3>
            <div className='rating-price'>
              <span className="carstars">⭐</span> {car.rating} ({car.reviews} Reviews)
              <div className="carprice">From ₹ {car.price}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarOptions;
