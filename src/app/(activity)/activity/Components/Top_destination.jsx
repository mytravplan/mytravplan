import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';
import emptyImage from '../../../assets/home_images/empty.jpg'



const TopDestinations = ({ response }) => {

  let reversedCities = Array.isArray(response) ? [...response].reverse() : []
  return (
    <div className="top-dest-container">
      <div className="inner-w-container">
        <h2 className="top-dest-title">Top Destination By Our Travel Experts</h2>
        <p className="top-dest-subtitle">Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
        <div className="top-dest-gridContainer">
          { reversedCities === null || reversedCities === undefined || reversedCities.length === 0 ? <EmptyComponent /> : (reversedCities.map((destination, index) => (
            <Link className="top-dest-cardOuter" href={`/${destination.slug.toLowerCase().replace(' ', '-')}`} key={index}>
              <div className="top-dest-card">

                {destination.images ? destination.images.map((e) => (
                  <Image
                    key={e._id}
                    src={`/uploads/${e.name}`}
                    alt={e.title}
                    width={1000}
                    height={300}
                    className="top-dest-image"
                  />
                )) : 'No image found'}
                <div className="top-dest-Details">
                  <h3 className="top-dest-city">{destination.title || 'no title found'}</h3>
                </div>
              </div>
            </Link>
          )))}
        </div>
      </div>
    </div>
  );
};


function EmptyComponent() {
  return (
    <>
      {Array(8).fill().map((_, index) => (
        <Link className="top-dest-cardOuter" href="#" key={index}>
          <div className="top-dest-card">
            <div className="skeleton">
              <div className='skeleton_animation'></div>
              <Image
                src={emptyImage.src}
                alt="Loading"
                width={1000}
                height={300}
                className="top-dest-image"
              />
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default TopDestinations;
