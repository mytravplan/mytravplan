'use client';


import Link from 'next/link';
import Image from 'next/image';
import trending from '../app/assets/home_images/trending.png';
import ribbon from '../app/assets/home_images/ribbon.png';
import fishbg from '../app/assets/home_images/fish-bg.png';
import { EmptyCountries } from '@/app/_common/EmptyComponents';

function Destinations({ country }) {

 

  return (
    <div className='top-destination' style={{ backgroundImage: `url(${fishbg.src})` }}>
      <div className="topdestination container inner-w-container">
  
        <h2 className='same_heading'>Top Destination By Our Travel Experts</h2>
        <div className='link_heading'>
          <p>Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
          <Link href="/countries"><span className="view-all">View All Countries</span></Link>
        </div>

        <div className="destinations expert-travel">

          { country === null || country === undefined || country.length === 0 ? (
            <EmptyCountries />
          ) : (country.slice(0, 8).map((country, index) => (
            <Link className="destination" href={`/countries/${country.slug.toLowerCase().replace(' ', '-')}`} key={index}>

              <div key={index} >

                {country.images === null || country.images === undefined ? ('no result found') : country.images.map((e) => {
                  return <Image
                    key={e._id}
                    src={`/uploads/${e.name}`}
                    alt={country.name}
                    width={1000}
                    height={300}
                    className="image-travel-expert"
                  />
                })}

                <span
                  style={{
                    backgroundImage: `url(${ribbon.src})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                  className="trending"
                >
                  <img src={trending.src}></img>
                  TRENDING
                </span>
                <div className="info">
                  <h3>{country.title}</h3>
                  <p>{country.totalCities || 0} cities</p>

                </div>
              </div>
            </Link>
          )))}
        </div>
      </div>
    </div>
  );
}

export default Destinations;
