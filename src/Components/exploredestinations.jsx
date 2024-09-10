'use client'
import Image from 'next/image';
import exploretheme from '../app/assets/home_images/theme-destination.png';
import Link from 'next/link';
import emptyImage from '../app/assets/home_images/empty.jpg';
import { EmptyActivityPackages } from '@/app/_common/EmptyComponents';
const ExploreDestinations = ({ packagescat }) => {



 


  return (
    <div className='explore-theme-destination' style={{ backgroundImage: `url(${exploretheme.src})` }}>
      <div className="explore-destinations">
        <h2 className='same_heading'>Explore Destinations By Theme</h2>
        <p>Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
        <div className="destinations-container-countries">
          { packagescat === null || packagescat === undefined || packagescat.length === 0 ? (
            <EmptyActivityPackages />
          ) : (packagescat?.slice(0, 6)?.map((destination, index) => (
            <div key={index} className="destination">
              <Link href={`/activity-package/${destination.slug}`}>

                {destination.image && destination.image.length > 0 ? (
                  destination.image.map((e) => (
                    <Image
                      key={e._id}
                      src={`/uploads/${e.name}`}
                      alt='packages_categories'
                      width={100}
                      height={100}
                      className="destination-image"
                      srcset={` ${`/uploads/${e.name}`} 480w, 
                             ${`/uploads/${e.name}`} 800w, 
                            ${`/uploads/${e.name}`} 1200w`}
                      sizes="(max-width: 600px) 480px, 
                           (max-width: 1200px) 800px, 
                           1200px"
                    />
                  ))
                ) : (
                  <Image
                    src={emptyImage.src}
                    alt="No Image Available"
                    width={333}
                    height={380}
                    className="image"
                  />
                )}
                <p>{destination.slug}</p>
              </Link>
            </div>
          )))}
        </div>
      </div>
    </div>

  );
};

export default ExploreDestinations;
